// Lists Zoho Inventory sales orders for the staff dashboards. Read-only: it never changes anything in Zoho.
// Customer data is returned, so every request must carry a valid team login:
//   { auth: { type: 'owner', email, password } }  or  { auth: { type: 'team', memberId, pin } }
// which is checked against the team list stored in Firebase. Needs ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET,
// ZOHO_REFRESH_TOKEN and ZOHO_ORG_ID in Netlify.

var ACCOUNTS_URL = 'https://accounts.zoho.com';
var INVENTORY_URL = 'https://www.zohoapis.com/inventory/v1';
var FIREBASE_API_KEY = 'AIzaSyBQiE4TlMIcO6iyCob2G1js3eEVcmmjNmI';
var FIREBASE_DB = 'https://gold-coast-auto-parts-default-rtdb.firebaseio.com';
var MAX_DETAILS = 30;

function reply(status, obj) { return { statusCode: status, body: JSON.stringify(obj) }; }
function lower(s) { return String(s || '').trim().toLowerCase(); }

async function loadSettings() {
  var a = await (await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + FIREBASE_API_KEY, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ returnSecureToken: true })
  })).json();
  if (!a.idToken) throw new Error('Could not reach the team list.');
  var r = await fetch(FIREBASE_DB + '/gcap/settings.json?auth=' + encodeURIComponent(a.idToken));
  if (!r.ok) throw new Error('Could not read the team list.');
  return (await r.json()) || {};
}

function verify(auth, settings) {
  if (!auth) return null;
  if (auth.type === 'owner') {
    if (settings.ownerEmail && settings.ownerPassword && lower(auth.email) === lower(settings.ownerEmail) && auth.password === settings.ownerPassword) return { name: 'Owner' };
  } else if (auth.type === 'team') {
    var m = (settings.team || []).find(function (x) { return x && x.id === auth.memberId && x.active !== false; });
    if (m && m.pin && m.pin === auth.pin) return { name: m.name };
  }
  return null;
}

async function accessToken() {
  var resp = await fetch(ACCOUNTS_URL + '/oauth/v2/token?' + new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN, client_id: process.env.ZOHO_CLIENT_ID,
    client_secret: process.env.ZOHO_CLIENT_SECRET, grant_type: 'refresh_token'
  }).toString(), { method: 'POST' });
  var d = await resp.json().catch(function () { return {}; });
  if (!d.access_token) throw new Error('Zoho refused the token: ' + (d.error || 'unknown'));
  return d.access_token;
}

function addressText(a) {
  if (!a) return '';
  return [a.address, a.street2, a.city, [a.state, a.zip].filter(Boolean).join(' '), a.country].filter(function (p) { return p && String(p).trim(); }).join(', ');
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return reply(405, { error: 'Method not allowed' });
  var missing = ['ZOHO_CLIENT_ID', 'ZOHO_CLIENT_SECRET', 'ZOHO_REFRESH_TOKEN', 'ZOHO_ORG_ID'].filter(function (k) { return !process.env[k]; });
  if (missing.length) return reply(500, { error: 'Zoho is not configured on the server (' + missing.join(', ') + ').' });

  var payload;
  try { payload = JSON.parse(event.body || '{}'); } catch (e) { return reply(400, { error: 'Invalid request.' }); }

  try {
    var who = verify(payload.auth, await loadSettings());
    if (!who) return reply(401, { error: 'Please log out and log back in, then try again.' });

    var statuses = Array.isArray(payload.statuses) ? payload.statuses.map(lower) : ['confirmed'];
    var headers = { Authorization: 'Zoho-oauthtoken ' + await accessToken() };
    var org = encodeURIComponent(process.env.ZOHO_ORG_ID);

    var listResp = await fetch(INVENTORY_URL + '/salesorders?organization_id=' + org + '&per_page=200&sort_column=date&sort_order=D', { headers: headers });
    var list = await listResp.json().catch(function () { return {}; });
    if (!listResp.ok) return reply(502, { error: list.message || 'Zoho would not return the orders.' });

    var all = list.salesorders || [], counts = {};
    all.forEach(function (o) { var s = lower(o.status) || 'unknown'; counts[s] = (counts[s] || 0) + 1; });
    var picked = all.filter(function (o) { return !statuses.length || statuses.indexOf(lower(o.status)) !== -1; });
    var truncated = picked.length > MAX_DETAILS;
    picked = picked.slice(0, MAX_DETAILS);

    var orders = await Promise.all(picked.map(async function (o) {
      var d = {};
      try {
        var dr = await fetch(INVENTORY_URL + '/salesorders/' + encodeURIComponent(o.salesorder_id) + '?organization_id=' + org, { headers: headers });
        d = ((await dr.json().catch(function () { return {}; })).salesorder) || {};
      } catch (e) { d = {}; }
      var ship = d.shipping_address || {};
      return {
        id: o.salesorder_id, number: o.salesorder_number, reference: o.reference_number || '',
        customer: o.customer_name || d.customer_name || '', date: o.date || '', deliveryDate: o.delivery_date || d.delivery_date || '',
        status: lower(o.status), shipped: o.shipped_status || '', paid: o.paid_status || '', method: o.delivery_method || d.delivery_method || '',
        salesperson: o.salesperson_name || '', address: addressText(ship), phone: ship.phone || d.contact_person_details && d.contact_person_details[0] && d.contact_person_details[0].phone || '',
        terms: d.payment_terms_label || '', notes: d.notes || '',
        lines: (d.line_items || []).map(function (li) { return { name: li.name || li.description || '', sku: li.sku || '', qty: li.quantity }; })
      };
    }));

    return reply(200, { ok: true, orders: orders, statusCounts: counts, truncated: truncated, hasMore: !!(list.page_context && list.page_context.has_more_page) });
  } catch (e) {
    return reply(500, { error: e.message || 'Something went wrong talking to Zoho.' });
  }
};

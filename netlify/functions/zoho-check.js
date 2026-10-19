// Read-only connection check for Zoho Inventory. Proves the refresh token and organization ID work.
// Returns only the organization name, order counts by status, and the NAMES of an order's fields —
// never customer names, addresses or amounts — because this endpoint is public.
// Needs ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN and ZOHO_ORG_ID in Netlify.

var ACCOUNTS_URL = 'https://accounts.zoho.com';
var INVENTORY_URL = 'https://www.zohoapis.com/inventory/v1';

function reply(status, obj) { return { statusCode: status, body: JSON.stringify(obj) }; }

exports.handler = async function () {
  var missing = ['ZOHO_CLIENT_ID', 'ZOHO_CLIENT_SECRET', 'ZOHO_REFRESH_TOKEN', 'ZOHO_ORG_ID'].filter(function (k) { return !process.env[k]; });
  if (missing.length) return reply(500, { ok: false, step: 'settings', error: 'Missing in Netlify: ' + missing.join(', ') });

  var tokenResp = await fetch(ACCOUNTS_URL + '/oauth/v2/token?' + new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN,
    client_id: process.env.ZOHO_CLIENT_ID,
    client_secret: process.env.ZOHO_CLIENT_SECRET,
    grant_type: 'refresh_token'
  }).toString(), { method: 'POST' });
  var token = await tokenResp.json().catch(function () { return {}; });
  if (!token.access_token) return reply(502, { ok: false, step: 'token', error: 'Zoho refused the token: ' + (token.error || 'unknown') });
  var headers = { Authorization: 'Zoho-oauthtoken ' + token.access_token };
  var org = encodeURIComponent(process.env.ZOHO_ORG_ID);

  var orgResp = await fetch(INVENTORY_URL + '/organizations', { headers: headers });
  var orgData = await orgResp.json().catch(function () { return {}; });
  if (!orgResp.ok) return reply(502, { ok: false, step: 'organizations', status: orgResp.status, error: orgData.message || 'Zoho Inventory refused the request (check the scopes and region).' });
  var match = (orgData.organizations || []).find(function (o) { return String(o.organization_id) === String(process.env.ZOHO_ORG_ID); });

  var soResp = await fetch(INVENTORY_URL + '/salesorders?organization_id=' + org + '&per_page=200&sort_column=date&sort_order=D', { headers: headers });
  var soData = await soResp.json().catch(function () { return {}; });
  if (!soResp.ok) return reply(502, { ok: false, step: 'salesorders', status: soResp.status, error: soData.message || 'Could not read sales orders (check the organization ID and scopes).' });

  var orders = soData.salesorders || [];
  var detailShape = null;
  var firstOpen = orders.find(function (o) { return String(o.status).toLowerCase() === 'confirmed'; }) || orders[0];
  if (firstOpen) {
    var dr = await fetch(INVENTORY_URL + '/salesorders/' + encodeURIComponent(firstOpen.salesorder_id) + '?organization_id=' + org, { headers: headers });
    var dd = ((await dr.json().catch(function () { return {}; })).salesorder) || {};
    var types = {};
    Object.keys(dd).forEach(function (k) { var v = dd[k]; types[k] = Array.isArray(v) ? 'array(' + v.length + ')' : (v && typeof v === 'object' ? 'object' : typeof v); });
    detailShape = {
      fieldTypes: types,
      lineItemFields: dd.line_items && dd.line_items[0] ? Object.keys(dd.line_items[0]) : [],
      shippingAddressFields: dd.shipping_address ? Object.keys(dd.shipping_address) : [],
      billingAddressFields: dd.billing_address ? Object.keys(dd.billing_address) : [],
      customFieldLabels: (dd.custom_fields || []).map(function (c) { return c.label || c.api_name || c.placeholder; })
    };
  }
  var byStatus = {};
  orders.forEach(function (o) { byStatus[o.status || 'unknown'] = (byStatus[o.status || 'unknown'] || 0) + 1; });
  return reply(200, {
    ok: true,
    organization: match ? match.name : '(organization ID not found in this account)',
    orderCountChecked: orders.length,
    hasMore: !!(soData.page_context && soData.page_context.has_more_page),
    statusCounts: byStatus,
    orderFieldNames: orders[0] ? Object.keys(orders[0]) : [],
    detailShape: detailShape
  });
};

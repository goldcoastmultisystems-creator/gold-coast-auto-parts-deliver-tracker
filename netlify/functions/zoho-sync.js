// Pushes a confirmed Visit Report to Zoho CRM.
// New Prospect visits -> upsert a Lead.
// Existing Customer / Follow-Up / Other visits -> upsert a Contact, plus a Deal if a quote was logged.
// Keeps Zoho credentials server-side — never exposed to the browser.
// Requires these environment variables in Netlify's site settings:
//   ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN
// (all three come from the one-time Self Client setup in the Zoho API Console —
// see the setup steps you were given alongside this file.)

var ZOHO_ACCOUNTS_URL = 'https://accounts.zoho.com';
var ZOHO_API_URL = 'https://www.zohoapis.com';

async function getAccessToken() {
  var params = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN,
    client_id: process.env.ZOHO_CLIENT_ID,
    client_secret: process.env.ZOHO_CLIENT_SECRET,
    grant_type: 'refresh_token'
  });
  var resp = await fetch(ZOHO_ACCOUNTS_URL + '/oauth/v2/token?' + params.toString(), { method: 'POST' });
  var data = await resp.json();
  if (!data.access_token) throw new Error('Zoho auth failed: ' + (data.error || JSON.stringify(data)));
  return data.access_token;
}

async function zohoRequest(accessToken, method, path, body) {
  var resp = await fetch(ZOHO_API_URL + path, {
    method: method,
    headers: {
      'Authorization': 'Zoho-oauthtoken ' + accessToken,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  var data = await resp.json().catch(function () { return {}; });
  return { ok: resp.ok, status: resp.status, data: data };
}

function buildDescription(v) {
  var lines = [];
  lines.push('Visit outcome: ' + (v.visitOutcome || '—'));
  if (v.nextAction && v.nextAction.what) lines.push('Next action: ' + v.nextAction.what + (v.nextAction.when ? ' by ' + v.nextAction.when : ''));
  if (v.painPoints && v.painPoints.length) lines.push('Pain points: ' + v.painPoints.join(', '));
  if (v.vehicleMakes) lines.push('Vehicle makes: ' + v.vehicleMakes);
  if (v.drpAffiliations) lines.push('DRP affiliations: ' + v.drpAffiliations);
  if (v.currentSuppliers) lines.push('Current suppliers: ' + v.currentSuppliers);
  if (v.estimatingSoftware) lines.push('Estimating software: ' + v.estimatingSoftware);
  lines.push('Logged by: ' + (v.repName || 'Gold Coast Auto Parts rep'));
  return lines.join('\n');
}

function closingDate30Days() {
  var d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }
  if (!process.env.ZOHO_CLIENT_ID || !process.env.ZOHO_CLIENT_SECRET || !process.env.ZOHO_REFRESH_TOKEN) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Zoho credentials are not configured on the server.' }) };
  }

  var payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body.' }) };
  }
  var v = payload.visit || {};
  if (!v.shopName) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing shop name.' }) };
  }

  try {
    var accessToken = await getAccessToken();
    var result;

    if (v.type === 'prospect') {
      var leadRecord = {
        Company: v.shopName,
        Last_Name: (v.contactName && v.contactName.trim()) || v.shopName,
        Phone: v.phone || '',
        Title: v.contactTitle || '',
        Lead_Source: 'Sales Rep Visit',
        Description: buildDescription(v),
        Street: v.address || ''
      };
      var leadResp = await zohoRequest(accessToken, 'POST', '/crm/v2/Leads/upsert', {
        data: [leadRecord],
        duplicate_check_fields: ['Company']
      });
      if (!leadResp.ok) throw new Error('Zoho Lead upsert failed: ' + JSON.stringify(leadResp.data));
      result = { lead: leadResp.data };
    } else {
      var contactRecord = {
        Last_Name: (v.contactName && v.contactName.trim()) || v.shopName,
        Account_Name: v.shopName,
        Phone: v.phone || '',
        Title: v.contactTitle || '',
        Mailing_Street: v.address || '',
        Description: buildDescription(v)
      };
      var contactResp = await zohoRequest(accessToken, 'POST', '/crm/v2/Contacts/upsert', {
        data: [contactRecord],
        duplicate_check_fields: ['Last_Name']
      });
      if (!contactResp.ok) throw new Error('Zoho Contact upsert failed: ' + JSON.stringify(contactResp.data));
      result = { contact: contactResp.data };

      var quotesWithYmm = (v.quotes || []).filter(function (q) { return q.ymm && q.ymm.trim(); });
      if (quotesWithYmm.length) {
        var dealRecord = {
          Deal_Name: v.shopName + ' — ' + quotesWithYmm.map(function (q) { return q.ymm; }).join(', '),
          Stage: 'Qualification',
          Account_Name: v.shopName,
          Closing_Date: closingDate30Days(),
          Description: quotesWithYmm.map(function (q) { return q.ymm + (q.notes ? ' — ' + q.notes : ''); }).join('; ')
        };
        var dealResp = await zohoRequest(accessToken, 'POST', '/crm/v2/Deals', { data: [dealRecord] });
        result.deal = dealResp.data;
      }
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true, result: result }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message || 'Zoho sync failed.' }) };
  }
};

// Reads a driver-photographed check and extracts its details using AI vision.
// Keeps the AI key server-side — never exposed to the browser. See ../lib/ai.js for the key settings.
var ai = require('../lib/ai');

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  var payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body.' }) };
  }

  var mediaType = payload.mediaType || 'image/jpeg';
  var base64Data = (payload.image || '').replace(/^data:[^;]+;base64,/, '');
  if (!base64Data) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No image data provided.' }) };
  }

  try {
    var raw = await ai.generate({
      maxTokens: 400,
      json: true,
      messages: [{
        role: 'user',
        image: { mediaType: mediaType, data: base64Data },
        text: 'This is a photo of a paper check an auto parts delivery driver just received as payment. ' +
          'Read the printed and handwritten text on the check and reply with ONLY a single JSON object ' +
          '(no markdown fences, no commentary) with exactly these keys: ' +
          '"amount" (the dollar amount as a plain number string like "245.00", or null if unreadable), ' +
          '"checkNumber" (the check number, usually top-right, as a string, or null), ' +
          '"payerName" (the name or company printed in the top-left / pre-printed on the check — ' +
          'whoever the check is drawn from — or null), ' +
          '"bankName" (the bank printed on the check, or null), ' +
          '"checkDate" (the date written on the check, or null). ' +
          'If this does not look like a check at all, set every field to null.'
      }]
    });
    raw = raw.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    var check;
    try {
      check = JSON.parse(raw);
    } catch (e) {
      return { statusCode: 200, body: JSON.stringify({ error: 'Could not parse check details from the photo.' }) };
    }
    return { statusCode: 200, body: JSON.stringify({ check: check }) };
  } catch (e) {
    return { statusCode: e.status || 500, body: JSON.stringify({ error: e.message || 'AI request failed.' }) };
  }
};

// Reads a driver-photographed check and extracts its details using Claude's vision.
// Keeps the Anthropic API key server-side — never exposed to the browser.
// Requires the ANTHROPIC_API_KEY environment variable to be set in Netlify's site settings
// (the same key used by describe-media.js).

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  var apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'ANTHROPIC_API_KEY is not configured on the server.' }) };
  }

  var payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body.' }) };
  }

  var image = payload.image || '';
  var mediaType = payload.mediaType || 'image/jpeg';
  var base64Data = image.replace(/^data:[^;]+;base64,/, '');
  if (!base64Data) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No image data provided.' }) };
  }

  try {
    var resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Data } },
            {
              type: 'text',
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
            }
          ]
        }]
      })
    });

    var data = await resp.json();
    if (!resp.ok) {
      var msg = (data && data.error && data.error.message) || 'AI request failed.';
      return { statusCode: resp.status, body: JSON.stringify({ error: msg }) };
    }

    var raw = (data.content && data.content[0] && data.content[0].text || '').trim();
    raw = raw.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    var check;
    try {
      check = JSON.parse(raw);
    } catch (e) {
      return { statusCode: 200, body: JSON.stringify({ error: 'Could not parse check details from the photo.' }) };
    }

    return { statusCode: 200, body: JSON.stringify({ check: check }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message || 'AI request failed.' }) };
  }
};

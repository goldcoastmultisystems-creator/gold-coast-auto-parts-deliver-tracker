// Describes a driver-uploaded delivery photo (or a extracted video frame) using Claude's vision.
// Keeps the Anthropic API key server-side — never exposed to the browser.
// Requires the ANTHROPIC_API_KEY environment variable to be set in Netlify's site settings.

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
        max_tokens: 150,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Data } },
            {
              type: 'text',
              text: 'This photo was taken by an auto parts delivery driver at a delivery, pickup, or deposit stop. ' +
                'In one or two short, factual sentences, describe what the photo shows and what the driver appears ' +
                'to be doing (for example: dropping off a box at a loading dock, handing a part to someone, parked ' +
                'outside a shop, a signed receipt, etc). No preamble, no "the image shows" — just the description.'
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

    var description = (data.content && data.content[0] && data.content[0].text || '').trim();
    return { statusCode: 200, body: JSON.stringify({ description: description }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message || 'AI request failed.' }) };
  }
};

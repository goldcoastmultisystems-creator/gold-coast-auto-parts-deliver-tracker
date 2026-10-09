// Describes a driver-uploaded delivery photo (or an extracted video frame) using AI vision.
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
    var description = await ai.generate({
      maxTokens: 200,
      messages: [{
        role: 'user',
        image: { mediaType: mediaType, data: base64Data },
        text: 'This photo was taken by an auto parts delivery driver at a delivery, pickup, or deposit stop. ' +
          'In one or two short, factual sentences, describe what the photo shows and what the driver appears ' +
          'to be doing (for example: dropping off a box at a loading dock, handing a part to someone, parked ' +
          'outside a shop, a signed receipt, etc). No preamble, no "the image shows" — just the description.'
      }]
    });
    return { statusCode: 200, body: JSON.stringify({ description: description }) };
  } catch (e) {
    return { statusCode: e.status || 500, body: JSON.stringify({ error: e.message || 'AI request failed.' }) };
  }
};

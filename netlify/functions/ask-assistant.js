// Answers team questions about today's delivery board using Claude.
// The browser sends a plain-text snapshot of the live data; this function never writes anything.
// Requires the ANTHROPIC_API_KEY environment variable in Netlify's site settings.

var MAX_CONTEXT_CHARS = 60000;
var MAX_HISTORY = 10;

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

  var question = String(payload.question || '').trim().slice(0, 1000);
  if (!question) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No question provided.' }) };
  }
  var context = String(payload.context || '').slice(0, MAX_CONTEXT_CHARS);
  var asker = String(payload.asker || 'a team member').slice(0, 80);

  var history = (Array.isArray(payload.history) ? payload.history : [])
    .slice(-MAX_HISTORY)
    .filter(function (m) { return m && (m.role === 'user' || m.role === 'assistant') && typeof m.text === 'string' && m.text.trim(); })
    .map(function (m) { return { role: m.role, content: m.text.slice(0, 2000) }; });
  while (history.length && history[0].role !== 'user') history.shift();

  var system =
    'You are the in-app assistant for Gold Coast Auto Parts, an auto parts distributor whose drivers deliver parts to body shops. ' +
    'You are talking to ' + asker + '. Answer questions using ONLY the live data snapshot below. ' +
    'Be brief and practical: short sentences, bullet points for lists, no preamble. ' +
    'If the answer is not in the data, say so plainly instead of guessing. ' +
    'For inventory questions, use the INVENTORY CATALOG matches: give the SKU, whether it is in stock (with quantity) or sold out, and the selling price. ' +
    'Only a few best matches are shown, so if nothing relevant appears say it may not be in the catalog and suggest checking the Stock Board. Never invent SKUs, quantities or prices. ' +
    'You are read-only: you cannot change stops, checks or returns; if asked to, tell them which button in the app to use.\n\n' +
    '--- LIVE DATA SNAPSHOT ---\n' + context;

  var messages = history.concat([{ role: 'user', content: question }]);

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
        max_tokens: 600,
        system: system,
        messages: messages
      })
    });

    var data = await resp.json();
    if (!resp.ok) {
      var msg = (data && data.error && data.error.message) || 'AI request failed.';
      return { statusCode: resp.status, body: JSON.stringify({ error: msg }) };
    }

    var answer = (data.content && data.content[0] && data.content[0].text || '').trim();
    return { statusCode: 200, body: JSON.stringify({ answer: answer }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message || 'AI request failed.' }) };
  }
};

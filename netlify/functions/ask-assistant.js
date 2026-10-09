// Answers team questions about today's board and the inventory using AI.
// The browser sends a plain-text snapshot of the live data; this function never writes anything.
// Key settings (GEMINI_API_KEY or ANTHROPIC_API_KEY) are described in ../lib/ai.js.
var ai = require('../lib/ai');

var MAX_CONTEXT_CHARS = 60000;
var MAX_HISTORY = 10;

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

  var question = String(payload.question || '').trim().slice(0, 1000);
  if (!question) {
    return { statusCode: 400, body: JSON.stringify({ error: 'No question provided.' }) };
  }
  var context = String(payload.context || '').slice(0, MAX_CONTEXT_CHARS);
  var asker = String(payload.asker || 'a team member').slice(0, 80);

  var history = (Array.isArray(payload.history) ? payload.history : [])
    .slice(-MAX_HISTORY)
    .filter(function (m) { return m && (m.role === 'user' || m.role === 'assistant') && typeof m.text === 'string' && m.text.trim(); })
    .map(function (m) { return { role: m.role, text: m.text.slice(0, 2000) }; });
  while (history.length && history[0].role !== 'user') history.shift();

  var isSales = payload.board === 'sales';
  var system =
    'You are the in-app assistant for Gold Coast Auto Parts, an auto parts distributor ' +
    (isSales ? 'whose sales reps visit body shops to win business and quote parts. ' : 'whose drivers deliver parts to body shops. ') +
    'You are talking to ' + asker + '. Answer questions using ONLY the live data snapshot below. ' +
    'Be brief and practical: short sentences, bullet points for lists, no preamble. ' +
    'If the answer is not in the data, say so plainly instead of guessing. ' +
    'For inventory questions, use the INVENTORY CATALOG matches: give the SKU, whether it is in stock (with quantity) or sold out, and the selling price. ' +
    'Only a few best matches are shown, so if nothing relevant appears say it may not be in the catalog and suggest checking the Stock Board. Never invent SKUs, quantities or prices. ' +
    'You are read-only: you cannot change stops, checks or returns; if asked to, tell them which button in the app to use.\n\n' +
    '--- LIVE DATA SNAPSHOT ---\n' + context;

  var messages = history.concat([{ role: 'user', text: question }]);

  try {
    var answer = await ai.generate({ system: system, messages: messages, maxTokens: 800 });
    return { statusCode: 200, body: JSON.stringify({ answer: answer }) };
  } catch (e) {
    return { statusCode: e.status || 500, body: JSON.stringify({ error: e.message || 'AI request failed.' }) };
  }
};

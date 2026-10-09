// Shared AI helper for the Netlify functions. Keys stay server-side in Netlify environment variables.
// Provider: GEMINI_API_KEY (free tier, default) or ANTHROPIC_API_KEY (Claude). If both are set, Gemini
// is used unless AI_PROVIDER=anthropic. Optional GEMINI_MODEL / ANTHROPIC_MODEL override the models.

var GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
var ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';

function pickProvider() {
  var forced = (process.env.AI_PROVIDER || '').toLowerCase();
  if (forced === 'anthropic' && process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (forced === 'gemini' && process.env.GEMINI_API_KEY) return 'gemini';
  if (process.env.GEMINI_API_KEY) return 'gemini';
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  return null;
}

function fail(status, message) {
  var e = new Error(message);
  e.status = status;
  return e;
}

// opts: { system, messages: [{ role: 'user'|'assistant', text, image?: { mediaType, data } }], json, maxTokens }
// Resolves to the reply text. Throws an Error with .status on failure.
async function generate(opts) {
  var provider = pickProvider();
  if (!provider) throw fail(500, 'AI key is not configured on the server (add GEMINI_API_KEY in Netlify).');
  var maxTokens = opts.maxTokens || 600;
  var resp, data;

  if (provider === 'gemini') {
    var body = {
      contents: opts.messages.map(function (m) {
        var parts = [];
        if (m.image) parts.push({ inlineData: { mimeType: m.image.mediaType, data: m.image.data } });
        parts.push({ text: m.text });
        return { role: m.role === 'assistant' ? 'model' : 'user', parts: parts };
      }),
      generationConfig: { maxOutputTokens: maxTokens, temperature: 0.2, thinkingConfig: { thinkingBudget: 0 } }
    };
    if (opts.system) body.systemInstruction = { parts: [{ text: opts.system }] };
    if (opts.json) body.generationConfig.responseMimeType = 'application/json';
    resp = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL + ':generateContent', {
      method: 'POST',
      headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY, 'content-type': 'application/json' },
      body: JSON.stringify(body)
    });
    data = await resp.json().catch(function () { return {}; });
    if (!resp.ok) {
      if (resp.status === 429) throw fail(429, 'The free AI limit was reached for now. Please try again in a bit.');
      throw fail(resp.status, (data && data.error && data.error.message) || 'AI request failed.');
    }
    var cand = data.candidates && data.candidates[0];
    var text = cand && cand.content && cand.content.parts ? cand.content.parts.map(function (p) { return p.text || ''; }).join('') : '';
    if (!text.trim()) throw fail(502, 'The AI returned no answer' + (cand && cand.finishReason ? ' (' + cand.finishReason + ')' : '') + '.');
    return text.trim();
  }

  var aBody = {
    model: ANTHROPIC_MODEL,
    max_tokens: maxTokens,
    messages: opts.messages.map(function (m) {
      if (!m.image) return { role: m.role, content: m.text };
      return { role: m.role, content: [
        { type: 'image', source: { type: 'base64', media_type: m.image.mediaType, data: m.image.data } },
        { type: 'text', text: m.text }
      ] };
    })
  };
  if (opts.system) aBody.system = opts.system;
  resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify(aBody)
  });
  data = await resp.json().catch(function () { return {}; });
  if (!resp.ok) throw fail(resp.status, (data && data.error && data.error.message) || 'AI request failed.');
  return ((data.content && data.content[0] && data.content[0].text) || '').trim();
}

module.exports = { generate: generate, pickProvider: pickProvider };

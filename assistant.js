/* Ask AI assistant shared by the Delivery and Sales Rep pages.
   Each page defines assistantBoardContext() (text snapshot of its own live board) and
   assistantBoardName ('delivery' | 'sales'); this file adds the chat panel and the inventory lookup. */
var ASSISTANT_ENDPOINT = '/.netlify/functions/ask-assistant';
var assistantHistory = [];
var assistantBusy = false;
var inventoryRows = null, inventoryMeta = null, inventoryLoading = null;
var INV_STOPWORDS = { the:1, a:1, an:1, do:1, we:1, have:1, any:1, in:1, on:1, of:1, for:1, is:1, are:1, there:1, stock:1, much:1, many:1, how:1, what:1, whats:1, price:1, cost:1, qty:1, quantity:1, left:1, got:1, you:1, and:1, or:1, to:1, it:1, our:1, with:1, part:1, parts:1, available:1, inventory:1 };

function assistantSuggestions() {
  if (typeof assistantBoardName !== 'undefined' && assistantBoardName === 'inventory') {
    return ['What Camry parts are in stock?', 'Which RAV4 parts are sold out?', 'How many bumpers do we have?'];
  }
  return (typeof assistantBoardName !== 'undefined' && assistantBoardName === 'sales')
    ? ["Summarize today's visits", "Who haven't I visited yet?", 'Do we have a Camry bumper in stock?', 'What does a RAV4 bumper cost?']
    : ['Summarize today', "What's still pending?", 'Which checks are not deposited yet?', 'Do we have a Camry bumper in stock?'];
}

function loadInventory() {
  if (inventoryRows) return Promise.resolve();
  if (inventoryLoading) return inventoryLoading;
  if (typeof FIREBASE_ENABLED === 'undefined' || !FIREBASE_ENABLED || !window.fbDb) return Promise.resolve();
  inventoryLoading = fbDb.ref('gcap/inventory/latest').once('value').then(function(snap) {
    var doc = snap.val();
    if (doc && doc.rowsJson) {
      inventoryRows = JSON.parse(doc.rowsJson);
      inventoryMeta = { total: doc.total || inventoryRows.length, syncedAt: doc.syncedAt || '' };
    }
  }).catch(function(e) { console.error('inventory load failed', e); }).then(function() { inventoryLoading = null; });
  return inventoryLoading;
}
function searchInventory(text, limit) {
  if (!inventoryRows) return [];
  var tokens = String(text || '').toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(function(t) { return t.length >= 2 && !INV_STOPWORDS[t]; });
  if (!tokens.length) return [];
  var scored = [];
  inventoryRows.forEach(function(r) {
    var sku = String(r[0] || '').toLowerCase(), oem = String(r[1] || '').toLowerCase(), name = String(r[6] || '').toLowerCase();
    var hay = sku + ' ' + oem + ' ' + name, score = 0;
    tokens.forEach(function(t) {
      if (sku === t || oem === t) score += 10;
      else if (hay.indexOf(t) !== -1) score += 1;
    });
    if (score > 0) scored.push({ r: r, score: score + (r[2] > 0 ? 0.5 : 0) });
  });
  scored.sort(function(a, b) { return b.score - a.score; });
  return scored.slice(0, limit || 15).map(function(x) { return x.r; });
}
function buildInventoryContext(question) {
  if (!inventoryRows) return '\nINVENTORY: not loaded — tell the user inventory lookups are not available right now.';
  var inStock = inventoryRows.filter(function(r) { return r[2] > 0; }).length;
  var recent = '';
  for (var i = assistantHistory.length - 1; i >= 0; i--) { if (assistantHistory[i].role === 'user') { recent = assistantHistory[i].text; break; } }
  var matches = searchInventory(question + ' ' + recent, 15);
  var L = ['\nINVENTORY CATALOG: ' + inventoryRows.length + ' SKUs (' + inStock + ' in stock, ' + (inventoryRows.length - inStock) + ' sold out), last synced ' + (inventoryMeta && inventoryMeta.syncedAt ? inventoryMeta.syncedAt.slice(0, 10) : 'unknown') + '.'];
  L.push('Best catalog matches for the question (' + matches.length + '):');
  matches.forEach(function(r) {
    L.push('- ' + r[0] + ' | OEM ' + (r[1] || '—') + ' | ' + (r[2] > 0 ? 'IN STOCK qty ' + r[2] : 'SOLD OUT') + ' | ' + (r[4] != null ? '$' + r[4] : 'no price') + ' | ' + r[6] + (r[7] ? ' | grade ' + r[7] : ''));
  });
  return L.join('\n');
}
function buildAssistantContext(question) {
  var board = (typeof assistantBoardContext === 'function') ? assistantBoardContext() : '';
  return board + buildInventoryContext(question || '');
}

function ensureAssistantModal() {
  if (document.getElementById('assistantModal')) return;
  var div = document.createElement('div');
  div.className = 'modal-backdrop';
  div.id = 'assistantModal';
  div.innerHTML =
    '<div class="modal wide">' +
      '<h3>🤖 Ask AI</h3>' +
      '<p class="modal-sub">Ask about today\'s board or look up a part in the inventory. It only reads live data — it can\'t change anything.</p>' +
      '<div id="assistantLog" style="max-height:48vh; overflow-y:auto; margin-bottom:10px;"></div>' +
      '<div id="assistantSuggest" style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:10px;"></div>' +
      '<div class="chat-input-row">' +
        '<input type="text" id="assistantInput" placeholder="e.g. Do we have a RAV4 bumper in stock?" onkeydown="if(event.key===\'Enter\')sendAssistant()">' +
        '<button class="btn btn-sm btn-navy" id="assistantSendBtn" onclick="sendAssistant()">Ask</button>' +
      '</div>' +
      '<div class="modal-actions">' +
        '<button class="btn btn-ghost" onclick="clearAssistant()">Clear</button>' +
        '<button class="btn btn-ghost" onclick="closeAssistantModal()">Close</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(div);
}
function openAssistantModal() {
  ensureAssistantModal();
  loadInventory();
  document.getElementById('assistantModal').classList.add('open');
  renderAssistantLog();
  document.getElementById('assistantSuggest').innerHTML = assistantHistory.length ? '' : assistantSuggestions().map(function(q) {
    return '<button class="btn btn-ghost btn-sm" onclick="askSuggestion(this)">' + escapeHtml(q) + '</button>';
  }).join('');
  document.getElementById('assistantInput').focus();
}
function closeAssistantModal() { document.getElementById('assistantModal').classList.remove('open'); }
function clearAssistant() { assistantHistory = []; openAssistantModal(); }
function askSuggestion(btn) {
  document.getElementById('assistantInput').value = btn.textContent;
  sendAssistant();
}
function renderAssistantLog(pending) {
  var el = document.getElementById('assistantLog');
  if (!assistantHistory.length && !pending) { el.innerHTML = '<div class="hist-empty">Ask a question to get started.</div>'; return; }
  el.innerHTML = assistantHistory.map(function(m) {
    var mine = m.role === 'user';
    return '<div class="chat-msg' + (mine ? '' : ' ai') + '" style="white-space:pre-wrap; margin-bottom:6px;"><span class="who">' + (mine ? 'You' : '🤖 AI') + ':</span><span>' + escapeHtml(m.text) + '</span></div>';
  }).join('') + (pending ? '<div class="chat-msg ai"><span class="who">🤖 AI:</span><span>Thinking…</span></div>' : '');
  el.scrollTop = el.scrollHeight;
}
function sendAssistant() {
  if (assistantBusy) return;
  var input = document.getElementById('assistantInput');
  var q = input.value.trim();
  if (!q) return;
  input.value = '';
  document.getElementById('assistantSuggest').innerHTML = '';
  var prior = assistantHistory.slice();
  assistantHistory.push({ role: 'user', text: q });
  assistantBusy = true;
  renderAssistantLog(true);
  loadInventory().then(function() {
    return fetch(ASSISTANT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: q, history: prior, context: buildAssistantContext(q),
        board: (typeof assistantBoardName !== 'undefined' ? assistantBoardName : 'delivery'),
        asker: ((session && session.name) || (settings && settings.driverName) || '') + (session && session.role ? ' (' + session.role + ')' : '')
      })
    });
  }).then(function(r) { return r.json().then(function(data) { return { ok: r.ok, data: data }; }); })
    .then(function(res) {
      var answer = res.ok && res.data && res.data.answer;
      if (!answer) {
        var err = (res.data && res.data.error) || '';
        answer = /not configured/i.test(err) ? "The AI isn't switched on yet — the GEMINI_API_KEY still needs to be added in Netlify." : (/limit/i.test(err) ? err : "Sorry, I couldn't answer that right now. Please try again.");
      }
      assistantHistory.push({ role: 'assistant', text: answer });
    })
    .catch(function() { assistantHistory.push({ role: 'assistant', text: "Couldn't reach the AI — check your connection and try again." }); })
    .then(function() { assistantBusy = false; renderAssistantLog(); });
}

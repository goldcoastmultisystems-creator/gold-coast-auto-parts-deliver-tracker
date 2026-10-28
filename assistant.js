/* Ask AI assistant shared by the Delivery and Sales Rep pages.
   Each page defines assistantBoardContext() (text snapshot of its own live board) and
   assistantBoardName ('delivery' | 'sales'); this file adds the chat panel and the inventory lookup. */
var ASSISTANT_ENDPOINT = '/.netlify/functions/ask-assistant';
var assistantHistory = [];
var assistantBusy = false;
var inventoryRows = null, inventoryMeta = null, inventoryLoading = null;
var inventoryLoc = { loc: {} };
function invLocKey(sku) { return String(sku).replace(/[.#$\/\[\]%]/g, function(c) { return '%' + c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0'); }); }
function invLocText(sku) { return inventoryLoc.loc[invLocKey(sku)] || ''; }
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
    return fbDb.ref('gcap/inventory/settings').once('value');
  }).then(function(snap) {
    var s = (snap && snap.val()) || {};
    inventoryLoc = { loc: s.locations || {} };
  }).catch(function(e) { console.error('inventory load failed', e); }).then(function() {
    inventoryLoading = null;
    attachPartStatus();
    if (typeof onInventoryLoaded === 'function') onInventoryLoaded();
  });
  return inventoryLoading;
}
/* ---------- FOUND / LOADED per part (shared by the Delivery board, Parts to Pull and the Zoho order lines) ----------
   Stored apart from the day's stops at gcap/partStatus/{key}, so one tap never touches the stop list. */
var partStatus = {}, partStatusRef = null;
function partStatusKey(ref, item) {
  function clean(x) { return String(x || '').toUpperCase().replace(/[^A-Z0-9-]+/g, '_').slice(0, 40); }
  return clean(ref) + '__' + clean(item);
}
function attachPartStatus() {
  if (partStatusRef || typeof FIREBASE_ENABLED === 'undefined' || !FIREBASE_ENABLED || !window.fbDb) return;
  partStatusRef = fbDb.ref('gcap/partStatus');
  partStatusRef.on('value', function(snap) { partStatus = snap.val() || {}; refreshPartStatusDom(); },
    function(e) { console.error('part status listener failed', e); partStatusRef = null; });
}
function partStatusInner(key) {
  var st = partStatus[key] || {};
  function btn(field, label, on, color) {
    var who = st[field] && st[field].by ? st[field].by + (st[field].at ? ' • ' + new Date(st[field].at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '') : '';
    var proofN = field === 'found' && st.found ? (st.found.p || 0) + (st.found.v || 0) : 0;
    var tip = field === 'found' ? (on ? who + ' — tap to see the proof or undo' : 'Add a photo or video, then mark it found') : (on ? who + ' — tap to undo' : (st.found ? 'Tap to mark loaded' : 'Mark it Found first'));
    return '<button type="button" onclick="event.stopPropagation(); togglePartStatus(\'' + key + '\',\'' + field + '\')" title="' + escapeHtml(tip) + '" style="cursor:pointer; font:inherit; font-size:11.5px; font-weight:800; padding:3px 9px; border-radius:7px; margin-left:4px; white-space:nowrap; ' +
      (on ? 'background:' + color + '; border:1px solid ' + color + '; color:#0b0b10;' : 'background:transparent; border:1px solid var(--glass-border); color:var(--text-soft);' + (field === 'loaded' && !st.found ? ' opacity:.5;' : '')) + '">' + (on ? '✓ ' : (field === 'found' ? '📷 ' : '')) + label + (proofN ? ' · ' + proofN : '') + '</button>';
  }
  return btn('found', 'Found', !!st.found, '#34d399') + btn('loaded', '🚚 Loaded', !!st.loaded, '#fbbf24');
}
function partStatusHtml(ref, item) {
  attachPartStatus();
  var key = partStatusKey(ref, item);
  return '<span class="pstat" data-pkey="' + key + '" style="display:inline-flex; align-items:center; flex-wrap:nowrap;">' + partStatusInner(key) + '</span>';
}
function refreshPartStatusDom() {
  Array.prototype.forEach.call(document.querySelectorAll('.pstat[data-pkey]'), function(el) { el.innerHTML = partStatusInner(el.getAttribute('data-pkey')); });
}
function partWho() { return (typeof session !== 'undefined' && session && session.name) || (typeof settings !== 'undefined' && settings && settings.driverName) || 'Someone'; }
function partToast(msg, kind) { if (typeof showToast === 'function') showToast(msg, kind || ''); else alert(msg); }
function writePartStatus(key, next) {
  partStatus[key] = next; refreshPartStatusDom();
  var write = (next.found || next.loaded) ? partStatusRef.child(key).set({ found: next.found || null, loaded: next.loaded || null }) : partStatusRef.child(key).remove();
  return write.catch(function(e) { console.error('part status save failed', e); partToast("Couldn't save that — check your connection.", 'red'); });
}
function togglePartStatus(key, field) {
  if (!partStatusRef) { partToast("Couldn't reach the database — try again in a moment.", 'red'); return; }
  var cur = partStatus[key] || {};
  if (field === 'found') { if (cur.found) viewPartProof(key); else openFoundProof(key); return; }
  if (!cur.found) { partToast('Mark it Found first — with a photo or video.', 'red'); return; }
  writePartStatus(key, { found: cur.found, loaded: cur.loaded ? null : { by: partWho(), at: Date.now() } });
}

/* ---------- PROOF: a photo or video is required before a part can be marked Found ----------
   Photos are saved small in gcap/partProof/{key}; videos go to Firebase Storage. Status only keeps the counts. */
var proofDraft = null;
var PROOF_MAX_PHOTOS = 6, PROOF_VIDEO_MAX = 300 * 1024 * 1024;
function proofLabel(key) { return String(key).replace('__', ' — ').replace(/_/g, ' '); }
function ensureProofModal() {
  if (document.getElementById('proofModal')) return;
  var div = document.createElement('div');
  div.className = 'modal-backdrop'; div.id = 'proofModal'; div.style.zIndex = '1200';
  div.innerHTML = '<div class="modal wide"><h3 id="proofTitle">📸 Proof</h3><p class="modal-sub" id="proofSub"></p>' +
    '<div id="proofMedia" style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px;"></div>' +
    '<div id="proofAdd" style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:6px;">' +
      '<button class="btn btn-navy btn-sm" onclick="document.getElementById(\'proofPhotoInput\').click()">📷 Add photo</button>' +
      '<button class="btn btn-navy btn-sm" onclick="document.getElementById(\'proofVideoInput\').click()">🎥 Add video</button></div>' +
    '<input type="file" id="proofPhotoInput" accept="image/*" capture="environment" style="display:none" onchange="proofFileChosen(this, \'photo\')">' +
    '<input type="file" id="proofVideoInput" accept="video/*" capture="environment" style="display:none" onchange="proofFileChosen(this, \'video\')">' +
    '<div id="proofMsg" style="font-size:12px; margin:6px 0; color:var(--text-soft);"></div>' +
    '<div class="modal-actions" id="proofActions"></div></div>';
  document.body.appendChild(div);
}
function closeProofModal() { var m = document.getElementById('proofModal'); if (m) m.classList.remove('open'); proofDraft = null; }
function openFoundProof(key) {
  ensureProofModal();
  proofDraft = { key: key, mode: 'add', photos: [], videos: [], uploading: 0 };
  document.getElementById('proofModal').classList.add('open');
  renderProofModal();
}
function renderProofModal() {
  var d = proofDraft; if (!d) return;
  var adding = d.mode === 'add';
  document.getElementById('proofTitle').textContent = adding ? '📸 Show it before marking Found' : '✓ Found — proof';
  document.getElementById('proofSub').textContent = proofLabel(d.key) + (adding ? ' — take at least one photo or video of the part.' : '');
  document.getElementById('proofAdd').style.display = adding ? 'flex' : 'none';
  var media = d.photos.map(function(p, i) { return '<img src="' + p + '" style="width:92px; height:92px; object-fit:cover; border-radius:10px; border:1px solid var(--glass-border); cursor:pointer;" onclick="window.open(this.src)">' + ''; }).concat(
    d.videos.map(function(u) { return '<video src="' + escapeHtml(u) + '" controls preload="metadata" style="width:160px; max-height:120px; border-radius:10px; border:1px solid var(--glass-border); background:#000;"></video>'; }));
  if (d.uploading) media.push('<div style="align-self:center; font-size:12px; color:var(--text-soft);">⏳ Uploading video…</div>');
  document.getElementById('proofMedia').innerHTML = media.join('') || (d.loading ? '<div class="hist-empty">Loading…</div>' : '<div class="hist-empty">' + (adding ? 'Nothing added yet.' : 'No photo or video was saved for this part (it was marked found before proof was required).') + '</div>');
  var st = partStatus[d.key] && partStatus[d.key].found;
  document.getElementById('proofMsg').textContent = adding ? '' : (st ? 'Marked found by ' + (st.by || '—') + (st.at ? ' at ' + new Date(st.at).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '') : '');
  var ready = d.photos.length + d.videos.length > 0 && !d.uploading;
  document.getElementById('proofActions').innerHTML = adding
    ? '<button class="btn btn-ghost" onclick="closeProofModal()">Cancel</button><button class="btn btn-gold" id="proofConfirmBtn" onclick="confirmFoundProof()"' + (ready ? '' : ' disabled style="opacity:.45; cursor:not-allowed;"') + '>✓ Mark as Found</button>'
    : '<button class="btn btn-ghost" onclick="closeProofModal()">Close</button><button class="btn btn-ghost" style="color:var(--red);" onclick="undoFound(\'' + d.key + '\')">↩ Undo Found</button>';
}
function proofFileChosen(input, kind) {
  var file = input.files && input.files[0]; input.value = '';
  var d = proofDraft; if (!file || !d) return;
  if (kind === 'photo') {
    if (d.photos.length >= PROOF_MAX_PHOTOS) { partToast('Up to ' + PROOF_MAX_PHOTOS + ' photos.', 'red'); return; }
    var reader = new FileReader();
    reader.onload = function(ev) {
      var img = new Image();
      img.onload = function() {
        var scale = Math.min(1, 800 / img.width), c = document.createElement('canvas');
        c.width = img.width * scale; c.height = img.height * scale;
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        if (proofDraft === d) { d.photos.push(c.toDataURL('image/jpeg', 0.75)); renderProofModal(); }
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
    return;
  }
  if (typeof fbStorage === 'undefined' || !fbStorage) { partToast('Video upload is not available on this page — add a photo instead.', 'red'); return; }
  if (file.size > PROOF_VIDEO_MAX) { partToast('That video is too large (max 300MB).', 'red'); return; }
  d.uploading++; renderProofModal();
  fbStorage.ref('gcap/videos/found_' + d.key + '/' + Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')).put(file)
    .then(function(snap) { return snap.ref.getDownloadURL(); })
    .then(function(url) { d.uploading--; d.videos.push(url); if (proofDraft === d) renderProofModal(); })
    .catch(function(e) { console.error('proof video upload failed', e); d.uploading--; partToast('Video upload failed — try again or add a photo.', 'red'); if (proofDraft === d) renderProofModal(); });
}
function confirmFoundProof() {
  var d = proofDraft;
  if (!d || d.uploading || d.photos.length + d.videos.length === 0) return;
  var key = d.key, cur = partStatus[key] || {};
  var btn = document.getElementById('proofConfirmBtn'); if (btn) btn.disabled = true;
  fbDb.ref('gcap/partProof/' + key).set({ photos: d.photos, videos: d.videos, by: partWho(), at: Date.now() })
    .then(function() {
      writePartStatus(key, { found: { by: partWho(), at: Date.now(), p: d.photos.length, v: d.videos.length }, loaded: cur.loaded || null });
      closeProofModal();
      partToast('Marked as found ✓', 'green');
    }).catch(function(e) { console.error('proof save failed', e); partToast("Couldn't save the proof — check your connection.", 'red'); if (btn) btn.disabled = false; });
}
function viewPartProof(key) {
  ensureProofModal();
  proofDraft = { key: key, mode: 'view', photos: [], videos: [], uploading: 0, loading: true };
  document.getElementById('proofModal').classList.add('open');
  renderProofModal();
  var d = proofDraft;
  fbDb.ref('gcap/partProof/' + key).once('value').then(function(snap) {
    var v = snap.val() || {};
    d.photos = v.photos || []; d.videos = v.videos || []; d.loading = false;
    if (proofDraft === d) renderProofModal();
  }).catch(function() { d.loading = false; if (proofDraft === d) renderProofModal(); });
}
function undoFound(key) {
  if (!confirm('Undo Found for this part? (This also clears Loaded. The saved photos are kept.)')) return;
  writePartStatus(key, { found: null, loaded: null });
  closeProofModal();
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
    L.push('- ' + r[0] + ' | OEM ' + (r[1] || '—') + ' | ' + (r[2] > 0 ? 'IN STOCK qty ' + r[2] : 'SOLD OUT') + ' | ' + (r[4] != null ? '$' + r[4] : 'no price') + ' | ' + r[6] + (r[7] ? ' | grade ' + r[7] : '') + (invLocText(r[0]) ? ' | location ' + invLocText(r[0]) : ''));
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
        answer = /not configured/i.test(err) ? "The AI isn't switched on yet — the GEMINI_API_KEY still needs to be added in Netlify." : (/limit|busy/i.test(err) ? err : "Sorry, I couldn't answer that right now. Please try again.");
      }
      assistantHistory.push({ role: 'assistant', text: answer });
    })
    .catch(function() { assistantHistory.push({ role: 'assistant', text: "Couldn't reach the AI — check your connection and try again." }); })
    .then(function() { assistantBusy = false; renderAssistantLog(); });
}

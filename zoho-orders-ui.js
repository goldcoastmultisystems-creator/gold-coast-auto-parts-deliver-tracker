/* Zoho Orders dashboard shared by the Delivery, Sales Rep and Inventory pages (read-only).
   The delivery page can add orders as stops by defining: zohoCanImport(), zohoDriverOptions(),
   zohoIsImported(order) and zohoImportOrders(orders, driver). Needs assistant.js loaded first (inventory lookup). */
var ZOHO_ORDERS_ENDPOINT = '/.netlify/functions/zoho-orders';
var zohoState = { orders: [], counts: {}, loading: false, error: '', statuses: 'confirmed', q: '', selected: {}, truncated: false, hasMore: false, open: {} };

function zohoAuthPayload() {
  var a = session && session.auth;
  if (!a) return null;
  return a.type === 'owner' ? { type: 'owner', email: a.email, password: a.password } : { type: 'team', memberId: a.memberId, pin: a.pin };
}
function ensureZohoModal() {
  if (document.getElementById('zohoModal')) return;
  var div = document.createElement('div');
  div.className = 'modal-backdrop';
  div.id = 'zohoModal';
  div.innerHTML = '<div class="modal wide" style="max-width:860px;">' +
    '<h3>🧾 Zoho Orders</h3>' +
    '<p class="modal-sub" id="zohoSub">Orders from Zoho Inventory. Read-only — nothing here changes Zoho.</p>' +
    '<div id="zohoControls" style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px;"></div>' +
    '<div id="zohoList" style="max-height:56vh; overflow-y:auto;"></div>' +
    '<div class="modal-actions" id="zohoActions"></div></div>';
  document.body.appendChild(div);
}
function openZohoOrders() {
  ensureZohoModal();
  document.getElementById('zohoModal').classList.add('open');
  if (typeof loadInventory === 'function') loadInventory().then(renderZohoOrders);
  fetchZohoOrders();
}
function closeZohoOrders() { document.getElementById('zohoModal').classList.remove('open'); }
function fetchZohoOrders() {
  var auth = zohoAuthPayload();
  if (!auth) { zohoState.error = 'Please log out and log back in once so your login can be used for Zoho orders.'; zohoState.orders = []; renderZohoOrders(); return; }
  zohoState.loading = true; zohoState.error = ''; zohoState.selected = {};
  renderZohoOrders();
  fetch(ZOHO_ORDERS_ENDPOINT, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ auth: auth, statuses: zohoState.statuses === 'all' ? [] : [zohoState.statuses] })
  }).then(function(r) { return r.json().then(function(d) { return { ok: r.ok, d: d }; }); })
    .then(function(res) {
      if (!res.ok || !res.d.ok) { zohoState.error = (res.d && res.d.error) || 'Could not load Zoho orders.'; zohoState.orders = []; }
      else { zohoState.orders = res.d.orders; zohoState.counts = res.d.statusCounts || {}; zohoState.truncated = res.d.truncated; zohoState.hasMore = res.d.hasMore; }
    })
    .catch(function() { zohoState.error = "Couldn't reach Zoho. Check your connection and try again."; zohoState.orders = []; })
    .then(function() { zohoState.loading = false; renderZohoOrders(); });
}
function zohoSetStatus(v) { zohoState.statuses = v; fetchZohoOrders(); }
function zohoSetQuery(v) { zohoState.q = v.toLowerCase(); renderZohoList(); }
function zohoToggleOpen(id) { zohoState.open[id] = !zohoState.open[id]; renderZohoList(); }
function zohoToggleSelect(id) { zohoState.selected[id] = !zohoState.selected[id]; renderZohoActions(); }

function zohoStockTag(line) {
  if (!line.sku || typeof inventoryRows === 'undefined' || !inventoryRows) return '';
  var row = inventoryRows.find(function(r) { return String(r[0]).toLowerCase() === String(line.sku).toLowerCase(); });
  if (!row) return ' <span style="color:var(--text-soft);">(not in catalog)</span>';
  return row[2] > 0 ? ' <span style="color:var(--green);">• ' + row[2] + ' in stock</span>' : ' <span style="color:var(--red);">• sold out</span>';
}
function renderZohoOrders() {
  if (!document.getElementById('zohoControls')) return;
  var statusKeys = Object.keys(zohoState.counts);
  if (statusKeys.indexOf(zohoState.statuses) === -1 && zohoState.statuses !== 'all') statusKeys.push(zohoState.statuses);
  document.getElementById('zohoControls').innerHTML =
    '<select class="edit-input" style="width:auto;" onchange="zohoSetStatus(this.value)">' +
      statusKeys.map(function(s) { return '<option value="' + escapeHtml(s) + '"' + (s === zohoState.statuses ? ' selected' : '') + '>' + escapeHtml(s.charAt(0).toUpperCase() + s.slice(1)) + (zohoState.counts[s] != null ? ' (' + zohoState.counts[s] + ')' : '') + '</option>'; }).join('') +
      '<option value="all"' + (zohoState.statuses === 'all' ? ' selected' : '') + '>All statuses</option></select>' +
    '<input class="edit-input" style="flex:1 1 180px; width:auto;" placeholder="Search customer or order #" value="' + escapeHtml(zohoState.q) + '" oninput="zohoSetQuery(this.value)">' +
    '<button class="btn btn-ghost btn-sm" onclick="fetchZohoOrders()">↻ Refresh</button>';
  renderZohoList();
  renderZohoActions();
}
function zohoVisible() {
  return zohoState.orders.filter(function(o) { return !zohoState.q || (o.customer + ' ' + o.number + ' ' + o.reference).toLowerCase().indexOf(zohoState.q) !== -1; });
}
function renderZohoList() {
  var el = document.getElementById('zohoList');
  if (!el) return;
  if (zohoState.loading) { el.innerHTML = '<div class="hist-empty">Loading orders from Zoho…</div>'; return; }
  if (zohoState.error) { el.innerHTML = '<div class="hist-empty" style="color:var(--amber); font-style:normal;">' + escapeHtml(zohoState.error) + '</div>'; return; }
  var list = zohoVisible();
  document.getElementById('zohoSub').textContent = 'Orders from Zoho Inventory (most recent 200 checked)' + (zohoState.truncated ? ' • showing the newest 30' : '') + '. Read-only — nothing here changes Zoho.';
  if (!list.length) { el.innerHTML = '<div class="hist-empty">No orders with this status.</div>'; return; }
  var canImport = typeof zohoCanImport === 'function' && zohoCanImport();
  el.innerHTML = list.map(function(o) {
    var done = canImport && typeof zohoIsImported === 'function' && zohoIsImported(o);
    var chips = '<span style="font-size:11px; color:var(--text-soft);">' + [o.shipped && 'shipped: ' + o.shipped, o.paid && 'paid: ' + o.paid, o.method].filter(Boolean).map(escapeHtml).join(' • ') + '</span>';
    return '<div class="team-row" style="align-items:flex-start;">' +
      (canImport ? '<input type="checkbox" style="width:auto; margin-top:4px;"' + (done ? ' disabled' : (zohoState.selected[o.id] ? ' checked' : '')) + ' onchange="zohoToggleSelect(\'' + escapeHtml(o.id) + '\')">' : '') +
      '<div style="flex:1 1 260px; min-width:240px; cursor:pointer;" onclick="zohoToggleOpen(\'' + escapeHtml(o.id) + '\')">' +
        '<span class="tname">' + escapeHtml(o.customer) + '</span> <span style="font-size:12px; color:var(--gold-2);">' + escapeHtml(o.number) + '</span>' +
        (done ? ' <span style="font-size:11px; color:var(--green); font-weight:700;">✓ On delivery board</span>' : '') +
        '<div style="font-size:11.5px; color:var(--text-soft); margin-top:2px;">' + escapeHtml(o.date) + (o.deliveryDate ? ' • deliver ' + escapeHtml(o.deliveryDate) : '') + ' • ' + escapeHtml(o.status) + '</div>' +
        '<div style="margin-top:2px;">' + chips + '</div>' +
        (zohoState.open[o.id]
          ? '<div style="font-size:12.5px; margin-top:6px;">' + (o.address ? '📍 ' + escapeHtml(o.address) + '<br>' : '') + (o.terms ? 'Terms: ' + escapeHtml(o.terms) + '<br>' : '') + (o.notes ? 'Notes: ' + escapeHtml(o.notes) + '<br>' : '') +
            (o.lines.length ? o.lines.map(function(l) { return '• ' + escapeHtml(String(l.qty)) + '× ' + escapeHtml(l.name) + (l.sku ? ' <span style="color:var(--text-soft);">(' + escapeHtml(l.sku) + ')</span>' : '') + zohoStockTag(l); }).join('<br>') : '<span style="color:var(--text-soft);">No line items.</span>') + '</div>'
          : '<div style="font-size:11.5px; color:var(--text-soft); margin-top:2px;">' + o.lines.length + ' item' + (o.lines.length === 1 ? '' : 's') + ' — tap to see details</div>') +
      '</div></div>';
  }).join('');
}
function renderZohoActions() {
  var el = document.getElementById('zohoActions');
  if (!el) return;
  var canImport = typeof zohoCanImport === 'function' && zohoCanImport();
  var n = Object.keys(zohoState.selected).filter(function(k) { return zohoState.selected[k]; }).length;
  el.innerHTML = (canImport
    ? '<select class="edit-input" id="zohoDriver" style="width:auto;">' + (typeof assignedDriverOptionsHtml === 'function' ? assignedDriverOptionsHtml('') : '') + '</select>' +
      '<button class="btn btn-navy" onclick="zohoAddSelected()"' + (n ? '' : ' disabled style="opacity:.5;"') + '>➕ Add ' + (n || '') + ' to deliveries</button>'
    : '') + '<button class="btn btn-ghost" onclick="closeZohoOrders()">Close</button>';
}
function zohoAddSelected() {
  var picked = zohoState.orders.filter(function(o) { return zohoState.selected[o.id]; });
  if (!picked.length) return;
  var added = zohoImportOrders(picked, document.getElementById('zohoDriver').value);
  zohoState.selected = {};
  if (typeof showToast === 'function') showToast(added + ' order' + (added === 1 ? '' : 's') + ' added to today\'s deliveries.', 'green');
  renderZohoOrders();
}

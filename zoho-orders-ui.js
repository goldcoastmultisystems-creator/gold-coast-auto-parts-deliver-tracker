/* Zoho Sales Orders panel shown at the top of the Delivery, Sales Rep and Inventory pages (read-only).
   The delivery page can add orders as stops by defining: zohoCanImport(), zohoIsImported(order),
   zohoImportOrders(orders, driver) and assignedDriverOptionsHtml(). Needs assistant.js loaded first (inventory lookup). */
/* Dark, readable dropdown lists on every page (the browser's default list is white with light text). */
(function() {
  var st = document.createElement('style');
  st.textContent = 'select { color-scheme: dark; } select option, select optgroup { background-color: #1a1713; color: #f3f1ec; }';
  document.head.appendChild(st);
})();
var ZOHO_ORDERS_ENDPOINT = '/.netlify/functions/zoho-orders';
var ZOHO_REFRESH_MS = 5 * 60 * 1000;
var zohoState = { orders: [], counts: {}, loading: false, loaded: false, error: '', statuses: 'confirmed', q: '', selected: {}, truncated: false, open: {}, collapsed: false, lastLoaded: 0 };

function zohoAuthPayload() {
  var a = session && session.auth;
  if (!a) return null;
  return a.type === 'owner' ? { type: 'owner', email: a.email, password: a.password } : { type: 'team', memberId: a.memberId, pin: a.pin };
}
function zohoPanelAllowed() {
  return !!session && !(session.type === 'guest' && !session.isAdmin && session.role === 'Driver');
}
function mountZohoPanel() {
  if (document.getElementById('zohoPanelWrap')) return;
  var anchor = document.querySelector('.smart-bar-wrap') || document.getElementById('notice');
  if (!anchor) return;
  try { zohoState.collapsed = localStorage.getItem('gcap_zoho_collapsed') === '1'; } catch (e) {}
  var wrap = document.createElement('div');
  wrap.id = 'zohoPanelWrap';
  wrap.style.cssText = 'max-width:1000px; margin:14px auto 0; padding:0 16px; display:none;';
  wrap.innerHTML = '<div style="background:var(--glass); border:1px solid var(--glass-border-gold); border-radius:16px; padding:12px 14px;">' +
    '<div style="display:flex; align-items:center; gap:10px; cursor:pointer;" onclick="zohoToggleCollapsed()">' +
      '<div style="font-weight:800; color:var(--gold-2); font-size:14px;">🧾 Zoho Sales Orders <span id="zohoCount" style="color:var(--text-soft); font-weight:600; font-size:12px;"></span></div>' +
      '<div id="zohoChevron" style="margin-left:auto; color:var(--text-soft);">▾</div></div>' +
    '<div id="zohoBody">' +
      '<div id="zohoControls" style="display:flex; gap:8px; flex-wrap:wrap; margin:10px 0;"></div>' +
      '<div id="zohoList" style="max-height:380px; overflow-y:auto;"></div>' +
      '<div id="zohoActions" style="display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-end; margin-top:10px;"></div>' +
      '<div id="zohoSub" style="font-size:11px; color:var(--text-soft); margin-top:8px;"></div>' +
    '</div></div>';
  anchor.parentNode.insertBefore(wrap, anchor);
  zohoApplyCollapsed();
}
function zohoApplyCollapsed() {
  var body = document.getElementById('zohoBody'), chev = document.getElementById('zohoChevron');
  if (body) body.style.display = zohoState.collapsed ? 'none' : '';
  if (chev) chev.textContent = zohoState.collapsed ? '▸' : '▾';
}
function zohoToggleCollapsed() {
  zohoState.collapsed = !zohoState.collapsed;
  try { localStorage.setItem('gcap_zoho_collapsed', zohoState.collapsed ? '1' : '0'); } catch (e) {}
  zohoApplyCollapsed();
}
function openZohoOrders() {
  mountZohoPanel();
  var wrap = document.getElementById('zohoPanelWrap');
  if (!wrap) return;
  wrap.style.display = zohoPanelAllowed() ? '' : 'none';
  zohoState.collapsed = false; zohoApplyCollapsed();
  wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  fetchZohoOrders();
}
function fetchZohoOrders() {
  if (zohoState.loading) return;
  var auth = zohoAuthPayload();
  if (!auth) { zohoState.error = 'Log out and log back in once so your login can be used for Zoho orders.'; zohoState.orders = []; zohoState.loaded = true; zohoState.lastLoaded = Date.now(); renderZohoOrders(); return; }
  zohoState.loading = true; zohoState.error = '';
  renderZohoOrders();
  fetch(ZOHO_ORDERS_ENDPOINT, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ auth: auth, statuses: zohoState.statuses === 'all' ? [] : [zohoState.statuses] })
  }).then(function(r) { return r.json().then(function(d) { return { ok: r.ok, d: d }; }); })
    .then(function(res) {
      if (!res.ok || !res.d.ok) { zohoState.error = (res.d && res.d.error) || 'Could not load Zoho orders.'; zohoState.orders = []; }
      else { zohoState.orders = res.d.orders; zohoState.counts = res.d.statusCounts || {}; zohoState.truncated = res.d.truncated; zohoState.selected = {}; }
    })
    .catch(function() { zohoState.error = "Couldn't reach Zoho. Check your connection and try again."; zohoState.orders = []; })
    .then(function() { zohoState.loading = false; zohoState.loaded = true; zohoState.lastLoaded = Date.now(); renderZohoOrders(); });
}
function zohoSetStatus(v) { zohoState.statuses = v; zohoState.loaded = false; fetchZohoOrders(); }
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
  var keys = Object.keys(zohoState.counts);
  if (keys.indexOf(zohoState.statuses) === -1 && zohoState.statuses !== 'all') keys.push(zohoState.statuses);
  document.getElementById('zohoControls').innerHTML =
    '<select class="edit-input" style="width:auto;" onchange="zohoSetStatus(this.value)">' +
      keys.map(function(s) { return '<option value="' + escapeHtml(s) + '"' + (s === zohoState.statuses ? ' selected' : '') + '>' + escapeHtml(s.charAt(0).toUpperCase() + s.slice(1)) + (zohoState.counts[s] != null ? ' (' + zohoState.counts[s] + ')' : '') + '</option>'; }).join('') +
      '<option value="all"' + (zohoState.statuses === 'all' ? ' selected' : '') + '>All statuses</option></select>' +
    '<input class="edit-input" style="flex:1 1 180px; width:auto;" placeholder="Search customer or order #" value="' + escapeHtml(zohoState.q) + '" oninput="zohoSetQuery(this.value)">' +
    '<button class="btn btn-ghost btn-sm" onclick="fetchZohoOrders()">' + (zohoState.loading ? 'Loading…' : '↻ Refresh') + '</button>';
  renderZohoList();
  renderZohoActions();
}
function zohoVisible() {
  return zohoState.orders.filter(function(o) { return !zohoState.q || (o.customer + ' ' + o.number + ' ' + o.reference).toLowerCase().indexOf(zohoState.q) !== -1; });
}
function renderZohoList() {
  var el = document.getElementById('zohoList');
  if (!el) return;
  var count = document.getElementById('zohoCount');
  if (zohoState.loading && !zohoState.orders.length) { el.innerHTML = '<div class="hist-empty">Loading orders from Zoho…</div>'; return; }
  if (zohoState.error) { if (count) count.textContent = ''; el.innerHTML = '<div class="hist-empty" style="color:var(--amber); font-style:normal;">' + escapeHtml(zohoState.error) + '</div>'; return; }
  var list = zohoVisible();
  if (count) count.textContent = '(' + list.length + ' ' + zohoState.statuses + ')';
  var sub = document.getElementById('zohoSub');
  if (sub) sub.textContent = 'From Zoho Inventory • newest 200 orders checked' + (zohoState.truncated ? ', showing 30' : '') + ' • updated ' + new Date(zohoState.lastLoaded).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) + ' • read-only';
  if (!list.length) { el.innerHTML = '<div class="hist-empty">No orders with this status.</div>'; return; }
  var canImport = typeof zohoCanImport === 'function' && zohoCanImport();
  el.innerHTML = list.map(function(o) {
    var done = canImport && typeof zohoIsImported === 'function' && zohoIsImported(o);
    var chips = [o.method, o.shipped && 'shipment ' + o.shipped, o.paid && o.paid, o.location].filter(Boolean).map(escapeHtml).join(' • ');
    return '<div class="team-row" style="align-items:flex-start;">' +
      (canImport ? '<input type="checkbox" style="width:auto; margin-top:4px;"' + (done ? ' disabled' : (zohoState.selected[o.id] ? ' checked' : '')) + ' onchange="zohoToggleSelect(\'' + escapeHtml(o.id) + '\')">' : '') +
      '<div style="flex:1 1 260px; min-width:220px; cursor:pointer;" onclick="zohoToggleOpen(\'' + escapeHtml(o.id) + '\')">' +
        '<span class="tname">' + escapeHtml(o.customer) + '</span> <span style="font-size:12px; color:var(--gold-2);">' + escapeHtml(o.number) + '</span>' +
        (done ? ' <span style="font-size:11px; color:var(--green); font-weight:700;">✓ On delivery board</span>' : '') +
        '<div style="font-size:11.5px; color:var(--text-soft); margin-top:2px;">' + escapeHtml(o.date) + (o.deliveryDate ? ' • deliver ' + escapeHtml(o.deliveryDate) : '') + (chips ? ' • ' + chips : '') + '</div>' +
        (zohoState.open[o.id]
          ? '<div style="font-size:12.5px; margin-top:6px;">' + (o.address ? '📍 ' + escapeHtml(o.address) + '<br>' : '') + (o.terms ? 'Terms: ' + escapeHtml(o.terms) + '<br>' : '') + (o.notes ? 'Notes: ' + escapeHtml(o.notes) + '<br>' : '') +
            (o.lines.length ? o.lines.map(function(l) { return '• ' + escapeHtml(String(l.qty)) + '× ' + escapeHtml(l.name) + (l.sku ? ' <span style="color:var(--text-soft);">(' + escapeHtml(l.sku) + ')</span>' : '') + zohoStockTag(l); }).join('<br>') : '<span style="color:var(--text-soft);">No line items.</span>') + '</div>'
          : '<div style="font-size:11.5px; color:var(--text-soft); margin-top:2px;">' + (o.address ? escapeHtml(o.address) + ' • ' : '') + o.lines.length + ' item' + (o.lines.length === 1 ? '' : 's') + ' — tap for details</div>') +
      '</div></div>';
  }).join('');
}
function renderZohoActions() {
  var el = document.getElementById('zohoActions');
  if (!el) return;
  var canImport = typeof zohoCanImport === 'function' && zohoCanImport();
  if (!canImport) { el.innerHTML = ''; return; }
  var n = Object.keys(zohoState.selected).filter(function(k) { return zohoState.selected[k]; }).length;
  var cur = document.getElementById('zohoDriver') ? document.getElementById('zohoDriver').value : '';
  el.innerHTML = '<select class="edit-input" id="zohoDriver" style="width:auto;">' + (typeof assignedDriverOptionsHtml === 'function' ? assignedDriverOptionsHtml(cur) : '') + '</select>' +
    '<button class="btn btn-navy btn-sm" onclick="zohoAddSelected()"' + (n ? '' : ' disabled style="opacity:.5;"') + '>➕ Add ' + (n || '') + ' to deliveries</button>';
}
function zohoAddSelected() {
  var picked = zohoState.orders.filter(function(o) { return zohoState.selected[o.id]; });
  if (!picked.length) return;
  var added = zohoImportOrders(picked, document.getElementById('zohoDriver').value);
  zohoState.selected = {};
  if (typeof showToast === 'function') showToast(added + ' order' + (added === 1 ? '' : 's') + ' added to today\'s deliveries.', 'green');
  renderZohoOrders();
}

/* Show the panel once someone is signed in, load it automatically, and keep it fresh. */
function zohoTick() {
  mountZohoPanel();
  var wrap = document.getElementById('zohoPanelWrap');
  if (!wrap) return;
  var allowed = zohoPanelAllowed();
  wrap.style.display = allowed ? '' : 'none';
  if (!allowed || zohoState.loading) return;
  if (!zohoState.loaded || Date.now() - zohoState.lastLoaded > ZOHO_REFRESH_MS) {
    if (typeof loadInventory === 'function') loadInventory().then(renderZohoList);
    fetchZohoOrders();
  }
}
setInterval(zohoTick, 2000);
zohoTick();

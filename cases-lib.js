/* Order Cancellations, Returns & Refunds — shared by returns-refunds.html and the delivery board (index.html).
   One "case" per customer request, saved in gcap/cases/{CR-0001}. Inspection photos/videos live in gcap/caseProof/{id}
   so the case list itself stays small and fast.
   Cases and delivery stops are linked both ways: a stop carries caseId, a case carries stop {day, stopId} (the original
   delivery) and/or pickup {day, stopId, driver, status} (the return pickup the driver does). */
var CASE_TYPES = {
  cancel: { label: 'Order Cancellation', short: 'Cancellation', icon: '✖', color: '#f87171', banner: '✖ ORDER CANCELLATION' },
  'return': { label: 'Return', short: 'Return', icon: '↩', color: '#fbbf24', banner: '↩ RETURN — part comes back to us' },
  refund: { label: 'Refund', short: 'Refund', icon: '💲', color: '#34d399', banner: '💲 REFUND — money back to the customer' }
};
var CASE_STAGES = {
  cancel: ['requested', 'cancelled'],
  'return': ['requested', 'pickup_scheduled', 'picked_up', 'inspected', 'closed'],
  refund: ['requested', 'approved', 'refunded']
};
var CASE_STAGE_LABEL = {
  requested: 'Requested', cancelled: 'Cancelled', rejected: 'Rejected', pickup_scheduled: 'Pickup scheduled', picked_up: 'Picked up',
  inspected: 'Inspected', closed: 'Closed', approved: 'Approved', refunded: 'Refunded', denied: 'Denied'
};
var CASE_END = { cancelled: true, rejected: true, closed: true, refunded: true, denied: true };
var CASE_REASONS = {
  cancel: ['Customer changed their mind', 'Wrong part ordered', 'Found it cheaper / elsewhere', 'Taking too long', 'Out of stock', 'Duplicate order', 'Other'],
  'return': ['Wrong part', 'Does not fit', 'Damaged on arrival', 'Defective', 'Body shop refused the part', 'Customer no longer needs it', 'Other'],
  refund: ['Returned part', 'Cancelled order (already paid)', 'Overcharged', 'Damaged / defective', 'Goodwill credit', 'Other']
};
var REFUND_METHODS = ['Cash', 'Check', 'Card refund', 'Zelle', 'Store credit', 'Account credit'];
var REFUND_STATUS_LABEL = { pending: 'Waiting for approval', approved: 'Approved — ready to pay', refunded: 'Refunded', denied: 'Denied' };
var CASE_CONDITIONS = [
  { id: 'good', icon: '✅', label: 'Good condition', hint: 'Can still be sold — back on the shelf at full price', outcome: 'shelved', color: '#34d399' },
  { id: 'slight', icon: '🎨', label: 'Slightly damaged / painted', hint: 'Can be sold at a discount — back on the shelf', outcome: 'shelved', color: '#fbbf24' },
  { id: 'damaged', icon: '🗑', label: 'Damaged', hint: 'Cannot be sold — must be disposed', outcome: 'disposed', color: '#f87171' }
];
var casesData = {};

function caseDb() { return (typeof fbDb !== 'undefined' && fbDb) ? fbDb : null; }
function caseEsc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function(c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function caseWho() { return (typeof session !== 'undefined' && session && session.name) || (typeof settings !== 'undefined' && settings && settings.driverName) || 'Someone'; }
function caseSess() { return (typeof session !== 'undefined' && session) || null; }
/* who can do what */
function caseIsAdmin() { var s = caseSess(); return !!s && (s.type === 'owner' || !!s.isAdmin); }
function caseCanCreate() { var s = caseSess(); return !!s && !(s.type === 'guest' && !s.isAdmin && s.role === 'Driver'); }
function caseCanEdit() { var s = caseSess(); return caseIsAdmin() || (!!s && (s.role === 'Dispatcher' || s.role === 'Inventory Specialist')); }
function caseCanApproveMoney() { return caseIsAdmin(); }

function caseConditionInfo(id) { return CASE_CONDITIONS.find(function(c) { return c.id === id; }) || null; }
function caseIsOpen(c) {
  if (!c || c.deleted) return false;
  if (c.refund && (c.refund.status === 'pending' || c.refund.status === 'approved')) return true;
  return !CASE_END[c.stage];
}
function caseMoney(n) { var v = Number(n); return isFinite(v) && n !== '' && n != null ? '$' + v.toFixed(2) : ''; }
function caseItemsText(c) { return (c.items || '').toString(); }
function caseList() { return Object.keys(casesData).map(function(k) { return casesData[k]; }).filter(function(c) { return c && !c.deleted; }); }
/* One line telling where the case stands, e.g. "↩ CR-0007 • Pickup scheduled" */
function caseShortLabel(c) {
  if (!c) return '';
  var t = CASE_TYPES[c.type] || CASE_TYPES['return'];
  var refund = c.refund && c.refund.status && c.type !== 'refund' ? ' • refund ' + (REFUND_STATUS_LABEL[c.refund.status] || c.refund.status).toLowerCase() : '';
  return t.icon + ' ' + c.id + ' • ' + t.short + ' ' + (CASE_STAGE_LABEL[c.stage] || c.stage).toLowerCase() + refund;
}

/* Keep casesData live. cb runs after every change. */
function casesListen(cb) {
  var db = caseDb(); if (!db) return;
  db.ref('gcap/cases').on('value', function(snap) {
    casesData = snap.val() || {};
    Object.keys(casesData).forEach(function(k) { if (casesData[k]) casesData[k].id = k; });
    if (cb) cb();
  });
}

/* ---------- writing ---------- */
function caseClean(o) { return JSON.parse(JSON.stringify(o, function(k, v) { return v === undefined ? null : v; })); }
function caseHistoryKey() { var db = caseDb(); return db ? db.ref().push().key : 'h' + Date.now(); }
/* New case → CR-0001, CR-0002 ... (a shared counter, safe when two people create at once). */
function caseCreate(data) {
  var db = caseDb(); if (!db) return Promise.reject(new Error('offline'));
  return db.ref('gcap/casesCounter').transaction(function(n) { return (n || 0) + 1; }).then(function(r) {
    if (!r.committed) throw new Error('Could not number the case');
    var n = r.snapshot.val(), id = 'CR-' + String(n).padStart(4, '0'), now = Date.now();
    var c = Object.assign({ stage: 'requested' }, data, { id: id, num: n, createdAt: now, createdBy: caseWho(), dayKey: gcapEt.dateKey(now), updatedAt: now });
    var t = CASE_TYPES[c.type] || CASE_TYPES['return'];
    c.history = {};
    c.history[caseHistoryKey()] = { at: now, by: caseWho(), text: 'Opened — ' + t.label + (c.reason ? ' (' + c.reason + ')' : '') + (c.source ? ' from ' + c.source : '') };
    c = caseClean(c);
    return db.ref('gcap/cases/' + id).set(c).then(function() { casesData[id] = c; return c; });
  });
}
/* changes may use sub-paths like 'refund/status'. text goes into the case's history. */
function caseUpdate(id, changes, text, who) {
  var db = caseDb(); if (!db || !id) return Promise.resolve();
  var u = {}, now = Date.now(), base = 'gcap/cases/' + id + '/';
  Object.keys(changes || {}).forEach(function(k) { var v = changes[k]; u[base + k] = (v === undefined) ? null : (v && typeof v === 'object' ? caseClean(v) : v); });
  u[base + 'updatedAt'] = now;
  if (text) u[base + 'history/' + caseHistoryKey()] = { at: now, by: who || caseWho(), text: text };
  return db.ref().update(u);
}

/* ---------- delivery-board stops ---------- */
function caseUid() { return 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function caseZohoIndexKey(zohoId, asReturn) { return String(zohoId).replace(/[.#$\/\[\]]/g, '_') + (asReturn ? '_r' : '_d'); }
function caseCustomerKey(name) { return String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 80); }
/* Change one day's stop list in a transaction so it is safe while drivers and dispatch are using the board.
   fn(list) returns the new list, or undefined to leave it alone. */
function caseDayStopsTx(dayKey, fn) {
  var db = caseDb(); if (!db) return Promise.reject(new Error('offline'));
  return db.ref('gcap/days/' + dayKey + '/stops').transaction(function(cur) {
    var list = !cur ? [] : (Array.isArray(cur) ? cur : Object.keys(cur).sort(function(a, b) { return a - b; }).map(function(k) { return cur[k]; })).filter(Boolean);
    return fn(list);
  });
}
function caseFindStop(dayKey, stopId) {
  var db = caseDb(); if (!db || !dayKey || !stopId) return Promise.resolve(null);
  return db.ref('gcap/days/' + dayKey + '/stops').once('value').then(function(snap) {
    var v = snap.val() || [], list = Array.isArray(v) ? v : Object.keys(v).map(function(k) { return v[k]; });
    return list.filter(Boolean).find(function(s) { return s.id === stopId; }) || null;
  });
}
/* Put a return pickup on today's delivery board for the chosen driver. */
function caseSchedulePickup(c, driver, extra) {
  var db = caseDb(); if (!db) return Promise.reject(new Error('offline'));
  var key = gcapEt.dateKey(Date.now()), now = Date.now();
  var stop = caseClean(Object.assign({
    id: caseUid(), loc: c.customer || 'Return pickup', addr: c.address || '', type: 'pickup', isReturn: true, assignedTo: driver || '',
    so: c.so || '', part: caseItemsText(c), mop: '', notes: '↩ Return ' + c.id + (c.reason ? ' — ' + c.reason : '') + (c.notes ? ' • ' + c.notes : ''),
    status: 'pending', photos: [], chat: [], createdAt: gcapEt.timeStr(now), caseId: c.id, zohoId: c.zohoId || null
  }, extra || {}));
  return caseDayStopsTx(key, function(list) { list.push(stop); return list; }).then(function(r) {
    if (!r.committed) throw new Error('Could not add the pickup');
    if (c.zohoId) db.ref('gcap/zohoImported/' + caseZohoIndexKey(c.zohoId, true)).set(key).catch(function() {});
    return caseUpdate(c.id, { stage: 'pickup_scheduled', pickup: { day: key, stopId: stop.id, driver: driver || '', status: 'pending' } },
      'Pickup put on today\'s delivery board' + (driver ? ' — ' + driver + '\'s route' : ' (no driver yet)')).then(function() { return stop; });
  });
}
/* Approving a cancellation takes the undelivered stop off the board. Returns 'removed' | 'delivered' | 'gone'. */
function caseRemoveDeliveryStop(c) {
  var link = c.stop;
  if (!link || !link.day || !link.stopId) return Promise.resolve('gone');
  var result = 'gone';
  return caseDayStopsTx(link.day, function(list) {
    var s = list.find(function(x) { return x.id === link.stopId; });
    if (!s) { result = 'gone'; return; }
    if (s.status === 'completed') { result = 'delivered'; return; }
    result = 'removed';
    return list.filter(function(x) { return x.id !== link.stopId; });
  }).then(function() {
    if (result === 'removed' && c.zohoId) { var db = caseDb(); if (db) db.ref('gcap/zohoImported/' + caseZohoIndexKey(c.zohoId, false)).remove().catch(function() {}); }
    return result;
  });
}
/* Write fields onto one stop (e.g. caseId) wherever it is. */
function casePatchStop(dayKey, stopId, fields) {
  return caseDayStopsTx(dayKey, function(list) {
    var s = list.find(function(x) { return x.id === stopId; });
    if (!s) return;
    Object.keys(fields).forEach(function(k) { if (fields[k] == null) delete s[k]; else s[k] = fields[k]; });
    return list;
  });
}

/* ---------- hooks the delivery board calls ---------- */
var CASE_STOP_STATUS_LABEL = { pending: 'Pending', onway: 'On the way', arrived: 'At location', completed: 'Completed', returned: 'Returned part', postponed: 'Postponed' };
/* A stop linked to a case changed status on the board. */
function caseOnStopStatus(s, status, dayKey) {
  var c = s && s.caseId && casesData[s.caseId];
  if (!c) return;
  var label = CASE_STOP_STATUS_LABEL[status] || status, who = caseWho();
  if (c.pickup && c.pickup.stopId === s.id) {
    var ch = { 'pickup/status': status };
    if (status === 'completed' && c.type === 'return' && (c.stage === 'requested' || c.stage === 'pickup_scheduled')) {
      ch.stage = 'picked_up';
      caseUpdate(c.id, ch, 'Part picked up from the customer by ' + who + ' — bring it in for inspection', who);
    } else caseUpdate(c.id, ch, 'Pickup stop marked ' + label + ' by ' + who, who);
    return;
  }
  if (c.stop && c.stop.stopId === s.id) {
    var warn = status === 'completed' && c.type === 'cancel' && c.stage === 'requested' ? ' ⚠ it was delivered before the cancellation was approved' : '';
    caseUpdate(c.id, { 'stop/status': status }, 'Delivery stop marked ' + label + ' by ' + who + warn, who);
  }
}
/* "Returned Part" on a delivery (the shop would not take it): open a return case, or note it on the existing one. */
function caseOnPartReturned(s, dayKey, onCreated) {
  if (!s) return;
  var who = caseWho();
  if (s.caseId && casesData[s.caseId]) {
    var c = casesData[s.caseId];
    caseUpdate(c.id, { 'stop/status': 'returned' }, 'Driver brought the part back — ' + (s.returnReason || 'not accepted') + (s.returnNotes ? ' (' + s.returnNotes + ')' : '') + ' — ' + who, who);
    return;
  }
  caseCreate({
    type: 'return', stage: 'picked_up', customer: s.loc || '', address: s.addr || '', so: s.so || '', items: s.part || '', zohoId: s.zohoId || null,
    reason: 'Body shop refused the part', notes: (s.returnReason || '') + (s.returnNotes ? ' — ' + s.returnNotes : ''), mop: s.mop || '',
    stop: { day: dayKey, stopId: s.id, status: 'returned' }, source: 'delivery board (' + who + ')'
  }).then(function(c) { if (onCreated) onCreated(c); }).catch(function(e) { console.error('auto return case failed', e); });
}
/* Return processed (shelved / disposed) on the board. */
function caseOnReturnProcessed(s, condition, outcome, proofPath) {
  var c = s && s.caseId && casesData[s.caseId];
  if (!c || c.type !== 'return') return;
  var info = caseConditionInfo(condition);
  caseUpdate(c.id, { stage: 'inspected', condition: condition, outcome: outcome, proofPath: proofPath || null, inspectedBy: caseWho(), inspectedAt: Date.now() },
    'Inspected: ' + (info ? info.label : condition) + ' — ' + (outcome === 'disposed' ? 'disposed' : 'back on the shelf'));
}
/* A stop linked to a case was deleted from the board. */
function caseOnStopDeleted(s) {
  var c = s && s.caseId && casesData[s.caseId];
  if (!c) return;
  if (c.pickup && c.pickup.stopId === s.id && !CASE_END[c.stage] && c.stage === 'pickup_scheduled') caseUpdate(c.id, { pickup: null, stage: 'requested' }, 'The pickup stop was deleted from the delivery board — schedule it again');
  else if (c.stop && c.stop.stopId === s.id) caseUpdate(c.id, { 'stop/removed': true }, 'The delivery stop was deleted from the board');
}

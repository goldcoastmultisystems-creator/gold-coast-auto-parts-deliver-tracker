/* Safe local storage for every page.
   Problem this fixes: each device cached ALL days (with their photos) in localStorage, which is capped at ~5 MB.
   Once full, localStorage.setItem() throws — so the login could not be saved (people were sent back to the login
   screen on the next page) and saves threw before they ever reached Firebase.
   Rules now: (1) the day cache only keeps today + yesterday (Firebase is the source of truth for older days),
   (2) a failing write never throws — if a cache doesn't fit it is simply skipped, (3) the login is also kept in
   sessionStorage as a backup, and a full cache is cleared to make room for it.
   Load this in <head> of every page, before the page's own scripts. */
(function() {
  var KEEP_DAYS = 2;                                           // today + yesterday are cached locally
  var DAY_KEYS = ['kgps_days', 'kgps_sales_days'];
  var DROPPABLE = ['kgps_days', 'kgps_sales_days', 'kgps_geocache'];   // caches that are safe to throw away to make room

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  /* ---- US Eastern time (Florida) is the business clock for every page, whatever the device's time zone is ---- */
  var ET_TZ = 'America/New_York';
  var etFmt = new Intl.DateTimeFormat('en-US', { timeZone: ET_TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  function etParts(ms) {
    var o = {}; etFmt.formatToParts(new Date(ms == null ? Date.now() : ms)).forEach(function(p) { o[p.type] = p.value; });
    return { y: o.year, mo: o.month, d: o.day, h: Number(o.hour) % 24, mi: Number(o.minute) };
  }
  function etDateKey(ms) { var p = etParts(ms); return p.y + '-' + p.mo + '-' + p.d; }
  function etTimeStr(ms) { var p = etParts(ms), h12 = p.h % 12 || 12; return h12 + ':' + pad(p.mi) + ' ' + (p.h >= 12 ? 'PM' : 'AM'); }
  function etMinutes(ms) { var p = etParts(ms); return p.h * 60 + p.mi; }
  /* add or subtract whole days from a "YYYY-MM-DD" key */
  function shiftKey(key, delta) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key), d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3] + delta));
    return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate());
  }
  window.gcapEt = { tz: ET_TZ, parts: etParts, dateKey: etDateKey, timeStr: etTimeStr, minutes: etMinutes, shiftKey: shiftKey };
  function oldestKept(n) { return shiftKey(etDateKey(Date.now()), -(n - 1)); }
  function recentDays(days, n) {
    var out = {}, min = oldestKept(n);
    Object.keys(days || {}).forEach(function(k) { if (k >= min) out[k] = days[k]; });
    return out;
  }
  function trySet(store, key, value) { try { store.setItem(key, value); return true; } catch (e) { return false; } }

  /* Writes without ever throwing. If the browser is full, throws away rebuildable caches and retries once. */
  function safeSet(key, value) {
    if (trySet(localStorage, key, value)) return true;
    DROPPABLE.forEach(function(k) { if (k !== key) { try { localStorage.removeItem(k); } catch (e) {} } });
    return trySet(localStorage, key, value);
  }

  /* Caches the recent days; if even that doesn't fit, tries today alone, then gives up quietly. */
  function saveDaysCache(key, days) {
    var attempts = [recentDays(days, KEEP_DAYS), recentDays(days, 1)];
    for (var i = 0; i < attempts.length; i++) {
      var json; try { json = JSON.stringify(attempts[i]); } catch (e) { continue; }
      if (safeSet(key, json)) return true;
    }
    try { localStorage.removeItem(key); } catch (e) {}
    return false;
  }

  /* The login: localStorage first, sessionStorage as a backup so a full/blocked localStorage can't log people out. */
  function saveSession(s) {
    if (!s) {
      try { localStorage.removeItem('kgps_session'); } catch (e) {}
      try { sessionStorage.removeItem('kgps_session'); } catch (e) {}
      return;
    }
    var json = JSON.stringify(s);
    safeSet('kgps_session', json);
    trySet(sessionStorage, 'kgps_session', json);
  }
  function loadSession() {
    var raw = null;
    try { raw = localStorage.getItem('kgps_session'); } catch (e) {}
    if (!raw) { try { raw = sessionStorage.getItem('kgps_session'); } catch (e) {} }
    try { return JSON.parse(raw) || null; } catch (e) { return null; }
  }

  /* Runs on every page load, before anything tries to log in: shrink an oversized cache.
     Writing a smaller value over the old one always succeeds, even when the browser is full. */
  function compact() {
    DAY_KEYS.forEach(function(key) {
      var raw; try { raw = localStorage.getItem(key); } catch (e) { return; }
      if (!raw || raw.length < 400000) return;
      try { saveDaysCache(key, JSON.parse(raw)); } catch (e) { try { localStorage.removeItem(key); } catch (x) {} }
    });
    // heal a login that only survived in sessionStorage
    try { if (!localStorage.getItem('kgps_session')) { var s = sessionStorage.getItem('kgps_session'); if (s) safeSet('kgps_session', s); } } catch (e) {}
  }

  window.gcapSafeSet = safeSet;
  window.gcapSaveDaysCache = saveDaysCache;
  window.gcapSaveSession = saveSession;
  window.gcapLoadSession = loadSession;
  compact();
})();

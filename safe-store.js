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
  function dayKey(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function oldestKept(n) { var d = new Date(); d.setDate(d.getDate() - (n - 1)); return dayKey(d); }
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

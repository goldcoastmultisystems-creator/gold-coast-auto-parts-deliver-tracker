/* Light / Dark / Device theme switch, shared by every page (like Chrome's appearance setting).
   Include in <head> so the saved choice is applied before the page paints. Choice is remembered per device. */
(function() {
  var KEY = 'gcap_theme';
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function saved() { try { var v = localStorage.getItem(KEY); return v === 'light' || v === 'dark' || v === 'system' ? v : 'dark'; } catch (e) { return 'dark'; } }
  function effective(choice) { return choice === 'system' ? (mq && !mq.matches ? 'light' : 'dark') : choice; }
  function apply(choice) {
    var eff = effective(choice);
    document.documentElement.setAttribute('data-theme', eff);
    document.documentElement.style.colorScheme = eff;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'theme-color'; document.head.appendChild(meta); }
    meta.content = eff === 'light' ? '#f3efe6' : '#07070a';
  }
  window.setTheme = function(choice) {
    try { localStorage.setItem(KEY, choice); } catch (e) {}
    apply(choice); renderMenu();
  };
  window.getThemeChoice = saved;
  apply(saved());
  if (mq) (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(function() { if (saved() === 'system') apply('system'); });
  window.addEventListener('storage', function(e) { if (e.key === KEY) { apply(saved()); renderMenu(); } });

  var css =
    'html[data-theme="light"] {' +
    '  color-scheme: light;' +
    '  --void:#f3efe6; --void-2:#e9e4d8; --glass:rgba(255,255,255,0.86); --glass-strong:rgba(255,255,255,0.96);' +
    '  --glass-border:rgba(60,45,10,0.16); --glass-border-gold:rgba(160,112,20,0.5);' +
    '  --gold:#d9a93f; --gold-2:#a47612; --gold-ink:#1a1305;' +
    '  --green:#0e9468; --red:#c93a30; --amber:#a86a0a; --gray:#6f6a7c; --purple:#6d4fd0; --blue:#1f5fd6;' +
    '  --text:#1c1912; --text-soft:#645d52;' +
    '}' +
    /* the top header band stays dark (brand look, white logo), so give it its dark palette back */
    'html[data-theme="light"] header, html[data-theme="light"] .page-overlay-toolbar {' +
    '  --glass:rgba(255,255,255,0.08); --glass-border:rgba(255,255,255,0.16); --glass-border-gold:rgba(212,164,65,0.45);' +
    '  --gold:#d4a441; --gold-2:#f2d38a; --text:#f3f1ec; --text-soft:#a39d94; --green:#34d399; --red:#f87171; --amber:#fbbf24; --blue:#60a5fa; color-scheme: dark;' +
    '}' +
    'html[data-theme="light"] header, html[data-theme="light"] header h1, html[data-theme="light"] header h2 { color: #f3f1ec; }' +
    'html[data-theme="light"] body::before { background: radial-gradient(ellipse 900px 620px at 8% -8%, rgba(212,164,65,0.20), transparent 60%), radial-gradient(ellipse 700px 520px at 105% 4%, rgba(167,139,250,0.10), transparent 60%), var(--void); }' +
    /* surfaces that were hard-coded dark */
    'html[data-theme="light"] .modal, html[data-theme="light"] .auth-card, html[data-theme="light"] .card, html[data-theme="light"] .driver-list-wrap,' +
    'html[data-theme="light"] .leaflet-popup-content-wrapper, html[data-theme="light"] .leaflet-popup-tip, html[data-theme="light"] .leaflet-tooltip.depot-tip { background: rgba(255,253,248,0.97); color: var(--text); box-shadow: 0 18px 50px rgba(60,45,10,0.22); }' +
    'html[data-theme="light"] .leaflet-tooltip.depot-tip { color: var(--gold-2); }' +
    'html[data-theme="light"] .leaflet-bar a { background: #fff !important; color: var(--text) !important; }' +
    'html[data-theme="light"] .leaflet-control-attribution { background: rgba(255,255,255,0.8) !important; color: var(--text-soft) !important; }' +
    'html[data-theme="light"] .modal-backdrop { background: rgba(40,30,10,0.42); }' +
    'html[data-theme="light"] .auth-card .auth-logo, html[data-theme="light"] .logo-wrap { background: #14110c; }' + /* the logo artwork is light-on-dark */
    'html[data-theme="light"] .stop-card, html[data-theme="light"] .stat, html[data-theme="light"] .smart-bubble, html[data-theme="light"] .smart-bar-row { box-shadow: 0 4px 16px rgba(60,45,10,0.10); }' +
    'html[data-theme="light"] .stop-card.current { box-shadow: 0 0 0 1px rgba(160,112,20,0.35), 0 6px 22px rgba(160,112,20,0.22); }' +
    /* form fields and tinted fills that assumed a dark page */
    'html[data-theme="light"] input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="file"]), html[data-theme="light"] select, html[data-theme="light"] textarea { background-color: #fff; color: var(--text); }' +
    'html[data-theme="light"] header input, html[data-theme="light"] header select { background-color: rgba(255,255,255,0.08) !important; color: #f3f1ec !important; color-scheme: dark; }' +
    'html[data-theme="light"] header select option { background-color: #1a1713; color: #f3f1ec; }' +
    'html[data-theme="light"] .smart-input { background: transparent; }' +
    'html[data-theme="light"] select { color-scheme: light; }' +
    'html[data-theme="light"] select option, html[data-theme="light"] select optgroup { background-color: #fff; color: #1c1912; }' +
    'html[data-theme="light"] .btn-navy, html[data-theme="light"] .choice-btn { background: rgba(60,45,10,0.05); }' +
    'html[data-theme="light"] .btn-ghost:hover, html[data-theme="light"] .chat-msg-btn:hover { border-color: rgba(60,45,10,0.35); background: rgba(60,45,10,0.07); }' +
    'html[data-theme="light"] th, html[data-theme="light"] .pp-table th { background: #ece6d8; }' +
    /* pastel text colours picked for a dark page → deeper shades for light */
    'html[data-theme="light"] .src-supplier { color: #1d4ed8; } html[data-theme="light"] .src-buy, html[data-theme="light"] .note-flag, html[data-theme="light"] .stop-delete-btn { color: #b3261e; } html[data-theme="light"] .src-stock { color: #0b7a55; }' +
    'html[data-theme="light"] ::-webkit-scrollbar-thumb { background: rgba(160,112,20,0.4); }' +
    /* the floating switch itself */
    '#gcapThemeBtn { position: fixed; right: 14px; bottom: 14px; z-index: 150; width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--glass-border-gold, rgba(212,164,65,0.45)); background: var(--glass-strong, rgba(255,255,255,0.1)); color: var(--text, #f3f1ec); font-size: 18px; cursor: pointer; box-shadow: 0 6px 18px rgba(0,0,0,0.3); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; padding: 0; }' +
    '#gcapThemeMenu { position: fixed; right: 14px; bottom: 62px; z-index: 151; min-width: 170px; padding: 6px; border-radius: 12px; border: 1px solid var(--glass-border-gold, rgba(212,164,65,0.45)); background: rgba(24,20,14,0.97); color: #f3f1ec; box-shadow: 0 16px 40px rgba(0,0,0,0.45); display: none; font-family: inherit; }' +
    'html[data-theme="light"] #gcapThemeMenu { background: rgba(255,253,248,0.98); color: #1c1912; box-shadow: 0 16px 40px rgba(60,45,10,0.25); }' +
    '#gcapThemeMenu.open { display: block; }' +
    '#gcapThemeMenu .ttl { font-size: 10.5px; font-weight: 800; text-transform: uppercase; letter-spacing: .5px; opacity: .6; padding: 6px 10px 4px; }' +
    '#gcapThemeMenu button { display: flex; align-items: center; gap: 9px; width: 100%; text-align: left; background: transparent; border: 0; border-radius: 8px; padding: 9px 10px; font: inherit; font-size: 13.5px; font-weight: 600; color: inherit; cursor: pointer; }' +
    '#gcapThemeMenu button:hover { background: rgba(212,164,65,0.18); }' +
    '#gcapThemeMenu button .tick { margin-left: auto; color: #d4a441; font-weight: 800; }';
  var st = document.createElement('style');
  st.id = 'gcap-theme-css';
  st.textContent = css;
  document.head.appendChild(st);

  var OPTIONS = [['light', '☀️', 'Light'], ['dark', '🌙', 'Dark'], ['system', '💻', 'Device default']];
  function renderMenu() {
    var menu = document.getElementById('gcapThemeMenu'), btn = document.getElementById('gcapThemeBtn');
    if (!menu || !btn) return;
    var choice = saved();
    btn.textContent = choice === 'light' ? '☀️' : (choice === 'dark' ? '🌙' : '💻');
    btn.title = 'Appearance: ' + OPTIONS.filter(function(o) { return o[0] === choice; })[0][2];
    menu.innerHTML = '<div class="ttl">Appearance</div>' + OPTIONS.map(function(o) {
      return '<button type="button" onclick="setTheme(\'' + o[0] + '\'); document.getElementById(\'gcapThemeMenu\').classList.remove(\'open\');">' + o[1] + ' ' + o[2] + (choice === o[0] ? '<span class="tick">✓</span>' : '') + '</button>';
    }).join('');
  }
  function mount() {
    if (document.getElementById('gcapThemeBtn')) return;
    var btn = document.createElement('button');
    btn.id = 'gcapThemeBtn'; btn.type = 'button'; btn.setAttribute('aria-label', 'Appearance');
    btn.onclick = function(e) { e.stopPropagation(); document.getElementById('gcapThemeMenu').classList.toggle('open'); };
    var menu = document.createElement('div');
    menu.id = 'gcapThemeMenu';
    document.body.appendChild(menu); document.body.appendChild(btn);
    document.addEventListener('click', function(e) { if (!menu.contains(e.target)) menu.classList.remove('open'); });
    renderMenu();
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();

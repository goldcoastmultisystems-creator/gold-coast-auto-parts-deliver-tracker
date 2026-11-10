// Sends photos/videos from the web app into a Google Drive folder.
// The browser never gets Google credentials: it asks this function for a one-time upload address, uploads the file
// straight to Google (so large videos work), then asks this function to finish (share the file by link).
//
// Every call except "status" must carry a valid team login:
//   { auth: { type: 'owner', email, password } }  or  { auth: { type: 'team', memberId, pin } }
// checked against the team list in Firebase.
//
// Needs these in Netlify (Site configuration -> Environment variables):
//   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN   (from get-google-token.ps1)
//   DRIVE_FOLDER_NAME   optional, default "Gold Coast Auto Parts - Webapp Uploads"
// Files are filed as  <that folder> / 2026-11 November / 2026-11-12 Thu / <file>,  so checking data later is easy.
// The token only has the "drive.file" permission, so it can touch ONLY the files and folders this app creates —
// nothing else in the Drive is visible to it.

var FIREBASE_API_KEY = 'AIzaSyBQiE4TlMIcO6iyCob2G1js3eEVcmmjNmI';
var FIREBASE_DB = 'https://gold-coast-auto-parts-default-rtdb.firebaseio.com';
var DEFAULT_FOLDER = 'Gold Coast Auto Parts - Webapp Uploads';
var TIME_ZONE = 'America/New_York';   // the business day the folders are named after
var MAX_BYTES = 500 * 1024 * 1024;
var ALLOWED_ORIGINS = ['https://goldcoastautoparts.netlify.app', 'http://localhost:8834', 'http://127.0.0.1:8834'];

function reply(status, obj) { return { statusCode: status, headers: { 'content-type': 'application/json' }, body: JSON.stringify(obj) }; }
function lower(s) { return String(s || '').trim().toLowerCase(); }
function configured() { return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN); }

async function loadSettings() {
  var a = await (await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + FIREBASE_API_KEY, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ returnSecureToken: true })
  })).json();
  if (!a.idToken) throw new Error('Could not reach the team list.');
  var r = await fetch(FIREBASE_DB + '/gcap/settings.json?auth=' + encodeURIComponent(a.idToken));
  if (!r.ok) throw new Error('Could not read the team list.');
  return (await r.json()) || {};
}

function verify(auth, settings) {
  if (!auth) return null;
  if (auth.type === 'owner') {
    if (settings.ownerEmail && settings.ownerPassword && lower(auth.email) === lower(settings.ownerEmail) && auth.password === settings.ownerPassword) return { name: 'Owner' };
  } else if (auth.type === 'team') {
    var m = (settings.team || []).find(function (x) { return x && x.id === auth.memberId && x.active !== false; });
    if (m && m.pin && m.pin === auth.pin) return { name: m.name };
  }
  return null;
}

async function accessToken() {
  var resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN, grant_type: 'refresh_token'
    }).toString()
  });
  var d = await resp.json().catch(function () { return {}; });
  if (!d.access_token) throw new Error('Google refused the login (' + (d.error_description || d.error || 'unknown') + '). The Google token may have expired — make a new one with get-google-token.ps1.');
  return d.access_token;
}

async function drive(token, path, opts) {
  var resp = await fetch('https://www.googleapis.com/drive/v3/' + path, Object.assign({}, opts, {
    headers: Object.assign({ Authorization: 'Bearer ' + token }, (opts && opts.headers) || {})
  }));
  var data = await resp.json().catch(function () { return {}; });
  if (!resp.ok) throw new Error('Google Drive: ' + ((data.error && data.error.message) || resp.status));
  return data;
}

var folderCache = {};
async function findOrCreateFolder(token, name, parentId) {
  var cacheKey = (parentId || 'root') + '/' + name;
  if (folderCache[cacheKey]) return folderCache[cacheKey];
  var q = "mimeType='application/vnd.google-apps.folder' and trashed=false and name='" + name.replace(/'/g, "\\'") + "'" + (parentId ? " and '" + parentId + "' in parents" : '');
  var found = await drive(token, 'files?spaces=drive&fields=files(id,name)&q=' + encodeURIComponent(q));
  var id = found.files && found.files[0] && found.files[0].id;
  if (!id) {
    var made = await drive(token, 'files?fields=id', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: name, mimeType: 'application/vnd.google-apps.folder', parents: parentId ? [parentId] : undefined })
    });
    id = made.id;
  }
  folderCache[cacheKey] = id;
  return id;
}
/* Today's date in the business time zone, e.g. { y:'2026', m:'11', d:'12', monthName:'November', weekday:'Thu' } */
function todayParts(now) {
  function part(opts, type) { return new Intl.DateTimeFormat('en-US', Object.assign({ timeZone: TIME_ZONE }, opts)).formatToParts(now || new Date()).find(function (p) { return p.type === type; }).value; }
  return { y: part({ year: 'numeric' }, 'year'), m: part({ month: '2-digit' }, 'month'), d: part({ day: '2-digit' }, 'day'), monthName: part({ month: 'long' }, 'month'), weekday: part({ weekday: 'short' }, 'weekday') };
}
/* Root folder -> month folder -> date folder, created on first use. */
async function dateFolder(token) {
  var t = todayParts();
  var root = await findOrCreateFolder(token, process.env.DRIVE_FOLDER_NAME || DEFAULT_FOLDER, null);
  var month = await findOrCreateFolder(token, t.y + '-' + t.m + ' ' + t.monthName, root);
  var day = await findOrCreateFolder(token, t.y + '-' + t.m + '-' + t.d + ' ' + t.weekday, month);
  return { root: root, month: month, folder: day };
}
/* True only if folderId is a date folder sitting inside a month folder inside OUR root folder. */
async function isOurDateFolder(token, folderId, rootId) {
  try {
    var day = await drive(token, 'files/' + encodeURIComponent(folderId) + '?fields=id,parents,mimeType');
    var monthId = day.parents && day.parents[0];
    if (!monthId) return false;
    var month = await drive(token, 'files/' + encodeURIComponent(monthId) + '?fields=id,parents');
    return !!month.parents && month.parents.indexOf(rootId) !== -1;
  } catch (e) { return false; }
}

function safeName(s) { return String(s || 'upload').replace(/[^a-zA-Z0-9 _.()\-]/g, '_').slice(0, 120); }
function pickOrigin(event, payload) {
  var o = (event.headers && (event.headers.origin || event.headers.Origin)) || payload.origin || '';
  return ALLOWED_ORIGINS.indexOf(o) !== -1 ? o : ALLOWED_ORIGINS[0];
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return reply(405, { error: 'Method not allowed' });
  var payload;
  try { payload = JSON.parse(event.body || '{}'); } catch (e) { return reply(400, { error: 'Invalid request.' }); }

  if (payload.action === 'status') return reply(200, { configured: configured() });
  if (!configured()) return reply(503, { error: 'Google Drive is not connected yet.', notConfigured: true });

  try {
    var who = verify(payload.auth, await loadSettings());
    if (!who) return reply(401, { error: 'Please log out and log back in, then try again.' });
    var token = await accessToken();

    if (payload.action === 'start') {
      var kind = String(payload.kind || 'Videos').replace(/[^a-zA-Z ]/g, '').slice(0, 20) || 'Videos';
      var mime = String(payload.mimeType || '');
      var size = Number(payload.size) || 0;
      if (!/^(video|image)\//.test(mime)) return reply(400, { error: 'Only photos and videos can be uploaded.' });
      if (size <= 0 || size > MAX_BYTES) return reply(400, { error: 'That file is too large (max 500 MB).' });
      var f = await dateFolder(token);
      var name = safeName(payload.name);
      var init = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token, 'content-type': 'application/json; charset=UTF-8',
          'X-Upload-Content-Type': mime, 'X-Upload-Content-Length': String(size),
          Origin: pickOrigin(event, payload)   // lets the browser upload straight to the address Google gives back
        },
        body: JSON.stringify({ name: name, parents: [f.folder], description: kind + ' uploaded by ' + who.name + ' from the Gold Coast Auto Parts web app' })
      });
      var uploadUrl = init.headers.get('location');
      if (!init.ok || !uploadUrl) { var e = await init.json().catch(function () { return {}; }); return reply(502, { error: 'Google Drive would not start the upload: ' + ((e.error && e.error.message) || init.status) }); }
      return reply(200, { uploadUrl: uploadUrl, name: name, kind: kind, folderId: f.folder });
    }

    if (payload.action === 'finish') {
      var rootId = await findOrCreateFolder(token, process.env.DRIVE_FOLDER_NAME || DEFAULT_FOLDER, null);
      var folderId = String(payload.folderId || '');
      if (!folderId || !(await isOurDateFolder(token, folderId, rootId))) return reply(403, { error: 'That is not one of the upload folders.' });
      var fileId = String(payload.fileId || '');
      if (!fileId) {   // the browser could not read the new file's id: find it by its (unique) name inside the date folder
        var q = "trashed=false and name='" + safeName(payload.name).replace(/'/g, "\'") + "' and '" + folderId + "' in parents";
        var list = await drive(token, 'files?orderBy=createdTime desc&pageSize=1&fields=files(id)&q=' + encodeURIComponent(q));
        fileId = list.files && list.files[0] && list.files[0].id;
        if (!fileId) return reply(404, { error: 'The uploaded file was not found in Drive.' });
      }
      var meta = await drive(token, 'files/' + encodeURIComponent(fileId) + '?fields=id,name,mimeType,parents');
      if (!(meta.parents || []).some(function (p) { return p === folderId; })) return reply(403, { error: 'That file is not in the upload folder.' });
      await drive(token, 'files/' + encodeURIComponent(fileId) + '/permissions', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ role: 'reader', type: 'anyone' })
      });
      return reply(200, { id: meta.id, name: meta.name, mimeType: meta.mimeType, url: 'https://drive.google.com/file/d/' + meta.id + '/view' });
    }

    return reply(400, { error: 'Unknown request.' });
  } catch (e) {
    console.error('drive-upload failed', e);
    return reply(500, { error: e.message || 'Upload failed.' });
  }
};

/* Uploads photos/videos to the company Google Drive folder (via the drive-upload Netlify function).
   The browser never sees any Google login: it asks the server for a one-time upload address, sends the file
   straight to Google (so big videos work), then asks the server to finish (share the file by link).
   If Drive isn't connected yet, gcapDriveReady() resolves false and callers fall back to the old behaviour. */
var GCAP_DRIVE_ENDPOINT = '/.netlify/functions/drive-upload';
var gcapDriveStatus = { at: 0, promise: null };

function gcapDriveAuth() {
  var a = (typeof session !== 'undefined' && session && session.auth) || null;
  if (!a) return null;
  return a.type === 'owner' ? { type: 'owner', email: a.email, password: a.password } : { type: 'team', memberId: a.memberId, pin: a.pin };
}
function gcapDriveCall(body) {
  return fetch(GCAP_DRIVE_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    .then(function(r) { return r.json().catch(function() { return {}; }).then(function(d) { if (!r.ok) { var e = new Error(d.error || 'Upload failed.'); e.notConfigured = !!d.notConfigured; throw e; } return d; }); });
}
/* true when the server has Google Drive connected. Checked at most once a minute. */
function gcapDriveReady() {
  if (!gcapDriveStatus.promise || Date.now() - gcapDriveStatus.at > 60000) {
    gcapDriveStatus.at = Date.now();
    gcapDriveStatus.promise = gcapDriveCall({ action: 'status' }).then(function(d) { return !!d.configured; }).catch(function() { return false; });
  }
  return gcapDriveStatus.promise;
}

/* opts: { kind: 'Videos'|'Photos'|'Checks'|'Returns', label: 'text for the file name', onProgress(percent) }
   resolves { id, url } — url is the shareable Drive link that is stored on the stop. */
function gcapDriveUpload(file, opts) {
  opts = opts || {};
  var auth = gcapDriveAuth();
  if (!auth) return Promise.reject(new Error('Please log out and log back in, then try again.'));
  var ext = (/\.[a-zA-Z0-9]{2,5}$/.exec(file.name || '') || [''])[0] || (file.type === 'video/quicktime' ? '.mov' : (/^video\//.test(file.type) ? '.mp4' : '.jpg'));
  var name = ((opts.label || 'upload') + ' ' + new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19) + ' ' + Math.random().toString(36).slice(2, 6) + ext);
  var mime = file.type || (ext === '.mov' ? 'video/quicktime' : 'video/mp4');
  var kind = opts.kind || 'Videos';
  return gcapDriveCall({ action: 'start', auth: auth, kind: kind, name: name, mimeType: mime, size: file.size, origin: location.origin }).then(function(start) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('PUT', start.uploadUrl);
      xhr.setRequestHeader('Content-Type', mime);
      xhr.upload.onprogress = function(e) { if (e.lengthComputable && opts.onProgress) opts.onProgress(Math.round(e.loaded / e.total * 100)); };
      xhr.onerror = function() { reject(new Error('The upload was interrupted — check your connection and try again.')); };
      xhr.onabort = function() { reject(new Error('Upload cancelled.')); };
      xhr.onload = function() {
        if (xhr.status < 200 || xhr.status > 299) { reject(new Error('Google Drive rejected the upload (' + xhr.status + ').')); return; }
        var id = ''; try { id = (JSON.parse(xhr.responseText) || {}).id || ''; } catch (e) {}
        resolve(id);
      };
      xhr.send(file);
    }).then(function(id) {
      return gcapDriveCall({ action: 'finish', auth: auth, kind: kind, fileId: id, name: start.name }).then(function(done) { return { id: done.id, url: done.url }; });
    });
  });
}

/* ---- showing Drive videos ---- */
function gcapDriveFileId(url) { var m = /drive\.google\.com\/file\/d\/([^\/?#]+)/.exec(String(url || '')); return m ? m[1] : ''; }
function gcapIsDriveUrl(url) { return !!gcapDriveFileId(url); }
function gcapDriveEmbedUrl(url) { var id = gcapDriveFileId(url); return id ? 'https://drive.google.com/file/d/' + id + '/preview' : url; }
function gcapDriveThumbUrl(url) { var id = gcapDriveFileId(url); return id ? 'https://drive.google.com/thumbnail?id=' + id + '&sz=w480' : ''; }

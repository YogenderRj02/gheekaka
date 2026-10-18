/**
 * Google Apps Script — photos ko aapke Google Drive folder me save karta hai.
 * Sirf wahi users upload kar sakte hain jinke paas valid Firebase login token ho.
 *
 * Setup: SETUP.md ka "Step 3" dekhein.
 */
const FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID';        // Drive folder URL ke aakhir ka ID
const FIREBASE_API_KEY = 'YOUR_FIREBASE_API_KEY'; // firebase-config.js wali apiKey
const MAX_BYTES = 3 * 1024 * 1024;                // 3 MB limit

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (!verifyToken(body.token)) return out({ ok: false, error: 'unauthorized' });
    if (!/^image\/(jpeg|png|webp)$/.test(body.mime || '')) return out({ ok: false, error: 'bad type' });
    const bytes = Utilities.base64Decode(body.data);
    if (bytes.length > MAX_BYTES) return out({ ok: false, error: 'too large' });

    const folder = DriveApp.getFolderById(FOLDER_ID);
    const name = (body.name || 'photo') .replace(/[^\w.\-]/g, '_') + '_' + Date.now() + '.jpg';
    const file = folder.createFile(Utilities.newBlob(bytes, body.mime, name));
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return out({ ok: true, id: file.getId(), url: 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w1000' });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

function verifyToken(idToken) {
  if (!idToken) return false;
  const res = UrlFetchApp.fetch(
    'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + FIREBASE_API_KEY,
    { method: 'post', contentType: 'application/json', payload: JSON.stringify({ idToken }), muteHttpExceptions: true }
  );
  return res.getResponseCode() === 200;
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || 'manabisai-dev',
  });
}

const db = admin.firestore();

const firestoreSettings = { ignoreUndefinedProperties: true };
if (process.env.NODE_ENV !== 'production') {
  firestoreSettings.host = 'localhost:9090';
  firestoreSettings.ssl = false;
}

db.settings(firestoreSettings);

module.exports = db;

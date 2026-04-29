const { onRequest } = require('firebase-functions/v2/https');
const app = require('./src/index');

exports.api = onRequest({ region: 'asia-southeast1' }, app);

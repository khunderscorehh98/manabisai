const db = require('../config/db');

const COLLECTION = 'refresh_tokens';

const RefreshTokenModel = {
  async create(userId, token, expiresAt) {
    await db.collection(COLLECTION).add({
      user_id: userId,
      token,
      expires_at: expiresAt, // ISO string
    });
  },

  async findByToken(token) {
    const snapshot = await db.collection(COLLECTION)
      .where('token', '==', token)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    const data = doc.data();
    // Check expiry manually since Firestore can't filter on server time
    if (new Date(data.expires_at) <= new Date()) return null;
    return { id: doc.id, ...data };
  },

  async deleteByToken(token) {
    const snapshot = await db.collection(COLLECTION)
      .where('token', '==', token)
      .limit(1)
      .get();
    if (!snapshot.empty) {
      await snapshot.docs[0].ref.delete();
    }
  },

  async deleteByUserId(userId) {
    const snapshot = await db.collection(COLLECTION)
      .where('user_id', '==', userId)
      .get();
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  },
};

module.exports = RefreshTokenModel;

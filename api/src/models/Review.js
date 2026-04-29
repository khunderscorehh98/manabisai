const db = require('../config/db');

const COLLECTION = 'reviews';

const ReviewModel = {
  async findBySpotId(spotId) {
    const snapshot = await db.collection(COLLECTION)
      .where('spot_id', '==', spotId)
      .orderBy('created_at', 'desc')
      .get();

    const reviews = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      // Fetch user name from users collection
      const userDoc = await db.collection('users').doc(data.user_id).get();
      const userName = userDoc.exists ? userDoc.data().name : 'Anonymous';
      reviews.push({
        id: doc.id,
        ...data,
        user_name: userName,
      });
    }
    return reviews;
  },

  async create({ user_id, spot_id, rating, comment }) {
    const docRef = await db.collection(COLLECTION).add({
      user_id,
      spot_id,
      rating,
      comment: comment || '',
      created_at: new Date().toISOString(),
    });
    return docRef.id;
  },

  async findById(id) {
    const doc = await db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  async remove(id, userId) {
    const doc = await db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return false;
    if (doc.data().user_id !== userId) return false;
    await doc.ref.delete();
    return true;
  },
};

module.exports = ReviewModel;

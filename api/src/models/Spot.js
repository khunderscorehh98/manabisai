const db = require('../config/db');
const { firestore } = require('firebase-admin');

const COLLECTION = 'spots';

// Haversine distance in km (used client-side or in JS filtering)
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const SpotModel = {
  async findAll() {
    const snapshot = await db.collection(COLLECTION)
      .orderBy('created_at', 'desc')
      .get();

    const spots = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const avgRating = await this._getAverageRating(doc.id);
      spots.push({
        id: doc.id,
        ...data,
        average_rating: avgRating,
      });
    }
    return spots;
  },

  async findById(id) {
    const doc = await db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data();
    const avgRating = await this._getAverageRating(id);
    return { id: doc.id, ...data, average_rating: avgRating };
  },

  async findNearby(lat, lng, radius = 5) {
    // Firestore geo queries require GeoPoint fields and a separate geo-indexing solution.
    // For simplicity, we fetch all spots and filter in JS (fine for MVP / small datasets).
    // For production: use geohash indexing (e.g. geo-firestore or Algolia).
    const snapshot = await db.collection(COLLECTION).get();
    const results = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const distance = haversineDistance(lat, lng, data.latitude, data.longitude);
      if (distance <= radius) {
        const avgRating = await this._getAverageRating(doc.id);
        results.push({
          id: doc.id,
          ...data,
          distance_km: Math.round(distance * 10) / 10,
          average_rating: avgRating,
        });
      }
    }

    return results.sort((a, b) => a.distance_km - b.distance_km);
  },

  async create({ name, description, latitude, longitude, address, category_id, category, is_halal }) {
    const docRef = await db.collection(COLLECTION).add({
      name,
      description: description || '',
      latitude,
      longitude,
      address: address || '',
      category_id,
      category,
      is_halal: is_halal ?? true,
      created_at: new Date().toISOString(),
    });
    return docRef.id;
  },

  async update(id, { name, description, latitude, longitude, address, category_id, category, is_halal }) {
    await db.collection(COLLECTION).doc(id).update({
      name,
      description: description || '',
      latitude,
      longitude,
      address: address || '',
      category_id,
      category,
      is_halal: is_halal ?? true,
    });
  },

  async remove(id) {
    await db.collection(COLLECTION).doc(id).delete();
  },

  // --- Internal helpers ---

  async _getAverageRating(spotId) {
    const snapshot = await db.collection('reviews')
      .where('spot_id', '==', spotId)
      .get();
    if (snapshot.empty) return 0;
    let total = 0;
    snapshot.docs.forEach(doc => { total += doc.data().rating; });
    return Math.round((total / snapshot.size) * 10) / 10;
  },
};

module.exports = SpotModel;

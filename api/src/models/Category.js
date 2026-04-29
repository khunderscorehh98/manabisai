const db = require('../config/db');

const COLLECTION = 'categories';

const CategoryModel = {
  async findAll() {
    const snapshot = await db.collection(COLLECTION)
      .orderBy('name', 'asc')
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async create(name) {
    const docRef = await db.collection(COLLECTION).add({ name });
    return docRef.id;
  },

  async findById(id) {
    const doc = await db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },
};

module.exports = CategoryModel;

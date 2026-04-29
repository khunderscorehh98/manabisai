const db = require('../config/db');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;
const COLLECTION = 'users';

const UserModel = {
  async create(name, email, password, role = 'user') {
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const docRef = await db.collection(COLLECTION).add({
      name,
      email,
      password: hashed,
      role,
      created_at: new Date().toISOString(),
    });
    return docRef.id;
  },

  async findByEmail(email) {
    const snapshot = await db.collection(COLLECTION)
      .where('email', '==', email)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  },

  async findById(id) {
    const doc = await db.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data();
    // Omit password from return
    delete data.password;
    return { id: doc.id, ...data };
  },

  async verifyPassword(plain, hashed) {
    return bcrypt.compare(plain, hashed);
  },
};

module.exports = UserModel;

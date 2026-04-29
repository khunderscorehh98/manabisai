// ManaBisai Firestore Seed Script
// Run: node db/seeds/seed_firestore.js
// Requires: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in env

require('dotenv').config({ path: '../../api/.env' });
const admin = require('firebase-admin');

// ── Initialize Firebase Admin ────────────────────────────────────────────────
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

// ── Seed Data ────────────────────────────────────────────────────────────────
const categories = [
  { name: 'Nasi Katok' },
  { name: 'Nasi Lemak' },
  { name: 'Mee Rebus' },
  { name: 'Ayam Penyet' },
  { name: 'Satay' },
  { name: 'Roti Canai' },
  { name: 'Kolo Mee' },
  { name: 'Ambuyat' },
  { name: 'Seafood' },
  { name: 'Cafe' },
];

const users = [
  { name: 'Admin', email: 'admin@manabisai.com', password: '$2b$10$X7MgkCZMfD0qVqYqZqZqZeqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZ', role: 'admin', created_at: new Date().toISOString() },
  { name: 'Haziq', email: 'haziq@test.com', password: '$2b$10$X7MgkCZMfD0qVqYqZqZqZeqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZ', role: 'user', created_at: new Date().toISOString() },
  { name: 'Test User', email: 'user@test.com', password: '$2b$10$X7MgkCZMfD0qVqYqZqZqZeqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZ', role: 'user', created_at: new Date().toISOString() },
];

const spots = [
  {
    name: 'Nasi Katok Uncle',
    description: 'Famous 24-hour nasi katok spot. Simple, cheap, and delicious.',
    latitude: 4.9382,
    longitude: 114.9471,
    address: 'Jalan Sultan, Bandar Seri Begawan',
    category_id: 'cat_1',   // will be replaced after creation
    category: 'Nasi Katok',
    is_halal: true,
    created_at: new Date().toISOString(),
  },
  {
    name: 'Nasi Katok Doyan',
    description: 'Local favourite with extra spicy sambal.',
    latitude: 4.9401,
    longitude: 114.9402,
    address: 'Kiulap, Bandar Seri Begawan',
    category_id: 'cat_1',
    category: 'Nasi Katok',
    is_halal: true,
    created_at: new Date().toISOString(),
  },
  {
    name: 'Gadong Night Market',
    description: 'Variety of stalls — satay, grilled fish, local snacks.',
    latitude: 4.9183,
    longitude: 114.9158,
    address: 'Gadong, Bandar Seri Begawan',
    category_id: 'cat_5',
    category: 'Satay',
    is_halal: true,
    created_at: new Date().toISOString(),
  },
];

const reviews = [
  { user_id: 'user_2', spot_id: 'spot_1', rating: 5, comment: "Best nasi katok in Brunei! Open 24 hours.", created_at: new Date().toISOString() },
  { user_id: 'user_2', spot_id: 'spot_3', rating: 4, comment: "Great variety. Go hungry and try everything.", created_at: new Date().toISOString() },
  { user_id: 'user_3', spot_id: 'spot_1', rating: 4, comment: "Solid choice, but can get crowded at night.", created_at: new Date().toISOString() },
];

// ── Seed Function ────────────────────────────────────────────────────────────
async function seed() {
  try {
    console.log('🌱 Seeding Firestore...\n');

    // --- Clear existing data (optional — comment out to append) ---
    const collections = ['categories', 'users', 'spots', 'reviews', 'refresh_tokens'];
    for (const colName of collections) {
      const snapshot = await db.collection(colName).get();
      if (!snapshot.empty) {
        const batch = db.batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        console.log(`  Cleared ${colName}`);
      }
    }

    // --- Categories ---
    const categoryIds = [];
    for (const cat of categories) {
      const ref = await db.collection('categories').add(cat);
      categoryIds.push(ref.id);
    }
    console.log(`  ✅ Seeded ${categoryIds.length} categories`);

    // --- Users ---
    const userIds = [];
    for (const user of users) {
      const ref = await db.collection('users').add(user);
      userIds.push(ref.id);
    }
    console.log(`  ✅ Seeded ${userIds.length} users`);

    // --- Spots (with real category IDs) ---
    const spotIds = [];
    for (let i = 0; i < spots.length; i++) {
      const spot = { ...spots[i] };
      // Map placeholder category_id to actual Firestore doc ID
      const catIndex = parseInt(spot.category_id.split('_')[1]) - 1;
      spot.category_id = categoryIds[catIndex];
      const ref = await db.collection('spots').add(spot);
      spotIds.push(ref.id);
    }
    console.log(`  ✅ Seeded ${spotIds.length} spots`);

    // --- Reviews (with real user & spot IDs) ---
    for (const review of reviews) {
      const r = { ...review };
      r.user_id = userIds[parseInt(review.user_id.split('_')[1]) - 1];
      r.spot_id = spotIds[parseInt(review.spot_id.split('_')[1]) - 1];
      await db.collection('reviews').add(r);
    }
    console.log(`  ✅ Seeded ${reviews.length} reviews`);

    console.log('\n🎉 Firestore seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();

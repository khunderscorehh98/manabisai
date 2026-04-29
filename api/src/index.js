require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const spotRoutes = require('./routes/spots');
const reviewRoutes = require('./routes/reviews');
const categoryRoutes = require('./routes/categories');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/spots', spotRoutes);
app.use('/api/spots', reviewRoutes);
app.use('/api/categories', categoryRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'ManaBisai API is running' });
});

// Error handling
app.use(errorHandler);

// Local dev — Firebase Functions wraps the app directly, no listen() needed there
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 ManaBisai API running on http://localhost:${PORT}`);
  });
}

module.exports = app;

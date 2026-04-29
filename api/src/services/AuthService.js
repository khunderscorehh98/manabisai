const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const RefreshTokenModel = require('../models/RefreshToken');

const AuthService = {
  async register(name, email, password) {
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      throw new Error('Email already registered');
    }
    const userId = await UserModel.create(name, email, password);
    return this.generateTokenPair(userId);
  },

  async login(email, password) {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const valid = await UserModel.verifyPassword(password, user.password);
    if (!valid) {
      throw new Error('Invalid credentials');
    }

    return this.generateTokenPair(user.id);
  },

  async refresh(refreshToken) {
    const stored = await RefreshTokenModel.findByToken(refreshToken);
    if (!stored) {
      throw new Error('Invalid refresh token');
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    await RefreshTokenModel.deleteByToken(refreshToken);

    return this.generateTokenPair(decoded.id);
  },

  async logout(refreshToken) {
    await RefreshTokenModel.deleteByToken(refreshToken);
  },

  generateTokenPair(userId) {
    const accessToken = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const refreshToken = jwt.sign(
      { id: userId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    RefreshTokenModel.create(userId, refreshToken, expiresAt);

    return { accessToken, refreshToken };
  },
};

module.exports = AuthService;

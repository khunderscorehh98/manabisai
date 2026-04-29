const AuthService = require('../services/AuthService');

const AuthController = {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
      }
      const tokens = await AuthService.register(name, email, password);
      res.status(201).json({ success: true, data: tokens });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
      }
      const tokens = await AuthService.login(email, password);
      res.json({ success: true, data: tokens });
    } catch (err) {
      next(err);
    }
  },

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ success: false, message: 'Refresh token is required' });
      }
      const tokens = await AuthService.refresh(refreshToken);
      res.json({ success: true, data: tokens });
    } catch (err) {
      next(err);
    }
  },

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ success: false, message: 'Refresh token is required' });
      }
      await AuthService.logout(refreshToken);
      res.json({ success: true, message: 'Logged out' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = AuthController;

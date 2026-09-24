import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'campus_lost_and_found_jwt_secret_super_secure_key_2026';

export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, regNumber: user.reg_number || user.regNumber },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ error: 'Authentication required. No token provided.' });
    }

    let userId = null;

    // Support standard JWT
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.id;
    } catch (jwtErr) {
      // Also allow legacy/mock tokens during smooth transition if present: mock_jwt_<userId>
      if (token.startsWith('mock_jwt_')) {
        const parts = token.split('_');
        // mock_jwt_std_1_12345678 or mock_jwt_std_1
        userId = parts.slice(2, 4).join('_');
        if (!userId) userId = parts[2];
      } else {
        return res.status(401).json({ error: 'Invalid or expired authentication token.' });
      }
    }

    const user = db.prepare('SELECT id, name, email, reg_number as regNumber, phone, created_at FROM users WHERE id = ?').get(userId);
    if (!user) {
      return res.status(401).json({ error: 'User associated with this token not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed.' });
  }
};

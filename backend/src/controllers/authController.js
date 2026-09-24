import { db } from '../config/db.js';
import { generateToken } from '../middleware/auth.js';
import { checkLoginRateLimit, recordFailedLogin, resetLoginAttempts } from '../middleware/rateLimiter.js';
import { COLLEGE_EMAIL_REGEX, REG_NUMBER_REGEX, PHONE_REGEX } from '../config/constants.js';
import { seedDatabase } from '../services/seedService.js';

export const register = (req, res) => {
  try {
    const { name, email, regNumber, phone } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Full name must be at least 2 characters.' });
    }

    if (!email || !COLLEGE_EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ error: 'Must be a valid @snsct.org or @college.edu address.' });
    }

    if (!regNumber || !REG_NUMBER_REGEX.test(regNumber.trim())) {
      return res.status(400).json({ error: 'Registration number must be 8 to 14 alphanumeric characters.' });
    }

    if (!phone || !PHONE_REGEX.test(phone.trim().replace(/[-\s]/g, ''))) {
      return res.status(400).json({ error: 'Phone must be exactly 10 digits.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedReg = regNumber.trim().toUpperCase();

    const existing = db.prepare(`
      SELECT id FROM users WHERE LOWER(email) = ? OR UPPER(reg_number) = ?
    `).get(normalizedEmail, normalizedReg);

    if (existing) {
      return res.status(400).json({ error: 'Student with this email or registration number already exists.' });
    }

    const userId = `std_${Date.now()}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, name, email, reg_number, phone, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, name.trim(), normalizedEmail, normalizedReg, phone.trim(), now);

    const user = {
      id: userId,
      name: name.trim(),
      email: normalizedEmail,
      regNumber: normalizedReg,
      phone: phone.trim()
    };

    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(201).json({ user, token });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: error.message || 'Registration failed.' });
  }
};

export const login = (req, res) => {
  try {
    const { email, regNumber } = req.body;

    if (!email || !regNumber) {
      return res.status(400).json({ error: 'Email and registration number are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedReg = regNumber.trim().toUpperCase();

    if (!checkLoginRateLimit(normalizedEmail)) {
      return res.status(429).json({ error: 'Too many attempts. Try again in 15 minutes.' });
    }

    const user = db.prepare(`
      SELECT id, name, email, reg_number as regNumber, phone, created_at 
      FROM users 
      WHERE LOWER(email) = ? AND UPPER(reg_number) = ?
    `).get(normalizedEmail, normalizedReg);

    if (!user) {
      recordFailedLogin(normalizedEmail);
      return res.status(401).json({ error: 'Email or registration number is incorrect.' });
    }

    resetLoginAttempts(normalizedEmail);
    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: error.message || 'Login failed.' });
  }
};

export const getMe = (req, res) => {
  return res.json(req.user);
};

export const logout = (req, res) => {
  res.clearCookie('token');
  return res.json({ success: true });
};

export const resetDemo = (req, res) => {
  try {
    seedDatabase(true);
    return res.json({ success: true, message: 'Demo data restored successfully.' });
  } catch (error) {
    console.error('Reset demo error:', error);
    return res.status(500).json({ error: 'Failed to reset demo data.' });
  }
};

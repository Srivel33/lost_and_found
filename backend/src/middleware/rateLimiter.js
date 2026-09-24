import { db } from '../config/db.js';

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

export const checkLoginRateLimit = (email) => {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const cutoff = Date.now() - WINDOW_MS;

  // Clean old attempts
  db.prepare('DELETE FROM login_attempts WHERE timestamp < ?').run(cutoff);

  const count = db.prepare(`
    SELECT COUNT(*) as count FROM login_attempts 
    WHERE email = ? AND timestamp >= ?
  `).get(normalizedEmail, cutoff).count;

  return count < MAX_ATTEMPTS;
};

export const recordFailedLogin = (email) => {
  const normalizedEmail = (email || '').trim().toLowerCase();
  db.prepare(`
    INSERT INTO login_attempts (email, timestamp) VALUES (?, ?)
  `).run(normalizedEmail, Date.now());
};

export const resetLoginAttempts = (email) => {
  const normalizedEmail = (email || '').trim().toLowerCase();
  db.prepare(`
    DELETE FROM login_attempts WHERE email = ?
  `).run(normalizedEmail);
};

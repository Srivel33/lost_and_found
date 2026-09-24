import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, '../../campus_lost_found.db');

// Ensure database directory exists
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

export const db = new Database(dbPath);

// Optimize SQLite for high performance and durability
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export const initDatabase = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      reg_number TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      password_hash TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lost_posts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      user_email TEXT NOT NULL,
      user_phone TEXT NOT NULL,
      category TEXT NOT NULL,
      item_name TEXT NOT NULL,
      description TEXT NOT NULL,
      color TEXT NOT NULL,
      special_marks TEXT,
      location TEXT NOT NULL,
      time_start TEXT NOT NULL,
      time_end TEXT NOT NULL,
      photo TEXT,
      status TEXT NOT NULL DEFAULT 'open',
      returned_at TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS found_posts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      user_email TEXT NOT NULL,
      user_phone TEXT NOT NULL,
      category TEXT NOT NULL,
      item_name TEXT NOT NULL,
      description TEXT NOT NULL,
      color TEXT NOT NULL,
      location TEXT NOT NULL,
      time_found TEXT NOT NULL,
      current_location TEXT NOT NULL,
      photo TEXT,
      hidden_question TEXT NOT NULL,
      correct_answer TEXT NOT NULL,
      decoy_answers TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open',
      returned_at TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      lost_id TEXT NOT NULL,
      found_id TEXT NOT NULL,
      lost_user_id TEXT NOT NULL,
      found_user_id TEXT NOT NULL,
      score REAL NOT NULL,
      band TEXT NOT NULL,
      why_matched TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      attempts_left INTEGER NOT NULL DEFAULT 3,
      lockout_until TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (lost_id) REFERENCES lost_posts(id) ON DELETE CASCADE,
      FOREIGN KEY (found_id) REFERENCES found_posts(id) ON DELETE CASCADE,
      FOREIGN KEY (lost_user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (found_user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      match_id TEXT,
      lost_id TEXT,
      message TEXT NOT NULL,
      read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS login_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      timestamp INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS dispute_reports (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      reason TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_reg ON users(reg_number);
    CREATE INDEX IF NOT EXISTS idx_lost_user ON lost_posts(user_id);
    CREATE INDEX IF NOT EXISTS idx_found_user ON found_posts(user_id);
    CREATE INDEX IF NOT EXISTS idx_matches_lost_user ON matches(lost_user_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
  `);
};

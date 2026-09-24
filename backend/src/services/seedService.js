import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const seedDatabase = (force = false) => {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount > 0 && !force) {
    return;
  }

  // Find seedData.json
  const seedPath = path.resolve(__dirname, '../../../frontend/src/data/seedData.json');
  if (!fs.existsSync(seedPath)) {
    console.warn('Seed data file not found at:', seedPath);
    return;
  }

  const raw = fs.readFileSync(seedPath, 'utf-8');
  const seed = JSON.parse(raw);

  const resetTransaction = db.transaction(() => {
    // Clear existing
    db.prepare('DELETE FROM notifications').run();
    db.prepare('DELETE FROM matches').run();
    db.prepare('DELETE FROM lost_posts').run();
    db.prepare('DELETE FROM found_posts').run();
    db.prepare('DELETE FROM users').run();
    db.prepare('DELETE FROM login_attempts').run();
    db.prepare('DELETE FROM dispute_reports').run();

    // Insert users
    const insertUser = db.prepare(`
      INSERT INTO users (id, name, email, reg_number, phone, password_hash, created_at)
      VALUES (?, ?, ?, ?, ?, NULL, ?)
    `);

    const now = new Date().toISOString();
    for (const student of seed.students_master || []) {
      insertUser.run(
        student.id,
        student.name,
        student.email.toLowerCase(),
        student.regNumber.toUpperCase(),
        student.phone,
        now
      );
    }

    // Insert lost posts
    const insertLost = db.prepare(`
      INSERT INTO lost_posts (id, user_id, user_name, user_email, user_phone, category, item_name, description, color, special_marks, location, time_start, time_end, photo, status, returned_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of seed.lost || []) {
      insertLost.run(
        item.id,
        item.userId,
        item.userName,
        item.userEmail,
        item.userPhone,
        item.category,
        item.itemName,
        item.description,
        item.color,
        item.specialMarks || '',
        item.location,
        item.timeStart,
        item.timeEnd,
        item.photo || null,
        item.status || 'open',
        item.returnedAt || null,
        item.createdAt || now
      );
    }

    // Insert found posts
    const insertFound = db.prepare(`
      INSERT INTO found_posts (id, user_id, user_name, user_email, user_phone, category, item_name, description, color, location, time_found, current_location, photo, hidden_question, correct_answer, decoy_answers, status, returned_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of seed.found || []) {
      insertFound.run(
        item.id,
        item.userId,
        item.userName,
        item.userEmail,
        item.userPhone,
        item.category,
        item.itemName,
        item.description,
        item.color,
        item.location,
        item.timeFound,
        item.currentLocation,
        item.photo || null,
        item.hiddenQuestion,
        item.correctAnswer,
        JSON.stringify(item.decoyAnswers || []),
        item.status || 'open',
        item.returnedAt || null,
        item.createdAt || now
      );
    }

    // Insert matches
    const insertMatch = db.prepare(`
      INSERT INTO matches (id, lost_id, found_id, lost_user_id, found_user_id, score, band, why_matched, status, attempts_left, lockout_until, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const match of seed.matches || []) {
      insertMatch.run(
        match.id,
        match.lostId,
        match.foundId,
        match.lostUserId,
        match.foundUserId,
        match.score,
        match.band,
        match.whyMatched,
        match.status || 'pending',
        match.attemptsLeft !== undefined ? match.attemptsLeft : 3,
        match.lockoutUntil || null,
        match.createdAt || now
      );
    }

    // Insert notifications
    const insertNotif = db.prepare(`
      INSERT INTO notifications (id, user_id, match_id, lost_id, message, read, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const n of seed.notifications || []) {
      insertNotif.run(
        n.id,
        n.userId,
        n.matchId || null,
        n.lostId || null,
        n.message,
        n.read ? 1 : 0,
        n.createdAt || now
      );
    }
  });

  resetTransaction();
  console.log('Database seeded successfully from seedData.json');
};

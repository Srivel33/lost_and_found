import { db } from '../config/db.js';
import { POST_STATUSES } from '../config/constants.js';
import { runMatchingForLostPost } from '../services/matchingService.js';
import { jobQueue } from '../services/backgroundWorker.js';

export const createLost = (req, res) => {
  try {
    const { category, itemName, description, color, specialMarks, location, floor, room, timeStart, timeEnd, phone, photo, visualFingerprint } = req.body;

    if (!category || !itemName || !description || !color || !location || !timeStart || !timeEnd) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    const start = new Date(timeStart).getTime();
    const end = new Date(timeEnd).getTime();
    const now = Date.now();

    if (isNaN(start) || isNaN(end) || start > now || end > now || end < start) {
      return res.status(400).json({ error: 'End time must be after start time, and neither can be in the future.' });
    }

    const id = `lost_${Date.now()}`;
    const createdAt = new Date().toISOString();
    const userPhone = phone || req.user.phone;

    db.prepare(`
      INSERT INTO lost_posts (
        id, user_id, user_name, user_email, user_phone,
        category, item_name, description, color, special_marks,
        location, floor, room, time_start, time_end, photo, visual_fingerprint,
        status, returned_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?)
    `).run(
      id,
      req.user.id,
      req.user.name,
      req.user.email,
      userPhone,
      category,
      itemName.trim(),
      description.trim(),
      color,
      specialMarks ? specialMarks.trim() : '',
      location,
      floor || null,
      room || null,
      timeStart,
      timeEnd,
      photo || null,
      visualFingerprint || null,
      POST_STATUSES.OPEN,
      createdAt
    );

    const newPost = {
      id,
      userId: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      userPhone,
      category,
      itemName: itemName.trim(),
      description: description.trim(),
      color,
      specialMarks: specialMarks ? specialMarks.trim() : '',
      location,
      timeStart,
      timeEnd,
      photo: photo || null,
      status: POST_STATUSES.OPEN,
      createdAt
    };

    // Enqueue background matching job
    jobQueue.enqueueLostPostMatching(id);

    return res.status(201).json(newPost);
  } catch (error) {
    console.error('Create lost error:', error);
    return res.status(500).json({ error: error.message || 'Failed to create lost report.' });
  }
};

export const getMyLost = (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT 
        id, user_id as userId, user_name as userName, user_email as userEmail, user_phone as userPhone,
        category, item_name as itemName, description, color, special_marks as specialMarks,
        location, time_start as timeStart, time_end as timeEnd, photo, status, returned_at as returnedAt, created_at as createdAt
      FROM lost_posts
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).all(req.user.id);

    return res.json(rows);
  } catch (error) {
    console.error('Get my lost error:', error);
    return res.status(500).json({ error: 'Failed to retrieve lost posts.' });
  }
};

export const markReturned = (req, res) => {
  try {
    const { id } = req.params;
    const post = db.prepare('SELECT * FROM lost_posts WHERE id = ?').get(id);

    if (!post) {
      return res.status(404).json({ error: 'Lost post not found.' });
    }

    if (post.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to modify this post.' });
    }

    const returnedAt = new Date().toISOString();
    db.prepare(`
      UPDATE lost_posts 
      SET status = ?, returned_at = ? 
      WHERE id = ?
    `).run(POST_STATUSES.RETURNED, returnedAt, id);

    const updated = db.prepare(`
      SELECT 
        id, user_id as userId, user_name as userName, user_email as userEmail, user_phone as userPhone,
        category, item_name as itemName, description, color, special_marks as specialMarks,
        location, time_start as timeStart, time_end as timeEnd, photo, status, returned_at as returnedAt, created_at as createdAt
      FROM lost_posts WHERE id = ?
    `).get(id);

    return res.json(updated);
  } catch (error) {
    console.error('Mark returned error:', error);
    return res.status(500).json({ error: 'Failed to mark post returned.' });
  }
};

export const withdrawLost = (req, res) => {
  try {
    const { id } = req.params;
    const post = db.prepare('SELECT * FROM lost_posts WHERE id = ?').get(id);

    if (!post) {
      return res.status(404).json({ error: 'Lost post not found.' });
    }

    if (post.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to modify this post.' });
    }

    db.prepare(`
      UPDATE lost_posts 
      SET status = ? 
      WHERE id = ?
    `).run(POST_STATUSES.WITHDRAWN, id);

    const updated = db.prepare(`
      SELECT 
        id, user_id as userId, user_name as userName, user_email as userEmail, user_phone as userPhone,
        category, item_name as itemName, description, color, special_marks as specialMarks,
        location, time_start as timeStart, time_end as timeEnd, photo, status, returned_at as returnedAt, created_at as createdAt
      FROM lost_posts WHERE id = ?
    `).get(id);

    return res.json(updated);
  } catch (error) {
    console.error('Withdraw lost error:', error);
    return res.status(500).json({ error: 'Failed to withdraw post.' });
  }
};

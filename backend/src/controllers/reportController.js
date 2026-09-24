import { db } from '../config/db.js';

export const createReport = (req, res) => {
  try {
    const { postId, reason } = req.body;

    if (!postId || !reason) {
      return res.status(400).json({ error: 'Post ID and dispute reason are required.' });
    }

    const id = `report_${Date.now()}`;
    const createdAt = new Date().toISOString();

    db.prepare(`
      INSERT INTO dispute_reports (id, post_id, user_id, reason, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, postId, req.user.id, reason.trim(), createdAt);

    return res.status(201).json({
      success: true,
      message: 'Report submitted to campus admin for review.'
    });
  } catch (error) {
    console.error('Create report error:', error);
    return res.status(500).json({ error: 'Failed to submit report.' });
  }
};

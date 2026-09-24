import { db } from '../config/db.js';
import { jobQueue } from '../services/backgroundWorker.js';

// SSE Clients
const clients = new Map();

jobQueue.on('new_notification', (userId) => {
  const userClients = clients.get(userId);
  if (userClients) {
    userClients.forEach(res => {
      res.write(`data: ${JSON.stringify({ type: 'NEW_NOTIFICATION' })}\n\n`);
    });
  }
});

export const streamNotifications = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const userId = req.user.id;

  if (!clients.has(userId)) {
    clients.set(userId, new Set());
  }
  clients.get(userId).add(res);

  // Send initial ping to establish connection
  res.write(`data: ${JSON.stringify({ type: 'PING' })}\n\n`);

  req.on('close', () => {
    const userClients = clients.get(userId);
    if (userClients) {
      userClients.delete(res);
      if (userClients.size === 0) {
        clients.delete(userId);
      }
    }
  });
};

export const getNotifications = (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT 
        id, user_id as userId, match_id as matchId, lost_id as lostId,
        message, read, created_at as createdAt
      FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).all(req.user.id);

    const formatted = rows.map(r => ({
      ...r,
      read: Boolean(r.read)
    }));

    return res.json(formatted);
  } catch (error) {
    console.error('Get notifications error:', error);
    return res.status(500).json({ error: 'Failed to retrieve notifications.' });
  }
};

export const markRead = (req, res) => {
  try {
    const { id } = req.params;

    db.prepare(`
      UPDATE notifications 
      SET read = 1 
      WHERE id = ? AND user_id = ?
    `).run(id, req.user.id);

    return res.json({ success: true });
  } catch (error) {
    console.error('Mark read error:', error);
    return res.status(500).json({ error: 'Failed to update notification.' });
  }
};

export const markAllRead = (req, res) => {
  try {
    db.prepare(`
      UPDATE notifications 
      SET read = 1 
      WHERE user_id = ?
    `).run(req.user.id);

    return res.json({ success: true });
  } catch (error) {
    console.error('Mark all read error:', error);
    return res.status(500).json({ error: 'Failed to mark all notifications as read.' });
  }
};

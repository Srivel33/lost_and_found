import { db } from '../config/db.js';
import { POST_STATUSES } from '../config/constants.js';
import { previewMatchesForLostPost } from '../services/matchingService.js';

export const previewMatches = (req, res) => {
  try {
    const previewData = req.body || {};
    const result = previewMatchesForLostPost(previewData, req.user?.id);
    return res.json(result);
  } catch (error) {
    console.error('Preview matches error:', error);
    return res.status(500).json({ error: 'Failed to preview matches.' });
  }
};

export const getMyMatches = (req, res) => {
  try {
    const matches = db.prepare(`
      SELECT 
        m.id, m.lost_id as lostId, m.found_id as foundId,
        m.score, m.band, m.why_matched as whyMatched,
        m.status, m.attempts_left as attemptsLeft, m.lockout_until as lockoutUntil,
        m.created_at as createdAt,
        l.item_name as lostItemName, l.category as lostCategory,
        f.category as category, f.color as color, f.location as location, f.time_found as timeFound
      FROM matches m
      JOIN lost_posts l ON m.lost_id = l.id
      JOIN found_posts f ON m.found_id = f.id
      WHERE m.lost_user_id = ?
      ORDER BY m.created_at DESC
    `).all(req.user.id);

    return res.json(matches);
  } catch (error) {
    console.error('Get my matches error:', error);
    return res.status(500).json({ error: 'Failed to retrieve matches.' });
  }
};

export const getMatchDetail = (req, res) => {
  try {
    const { id } = req.params;

    const match = db.prepare('SELECT * FROM matches WHERE id = ?').get(id);
    if (!match) {
      return res.status(404).json({ error: 'Match not found.' });
    }

    // Privacy rule: Only the owner of the lost post can view this match
    if (match.lost_user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized: You do not have permission to view this match.' });
    }

    const lostItem = db.prepare('SELECT * FROM lost_posts WHERE id = ?').get(match.lost_id);
    const foundItem = db.prepare('SELECT * FROM found_posts WHERE id = ?').get(match.found_id);

    if (!foundItem) {
      return res.status(404).json({ error: 'Associated found post not found.' });
    }

    let isLocked = false;
    if (match.lockout_until) {
      if (Date.now() < new Date(match.lockout_until).getTime()) {
        isLocked = true;
      }
    }

    const decoys = JSON.parse(foundItem.decoy_answers || '[]');
    const rawOptions = [foundItem.correct_answer, ...decoys];
    // Deterministic or pseudorandom shuffle
    const options = [...rawOptions].sort(() => 0.5 - Math.random());

    // STRICT PRIVACY: NEVER send finder contact details or correct answer here!
    const responsePayload = {
      id: match.id,
      lostId: match.lost_id,
      lostItemName: lostItem?.item_name || 'Item',
      lostCategory: lostItem?.category || 'other',
      category: foundItem.category,
      description: foundItem.description,
      color: foundItem.color,
      location: foundItem.location,
      timeFound: foundItem.time_found,
      currentLocation: foundItem.current_location,
      photo: foundItem.photo,
      band: match.band,
      score: match.score,
      whyMatched: match.why_matched,
      status: match.status,
      attemptsLeft: match.attempts_left,
      lockoutUntil: match.lockout_until,
      isLocked,
      hiddenQuestion: foundItem.hidden_question,
      questionOptions: options,
      createdAt: match.created_at
    };

    return res.json(responsePayload);
  } catch (error) {
    console.error('Get match detail error:', error);
    return res.status(500).json({ error: error.message || 'Failed to retrieve match details.' });
  }
};

export const submitHiddenQuestionAnswer = (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    if (!answer || typeof answer !== 'string') {
      return res.status(400).json({ error: 'Answer is required.' });
    }

    const match = db.prepare('SELECT * FROM matches WHERE id = ?').get(id);
    if (!match) {
      return res.status(404).json({ error: 'Match not found.' });
    }

    if (match.lost_user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized.' });
    }

    // Check lockout
    if (match.lockout_until && Date.now() < new Date(match.lockout_until).getTime()) {
      return res.status(429).json({ error: 'This match is temporarily locked. Please try again after the cooldown period.' });
    }

    const foundItem = db.prepare('SELECT * FROM found_posts WHERE id = ?').get(match.found_id);
    if (!foundItem) {
      return res.status(404).json({ error: 'Found item not found.' });
    }

    const isCorrect = answer.trim().toLowerCase() === foundItem.correct_answer.trim().toLowerCase();

    if (isCorrect) {
      db.prepare(`
        UPDATE matches 
        SET status = 'verified', attempts_left = 3, lockout_until = NULL 
        WHERE id = ?
      `).run(id);

      return res.json({
        success: true,
        verified: true,
        message: 'Correct answer! Finder contact details are now revealed.'
      });
    } else {
      const newAttempts = Math.max(0, match.attempts_left - 1);
      let lockoutUntil = null;
      if (newAttempts === 0) {
        // Lock for 24 hours
        lockoutUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      }

      db.prepare(`
        UPDATE matches 
        SET attempts_left = ?, lockout_until = ? 
        WHERE id = ?
      `).run(newAttempts, lockoutUntil, id);

      return res.json({
        success: false,
        verified: false,
        attemptsLeft: newAttempts,
        lockoutUntil,
        message: "That answer isn't right"
      });
    }
  } catch (error) {
    console.error('Submit answer error:', error);
    return res.status(500).json({ error: error.message || 'Failed to submit verification answer.' });
  }
};

export const getVerifiedContact = (req, res) => {
  try {
    const { id } = req.params;

    const match = db.prepare('SELECT * FROM matches WHERE id = ?').get(id);
    if (!match) {
      return res.status(404).json({ error: 'Match not found.' });
    }

    if (match.lost_user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized.' });
    }

    if (match.status !== 'verified' && match.status !== 'confirmed' && match.status !== 'returned') {
      return res.status(403).json({ error: 'Contact information is locked until the hidden question is answered correctly.' });
    }

    const foundItem = db.prepare('SELECT * FROM found_posts WHERE id = ?').get(match.found_id);
    if (!foundItem) {
      return res.status(404).json({ error: 'Found post not found.' });
    }

    return res.json({
      finderName: foundItem.user_name,
      finderPhone: foundItem.user_phone,
      finderEmail: foundItem.user_email,
      currentLocation: foundItem.current_location
    });
  } catch (error) {
    console.error('Get verified contact error:', error);
    return res.status(500).json({ error: error.message || 'Failed to get contact info.' });
  }
};

export const confirmMatch = (req, res) => {
  try {
    const { id } = req.params;

    const match = db.prepare('SELECT * FROM matches WHERE id = ?').get(id);
    if (!match) {
      return res.status(404).json({ error: 'Match not found.' });
    }

    if (match.lost_user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized.' });
    }

    const confirmTx = db.transaction(() => {
      db.prepare(`UPDATE matches SET status = 'confirmed' WHERE id = ?`).run(id);
      db.prepare(`UPDATE lost_posts SET status = ? WHERE id = ?`).run(POST_STATUSES.CLAIMED, match.lost_id);
      db.prepare(`UPDATE found_posts SET status = ? WHERE id = ?`).run(POST_STATUSES.CLAIMED, match.found_id);
    });

    confirmTx();

    return res.json({ success: true, status: 'confirmed' });
  } catch (error) {
    console.error('Confirm match error:', error);
    return res.status(500).json({ error: 'Failed to confirm match claim.' });
  }
};

export const rejectMatch = (req, res) => {
  try {
    const { id } = req.params;

    const match = db.prepare('SELECT * FROM matches WHERE id = ?').get(id);
    if (!match) {
      return res.status(404).json({ error: 'Match not found.' });
    }

    if (match.lost_user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized.' });
    }

    db.prepare(`UPDATE matches SET status = 'rejected' WHERE id = ?`).run(id);

    return res.json({ success: true, status: 'rejected' });
  } catch (error) {
    console.error('Reject match error:', error);
    return res.status(500).json({ error: 'Failed to reject match claim.' });
  }
};

export const getRelayMessages = (req, res) => {
  try {
    const { id } = req.params;

    const match = db.prepare('SELECT * FROM matches WHERE id = ?').get(id);
    if (!match) return res.status(404).json({ error: 'Match not found.' });

    if (match.lost_user_id !== req.user.id && match.found_user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to view this conversation.' });
    }

    if (match.status !== 'verified' && match.status !== 'confirmed' && match.status !== 'returned') {
      return res.status(403).json({ error: 'Anonymous relay chat opens after the security challenge is verified.' });
    }

    const messages = db.prepare(`
      SELECT id, match_id as matchId, sender_id as senderId, sender_role as senderRole, message, created_at as createdAt
      FROM relay_messages 
      WHERE match_id = ? 
      ORDER BY created_at ASC
    `).all(id);

    return res.json({
      handoverCode: match.handover_code,
      messages: messages.map(m => ({
        ...m,
        isMe: m.senderId === req.user.id
      }))
    });
  } catch (error) {
    console.error('Get relay messages error:', error);
    return res.status(500).json({ error: 'Failed to retrieve relay messages.' });
  }
};

export const sendRelayMessage = (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const match = db.prepare('SELECT * FROM matches WHERE id = ?').get(id);
    if (!match) return res.status(404).json({ error: 'Match not found.' });

    const isOwner = match.lost_user_id === req.user.id;
    const isFinder = match.found_user_id === req.user.id;

    if (!isOwner && !isFinder) {
      return res.status(403).json({ error: 'Unauthorized to send message in this match.' });
    }

    if (match.status !== 'verified' && match.status !== 'confirmed' && match.status !== 'returned') {
      return res.status(403).json({ error: 'Anonymous relay chat opens after the security challenge is verified.' });
    }

    const role = isOwner ? 'Claimant (Owner)' : 'Finder';
    const msgId = `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO relay_messages (id, match_id, sender_id, sender_role, message, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(msgId, id, req.user.id, role, message.trim(), now);

    // Notify recipient
    const recipientId = isOwner ? match.found_user_id : match.lost_user_id;
    const notifId = `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    db.prepare(`
      INSERT INTO notifications (id, user_id, match_id, lost_id, message, read, created_at)
      VALUES (?, ?, ?, ?, ?, 0, ?)
    `).run(notifId, recipientId, id, match.lost_id, `New secure relay message from ${role}: "${message.trim().slice(0, 40)}..."`, now);

    return res.status(201).json({
      id: msgId,
      matchId: id,
      senderId: req.user.id,
      senderRole: role,
      message: message.trim(),
      isMe: true,
      createdAt: now
    });
  } catch (error) {
    console.error('Send relay message error:', error);
    return res.status(500).json({ error: 'Failed to send relay message.' });
  }
};

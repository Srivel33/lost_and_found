import { db } from '../config/db.js';
import { POST_STATUSES } from '../config/constants.js';
import { runMatchingForFoundPost } from '../services/matchingService.js';
import { jobQueue } from '../services/backgroundWorker.js';

const OBVIOUS_KEYWORDS = ['color', 'colour', 'brand', 'company', 'make', 'name of brand', 'what brand', 'what color'];

const isObviousQuestion = (question) => {
  if (!question) return false;
  const qLower = question.toLowerCase();
  return OBVIOUS_KEYWORDS.some(kw => qLower.includes(kw));
};

export const createFound = (req, res) => {
  try {
    const {
      category, itemName, description, color, location, floor, room, timeFound, currentLocation, photo, visualFingerprint, phone,
      hiddenQuestion, correctAnswer, decoyAnswers, decoy1, decoy2, decoy3
    } = req.body;

    if (!category || !description || !color || !location || !timeFound || !currentLocation || !hiddenQuestion || !correctAnswer) {
      return res.status(400).json({ error: 'Please provide all required fields including the verification question.' });
    }

    if (new Date(timeFound).getTime() > Date.now()) {
      return res.status(400).json({ error: 'Found time cannot be in the future.' });
    }

    if (hiddenQuestion.trim().length < 8) {
      return res.status(400).json({ error: 'Hidden verification question must be at least 8 characters long.' });
    }

    if (isObviousQuestion(hiddenQuestion)) {
      return res.status(400).json({ error: 'Pick a less obvious detail, like a sticker, keychain, wallpaper, or unique scratch.' });
    }

    // Process decoys
    let decoys = [];
    if (Array.isArray(decoyAnswers) && decoyAnswers.length > 0) {
      decoys = decoyAnswers.map(d => String(d).trim()).filter(Boolean);
    } else if (decoy1 && decoy2 && decoy3) {
      decoys = [decoy1.trim(), decoy2.trim(), decoy3.trim()];
    }

    if (decoys.length < 3) {
      return res.status(400).json({ error: 'Three distinct decoy options are required.' });
    }

    // Anti-collusion & quality check: Ensure decoys are unique and not equal to the correct answer
    const normCorrect = correctAnswer.trim().toLowerCase();
    const uniqueDecoys = new Set(decoys.map(d => d.toLowerCase()));
    if (uniqueDecoys.size < 3 || uniqueDecoys.has(normCorrect)) {
      return res.status(400).json({ error: 'Decoy options must be distinct from each other and cannot match the correct answer.' });
    }

    const id = `found_${Date.now()}`;
    const createdAt = new Date().toISOString();
    const finalItemName = (itemName && itemName.trim()) || `${category} item`;
    const userPhone = phone || req.user.phone;

    db.prepare(`
      INSERT INTO found_posts (
        id, user_id, user_name, user_email, user_phone,
        category, item_name, description, color, location, floor, room,
        time_found, current_location, photo, visual_fingerprint, hidden_question,
        correct_answer, decoy_answers, status, returned_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?)
    `).run(
      id,
      req.user.id,
      req.user.name,
      req.user.email,
      userPhone,
      category,
      finalItemName,
      description.trim(),
      color,
      location,
      floor || null,
      room || null,
      timeFound,
      currentLocation,
      photo || null,
      visualFingerprint || null,
      hiddenQuestion.trim(),
      correctAnswer.trim(),
      JSON.stringify(decoys),
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
      itemName: finalItemName,
      description: description.trim(),
      color,
      location,
      timeFound,
      currentLocation,
      photo: photo || null,
      hiddenQuestion: hiddenQuestion.trim(),
      correctAnswer: correctAnswer.trim(),
      decoyAnswers: decoys,
      status: POST_STATUSES.OPEN,
      createdAt
    };

    // Enqueue background matching job
    jobQueue.enqueueFoundPostMatching(id);

    return res.status(201).json(newPost);
  } catch (error) {
    console.error('Create found error:', error);
    return res.status(500).json({ error: error.message || 'Failed to create found report.' });
  }
};

export const getMyFound = (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT 
        id, user_id as userId, user_name as userName, user_email as userEmail, user_phone as userPhone,
        category, item_name as itemName, description, color, location,
        time_found as timeFound, current_location as currentLocation, photo,
        hidden_question as hiddenQuestion, correct_answer as correctAnswer, decoy_answers as decoyAnswers,
        status, returned_at as returnedAt, created_at as createdAt
      FROM found_posts
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).all(req.user.id);

    const formatted = rows.map(r => ({
      ...r,
      decoyAnswers: JSON.parse(r.decoyAnswers || '[]')
    }));

    return res.json(formatted);
  } catch (error) {
    console.error('Get my found error:', error);
    return res.status(500).json({ error: 'Failed to retrieve found posts.' });
  }
};

export const markReturned = (req, res) => {
  try {
    const { id } = req.params;
    const post = db.prepare('SELECT * FROM found_posts WHERE id = ?').get(id);

    if (!post) {
      return res.status(404).json({ error: 'Found post not found.' });
    }

    if (post.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to modify this post.' });
    }

    const returnedAt = new Date().toISOString();
    db.prepare(`
      UPDATE found_posts 
      SET status = ?, returned_at = ? 
      WHERE id = ?
    `).run(POST_STATUSES.RETURNED, returnedAt, id);

    const updated = db.prepare(`
      SELECT 
        id, user_id as userId, user_name as userName, user_email as userEmail, user_phone as userPhone,
        category, item_name as itemName, description, color, location,
        time_found as timeFound, current_location as currentLocation, photo,
        hidden_question as hiddenQuestion, status, returned_at as returnedAt, created_at as createdAt
      FROM found_posts WHERE id = ?
    `).get(id);

    return res.json(updated);
  } catch (error) {
    console.error('Mark found returned error:', error);
    return res.status(500).json({ error: 'Failed to mark post returned.' });
  }
};

export const withdrawFound = (req, res) => {
  try {
    const { id } = req.params;
    const post = db.prepare('SELECT * FROM found_posts WHERE id = ?').get(id);

    if (!post) {
      return res.status(404).json({ error: 'Found post not found.' });
    }

    if (post.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to modify this post.' });
    }

    db.prepare(`
      UPDATE found_posts 
      SET status = ? 
      WHERE id = ?
    `).run(POST_STATUSES.WITHDRAWN, id);

    const updated = db.prepare(`
      SELECT 
        id, user_id as userId, user_name as userName, user_email as userEmail, user_phone as userPhone,
        category, item_name as itemName, description, color, location,
        time_found as timeFound, current_location as currentLocation, photo,
        hidden_question as hiddenQuestion, status, returned_at as returnedAt, created_at as createdAt
      FROM found_posts WHERE id = ?
    `).get(id);

    return res.json(updated);
  } catch (error) {
    console.error('Withdraw found error:', error);
    return res.status(500).json({ error: 'Failed to withdraw post.' });
  }
};

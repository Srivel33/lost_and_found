import { CAMPUS_ADJACENCY, STOP_WORDS, SYNONYM_MAP, POST_STATUSES } from '../config/constants.js';
import { db } from '../config/db.js';

export const normalizeText = (text) => {
  if (!text) return [];
  const cleaned = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const rawTokens = cleaned.split(/\s+/).filter(t => t.length > 1 && !STOP_WORDS.has(t));
  return rawTokens.map(token => SYNONYM_MAP[token] || token);
};

export const calculateJaccardSimilarity = (tokensA, tokensB) => {
  if (!tokensA.length || !tokensB.length) return 0;
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  
  return intersection.size / union.size;
};

export const calculateLocationScore = (locLost, locFound) => {
  if (!locLost || !locFound) return 0;
  if (locLost.trim().toLowerCase() === locFound.trim().toLowerCase()) return 1.0;
  
  const adjList = CAMPUS_ADJACENCY[locLost] || [];
  if (adjList.some(adj => adj.toLowerCase() === locFound.trim().toLowerCase())) {
    return 0.6;
  }
  return 0;
};

export const calculateTimeScore = (timeStartStr, timeEndStr, timeFoundStr) => {
  const tStart = new Date(timeStartStr).getTime();
  const tEnd = new Date(timeEndStr || timeStartStr).getTime();
  const tFound = new Date(timeFoundStr).getTime();

  if (isNaN(tStart) || isNaN(tFound)) return 0;
  if (tFound < tStart) return 0; // Found before it was lost

  if (tFound <= tEnd) {
    return 1.0;
  }

  // Decays to 0 over 48 hours after timeEnd
  const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;
  const diffAfterEnd = tFound - tEnd;

  if (diffAfterEnd > FORTY_EIGHT_HOURS_MS) {
    return 0;
  }

  return Math.max(0, 1.0 - (diffAfterEnd / FORTY_EIGHT_HOURS_MS));
};

export const calculateColorScore = (colorLost, colorFound) => {
  if (!colorLost || !colorFound) return 0;
  const cLost = colorLost.toLowerCase().replace(/[^a-z]/g, '');
  const cFound = colorFound.toLowerCase().replace(/[^a-z]/g, '');

  if (cLost === cFound) return 1.0;
  if (cLost.includes('blue') && cFound.includes('blue')) return 1.0;
  if (cLost.includes('black') && cFound.includes('black')) return 1.0;
  if (cLost.includes(cFound) || cFound.includes(cLost)) return 0.8;
  return 0;
};

export const calculateImageSimilarity = (photoA, photoB) => {
  if (!photoA || !photoB) return null;
  if (typeof photoA !== 'string' || typeof photoB !== 'string') return null;

  const pA = photoA.trim();
  const pB = photoB.trim();
  if (!pA || !pB) return null;

  // Exact match (identical file or data URL)
  if (pA === pB) return 1.0;

  // If both are base64 data URLs
  if (pA.startsWith('data:image') && pB.startsWith('data:image')) {
    const rawA = pA.split(',')[1] || '';
    const rawB = pB.split(',')[1] || '';
    if (!rawA || !rawB) return null;
    if (rawA === rawB) return 1.0;

    const lenA = rawA.length;
    const lenB = rawB.length;
    const lengthRatio = Math.min(lenA, lenB) / Math.max(lenA, lenB);

    let matchCount = 0;
    const samples = 32;
    for (let i = 0; i < samples; i++) {
      const idxA = Math.floor((i / samples) * lenA);
      const idxB = Math.floor((i / samples) * lenB);
      if (rawA[idxA] === rawB[idxB]) {
        matchCount++;
      }
    }
    const sampleSimilarity = matchCount / samples;
    const similarity = (lengthRatio * 0.4) + (sampleSimilarity * 0.6);
    return parseFloat(similarity.toFixed(2));
  }

  // If filenames or URLs match
  const nameA = pA.split('/').pop().split('?')[0];
  const nameB = pB.split('/').pop().split('?')[0];
  if (nameA && nameB && nameA === nameB) {
    return 1.0;
  }

  return 0.6; // Baseline similarity for verified photo existence on both posts
};

export const generateWhyMatchedSummary = (lostPost, foundPost, subScores) => {
  const reasons = [];
  reasons.push(`Same category (${lostPost.category})`);
  
  if (subScores.colorScore >= 0.7) {
    reasons.push(`matching color (${foundPost.color})`);
  }
  
  if (subScores.locationScore === 1.0) {
    reasons.push(`exact location (${foundPost.location})`);
  } else if (subScores.locationScore > 0) {
    reasons.push(`nearby location (${foundPost.location} near ${lostPost.location})`);
  }
  
  if (subScores.timeScore >= 0.9) {
    reasons.push('found within estimated time window');
  } else if (subScores.timeScore > 0) {
    reasons.push('found within 48h of time window');
  }

  if (subScores.imageScore !== null && subScores.imageScore >= 0.6) {
    reasons.push('visual photo similarity match (+bonus)');
  }

  return reasons.join(', ');
};

export const scoreMatchPair = (lostPost, foundPost) => {
  if (lostPost.category !== foundPost.category) {
    return null;
  }

  const tStart = new Date(lostPost.time_start || lostPost.timeStart).getTime();
  const tFound = new Date(foundPost.time_found || foundPost.timeFound).getTime();
  if (tFound < tStart) {
    return null;
  }

  const textLost = `${lostPost.item_name || lostPost.itemName || ''} ${lostPost.description || ''} ${lostPost.special_marks || lostPost.specialMarks || ''}`;
  const textFound = `${foundPost.item_name || foundPost.itemName || ''} ${foundPost.description || ''}`;
  
  const tokensLost = normalizeText(textLost);
  const tokensFound = normalizeText(textFound);
  
  const textScore = calculateJaccardSimilarity(tokensLost, tokensFound);
  const colorScore = calculateColorScore(lostPost.color, foundPost.color);
  const locationScore = calculateLocationScore(lostPost.location, foundPost.location);
  const timeScore = calculateTimeScore(
    lostPost.time_start || lostPost.timeStart,
    lostPost.time_end || lostPost.timeEnd,
    foundPost.time_found || foundPost.timeFound
  );

  // Optional Image Similarity Bonus
  const imageScore = calculateImageSimilarity(lostPost.photo, foundPost.photo);
  const imageBonus = imageScore !== null ? imageScore * 0.15 : 0;

  const baseScore = (0.40 * textScore) + (0.20 * colorScore) + (0.25 * locationScore) + (0.15 * timeScore);
  const totalScore = Math.min(1.0, baseScore + imageBonus);

  if (totalScore >= 0.60) {
    const band = totalScore >= 0.80 ? 'High' : 'Medium';
    const whyMatched = generateWhyMatchedSummary(lostPost, foundPost, { textScore, colorScore, locationScore, timeScore, imageScore });
    
    return {
      score: parseFloat(totalScore.toFixed(2)),
      band,
      whyMatched,
      imageBonus: imageBonus > 0 ? parseFloat(imageBonus.toFixed(2)) : undefined
    };
  }

  return null;
};

export const previewMatchesForLostPost = (lostPostData, currentUserId) => {
  const foundList = db.prepare(`
    SELECT * FROM found_posts 
    WHERE status NOT IN (?, ?) AND user_id != ?
  `).all(POST_STATUSES.WITHDRAWN, POST_STATUSES.RETURNED, currentUserId || '');

  const matches = [];

  for (const foundPost of foundList) {
    const matchResult = scoreMatchPair(lostPostData, foundPost);
    if (matchResult) {
      matches.push({
        id: foundPost.id,
        category: foundPost.category,
        itemName: foundPost.item_name,
        color: foundPost.color,
        location: foundPost.location,
        timeFound: foundPost.time_found,
        score: matchResult.score,
        band: matchResult.band,
        whyMatched: matchResult.whyMatched,
        hasPhoto: Boolean(foundPost.photo)
      });
    }
  }

  matches.sort((a, b) => b.score - a.score);

  return {
    count: matches.length,
    topMatch: matches[0] || null,
    matches: matches.slice(0, 3)
  };
};

export const runMatchingForLostPost = (lostPost) => {
  const foundList = db.prepare(`
    SELECT * FROM found_posts 
    WHERE status NOT IN (?, ?) AND user_id != ?
  `).all(POST_STATUSES.WITHDRAWN, POST_STATUSES.RETURNED, lostPost.user_id);

  let hasMatch = false;

  const insertMatch = db.prepare(`
    INSERT INTO matches (id, lost_id, found_id, lost_user_id, found_user_id, score, band, why_matched, status, attempts_left, lockout_until, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', 3, NULL, ?)
  `);

  const insertNotif = db.prepare(`
    INSERT INTO notifications (id, user_id, match_id, lost_id, message, read, created_at)
    VALUES (?, ?, ?, ?, ?, 0, ?)
  `);

  const checkExisting = db.prepare(`
    SELECT id FROM matches WHERE lost_id = ? AND found_id = ?
  `);

  for (const foundPost of foundList) {
    if (checkExisting.get(lostPost.id, foundPost.id)) continue;

    const matchResult = scoreMatchPair(lostPost, foundPost);
    if (matchResult) {
      hasMatch = true;
      const matchId = `match_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const now = new Date().toISOString();

      insertMatch.run(
        matchId,
        lostPost.id,
        foundPost.id,
        lostPost.user_id,
        foundPost.user_id,
        matchResult.score,
        matchResult.band,
        matchResult.whyMatched,
        now
      );

      const notifId = `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      insertNotif.run(
        notifId,
        lostPost.user_id,
        matchId,
        lostPost.id,
        `A possible match was found for your ${lostPost.item_name}.`,
        now
      );
    }
  }

  if (hasMatch) {
    db.prepare(`UPDATE lost_posts SET status = ? WHERE id = ?`).run(POST_STATUSES.MATCHED, lostPost.id);
  }
};

export const runMatchingForFoundPost = (foundPost) => {
  const lostList = db.prepare(`
    SELECT * FROM lost_posts 
    WHERE status NOT IN (?, ?) AND user_id != ?
  `).all(POST_STATUSES.WITHDRAWN, POST_STATUSES.RETURNED, foundPost.user_id);

  const insertMatch = db.prepare(`
    INSERT INTO matches (id, lost_id, found_id, lost_user_id, found_user_id, score, band, why_matched, status, attempts_left, lockout_until, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', 3, NULL, ?)
  `);

  const insertNotif = db.prepare(`
    INSERT INTO notifications (id, user_id, match_id, lost_id, message, read, created_at)
    VALUES (?, ?, ?, ?, ?, 0, ?)
  `);

  const checkExisting = db.prepare(`
    SELECT id FROM matches WHERE lost_id = ? AND found_id = ?
  `);

  for (const lostPost of lostList) {
    if (checkExisting.get(lostPost.id, foundPost.id)) continue;

    const matchResult = scoreMatchPair(lostPost, foundPost);
    if (matchResult) {
      const matchId = `match_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const now = new Date().toISOString();

      insertMatch.run(
        matchId,
        lostPost.id,
        foundPost.id,
        lostPost.user_id,
        foundPost.user_id,
        matchResult.score,
        matchResult.band,
        matchResult.whyMatched,
        now
      );

      const notifId = `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      insertNotif.run(
        notifId,
        lostPost.user_id,
        matchId,
        lostPost.id,
        `A possible match was found for your ${lostPost.item_name}.`,
        now
      );

      db.prepare(`UPDATE lost_posts SET status = ? WHERE id = ?`).run(POST_STATUSES.MATCHED, lostPost.id);
    }
  }
};

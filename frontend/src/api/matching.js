import { CAMPUS_ADJACENCY } from '../utils/constants';

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'in', 'on', 'at', 'with', 'for', 'to', 'of', 'and', 'or', 'is', 'it', 'my', 'near', 'from', 'left', 'found', 'lost'
]);

const SYNONYM_MAP = {
  'navy': 'blue',
  'darkblue': 'blue',
  'backpack': 'bag',
  'sack': 'bag',
  'duffle': 'bag',
  'purse': 'wallet',
  'cardholder': 'wallet',
  'earbuds': 'earphones',
  'buds': 'earphones',
  'airpods': 'earphones',
  'headphones': 'earphones',
  'mobile': 'phone',
  'smartphone': 'phone',
  'cellphone': 'phone',
  'galaxy': 'phone',
  'iphone': 'phone',
  'flask': 'bottle',
  'sipper': 'bottle',
  'hydroflask': 'bottle',
  'idcard': 'id_card',
  'identity': 'id_card',
  'lanyard': 'id_card'
};

export const normalizeText = (text) => {
  if (!text) return [];
  // Clean punctuation
  let cleaned = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  let rawTokens = cleaned.split(/\s+/).filter(t => t.length > 1 && !STOP_WORDS.has(t));
  
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

  // If found within or up to end time
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

  return reasons.join(', ');
};

export const scoreMatchPair = (lostPost, foundPost) => {
  // Pre-filter: same category, found time >= lost timeStart, status open/matched
  if (lostPost.category !== foundPost.category) {
    return null;
  }

  const tStart = new Date(lostPost.timeStart).getTime();
  const tFound = new Date(foundPost.timeFound).getTime();
  if (tFound < tStart) {
    return null;
  }

  // Text tokens
  const textLost = `${lostPost.itemName || ''} ${lostPost.description || ''} ${lostPost.specialMarks || ''}`;
  const textFound = `${foundPost.itemName || ''} ${foundPost.description || ''}`;
  
  const tokensLost = normalizeText(textLost);
  const tokensFound = normalizeText(textFound);
  
  const textScore = calculateJaccardSimilarity(tokensLost, tokensFound);
  const colorScore = calculateColorScore(lostPost.color, foundPost.color);
  const locationScore = calculateLocationScore(lostPost.location, foundPost.location);
  const timeScore = calculateTimeScore(lostPost.timeStart, lostPost.timeEnd, foundPost.timeFound);

  // Score = 0.40 text + 0.20 color + 0.25 location + 0.15 time
  const totalScore = (0.40 * textScore) + (0.20 * colorScore) + (0.25 * locationScore) + (0.15 * timeScore);

  if (totalScore >= 0.60) {
    const band = totalScore >= 0.80 ? 'High' : 'Medium';
    const whyMatched = generateWhyMatchedSummary(lostPost, foundPost, { textScore, colorScore, locationScore, timeScore });
    
    return {
      score: parseFloat(totalScore.toFixed(2)),
      band,
      whyMatched
    };
  }

  return null;
};

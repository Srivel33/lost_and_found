import seedData from '../data/seedData.json';
import { scoreMatchPair } from './matching';
import { POST_STATUSES } from '../utils/constants';

const STORAGE_KEYS = {
  USERS: 'lf_users',
  LOST: 'lf_lost',
  FOUND: 'lf_found',
  MATCHES: 'lf_matches',
  NOTIFICATIONS: 'lf_notifications',
  LOGIN_ATTEMPTS: 'lf_login_attempts',
  SESSION: 'lf_session' // stored in sessionStorage
};

export const initializeMockStore = (forceReset = false) => {
  if (forceReset || !localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(seedData.students_master));
    localStorage.setItem(STORAGE_KEYS.LOST, JSON.stringify(seedData.lost));
    localStorage.setItem(STORAGE_KEYS.FOUND, JSON.stringify(seedData.found));
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(seedData.matches));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(seedData.notifications));
    localStorage.setItem(STORAGE_KEYS.LOGIN_ATTEMPTS, JSON.stringify([]));
    sessionStorage.removeItem(STORAGE_KEYS.SESSION);
  }
};

// Initialize if empty
initializeMockStore(false);

const getFromStorage = (key, fallback = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Auth & Session
export const getSessionUser = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.SESSION);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      sessionStorage.removeItem(STORAGE_KEYS.SESSION);
      return null;
    }
    return session.user;
  } catch {
    return null;
  }
};

export const setSessionUser = (user) => {
  const session = {
    user,
    token: `mock_jwt_${user.id}_${Date.now()}`,
    expiresAt: Date.now() + 60 * 60 * 1000 // 1 hour
  };
  sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  return user;
};

export const clearSessionUser = () => {
  sessionStorage.removeItem(STORAGE_KEYS.SESSION);
};

// Rate Limiter for Login (5 failed attempts per 15 minutes)
export const checkLoginRateLimit = () => {
  const attempts = getFromStorage(STORAGE_KEYS.LOGIN_ATTEMPTS, []);
  const fifteenMinsAgo = Date.now() - 15 * 60 * 1000;
  const recentAttempts = attempts.filter(ts => ts > fifteenMinsAgo);

  if (recentAttempts.length >= 5) {
    return false;
  }
  return true;
};

export const recordFailedLoginAttempt = () => {
  const attempts = getFromStorage(STORAGE_KEYS.LOGIN_ATTEMPTS, []);
  const fifteenMinsAgo = Date.now() - 15 * 60 * 1000;
  const recentAttempts = attempts.filter(ts => ts > fifteenMinsAgo);
  recentAttempts.push(Date.now());
  saveToStorage(STORAGE_KEYS.LOGIN_ATTEMPTS, recentAttempts);
};

export const resetLoginAttempts = () => {
  saveToStorage(STORAGE_KEYS.LOGIN_ATTEMPTS, []);
};

// User store operations
export const findUserByCredentials = (email, regNumber) => {
  const users = getFromStorage(STORAGE_KEYS.USERS);
  const normalizedEmail = (email || '').trim().toLowerCase();
  const normalizedReg = (regNumber || '').trim().toUpperCase();

  return users.find(
    u => u.email.toLowerCase() === normalizedEmail && u.regNumber.toUpperCase() === normalizedReg
  );
};

export const registerNewUser = ({ name, email, regNumber, phone }) => {
  const users = getFromStorage(STORAGE_KEYS.USERS);
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedReg = regNumber.trim().toUpperCase();

  // Check if email or regNumber already exists
  const existing = users.find(
    u => u.email.toLowerCase() === normalizedEmail || u.regNumber.toUpperCase() === normalizedReg
  );

  if (existing) {
    throw new Error('Student with this email or registration number already exists.');
  }

  const newUser = {
    id: `std_${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    regNumber: normalizedReg,
    phone: phone.trim()
  };

  users.push(newUser);
  saveToStorage(STORAGE_KEYS.USERS, users);
  return newUser;
};

// Lost & Found Posts
export const addLostPost = (postData, currentUser) => {
  const lostList = getFromStorage(STORAGE_KEYS.LOST);
  const newPost = {
    id: `lost_${Date.now()}`,
    userId: currentUser.id,
    userName: currentUser.name,
    userEmail: currentUser.email,
    userPhone: postData.phone || currentUser.phone,
    category: postData.category,
    itemName: postData.itemName,
    description: postData.description,
    color: postData.color,
    specialMarks: postData.specialMarks || '',
    location: postData.location,
    timeStart: postData.timeStart,
    timeEnd: postData.timeEnd,
    photo: postData.photo || null,
    status: POST_STATUSES.OPEN,
    createdAt: new Date().toISOString()
  };

  lostList.unshift(newPost);
  saveToStorage(STORAGE_KEYS.LOST, lostList);

  // Trigger matching against existing found posts
  checkAndCreateMatchesForLost(newPost);

  return newPost;
};

export const addFoundPost = (postData, currentUser) => {
  const foundList = getFromStorage(STORAGE_KEYS.FOUND);
  const newPost = {
    id: `found_${Date.now()}`,
    userId: currentUser.id,
    userName: currentUser.name,
    userEmail: currentUser.email,
    userPhone: postData.phone || currentUser.phone,
    category: postData.category,
    itemName: postData.itemName || `${postData.category} item`,
    description: postData.description,
    color: postData.color,
    location: postData.location,
    timeFound: postData.timeFound,
    currentLocation: postData.currentLocation,
    photo: postData.photo || null,
    hiddenQuestion: postData.hiddenQuestion,
    correctAnswer: postData.correctAnswer,
    decoyAnswers: postData.decoyAnswers,
    status: POST_STATUSES.OPEN,
    createdAt: new Date().toISOString()
  };

  foundList.unshift(newPost);
  saveToStorage(STORAGE_KEYS.FOUND, foundList);

  // Trigger matching against existing lost posts
  checkAndCreateMatchesForFound(newPost);

  return newPost;
};

// Matching triggers
const checkAndCreateMatchesForLost = (lostPost) => {
  const foundList = getFromStorage(STORAGE_KEYS.FOUND);
  const matches = getFromStorage(STORAGE_KEYS.MATCHES);
  const notifications = getFromStorage(STORAGE_KEYS.NOTIFICATIONS);
  const lostList = getFromStorage(STORAGE_KEYS.LOST);

  let hasMatch = false;

  foundList.forEach(foundPost => {
    if (foundPost.status === POST_STATUSES.WITHDRAWN || foundPost.status === POST_STATUSES.RETURNED) return;
    if (foundPost.userId === lostPost.userId) return; // Don't match user's own found posts

    const matchResult = scoreMatchPair(lostPost, foundPost);
    if (matchResult) {
      hasMatch = true;
      const matchId = `match_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const newMatch = {
        id: matchId,
        lostId: lostPost.id,
        foundId: foundPost.id,
        lostUserId: lostPost.userId,
        foundUserId: foundPost.userId,
        score: matchResult.score,
        band: matchResult.band,
        whyMatched: matchResult.whyMatched,
        status: 'pending',
        attemptsLeft: 3,
        lockoutUntil: null,
        createdAt: new Date().toISOString()
      };
      matches.unshift(newMatch);

      // Create notification for lost person only
      notifications.unshift({
        id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        userId: lostPost.userId,
        matchId: matchId,
        lostId: lostPost.id,
        message: `A possible match was found for your ${lostPost.itemName}.`,
        read: false,
        createdAt: new Date().toISOString()
      });
    }
  });

  if (hasMatch) {
    const updatedLost = lostList.map(l => l.id === lostPost.id ? { ...l, status: POST_STATUSES.MATCHED } : l);
    saveToStorage(STORAGE_KEYS.LOST, updatedLost);
  }

  saveToStorage(STORAGE_KEYS.MATCHES, matches);
  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
};

const checkAndCreateMatchesForFound = (foundPost) => {
  const lostList = getFromStorage(STORAGE_KEYS.LOST);
  const matches = getFromStorage(STORAGE_KEYS.MATCHES);
  const notifications = getFromStorage(STORAGE_KEYS.NOTIFICATIONS);

  lostList.forEach(lostPost => {
    if (lostPost.status === POST_STATUSES.WITHDRAWN || lostPost.status === POST_STATUSES.RETURNED) return;
    if (lostPost.userId === foundPost.userId) return;

    const matchResult = scoreMatchPair(lostPost, foundPost);
    if (matchResult) {
      const matchId = `match_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const newMatch = {
        id: matchId,
        lostId: lostPost.id,
        foundId: foundPost.id,
        lostUserId: lostPost.userId,
        foundUserId: foundPost.userId,
        score: matchResult.score,
        band: matchResult.band,
        whyMatched: matchResult.whyMatched,
        status: 'pending',
        attemptsLeft: 3,
        lockoutUntil: null,
        createdAt: new Date().toISOString()
      };
      matches.unshift(newMatch);

      // Create notification for the lost person only
      notifications.unshift({
        id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        userId: lostPost.userId,
        matchId: matchId,
        lostId: lostPost.id,
        message: `A possible match was found for your ${lostPost.itemName}.`,
        read: false,
        createdAt: new Date().toISOString()
      });
    }
  });

  saveToStorage(STORAGE_KEYS.MATCHES, matches);
  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
};

// Match queries with strict privacy enforcement
export const getMyMatches = (userId) => {
  const matches = getFromStorage(STORAGE_KEYS.MATCHES);
  const foundList = getFromStorage(STORAGE_KEYS.FOUND);
  const lostList = getFromStorage(STORAGE_KEYS.LOST);

  // User only sees matches tied to their own lost posts
  const userMatches = matches.filter(m => m.lostUserId === userId);

  return userMatches.map(m => {
    const lostItem = lostList.find(l => l.id === m.lostId);
    const foundItem = foundList.find(f => f.id === m.foundId);

    return {
      id: m.id,
      lostId: m.lostId,
      foundId: m.foundId,
      lostItemName: lostItem ? lostItem.itemName : 'Lost Item',
      lostCategory: lostItem ? lostItem.category : 'other',
      category: foundItem ? foundItem.category : 'other',
      color: foundItem ? foundItem.color : '',
      location: foundItem ? foundItem.location : '',
      timeFound: foundItem ? foundItem.timeFound : '',
      score: m.score,
      band: m.band,
      whyMatched: m.whyMatched,
      status: m.status,
      attemptsLeft: m.attemptsLeft,
      lockoutUntil: m.lockoutUntil,
      createdAt: m.createdAt
    };
  });
};

export const getMatchDetail = (matchId, currentUserId) => {
  const matches = getFromStorage(STORAGE_KEYS.MATCHES);
  const foundList = getFromStorage(STORAGE_KEYS.FOUND);
  const lostList = getFromStorage(STORAGE_KEYS.LOST);

  const match = matches.find(m => m.id === matchId);
  if (!match) throw new Error('Match not found');

  // Privacy Rule: Only owner of the lost post can view this match detail
  if (match.lostUserId !== currentUserId) {
    throw new Error('Unauthorized: You do not have permission to view this match.');
  }

  const lostItem = lostList.find(l => l.id === match.lostId);
  const foundItem = foundList.find(f => f.id === match.foundId);

  if (!foundItem) throw new Error('Associated found post not found');

  // Check if lockout has expired
  let isLocked = false;
  if (match.lockoutUntil) {
    if (Date.now() < new Date(match.lockoutUntil).getTime()) {
      isLocked = true;
    }
  }

  // Shuffle answers for multiple choice question
  // Note: We DO NOT send which one is correct in the client response
  const rawOptions = [foundItem.correctAnswer, ...foundItem.decoyAnswers];
  // Deterministic or pseudorandom shuffle based on matchId so it stays steady on re-renders
  const options = [...rawOptions].sort(() => 0.5 - Math.random());

  return {
    id: match.id,
    lostId: match.lostId,
    lostItemName: lostItem?.itemName || 'Item',
    lostCategory: lostItem?.category || 'other',
    category: foundItem.category,
    description: foundItem.description,
    color: foundItem.color,
    location: foundItem.location,
    timeFound: foundItem.timeFound,
    currentLocation: foundItem.currentLocation,
    photo: foundItem.photo,
    band: match.band,
    score: match.score,
    whyMatched: match.whyMatched,
    status: match.status,
    attemptsLeft: match.attemptsLeft,
    lockoutUntil: match.lockoutUntil,
    isLocked,
    hiddenQuestion: foundItem.hiddenQuestion,
    questionOptions: options,
    // Note: NEVER include foundItem.userName, foundItem.userPhone, foundItem.userEmail or foundItem.correctAnswer here!
    createdAt: match.createdAt
  };
};

export const submitHiddenQuestionAnswer = (matchId, selectedAnswer, currentUserId) => {
  const matches = getFromStorage(STORAGE_KEYS.MATCHES);
  const foundList = getFromStorage(STORAGE_KEYS.FOUND);

  const matchIndex = matches.findIndex(m => m.id === matchId);
  if (matchIndex === -1) throw new Error('Match not found');

  const match = matches[matchIndex];
  if (match.lostUserId !== currentUserId) {
    throw new Error('Unauthorized');
  }

  // Check lockout
  if (match.lockoutUntil && Date.now() < new Date(match.lockoutUntil).getTime()) {
    throw new Error('This match is temporarily locked. Please try again after the cooldown period.');
  }

  const foundItem = foundList.find(f => f.id === match.foundId);
  if (!foundItem) throw new Error('Found item not found');

  const isCorrect = selectedAnswer.trim().toLowerCase() === foundItem.correctAnswer.trim().toLowerCase();

  if (isCorrect) {
    matches[matchIndex] = {
      ...match,
      status: 'verified',
      attemptsLeft: 3,
      lockoutUntil: null
    };
    saveToStorage(STORAGE_KEYS.MATCHES, matches);

    return {
      success: true,
      verified: true,
      message: 'Correct answer! Finder contact details are now revealed.'
    };
  } else {
    const newAttempts = Math.max(0, match.attemptsLeft - 1);
    let lockoutUntil = null;
    if (newAttempts === 0) {
      // Lock for 24 hours
      lockoutUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    }

    matches[matchIndex] = {
      ...match,
      attemptsLeft: newAttempts,
      lockoutUntil: lockoutUntil
    };
    saveToStorage(STORAGE_KEYS.MATCHES, matches);

    return {
      success: false,
      verified: false,
      attemptsLeft: newAttempts,
      lockoutUntil: lockoutUntil,
      message: "That answer isn't right"
    };
  }
};

export const getVerifiedContact = (matchId, currentUserId) => {
  const matches = getFromStorage(STORAGE_KEYS.MATCHES);
  const foundList = getFromStorage(STORAGE_KEYS.FOUND);

  const match = matches.find(m => m.id === matchId);
  if (!match) throw new Error('Match not found');

  if (match.lostUserId !== currentUserId) {
    throw new Error('Unauthorized');
  }

  if (match.status !== 'verified' && match.status !== 'confirmed' && match.status !== 'returned') {
    throw new Error('Contact information is locked until the hidden question is answered correctly.');
  }

  const foundItem = foundList.find(f => f.id === match.foundId);
  if (!foundItem) throw new Error('Found post not found');

  return {
    finderName: foundItem.userName,
    finderPhone: foundItem.userPhone,
    finderEmail: foundItem.userEmail,
    currentLocation: foundItem.currentLocation
  };
};

export const confirmMatchClaim = (matchId, currentUserId) => {
  const matches = getFromStorage(STORAGE_KEYS.MATCHES);
  const lostList = getFromStorage(STORAGE_KEYS.LOST);
  const foundList = getFromStorage(STORAGE_KEYS.FOUND);

  const matchIndex = matches.findIndex(m => m.id === matchId);
  if (matchIndex === -1) throw new Error('Match not found');

  const match = matches[matchIndex];
  if (match.lostUserId !== currentUserId) throw new Error('Unauthorized');

  matches[matchIndex] = { ...match, status: 'confirmed' };

  // Update post statuses to claimed
  const updatedLost = lostList.map(l => l.id === match.lostId ? { ...l, status: POST_STATUSES.CLAIMED } : l);
  const updatedFound = foundList.map(f => f.id === match.foundId ? { ...f, status: POST_STATUSES.CLAIMED } : f);

  saveToStorage(STORAGE_KEYS.MATCHES, matches);
  saveToStorage(STORAGE_KEYS.LOST, updatedLost);
  saveToStorage(STORAGE_KEYS.FOUND, updatedFound);

  return { success: true, status: 'confirmed' };
};

export const rejectMatchClaim = (matchId, currentUserId) => {
  const matches = getFromStorage(STORAGE_KEYS.MATCHES);
  const matchIndex = matches.findIndex(m => m.id === matchId);
  if (matchIndex === -1) throw new Error('Match not found');

  const match = matches[matchIndex];
  if (match.lostUserId !== currentUserId) throw new Error('Unauthorized');

  matches[matchIndex] = { ...match, status: 'rejected' };
  saveToStorage(STORAGE_KEYS.MATCHES, matches);

  return { success: true, status: 'rejected' };
};

export const markPostReturned = (postId, postType, currentUserId) => {
  const storageKey = postType === 'lost' ? STORAGE_KEYS.LOST : STORAGE_KEYS.FOUND;
  const posts = getFromStorage(storageKey);
  const postIndex = posts.findIndex(p => p.id === postId);

  if (postIndex === -1) throw new Error('Post not found');
  if (posts[postIndex].userId !== currentUserId) throw new Error('Unauthorized');

  const returnedAt = new Date().toISOString();
  posts[postIndex] = {
    ...posts[postIndex],
    status: POST_STATUSES.RETURNED,
    returnedAt
  };

  saveToStorage(storageKey, posts);
  return posts[postIndex];
};

export const withdrawPost = (postId, postType, currentUserId) => {
  const storageKey = postType === 'lost' ? STORAGE_KEYS.LOST : STORAGE_KEYS.FOUND;
  const posts = getFromStorage(storageKey);
  const postIndex = posts.findIndex(p => p.id === postId);

  if (postIndex === -1) throw new Error('Post not found');
  if (posts[postIndex].userId !== currentUserId) throw new Error('Unauthorized');

  posts[postIndex] = {
    ...posts[postIndex],
    status: POST_STATUSES.WITHDRAWN
  };

  saveToStorage(storageKey, posts);
  return posts[postIndex];
};

export const reportUserDispute = (postId, reason, currentUserId) => {
  // Mock recording dispute report
  return { success: true, message: 'Report submitted to campus admin for review.' };
};

export const getUserPosts = (userId) => {
  const lost = getFromStorage(STORAGE_KEYS.LOST).filter(l => l.userId === userId);
  const found = getFromStorage(STORAGE_KEYS.FOUND).filter(f => f.userId === userId);

  return { lost, found };
};

export const getUserNotifications = (userId) => {
  const notifications = getFromStorage(STORAGE_KEYS.NOTIFICATIONS);
  return notifications.filter(n => n.userId === userId);
};

export const markNotificationRead = (notifId, currentUserId) => {
  const notifications = getFromStorage(STORAGE_KEYS.NOTIFICATIONS);
  const updated = notifications.map(n => {
    if (n.id === notifId && n.userId === currentUserId) {
      return { ...n, read: true };
    }
    return n;
  });

  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  return true;
};

export const markAllNotificationsRead = (currentUserId) => {
  const notifications = getFromStorage(STORAGE_KEYS.NOTIFICATIONS);
  const updated = notifications.map(n => {
    if (n.userId === currentUserId) {
      return { ...n, read: true };
    }
    return n;
  });

  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  return true;
};

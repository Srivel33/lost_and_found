import * as mockStore from './mockStore';

// Artificial delay simulator (300 to 600ms)
const simulateLatency = (min = 300, max = 600) => {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const api = {
  // Auth endpoints
  async register(data) {
    await simulateLatency();
    const newUser = mockStore.registerNewUser(data);
    mockStore.setSessionUser(newUser);
    return { user: newUser, token: `mock_jwt_${newUser.id}` };
  },

  async login(email, regNumber) {
    await simulateLatency();
    const isAllowed = mockStore.checkLoginRateLimit();
    if (!isAllowed) {
      throw new Error('Too many attempts. Try again in 15 minutes.');
    }

    const user = mockStore.findUserByCredentials(email, regNumber);
    if (!user) {
      mockStore.recordFailedLoginAttempt();
      throw new Error('Email or registration number is incorrect.');
    }

    mockStore.resetLoginAttempts();
    mockStore.setSessionUser(user);
    return { user, token: `mock_jwt_${user.id}` };
  },

  async me() {
    await simulateLatency(100, 200);
    const user = mockStore.getSessionUser();
    if (!user) return null;
    return user;
  },

  async logout() {
    await simulateLatency(100, 200);
    mockStore.clearSessionUser();
    return { success: true };
  },

  async resetDemo() {
    await simulateLatency(200, 400);
    mockStore.initializeMockStore(true);
    return { success: true };
  },

  // Lost posts
  async createLost(postData) {
    await simulateLatency();
    const user = mockStore.getSessionUser();
    if (!user) throw new Error('Unauthenticated');
    return mockStore.addLostPost(postData, user);
  },

  async getMyLost() {
    await simulateLatency();
    const user = mockStore.getSessionUser();
    if (!user) throw new Error('Unauthenticated');
    const { lost } = mockStore.getUserPosts(user.id);
    return lost;
  },

  // Found posts
  async createFound(postData) {
    await simulateLatency();
    const user = mockStore.getSessionUser();
    if (!user) throw new Error('Unauthenticated');
    return mockStore.addFoundPost(postData, user);
  },

  async getMyFound() {
    await simulateLatency();
    const user = mockStore.getSessionUser();
    if (!user) throw new Error('Unauthenticated');
    const { found } = mockStore.getUserPosts(user.id);
    return found;
  },

  // Matches
  async getMyMatches() {
    await simulateLatency();
    const user = mockStore.getSessionUser();
    if (!user) throw new Error('Unauthenticated');
    return mockStore.getMyMatches(user.id);
  },

  // Match detail (Strictly WITHOUT contact info)
  async getMatch(matchId) {
    await simulateLatency();
    const user = mockStore.getSessionUser();
    if (!user) throw new Error('Unauthenticated');
    return mockStore.getMatchDetail(matchId, user.id);
  },

  // Submit hidden question answer
  async submitAnswer(matchId, choice) {
    await simulateLatency();
    const user = mockStore.getSessionUser();
    if (!user) throw new Error('Unauthenticated');
    return mockStore.submitHiddenQuestionAnswer(matchId, choice, user.id);
  },

  // Get contact ONLY when verified
  async getContact(matchId) {
    await simulateLatency();
    const user = mockStore.getSessionUser();
    if (!user) throw new Error('Unauthenticated');
    return mockStore.getVerifiedContact(matchId, user.id);
  },

  // Confirm / Reject match
  async confirmMatch(matchId) {
    await simulateLatency();
    const user = mockStore.getSessionUser();
    if (!user) throw new Error('Unauthenticated');
    return mockStore.confirmMatchClaim(matchId, user.id);
  },

  async rejectMatch(matchId) {
    await simulateLatency();
    const user = mockStore.getSessionUser();
    if (!user) throw new Error('Unauthenticated');
    return mockStore.rejectMatchClaim(matchId, user.id);
  },

  // Lifecycle
  async markReturned(postId, postType) {
    await simulateLatency();
    const user = mockStore.getSessionUser();
    if (!user) throw new Error('Unauthenticated');
    return mockStore.markPostReturned(postId, postType, user.id);
  },

  async withdrawPost(postId, postType) {
    await simulateLatency();
    const user = mockStore.getSessionUser();
    if (!user) throw new Error('Unauthenticated');
    return mockStore.withdrawPost(postId, postType, user.id);
  },

  async reportUser(postId, reason) {
    await simulateLatency();
    const user = mockStore.getSessionUser();
    if (!user) throw new Error('Unauthenticated');
    return mockStore.reportUserDispute(postId, reason, user.id);
  },

  // Notifications
  async getNotifications() {
    // Shorter latency for polling
    await simulateLatency(150, 300);
    const user = mockStore.getSessionUser();
    if (!user) return [];
    return mockStore.getUserNotifications(user.id);
  },

  async markRead(notifId) {
    await simulateLatency(100, 200);
    const user = mockStore.getSessionUser();
    if (!user) return false;
    return mockStore.markNotificationRead(notifId, user.id);
  },

  async markAllRead() {
    await simulateLatency(100, 200);
    const user = mockStore.getSessionUser();
    if (!user) return false;
    return mockStore.markAllNotificationsRead(user.id);
  }
};

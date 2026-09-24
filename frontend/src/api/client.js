import * as mockStore from './mockStore';

const API_BASE = '/api';

const TOKEN_KEY = 'lf_token';

const getToken = () => {
  return sessionStorage.getItem(TOKEN_KEY);
};

const setToken = (token) => {
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(TOKEN_KEY);
  }
};

const clearToken = () => {
  sessionStorage.removeItem(TOKEN_KEY);
};

// Generic authenticated fetch wrapper with JSON error handling
const fetchApi = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${res.status}`;
    const err = new Error(errorMsg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
};

export const api = {
  // Auth endpoints
  async register(formData) {
    try {
      const res = await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setToken(res.token);
      mockStore.setSessionUser(res.user);
      return res;
    } catch (err) {
      if (err.message && err.message.includes('Failed to fetch')) {
        const newUser = mockStore.registerNewUser(formData);
        mockStore.setSessionUser(newUser);
        return { user: newUser, token: `mock_jwt_${newUser.id}` };
      }
      throw err;
    }
  },

  async login(email, regNumber) {
    try {
      const res = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, regNumber })
      });
      setToken(res.token);
      mockStore.setSessionUser(res.user);
      return res;
    } catch (err) {
      if (err.message && err.message.includes('Failed to fetch')) {
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
      }
      throw err;
    }
  },

  async me() {
    try {
      const token = getToken();
      if (!token) {
        const mockUser = mockStore.getSessionUser();
        return mockUser || null;
      }
      const user = await fetchApi('/auth/me');
      mockStore.setSessionUser(user);
      return user;
    } catch (err) {
      clearToken();
      mockStore.clearSessionUser();
      return null;
    }
  },

  async logout() {
    try {
      await fetchApi('/auth/logout', { method: 'POST' });
    } catch {}
    clearToken();
    mockStore.clearSessionUser();
    return { success: true };
  },

  async resetDemo() {
    try {
      await fetchApi('/auth/reset-demo', { method: 'POST' });
    } catch {}
    clearToken();
    mockStore.initializeMockStore(true);
    return { success: true };
  },

  // Lost posts
  async createLost(postData) {
    try {
      return await fetchApi('/lost', {
        method: 'POST',
        body: JSON.stringify(postData)
      });
    } catch (err) {
      if (err.message && err.message.includes('Failed to fetch')) {
        const user = mockStore.getSessionUser();
        return mockStore.addLostPost(postData, user);
      }
      throw err;
    }
  },

  async getMyLost() {
    try {
      return await fetchApi('/lost/my');
    } catch (err) {
      if (err.message && err.message.includes('Failed to fetch')) {
        const user = mockStore.getSessionUser();
        if (!user) return [];
        const { lost } = mockStore.getUserPosts(user.id);
        return lost;
      }
      throw err;
    }
  },

  // Found posts
  async createFound(postData) {
    try {
      return await fetchApi('/found', {
        method: 'POST',
        body: JSON.stringify(postData)
      });
    } catch (err) {
      if (err.message && err.message.includes('Failed to fetch')) {
        const user = mockStore.getSessionUser();
        return mockStore.addFoundPost(postData, user);
      }
      throw err;
    }
  },

  async getMyFound() {
    try {
      return await fetchApi('/found/my');
    } catch (err) {
      if (err.message && err.message.includes('Failed to fetch')) {
        const user = mockStore.getSessionUser();
        if (!user) return [];
        const { found } = mockStore.getUserPosts(user.id);
        return found;
      }
      throw err;
    }
  },

  // Matches
  async previewMatches(postData) {
    try {
      return await fetchApi('/matches/preview', {
        method: 'POST',
        body: JSON.stringify(postData)
      });
    } catch (err) {
      const user = mockStore.getSessionUser();
      return mockStore.previewMatches(postData, user?.id);
    }
  },

  async getMyMatches() {
    try {
      return await fetchApi('/matches/my');
    } catch (err) {
      if (err.message && err.message.includes('Failed to fetch')) {
        const user = mockStore.getSessionUser();
        if (!user) return [];
        return mockStore.getMyMatches(user.id);
      }
      throw err;
    }
  },

  // Match detail (Strictly WITHOUT contact info)
  async getMatch(matchId) {
    try {
      return await fetchApi(`/matches/${matchId}`);
    } catch (err) {
      if (err.message && err.message.includes('Failed to fetch')) {
        const user = mockStore.getSessionUser();
        return mockStore.getMatchDetail(matchId, user?.id);
      }
      throw err;
    }
  },

  // Submit hidden question answer
  async submitAnswer(matchId, choice) {
    try {
      return await fetchApi(`/matches/${matchId}/answer`, {
        method: 'POST',
        body: JSON.stringify({ answer: choice })
      });
    } catch (err) {
      if (err.message && err.message.includes('Failed to fetch')) {
        const user = mockStore.getSessionUser();
        return mockStore.submitHiddenQuestionAnswer(matchId, choice, user?.id);
      }
      throw err;
    }
  },

  // Get contact ONLY when verified
  async getContact(matchId) {
    try {
      return await fetchApi(`/matches/${matchId}/contact`);
    } catch (err) {
      if (err.message && err.message.includes('Failed to fetch')) {
        const user = mockStore.getSessionUser();
        return mockStore.getVerifiedContact(matchId, user?.id);
      }
      throw err;
    }
  },

  // Confirm / Reject match
  async confirmMatch(matchId) {
    try {
      return await fetchApi(`/matches/${matchId}/confirm`, { method: 'POST' });
    } catch (err) {
      if (err.message && err.message.includes('Failed to fetch')) {
        const user = mockStore.getSessionUser();
        return mockStore.confirmMatchClaim(matchId, user?.id);
      }
      throw err;
    }
  },

  async rejectMatch(matchId) {
    try {
      return await fetchApi(`/matches/${matchId}/reject`, { method: 'POST' });
    } catch (err) {
      if (err.message && err.message.includes('Failed to fetch')) {
        const user = mockStore.getSessionUser();
        return mockStore.rejectMatchClaim(matchId, user?.id);
      }
      throw err;
    }
  },

  // Lifecycle
  async markReturned(postId, postType) {
    try {
      return await fetchApi(`/${postType}/${postId}/returned`, { method: 'PATCH' });
    } catch (err) {
      if (err.message && err.message.includes('Failed to fetch')) {
        const user = mockStore.getSessionUser();
        return mockStore.markPostReturned(postId, postType, user?.id);
      }
      throw err;
    }
  },

  async withdrawPost(postId, postType) {
    try {
      return await fetchApi(`/${postType}/${postId}/withdraw`, { method: 'PATCH' });
    } catch (err) {
      if (err.message && err.message.includes('Failed to fetch')) {
        const user = mockStore.getSessionUser();
        return mockStore.withdrawPost(postId, postType, user?.id);
      }
      throw err;
    }
  },

  async reportUser(postId, reason) {
    try {
      return await fetchApi('/reports', {
        method: 'POST',
        body: JSON.stringify({ postId, reason })
      });
    } catch (err) {
      if (err.message && err.message.includes('Failed to fetch')) {
        const user = mockStore.getSessionUser();
        return mockStore.reportUserDispute(postId, reason, user?.id);
      }
      throw err;
    }
  },

  // Notifications
  async getNotifications() {
    try {
      return await fetchApi('/notifications');
    } catch (err) {
      if (err.message && err.message.includes('Failed to fetch')) {
        const user = mockStore.getSessionUser();
        if (!user) return [];
        return mockStore.getUserNotifications(user.id);
      }
      return [];
    }
  },

  async markRead(notifId) {
    try {
      await fetchApi(`/notifications/${notifId}/read`, { method: 'PATCH' });
      return true;
    } catch (err) {
      if (err.message && err.message.includes('Failed to fetch')) {
        const user = mockStore.getSessionUser();
        return mockStore.markNotificationRead(notifId, user?.id);
      }
      return false;
    }
  },

  async markAllRead() {
    try {
      await fetchApi('/notifications/read-all', { method: 'PATCH' });
      return true;
    } catch (err) {
      if (err.message && err.message.includes('Failed to fetch')) {
        const user = mockStore.getSessionUser();
        return mockStore.markAllNotificationsRead(user?.id);
      }
      return false;
    }
  },

  // Upload photo
  async uploadPhoto(file) {
    const token = getToken();
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to upload image.');
    }

    return await res.json();
  }
};

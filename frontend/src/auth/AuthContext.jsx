import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check existing session on mount
    const checkSession = async () => {
      try {
        const currentUser = await api.me();
        setUser(currentUser);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email, regNumber) => {
    try {
      const response = await api.login(email, regNumber);
      setUser(response.user);
      toast.success(`Welcome back, ${response.user.name.split(' ')[0]}!`);
      return response.user;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const register = async (formData) => {
    try {
      const response = await api.register(formData);
      setUser(response.user);
      toast.success('Registration successful! Welcome to Campus Lost & Found.');
      return response.user;
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
      toast.success('Logged out successfully');
    } catch {
      setUser(null);
    }
  };

  const resetDemoData = async () => {
    try {
      await api.resetDemo();
      setUser(null);
      toast.success('Demo data restored to default seed state.');
      window.location.href = '/login';
    } catch (err) {
      toast.error('Failed to reset demo data');
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    resetDemoData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from '../utils/toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      setUser(response.data.user);
      toast.success(response.data.message || 'Login successful!');
      return response.data.user;
    } catch (err) {
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role) => {
    setLoading(true);
    try {
      // Create user account
      await api.post('/auth/register', { name, email, password, role });
      // Login automatically to establish HttpOnly cookie
      const loginRes = await api.post('/auth/login', { email, password });
      setUser(loginRes.data.user);
      toast.success('Registration successful!');
      return loginRes.data.user;
    } catch (err) {
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
      setUser(null);
      toast.success('Logged out successfully.');
    } catch (err) {
      toast.error('Logout failed.');
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (current_password, new_password) => {
    try {
      const response = await api.put('/auth/change-password', {
        current_password,
        new_password,
      });
      toast.success(response.data.message || 'Password changed successfully!');
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteAccount = async () => {
    try {
      const response = await api.delete('/auth/delete-account');
      setUser(null);
      toast.success(response.data.message || 'Account deleted successfully.');
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    changePassword,
    deleteAccount,
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

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';
import { convertLength } from '@mui/material/styles/cssUtils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          api.defaults.headers.common['Authorization'] = `Token ${token}`;
          const response = await api.get('/profile/');
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const login = async (credentials) => {
    // console.log('credentials', credentials)
    try {
      const response = await api.post('/login/', credentials);
      const { token } = response.data;
      
      // Store token and role
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', credentials.role);
      api.defaults.headers.common['Authorization'] = `Token ${token}`;
      
      // Fetch user profile
      const profileResponse = await api.get('/profile/');
      const userData = profileResponse.data;
      setUser(userData);
      return userData;
    } catch (error) {
      throw error.response?.data?.error || 'Login failed';
    }
  };

  const logout = async () => {
    try {
      // First, call the backend logout endpoint
      await api.post('/logout/');
    } catch (error) {
      console.error('Backend logout error:', error);
      // Continue with cleanup even if backend fails
    } finally {
      // Clean up all auth-related storage
      localStorage.clear();  // Clear all localStorage items
      
      // Clear specific auth items if you prefer targeted cleanup
      // localStorage.removeItem('token');
      // localStorage.removeItem('user');
      // localStorage.removeItem('userRole');
      
      // Reset API headers
      delete api.defaults.headers.common['Authorization'];
      
      // Reset auth context state
      setUser(null);
      
      // Force a clean reload to clear any in-memory state
      window.location.replace('/');  // Using replace instead of href prevents back-button from accessing protected routes
    }
  };

  const value = {
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Configure axios defaults
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle token refresh on 401 responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken
          });
          const { token } = response.data;
          localStorage.setItem('authToken', token);
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');

    const initializeAuth = async () => {
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          // Set user from local storage initially
          setUser(parsedUser);
          setIsSignedIn(true);
          
          // Refresh user data from server to get latest permissions
          const response = await api.get('/auth/me');
          const updatedUser = response.data.data.user;
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
        } catch (error) {
          console.error('Error initializing user data:', error);
          // Clear invalid data on error
          localStorage.removeItem('user');
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setIsLoaded(true);
    };
    
    initializeAuth();
  }, []);

  const signIn = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, refreshToken, data } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      setIsSignedIn(true);
      return { success: true, user: data.user };
    } catch (error) {
      if (error.response?.status === 403 && error.response?.data?.data?.userId) {
        return {
          success: false,
          needsVerification: true,
          userId: error.response.data.data.userId,
          error: error.response.data.message
        };
      }
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData) => {
    try {
      console.log('Signing up with data:', userData);
      const response = await api.post('/auth/register', userData);
      console.log('Signup response:', response.data);
      return {
        success: true,
        message: response.data.message,
        userId: response.data.data.userId
      };
    } catch (error) {
      console.error('Signup error:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const verifyOTP = async (userId, otp) => {
    setIsLoading(true);
    try {
      console.log('Verifying OTP:', { userId, otp });
      const response = await api.post('/auth/verify-otp', { userId, otp });
      console.log('OTP verification response:', response.data);
      const { token, refreshToken, data } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      setIsSignedIn(true);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('OTP verification error:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || 'OTP verification failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsSignedIn(false);
    window.location.href = '/';
  };

  const googleSignIn = async (code) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/google', { code });
      if (response.data.status === 'account-exists') {
        return {
          success: false,
          error: 'Account exists with different login method',
          data: response.data.data
        };
      }
      const { token, refreshToken, data } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setIsSignedIn(true);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Google sign-in failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Password reset failed'
      };
    }
  };
  
  const resetPassword = async (token, password) => {
    try {
      const response = await api.patch(`/auth/reset-password/${token}`, { password });
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Password reset failed'
      };
    }
  };
  
  const linkGoogleAccount = async (code) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/link-google', { code });
      return { success: true, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to link Google account'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return { success: false, error: 'No token found' };
      
      const response = await api.get('/auth/me');
      const updatedUser = response.data.data.user;
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Refresh user error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to refresh user data'
      };
    }
  };
  
  const value = {
    user,
    isLoaded,
    isSignedIn,
    isLoading,
    signIn,
    signUp,
    verifyOTP,
    signOut,
    googleSignIn,
    forgotPassword,
    resetPassword,
    linkGoogleAccount,
    refreshUser,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
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

export const useUser = () => {
  const { user, isLoaded, isSignedIn } = useAuth();
  return {
    user: user ? {
      id: user._id,
      emailAddresses: [{ emailAddress: user.email }],
      firstName: user.fullName?.split(' ')[0] || '',
      lastName: user.fullName?.split(' ').slice(1).join(' ') || '',
      imageUrl: user.imageUrl || '',
      ...user
    } : null,
    isLoaded,
    isSignedIn
  };
};

export default api;
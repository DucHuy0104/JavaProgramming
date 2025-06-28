import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra user đã đăng nhập chưa khi app load
    const currentUser = authAPI.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const { user, redirectUrl } = await authAPI.login(credentials);
      setUser(user);

      // Xác định redirect URL dựa trên role
      const finalRedirectUrl = redirectUrl || getRedirectPathByRole(user.role);

      return { success: true, redirectUrl: finalRedirectUrl };
    } catch (error) {
      return { success: false, message: error.message || 'Đăng nhập thất bại' };
    }
  };

  // Helper function để xác định trang redirect dựa trên role
  const getRedirectPathByRole = (role) => {
    switch (role) {
      case 'ADMIN':
      case 'MANAGER':
      case 'STAFF':
        return '/admin';
      case 'CUSTOMER':
        return '/home';
      default:
        return '/home';
    }
  };

  const register = async (userData) => {
    try {
      await authAPI.register(userData);
      return { success: true, message: 'Đăng ký thành công!' };
    } catch (error) {
      return { success: false, message: error.message || 'Đăng ký thất bại' };
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    // Redirect to home page after logout
    window.location.href = '/';
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

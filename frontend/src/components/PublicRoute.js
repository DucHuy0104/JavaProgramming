import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Hiển thị loading khi đang kiểm tra authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Nếu đã đăng nhập, chuyển về trang phù hợp với role
  if (isAuthenticated && user) {
    const redirectPath = getRedirectPathByRole(user.role);
    return <Navigate to={redirectPath} replace />;
  }

  // Nếu chưa đăng nhập, hiển thị trang login/register
  return children;
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

export default PublicRoute;

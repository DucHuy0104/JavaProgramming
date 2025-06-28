import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Hiển thị loading khi đang kiểm tra authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Nếu chưa đăng nhập, chuyển đến trang login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu có yêu cầu role cụ thể, kiểm tra role của user
  if (requiredRoles.length > 0 && !requiredRoles.includes(user?.role)) {
    // Nếu không có quyền, chuyển về trang phù hợp với role
    const redirectPath = getRedirectPathByRole(user?.role);
    return <Navigate to={redirectPath} replace />;
  }

  // Nếu đã đăng nhập và có quyền, hiển thị component
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

export default ProtectedRoute;

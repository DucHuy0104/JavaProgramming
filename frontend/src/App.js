import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Auth Context
import { AuthProvider } from './contexts/AuthContext';

// Route Protection Components
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Auth Components
import Login from './components/Login';
import Register from './components/Register';
import BlogList from './components/BlogList';
import Profile from './components/Profile';
import Orders from './components/Orders';
import ForgotPassword from './components/ForgotPassword';

import Results from './components/Results';


// Components for user interface
import Header from './component/header';
import Footer from './component/footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Introduce from './pages/Introduce';

// Components for admin interface
import LayoutAdmin from './component/Layout(Admin)';
import DashboardAdmin from './pages/Dashboard(Admin)';
import OrdersAdmin from './pages/Orders(Admin)';
import ServicesAdmin from './pages/Services(Admin)';
import CustomersAdmin from './pages/Customers(Admin)';
import ReportsAdmin from './pages/Reports(Admin)';
import FeedbackAdmin from './pages/Feedback(Admin)';
import BlogAdmin from './pages/Blog(Admin)';
import StaffAdmin from './pages/Staff(Admin)';
import SettingsAdmin from './pages/Settings(Admin)';

// Layout component for public pages
const PublicLayout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        {/* Auth routes - chỉ cho phép truy cập khi chưa đăng nhập */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/results" element={<Results />} />
        
        {/* Blog routes */}
        <Route path="/blogs" element={<PublicLayout><BlogList /></PublicLayout>} />

        {/* User routes - cần đăng nhập */}
        <Route path="/profile" element={
          <ProtectedRoute requiredRoles={['CUSTOMER']}>
            <PublicLayout><Profile /></PublicLayout>
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute requiredRoles={['CUSTOMER']}>
            <PublicLayout><Orders /></PublicLayout>
          </ProtectedRoute>
        } />

        {/* Public (user) routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/home" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/introduce" element={<PublicLayout><Introduce /></PublicLayout>} />
        <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

        {/* Admin routes - cần đăng nhập và có role ADMIN/MANAGER/STAFF */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRoles={['ADMIN', 'MANAGER', 'STAFF']}>
            <LayoutAdmin />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardAdmin />} />
          <Route path="orders" element={<OrdersAdmin />} />
          <Route path="services" element={<ServicesAdmin />} />
          <Route path="customers" element={<CustomersAdmin />} />
          <Route path="reports" element={<ReportsAdmin />} />
          <Route path="feedback" element={<FeedbackAdmin />} />
          <Route path="blog" element={<BlogAdmin />} />
          <Route path="staff" element={<StaffAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={
          <PublicLayout>
            <div className="container mt-5">
              <h1>404 - Page Not Found</h1>
              <p>The page you are looking for does not exist.</p>
            </div>
          </PublicLayout>
        } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

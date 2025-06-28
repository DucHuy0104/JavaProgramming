import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Nav, Dropdown, Badge } from 'react-bootstrap';
import { FaUser, FaSignOutAlt, FaCog, FaHome } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar(Admin)';
import '../admin.css';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      logout();
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'ADMIN': return 'danger';
      case 'MANAGER': return 'warning';
      case 'STAFF': return 'primary';
      default: return 'secondary';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'ADMIN': return 'Admin';
      case 'MANAGER': return 'Quản lý';
      case 'STAFF': return 'Nhân viên';
      default: return role;
    }
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <div className="flex-grow-1 bg-light d-flex flex-column" style={{ marginLeft: '250px' }}>
          {/* Header với thông tin user và nút đăng xuất */}
          <Navbar bg="white" className="border-bottom px-4 py-3" style={{ marginLeft: '0' }}>

            <Nav className="ms-auto">
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="outline-primary"
                  id="user-dropdown"
                  className="d-flex align-items-center"
                >
                  <FaUser className="me-2" />
                  <span className="me-2">{user?.fullName || 'Admin'}</span>
                  <Badge bg={getRoleBadgeVariant(user?.role)} className="ms-1">
                    {getRoleText(user?.role)}
                  </Badge>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item disabled>
                    <div className="text-muted small">
                      <div><strong>{user?.fullName}</strong></div>
                      <div>{user?.email}</div>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => navigate('/admin/settings')}>
                    <FaCog className="me-2" />
                    Cài đặt
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => navigate('/home')}>
                    <FaHome className="me-2" />
                    Quay về trang chủ
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    <FaSignOutAlt className="me-2" />
                    Đăng xuất
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar>

          {/* Main content */}
          <main className="p-4 flex-grow-1">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Footer - spans full width */}
      <footer className="bg-dark text-white text-center p-3 mt-auto" style={{
        width: '100%',
        marginLeft: '0',
        position: 'relative',
        zIndex: 1
      }}>
        <div className="container-fluid" style={{ paddingLeft: '250px' }}>
          <span>© 2024 Bloodline DNA Testing Service Admin Panel</span>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 
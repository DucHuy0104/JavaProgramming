import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '', label: 'Dashboard' },
    { path: 'services', label: 'Dịch vụ' },
    { path: 'orders', label: 'Đơn xét nghiệm' },
    { path: 'results', label: 'Kết quả' },
    { path: 'customers', label: 'Khách hàng' },
    { path: 'staff', label: 'Nhân viên' },
    { path: 'blog', label: 'Blog' },
    { path: 'feedback', label: 'Feedback' },
    { path: 'reports', label: 'Báo cáo' }
  ];

  return (
    <Nav className="flex-column text-white position-fixed" style={{
      width: '250px',
      height: '100vh',
      backgroundColor: '#2563eb',
      zIndex: 1000
    }}>
      <div className="p-3">
        <h4 className="text-white mb-4 border-bottom pb-3">
          <strong>Bloodline DNA</strong>
          <div className="small text-light">Admin Panel</div>
        </h4>
        {menuItems.map((item) => (
          <Nav.Link
            key={item.path}
            as={Link}
            to={`/admin/${item.path}`}
            className={`text-white mb-2 p-3 rounded ${
              location.pathname === (item.path ? `/admin/${item.path}` : '/admin')
                ? 'active bg-primary shadow'
                : 'hover-bg-primary'
            }`}
            style={{
              transition: 'all 0.3s ease',
              textDecoration: 'none'
            }}
          >
            {item.label}
          </Nav.Link>
        ))}
      </div>
    </Nav>
  );
};

export default Sidebar; 
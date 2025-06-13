import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar(Admin)';
import '../admin.css';

const Layout = () => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <div className="flex-grow-1 bg-light d-flex flex-column" style={{ marginBottom: '56px' }}>
        <main className="p-4 flex-grow-1">
          <Outlet />
        </main>
      </div>
      <footer className="bg-dark text-white text-left p-3" style={{ position: 'fixed', bottom: 0, width: '100%', paddingLeft: '250px', left: '0.8cm' }}>
        Bloodline DNA Testing Service Admin Panel
      </footer>
    </div>
  );
};

export default Layout; 
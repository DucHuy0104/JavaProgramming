import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { Link, useLocation } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaClipboardList } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import './header.css';

function Header() {
    const location = useLocation();
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <div className="header">
            {/* Main Header */}
            <div className="main-header">
                <Container>
                    <div className="header-container">
                        <div className="header-logo">
                            <Link to="/" className="logo-link">
                                <img src={require('../assets/image.png')} alt="logo" className="logo-image" />
                                <div className="logo-text">
                                    <span className="logo-title">DNA Testing</span>
                                    <span className="logo-subtitle">Chính xác 99.9%</span>
                                </div>
                            </Link>
                        </div>

                        <div className="header-menu">
                            <Navbar bg="white" expand="lg" className="main-navbar">
                                <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggler" />
                                <Navbar.Collapse id="basic-navbar-nav">
                                    <Nav className="me-auto main-nav">
                                        <Nav.Link 
                                            as={Link} 
                                            to="/home" 
                                            className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`}
                                        >
                                            Trang Chủ
                                        </Nav.Link>

                                        <Nav.Link
                                            as={Link}
                                            to="/introduce"
                                            className={`nav-link ${location.pathname === '/introduce' ? 'active' : ''}`}
                                        >
                                            Giới thiệu
                                        </Nav.Link>

                                        <Nav.Link 
                                            as={Link} 
                                            to="/services" 
                                            className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`}
                                        >
                                            Dịch vụ
                                        </Nav.Link>


                                        
                                        <Nav.Link
                                            as={Link}
                                            to="/blogs"
                                            className={`nav-link ${location.pathname === '/blogs' ? 'active' : ''}`}
                                        >
                                            Tin tức
                                        </Nav.Link>

                                        <Nav.Link
                                            as={Link}
                                            to="/contact"
                                            className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
                                        >
                                            Liên hệ
                                        </Nav.Link>
                                    </Nav>
                                </Navbar.Collapse>
                            </Navbar>
                        </div>

                        {/* Auth Section - Right Side */}
                        <div className="header-auth">
                            {isAuthenticated ? (
                                <NavDropdown
                                    title={
                                        <div className="user-avatar">
                                            <div className="avatar-circle">
                                                {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                            </div>
                                        </div>
                                    }
                                    id="user-dropdown"
                                    className="user-dropdown"
                                >
                                    <NavDropdown.Item className="user-info">
                                        <div className="user-details">
                                            <strong>{user?.fullName}</strong>
                                            <small>{user?.email}</small>
                                        </div>
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item as={Link} to="/profile">
                                        <FaUser className="dropdown-icon" /> Thông tin tài khoản
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/orders">
                                        <FaClipboardList className="dropdown-icon" /> Đơn xét nghiệm
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={logout}>
                                        <FaSignOutAlt className="dropdown-icon" /> Đăng xuất
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <Nav.Link
                                    as={Link}
                                    to="/login"
                                    className={`nav-link auth-link ${location.pathname === '/login' ? 'active' : ''}`}
                                >
                                    Đăng nhập
                                </Nav.Link>
                            )}
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    );
}

export default Header;

import './header.css';
import Navbar from 'react-bootstrap/Navbar'; 
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { Link, useLocation } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaUser, FaCalendarAlt } from 'react-icons/fa';

function Header() {
    const location = useLocation();

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
                                            to="/" 
                                            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                                        >
                                            Home
                                        </Nav.Link>
                                        
                                        <NavDropdown 
                                            title="Services" 
                                            id="basic-nav-paternity-1"
                                            className={`nav-dropdown ${location.pathname === '/services' ? 'active' : ''}`}
                                        >
                                            <NavDropdown.Item as={Link} to="/services">
                                                Đặt dịch vụ tự lấy mẫu tại nhà
                                            </NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/services">
                                                Đặt dịch vụ cơ sở tự thu mẫu tại nhà
                                            </NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/services">
                                                Đặt dịch vụ cơ sở tự thu máu tại cơ sở
                                            </NavDropdown.Item>
                                        </NavDropdown>

                                        <Nav.Link 
                                            as={Link} 
                                            to="/blog"
                                            className={`nav-link ${location.pathname === '/blog' ? 'active' : ''}`}
                                        >
                                            Blog
                                        </Nav.Link>

                                        <Nav.Link 
                                            as={Link} 
                                            to="/reliability"
                                            className={`nav-link ${location.pathname === '/reliability' ? 'active' : ''}`}
                                        >
                                            Reliability
                                        </Nav.Link>

                                        <Nav.Link 
                                            as={Link} 
                                            to="/contact"
                                            className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
                                        >
                                            Contact
                                        </Nav.Link>

                                        <Nav.Link 
                                            as={Link} 
                                            to="/login"
                                            className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                                        >
                                            Login
                                        </Nav.Link>

                                    </Nav>
                                </Navbar.Collapse>
                            </Navbar>
                        </div>
                    </div>
                </Container>
            </div>

            <style jsx>{`
                .header {
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                
                .main-header {
                    background: white;
                    padding: 15px 0;
                }
                
                .header-container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                
                .header-logo {
                    flex-shrink: 0;
                }
                
                .logo-link {
                    display: flex;
                    align-items: center;
                    text-decoration: none;
                    color: #333;
                    transition: all 0.3s ease;
                }
                
                .logo-link:hover {
                    color: #007bff;
                    transform: scale(1.05);
                }
                
                .logo-image {
                    height: 50px;
                    width: auto;
                    margin-right: 10px;
                }
                
                .logo-text {
                    font-size: 24px;
                    font-weight: bold;
                    color: #007bff;
                }
                
                .header-menu {
                    flex-grow: 1;
                    margin-left: 30px;
                }
                
                .main-navbar {
                    padding: 0;
                }
                
                .navbar-nav .nav-link {
                    color: #333 !important;
                    font-weight: 500;
                    padding: 10px 15px !important;
                    margin: 0 5px;
                    border-radius: 5px;
                    transition: all 0.3s ease;
                }
                
                .navbar-nav .nav-link:hover,
                .navbar-nav .nav-link.active {
                    color: #007bff !important;
                    background-color: #f8f9fa;
                }
                
                .dropdown-menu {
                    border: none;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                    border-radius: 10px;
                }
                
                .dropdown-item {
                    padding: 10px 20px;
                    transition: all 0.3s ease;
                }
                
                .dropdown-item:hover {
                    background-color: #f8f9fa;
                    color: #007bff;
                }
                
                @media (max-width: 991px) {
                    .header-container {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    
                    .header-menu {
                        margin-left: 0;
                        margin-top: 15px;
                    }
                }
            `}</style>
        </div>
    );
}

export default Header;

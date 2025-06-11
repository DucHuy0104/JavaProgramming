import './footer.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaArrowUp } from 'react-icons/fa';

function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="footer">
            {/* Main Footer */}
            <div className="footer-main py-5">
                <Container>
                    <Row>
                        {/* Company Info */}
                        <Col lg={4} md={6} sm={12} className="mb-4">
                            <div className="footer-section">
                                <div className="footer-logo mb-3">
                                    <img src={require('../assets/image.png')} alt="logo" className="logo-image" />
                                    <span className="logo-text">DNA Testing</span>
                                </div>
                                <p className="company-description mb-3">
                                    Chúng tôi là đơn vị tiên phong trong lĩnh vực xét nghiệm DNA tại Việt Nam, 
                                    cung cấp các dịch vụ chính xác và đáng tin cậy nhất với độ chính xác 99.9%.
                                </p>
                                <div className="social-links">
                                    <a href="#" className="social-link">
                                        <FaFacebook />
                                    </a>
                                    <a href="#" className="social-link">
                                        <FaTwitter />
                                    </a>
                                    <a href="#" className="social-link">
                                        <FaInstagram />
                                    </a>
                                    <a href="#" className="social-link">
                                        <FaLinkedin />
                                    </a>
                                </div>
                            </div>
                        </Col>

                        {/* Quick Links */}
                        <Col lg={2} md={6} sm={12} className="mb-4">
                            <div className="footer-section">
                                <h5 className="footer-title mb-3">Liên kết nhanh</h5>
                                <ul className="footer-links">
                                    <li>
                                        <Link to="/">Trang chủ</Link>
                                    </li>
                                    <li>
                                        <Link to="/about">Về chúng tôi</Link>
                                    </li>
                                    <li>
                                        <Link to="/services">Dịch vụ</Link>
                                    </li>
                                    <li>
                                        <Link to="/contact">Liên hệ</Link>
                                    </li>
                                </ul>
                            </div>
                        </Col>

                        {/* Services */}
                        <Col lg={3} md={6} sm={12} className="mb-4">
                            <div className="footer-section">
                                <h5 className="footer-title mb-3">Dịch vụ</h5>
                                <ul className="footer-links">
                                    <li>
                                        <Link to="/services">Xét nghiệm ADN cha con</Link>
                                    </li>
                                    <li>
                                        <Link to="/services">Xét nghiệm di trú</Link>
                                    </li>
                                    <li>
                                        <Link to="/services">Xét nghiệm quan hệ huyết thống</Link>
                                    </li>
                                    <li>
                                        <Link to="/services">Xét nghiệm ADN trước sinh</Link>
                                    </li>
                                </ul>
                            </div>
                        </Col>

                        {/* Contact Info */}
                        <Col lg={3} md={6} sm={12} className="mb-4">
                            <div className="footer-section">
                                <h5 className="footer-title mb-3">Thông tin liên hệ</h5>
                                <div className="contact-info">
                                    <div className="contact-item">
                                        <FaPhone className="contact-icon" />
                                        <div>
                                            <p className="mb-1">1900-xxxx</p>
                                            <p className="mb-0">098-xxx-xxxx</p>
                                        </div>
                                    </div>
                                    <div className="contact-item">
                                        <FaEnvelope className="contact-icon" />
                                        <div>
                                            <p className="mb-1">info@dnatesting.vn</p>
                                            <p className="mb-0">support@dnatesting.vn</p>
                                        </div>
                                    </div>
                                    <div className="contact-item">
                                        <FaMapMarkerAlt className="contact-icon" />
                                        <div>
                                            <p className="mb-1">123 Đường ABC, Quận 1</p>
                                            <p className="mb-0">TP. Hồ Chí Minh, Việt Nam</p>
                                        </div>
                                    </div>
                                    <div className="contact-item">
                                        <FaClock className="contact-icon" />
                                        <div>
                                            <p className="mb-1">Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                                            <p className="mb-0">Thứ 7: 8:00 - 12:00</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Bottom Footer */}
            <div className="footer-bottom py-3">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6} md={6} sm={12} className="mb-2">
                            <p className="mb-0 text-center text-lg-start">
                                © 2024 DNA Testing. Tất cả quyền được bảo lưu.
                            </p>
                        </Col>
                        <Col lg={6} md={6} sm={12} className="text-center text-lg-end">
                            <button 
                                className="scroll-to-top-btn"
                                onClick={scrollToTop}
                                title="Lên đầu trang"
                            >
                                <FaArrowUp />
                            </button>
                        </Col>
                    </Row>
                </Container>
            </div>

            <style jsx>{`
                .footer {
                    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
                    color: white;
                }
                
                .footer-main {
                    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
                }
                
                .footer-bottom {
                    background: rgba(0, 0, 0, 0.2);
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }
                
                .footer-section {
                    height: 100%;
                }
                
                .footer-logo {
                    display: flex;
                    align-items: center;
                }
                
                .logo-image {
                    height: 40px;
                    width: auto;
                    margin-right: 10px;
                }
                
                .logo-text {
                    font-size: 20px;
                    font-weight: bold;
                    color: #3498db;
                }
                
                .company-description {
                    color: #bdc3c7;
                    line-height: 1.6;
                }
                
                .social-links {
                    display: flex;
                    gap: 15px;
                }
                
                .social-link {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    border-radius: 50%;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }
                
                .social-link:hover {
                    background: #3498db;
                    color: white;
                    transform: translateY(-3px);
                }
                
                .footer-title {
                    color: #3498db;
                    font-weight: bold;
                    margin-bottom: 20px;
                }
                
                .footer-links {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                
                .footer-links li {
                    margin-bottom: 10px;
                }
                
                .footer-links a {
                    color: #bdc3c7;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    display: block;
                    padding: 5px 0;
                }
                
                .footer-links a:hover {
                    color: #3498db;
                    transform: translateX(5px);
                }
                
                .contact-info {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                
                .contact-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                }
                
                .contact-icon {
                    color: #3498db;
                    margin-top: 3px;
                    flex-shrink: 0;
                }
                
                .contact-item p {
                    color: #bdc3c7;
                    margin: 0;
                    font-size: 14px;
                }
                
                .scroll-to-top-btn {
                    background: #3498db;
                    color: white;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .scroll-to-top-btn:hover {
                    background: #2980b9;
                    transform: translateY(-3px);
                }
                
                @media (max-width: 991px) {
                    .footer-section {
                        text-align: center;
                    }
                    
                    .contact-item {
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
    );
}

export default Footer; 
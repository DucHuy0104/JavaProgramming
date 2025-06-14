import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaArrowUp } from 'react-icons/fa';

function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="footer">
            <Container>
                <Row className="py-5">
                    {/* Company Info */}
                    <Col lg={4} md={6} sm={12} className="mb-4">
                        <div className="footer-section">
                            <div className="footer-logo mb-4">
                                <img src={require('../assets/image.png')} alt="logo" className="logo-image" />
                                    <span className="logo-title">DNA Testing</span>
                            </div>
                            <p className="company-description">
                                Đơn vị tiên phong trong lĩnh vực xét nghiệm DNA tại Việt Nam, 
                                cung cấp dịch vụ chính xác với độ tin cậy 99.9%.
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
                            </div>
                        </div>
                    </Col>

                    {/* Quick Links */}
                    <Col lg={4} md={6} sm={12} className="mb-4">
                        <div className="footer-section">
                            <h5 className="footer-title">Liên kết nhanh</h5>
                            <div className="footer-links-grid">
                                <Link to="/home">Trang chủ</Link>
                                <Link to="/services">Dịch vụ</Link>
                                <Link to="/blog">Blog</Link>
                                <Link to="/reliability">Độ tin cậy</Link>
                                <Link to="/login">Đăng nhập</Link>
                            </div>
                        </div>
                    </Col>

                    {/* Contact Info */}
                    <Col lg={4} md={12} sm={12} className="mb-4">
                        <div className="footer-section">
                            <h5 className="footer-title">Thông tin liên hệ</h5>
                            <div className="contact-info">
                                <div className="contact-item">
                                    <div className="contact-icon-wrapper">
                                        <FaPhone />
                                    </div>
                                    <div className="contact-details">
                                        <span className="contact-label">Điện thoại</span>
                                        <span className="contact-value">1900-xxxx | 098-xxx-xxxx</span>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <div className="contact-icon-wrapper">
                                        <FaEnvelope />
                                    </div>
                                    <div className="contact-details">
                                        <span className="contact-label">Email</span>
                                        <span className="contact-value">info@dnatesting.vn</span>
                                    </div>
                                </div>
                                <div className="contact-item">
                                    <div className="contact-icon-wrapper">
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div className="contact-details">
                                        <span className="contact-label">Địa chỉ</span>
                                        <span className="contact-value">123 Đường ABC, Quận 1, TP.HCM</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Bottom Footer */}
                <div className="footer-bottom">
                    <Row className="align-items-center">
                        <Col lg={6} md={6} sm={12} className="mb-3 mb-lg-0">
                            <p className="copyright">
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
                </div>
            </Container>

            <style jsx>{`
                .footer {
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                    color: #ffffff;
                    margin-top: 50px;
                    position: relative;
                    overflow: hidden;
                }

                .footer::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, #3498db, transparent);
                }

                .footer-section {
                    height: 100%;
                }

                .footer-logo {
                    display: flex;
                    align-items: center;
                }

                .logo-image {
                    height: 45px;
                    width: auto;
                    filter: brightness(1.1);
                }

                .company-description {
                    color: #b8c5d6;
                    line-height: 1.7;
                    font-size: 15px;
                    margin-bottom: 25px;
                    font-weight: 300;
                }

                .social-links {
                    display: flex;
                    gap: 15px;
                }

                .social-link {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 42px;
                    height: 42px;
                    background: linear-gradient(135deg, #3498db, #2980b9);
                    color: #ffffff;
                    border-radius: 12px;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    font-size: 18px;
                    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
                }

                .social-link:hover {
                    background: linear-gradient(135deg, #2980b9, #1f5f8b);
                    color: #ffffff;
                    transform: translateY(-3px);
                    box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
                }

                .footer-title {
                    color: #ffffff;
                    font-weight: 700;
                    margin-bottom: 25px;
                    font-size: 18px;
                    position: relative;
                    padding-bottom: 12px;
                }

                .footer-title::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 40px;
                    height: 3px;
                    background: linear-gradient(90deg, #3498db, #2980b9);
                    border-radius: 2px;
                }

                .footer-links-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                }

                .footer-links-grid a {
                    color: #b8c5d6;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    font-size: 15px;
                    padding: 8px 0;
                    position: relative;
                    font-weight: 400;
                }

                .footer-links-grid a::before {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 0;
                    height: 2px;
                    background: #3498db;
                    transition: width 0.3s ease;
                }

                .footer-links-grid a:hover {
                    color: #3498db;
                    text-decoration: none;
                    transform: translateX(5px);
                }

                .footer-links-grid a:hover::before {
                    width: 100%;
                }

                .contact-info {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .contact-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 15px;
                }

                .contact-icon-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #3498db, #2980b9);
                    color: #ffffff;
                    border-radius: 10px;
                    font-size: 16px;
                    flex-shrink: 0;
                    box-shadow: 0 3px 10px rgba(52, 152, 219, 0.3);
                }

                .contact-details {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .contact-label {
                    color: #ffffff;
                    font-size: 13px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .contact-value {
                    color: #b8c5d6;
                    font-size: 14px;
                    font-weight: 400;
                }

                .footer-bottom {
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding-top: 25px;
                    margin-top: 20px;
                }

                .copyright {
                    color: #b8c5d6;
                    margin: 0;
                    font-size: 14px;
                    font-weight: 400;
                }

                .scroll-to-top-btn {
                    background: linear-gradient(135deg, #3498db, #2980b9);
                    color: white;
                    border: none;
                    width: 45px;
                    height: 45px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 18px;
                    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
                }

                .scroll-to-top-btn:hover {
                    background: linear-gradient(135deg, #2980b9, #1f5f8b);
                    transform: translateY(-3px);
                    box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
                }

                /* Responsive Design */
                @media (max-width: 991px) {
                    .footer-section {
                        text-align: center;
                    }
                    
                    .contact-item {
                        justify-content: center;
                    }
                    
                    .footer-links-grid {
                        justify-content: center;
                        max-width: 300px;
                        margin: 0 auto;
                    }

                    .footer-title::after {
                        left: 50%;
                        transform: translateX(-50%);
                    }
                }

                @media (max-width: 768px) {
                    .footer {
                        padding: 30px 0;
                    }
                    
                    .footer-links-grid {
                        grid-template-columns: 1fr;
                        text-align: center;
                    }

                    .contact-item {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }
                }

                @media (max-width: 576px) {
                    .footer-title {
                        font-size: 16px;
                    }
                    
                    .company-description,
                    .footer-links-grid a,
                    .contact-value,
                    .copyright {
                        font-size: 14px;
                    }
                    
                    .social-link {
                        width: 38px;
                        height: 38px;
                        font-size: 16px;
                    }
                    
                    .scroll-to-top-btn {
                        width: 40px;
                        height: 40px;
                        font-size: 16px;
                    }

                    .contact-icon-wrapper {
                        width: 35px;
                        height: 35px;
                        font-size: 14px;
                    }
                }
            `}</style>
        </div>
    );
}

export default Footer; 
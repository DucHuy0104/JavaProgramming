import './footer.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

function Footer() {
    return (
        <div className="footer">
            <Container>
                <Row className="footer-content">
                    <Col lg={3} md={6} sm={12} className="footer-section">
                        <div className="footer-logo">
                            <img src={require('../assets/image.png')} alt="logo" />
                        </div>
                        <p className="footer-description">
                            Chuyên cung cấp các dịch vụ xét nghiệm DNA chính xác và đáng tin cậy. 
                            Chúng tôi cam kết mang đến kết quả nhanh chóng và bảo mật.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-link"><FaFacebook /></a>
                            <a href="#" className="social-link"><FaTwitter /></a>
                            <a href="#" className="social-link"><FaInstagram /></a>
                            <a href="#" className="social-link"><FaLinkedin /></a>
                        </div>
                    </Col>

                    <Col lg={3} md={6} sm={12} className="footer-section">
                        <h5 className="footer-title">Dịch vụ chính</h5>
                        <ul className="footer-links">
                            <li><a href="#paternity">Xét nghiệm ADN</a></li>
                            <li><a href="#immigration">Xét nghiệm di truyền </a></li>
                            <li><a href="#relationship">Xét nghiệm quan hệ huyết thống</a></li>
                            <li><a href="#ancestry">Xét nghiệm nguồn gốc</a></li>
                            <li><a href="#health">Xét nghiệm sức khỏe</a></li>
                        </ul>
                    </Col>

                    <Col lg={3} md={6} sm={12} className="footer-section">
                        <h5 className="footer-title">Hỗ trợ khách hàng</h5>
                        <ul className="footer-links">
                            <li><a href="#help">Hướng dẫn sử dụng</a></li>
                            <li><a href="#results">Tra cứu kết quả</a></li>
                            <li><a href="#faq">Câu hỏi thường gặp</a></li>
                            <li><a href="#privacy">Chính sách bảo mật</a></li>
                            <li><a href="#terms">Điều khoản sử dụng</a></li>
                        </ul>
                    </Col>

                    <Col lg={3} md={6} sm={12} className="footer-section">
                        <h5 className="footer-title">Liên hệ</h5>
                        <div className="contact-info">
                            <div className="contact-item">
                                <FaPhone className="contact-icon" />
                                <span>0971051152</span>
                            </div>
                            <div className="contact-item">
                                <FaEnvelope className="contact-icon" />
                                <span>khangtm5682@ut.edu.vn</span>
                            </div>
                            <div className="contact-item">
                                <FaMapMarkerAlt className="contact-icon" />
                                <span>02 Đường Võ Oanh, Phường 25, Bình Thạnh, Hồ Chí Minh</span>
                            </div>
                        </div>
                        <div className="business-hours">
                            <h6>Giờ làm việc:</h6>
                            <p>Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                            <p>Thứ 7: 8:00 - 12:00</p>
                            <p>Chủ nhật: Nghỉ</p>
                        </div>
                    </Col>
                </Row>

                <Row className="footer-bottom">
                    <Col>
                        <div className="footer-divider"></div>
                        <div className="footer-bottom-content">
                            <p>&copy; 2024 DNA Testing. Tất cả quyền được bảo lưu.</p>
                            <div className="footer-bottom-links">
                                <a href="#privacy">Bảo mật</a>
                                <a href="#terms">Điều khoản</a>
                                <a href="#sitemap">Sơ đồ website</a>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Footer; 
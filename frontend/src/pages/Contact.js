import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane, FaUser, FaComments } from 'react-icons/fa';

function Contact() {
    return (
        <div className="contact-page">
            {/* Hero Section */}
            <section className="contact-hero py-5">
                <div className="hero-background"></div>
                <Container>
                    <Row className="justify-content-center text-center">
                        <Col lg={10} md={12}>
                            <h1 className="display-2 fw-bold text-white mb-4">Liên hệ với chúng tôi</h1>
                            <p className="lead text-white-50 mb-0">
                                Hãy liên hệ ngay để được tư vấn miễn phí và đặt lịch xét nghiệm
                            </p>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="contact-content py-5">
                <Container>
                    <Row>
                        {/* Contact Form */}
                        <Col lg={8} md={12} className="mb-4">
                            <Card className="border-0 shadow-lg">
                                <Card.Body className="p-5">
                                    <div className="d-flex align-items-center mb-4">
                                        <div className="form-icon me-3">
                                            <FaComments size={40} color="#007bff" />
                                        </div>
                                        <div>
                                            <h3 className="fw-bold mb-1">Gửi tin nhắn cho chúng tôi</h3>
                                            <p className="text-muted mb-0">Chúng tôi sẽ phản hồi trong vòng 24 giờ</p>
                                        </div>
                                    </div>
                                    <Form>
                                        <Row>
                                            <Col md={6} sm={12} className="mb-3">
                                                <Form.Group controlId="formFirstName">
                                                    <Form.Label className="fw-bold">
                                                        <FaUser className="me-2" />
                                                        Họ và tên *
                                                    </Form.Label>
                                                    <Form.Control 
                                                        type="text" 
                                                        placeholder="Nhập họ và tên" 
                                                        required 
                                                        className="form-control-lg"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} sm={12} className="mb-3">
                                                <Form.Group controlId="formPhone">
                                                    <Form.Label className="fw-bold">
                                                        <FaPhone className="me-2" />
                                                        Số điện thoại *
                                                    </Form.Label>
                                                    <Form.Control 
                                                        type="tel" 
                                                        placeholder="Nhập số điện thoại" 
                                                        required 
                                                        className="form-control-lg"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6} sm={12} className="mb-3">
                                                <Form.Group controlId="formEmail">
                                                    <Form.Label className="fw-bold">
                                                        <FaEnvelope className="me-2" />
                                                        Email
                                                    </Form.Label>
                                                    <Form.Control 
                                                        type="email" 
                                                        placeholder="Nhập email" 
                                                        className="form-control-lg"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} sm={12} className="mb-3">
                                                <Form.Group controlId="formService">
                                                    <Form.Label className="fw-bold">Dịch vụ quan tâm</Form.Label>
                                                    <Form.Select className="form-select-lg">
                                                        <option>Chọn dịch vụ</option>
                                                        <option>Xét nghiệm ADN cha con</option>
                                                        <option>Xét nghiệm di trú</option>
                                                        <option>Xét nghiệm quan hệ huyết thống</option>
                                                        <option>Xét nghiệm ADN trước sinh</option>
                                                        <option>Xét nghiệm gia đình</option>
                                                        <option>Xét nghiệm pháp lý</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Form.Group controlId="formMessage" className="mb-4">
                                            <Form.Label className="fw-bold">Nội dung tin nhắn *</Form.Label>
                                            <Form.Control 
                                                as="textarea" 
                                                rows={5} 
                                                placeholder="Nhập nội dung tin nhắn" 
                                                required 
                                                className="form-control-lg"
                                            />
                                        </Form.Group>
                                        <Button variant="primary" type="submit" size="lg" className="px-5 py-3 fw-bold">
                                            <FaPaperPlane className="me-2" />
                                            Gửi tin nhắn
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Contact Information */}
                        <Col lg={4} md={12}>
                            <Card className="border-0 shadow-lg mb-4">
                                <Card.Body className="p-4">
                                    <h3 className="fw-bold mb-4">Thông tin liên hệ</h3>
                                    
                                    <div className="contact-item mb-4">
                                        <div className="d-flex align-items-start">
                                            <div className="contact-icon me-3">
                                                <FaPhone color="#007bff" size={24} />
                                            </div>
                                            <div>
                                                <h6 className="fw-bold mb-2">Điện thoại</h6>
                                                <p className="mb-1">1900-xxxx</p>
                                                <p className="mb-0">098-xxx-xxxx</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="contact-item mb-4">
                                        <div className="d-flex align-items-start">
                                            <div className="contact-icon me-3">
                                                <FaEnvelope color="#28a745" size={24} />
                                            </div>
                                            <div>
                                                <h6 className="fw-bold mb-2">Email</h6>
                                                <p className="mb-1">info@dnatesting.vn</p>
                                                <p className="mb-0">support@dnatesting.vn</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="contact-item mb-4">
                                        <div className="d-flex align-items-start">
                                            <div className="contact-icon me-3">
                                                <FaMapMarkerAlt color="#dc3545" size={24} />
                                            </div>
                                            <div>
                                                <h6 className="fw-bold mb-2">Địa chỉ</h6>
                                                <p className="mb-1">123 Đường ABC, Quận 1</p>
                                                <p className="mb-0">TP. Hồ Chí Minh, Việt Nam</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="contact-item">
                                        <div className="d-flex align-items-start">
                                            <div className="contact-icon me-3">
                                                <FaClock color="#ffc107" size={24} />
                                            </div>
                                            <div>
                                                <h6 className="fw-bold mb-2">Giờ làm việc</h6>
                                                <p className="mb-1">Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                                                <p className="mb-1">Thứ 7: 8:00 - 12:00</p>
                                                <p className="mb-0">Chủ nhật: Nghỉ</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>

                            {/* Emergency Contact */}
                            <Card className="border-0 shadow-lg emergency-card">
                                <Card.Body className="p-4 text-center">
                                    <h5 className="fw-bold mb-3">Liên hệ khẩn cấp</h5>
                                    <p className="mb-3">Cần tư vấn ngay? Gọi cho chúng tôi:</p>
                                    <Button variant="danger" size="lg" className="w-100 py-3 fw-bold">
                                        <FaPhone className="me-2" />
                                        1900-xxxx
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Map Section */}
            <section className="map-section py-5 bg-light">
                <Container>
                    <Row className="mb-4">
                        <Col lg={12} className="text-center">
                            <h2 className="display-4 fw-bold mb-3">Vị trí của chúng tôi</h2>
                            <p className="lead text-muted">Tìm đường đến trung tâm xét nghiệm DNA</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12}>
                            <Card className="border-0 shadow-lg">
                                <Card.Body className="p-0">
                                    <div className="map-placeholder">
                                        <div className="map-content">
                                            <FaMapMarkerAlt size={80} color="#6c757d" />
                                            <h4 className="mt-3 mb-2">Bản đồ sẽ được hiển thị tại đây</h4>
                                            <p className="text-muted">123 Đường ABC, Quận 1, TP. Hồ Chí Minh</p>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            <style jsx>{`
                .contact-page {
                    overflow-x: hidden;
                }
                
                .contact-hero {
                    position: relative;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 60vh;
                    display: flex;
                    align-items: center;
                }
                
                .hero-background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><polygon fill="rgba(255,255,255,0.1)" points="0,1000 1000,0 1000,1000"/></svg>');
                    background-size: cover;
                }
                
                .form-icon {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .contact-item {
                    padding: 15px 0;
                    border-bottom: 1px solid #eee;
                    transition: all 0.3s ease;
                }
                
                .contact-item:last-child {
                    border-bottom: none;
                }
                
                .contact-item:hover {
                    transform: translateX(10px);
                }
                
                .contact-icon {
                    width: 50px;
                    height: 50px;
                    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.3s ease;
                }
                
                .contact-item:hover .contact-icon {
                    transform: scale(1.1);
                }
                
                .emergency-card {
                    background: linear-gradient(135deg, #dc3545, #c82333);
                    color: white;
                }
                
                .map-placeholder {
                    height: 400px;
                    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 15px;
                }
                
                .map-content {
                    text-align: center;
                }
                
                .form-control-lg, .form-select-lg {
                    border-radius: 10px;
                    border: 2px solid #e9ecef;
                    transition: all 0.3s ease;
                }
                
                .form-control-lg:focus, .form-select-lg:focus {
                    border-color: #007bff;
                    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
                }
            `}</style>
        </div>
    );
}

export default Contact; 
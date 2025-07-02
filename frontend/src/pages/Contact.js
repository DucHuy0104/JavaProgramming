import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const FEEDBACK_API = "http://localhost:8081/api/feedback";

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [feedback, setFeedback] = useState({
        name: '',
        email: '',
        message: '',
        rating: '5',
    });
    const [feedbackSent, setFeedbackSent] = useState(false);
    const [feedbackList, setFeedbackList] = useState([]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý gửi form liên hệ
        console.log('Form submitted:', formData);
        alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        });
    };

    const handleFeedbackChange = (e) => {
        setFeedback({
            ...feedback,
            [e.target.name]: e.target.value
        });
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        const newFeedback = {
            ...feedback,
            rating: parseInt(feedback.rating),
        };
        try {
            const res = await fetch(FEEDBACK_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newFeedback),
            });
            if (res.ok) {
                setFeedbackSent(true);
                setFeedback({ name: '', email: '', message: '', rating: '5' });
                fetchFeedbackList();
                setTimeout(() => setFeedbackSent(false), 3000);
                alert("Feedback đã được gửi thành công! Feedback sẽ được hiển thị sau khi được duyệt.");
            } else {
                alert("Gửi feedback thất bại!");
            }
        } catch (err) {
            alert("Lỗi kết nối server!");
        }
    };

    const fetchFeedbackList = async () => {
        try {
            const res = await fetch(FEEDBACK_API);
            if (res.ok) {
                const data = await res.json();
                // Chỉ hiển thị feedback đã được duyệt
                const approvedFeedback = data.filter(fb => fb.status === 'approved');
                setFeedbackList(approvedFeedback);
            }
        } catch (err) {
            // Có thể log lỗi nếu cần
        }
    };

    useEffect(() => {
        fetchFeedbackList();
        const interval = setInterval(fetchFeedbackList, 10000); // 10 giây
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="contact-page">
            {/* Hero Section */}
            <div className="contact-hero">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8} className="text-center">
                            <h1 className="hero-title">Liên Hệ Với Chúng Tôi</h1>
                            <p className="hero-subtitle">
                                Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
                            </p>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Container className="py-5">
                <Row className="g-4">
                    {/* Contact Form */}
                    <Col lg={8}>
                        <Card className="contact-form-card">
                            <Card.Body className="p-4">
                                <h3 className="form-title mb-4">Gửi Tin Nhắn Cho Chúng Tôi</h3>
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Họ và tên *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="Nhập họ và tên"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Email *</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="Nhập email"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Số điện thoại</Form.Label>
                                                <Form.Control
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="Nhập số điện thoại"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Chủ đề *</Form.Label>
                                                <Form.Select
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">Chọn chủ đề</option>
                                                    <option value="dich-vu">Tư vấn dịch vụ</option>
                                                    <option value="dat-lich">Đặt lịch xét nghiệm</option>
                                                    <option value="ket-qua">Tra cứu kết quả</option>
                                                    <option value="thanh-toan">Thanh toán</option>
                                                    <option value="khac">Khác</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group className="mb-4">
                                        <Form.Label>Nội dung tin nhắn *</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={5}
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            placeholder="Nhập nội dung tin nhắn..."
                                        />
                                    </Form.Group>
                                    <Button 
                                        type="submit" 
                                        className="submit-btn"
                                        size="lg"
                                    >
                                        Gửi Tin Nhắn
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>

                        {/* Feedback Form dưới form liên hệ */}
                        <Card className="feedback-card mt-4 mb-4">
                            <Card.Body className="p-4">
                                <h3 className="form-title mb-4">Gửi Feedback của bạn</h3>
                                {feedbackSent && (
                                    <div className="alert alert-success" role="alert">
                                        Cảm ơn bạn đã gửi feedback!
                                    </div>
                                )}
                                <Form onSubmit={handleFeedbackSubmit}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Họ và tên *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="name"
                                                    value={feedback.name}
                                                    onChange={handleFeedbackChange}
                                                    required
                                                    placeholder="Nhập họ và tên"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Email *</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    value={feedback.email}
                                                    onChange={handleFeedbackChange}
                                                    required
                                                    placeholder="Nhập email"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nội dung feedback *</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            name="message"
                                            value={feedback.message}
                                            onChange={handleFeedbackChange}
                                            required
                                            placeholder="Nhập nội dung feedback..."
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-4">
                                        <Form.Label>Đánh giá *</Form.Label>
                                        <Form.Select
                                            name="rating"
                                            value={feedback.rating}
                                            onChange={handleFeedbackChange}
                                            required
                                        >
                                            <option value="5">5 sao - Tuyệt vời</option>
                                            <option value="4">4 sao - Tốt</option>
                                            <option value="3">3 sao - Bình thường</option>
                                            <option value="2">2 sao - Chưa tốt</option>
                                            <option value="1">1 sao - Rất tệ</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Button type="submit" className="submit-btn" size="lg">
                                        Gửi Feedback
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>

                        <div className="mt-4">
                            <h5 className="mb-3">Feedback đã gửi</h5>
                            {feedbackList.length === 0 && (
                                <div className="text-muted">Chưa có feedback nào.</div>
                            )}
                            {feedbackList.map((fb, idx) => (
                                <Card key={fb.id || idx} className="mb-3 shadow-sm border-0 bg-light">
                                    <Card.Body>
                                        <div className="mb-2">
                                            <strong>{fb.name}</strong> &lt;{fb.email}&gt;
                                        </div>
                                        <div className="mb-2"><strong>Đánh giá:</strong> {Array.from({length: parseInt(fb.rating)}, (_, i) => '★').join('')} {fb.rating}/5</div>
                                        <div className="mb-2"><strong>Nội dung:</strong> {fb.message}</div>
                                        <div className="text-muted" style={{fontSize: '0.9rem'}}>Gửi lúc: {fb.createdAt ? new Date(fb.createdAt).toLocaleString('vi-VN') : ''}</div>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    </Col>

                    {/* Contact Information */}
                    <Col lg={4}>
                        <div className="contact-info-sidebar">
                            {/* Company Info */}
                            <Card className="info-card mb-4">
                                <Card.Body className="p-4">
                                    <h4 className="info-title mb-4">Thông Tin Liên Hệ</h4>
                                    
                                    <div className="contact-item">
                                        <div className="contact-icon">
                                            <FaPhone />
                                        </div>
                                        <div className="contact-details">
                                            <h6>Điện thoại</h6>
                                            <p>1900-xxxx</p>
                                            <p>098-xxx-xxxx</p>
                                        </div>
                                    </div>

                                    <div className="contact-item">
                                        <div className="contact-icon">
                                            <FaEnvelope />
                                        </div>
                                        <div className="contact-details">
                                            <h6>Email</h6>
                                            <p>info@dnatesting.vn</p>
                                            <p>support@dnatesting.vn</p>
                                        </div>
                                    </div>

                                    <div className="contact-item">
                                        <div className="contact-icon">
                                            <FaMapMarkerAlt />
                                        </div>
                                        <div className="contact-details">
                                            <h6>Địa chỉ</h6>
                                            <p>123 Đường ABC, Quận 1</p>
                                            <p>TP. Hồ Chí Minh, Việt Nam</p>
                                        </div>
                                    </div>

                                    <div className="contact-item">
                                        <div className="contact-icon">
                                            <FaClock />
                                        </div>
                                        <div className="contact-details">
                                            <h6>Giờ làm việc</h6>
                                            <p>Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                                            <p>Thứ 7: 8:00 - 12:00</p>
                                            <p>Chủ nhật: Nghỉ</p>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>

                            {/* Social Media */}
                            <Card className="social-card">
                                <Card.Body className="p-4">
                                    <h4 className="info-title mb-4">Theo Dõi Chúng Tôi</h4>
                                    <div className="social-links">
                                        <a href="#" className="social-link facebook">
                                            <FaFacebook />
                                        </a>
                                        <a href="#" className="social-link twitter">
                                            <FaTwitter />
                                        </a>
                                        <a href="#" className="social-link instagram">
                                            <FaInstagram />
                                        </a>
                                        <a href="#" className="social-link linkedin">
                                            <FaLinkedin />
                                        </a>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>

                {/* Map Section */}
                <Row className="mt-5">
                    <Col>
                        <Card className="map-card">
                            <Card.Body className="p-0">
                                <div className="map-container">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.424098981303!2d106.6983153148008!3d10.776755992319!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f46f64b933f%3A0xf8a6e5b2a5a4f1f4!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgVGjDtG5nIHRpbiB2aWV0!5e0!3m2!1svi!2s!4v1234567890"
                                        width="100%"
                                        height="400"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="DNA Testing Location"
                                    ></iframe>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <style jsx>{`
                .contact-page {
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    min-height: 100vh;
                }

                .contact-hero {
                    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
                    color: white;
                    padding: 80px 0;
                    text-align: center;
                }

                .hero-title {
                    font-size: 3.5rem;
                    font-weight: 700;
                    margin-bottom: 20px;
                    background: linear-gradient(135deg, #3498db, #2980b9);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .hero-subtitle {
                    font-size: 1.2rem;
                    color: #b8c5d6;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .contact-form-card {
                    border: none;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    background: white;
                }

                .form-title {
                    color: #2c3e50;
                    font-weight: 700;
                    font-size: 2rem;
                }

                .submit-btn {
                    background: linear-gradient(135deg, #28a745, #20c997);
                    border: none;
                    border-radius: 50px;
                    padding: 12px 40px;
                    font-weight: 600;
                    font-size: 1.1rem;
                    transition: all 0.3s ease;
                }

                .submit-btn:hover {
                    background: linear-gradient(135deg, #20c997, #17a2b8);
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3);
                }

                .contact-info-sidebar {
                    position: sticky;
                    top: 100px;
                }

                .info-card, .social-card {
                    border: none;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    background: white;
                }

                .info-title {
                    color: #2c3e50;
                    font-weight: 700;
                    font-size: 1.5rem;
                }

                .contact-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 15px;
                    margin-bottom: 25px;
                }

                .contact-item:last-child {
                    margin-bottom: 0;
                }

                .contact-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 50px;
                    height: 50px;
                    background: linear-gradient(135deg, #3498db, #2980b9);
                    color: white;
                    border-radius: 12px;
                    font-size: 20px;
                    flex-shrink: 0;
                }

                .contact-details h6 {
                    color: #2c3e50;
                    font-weight: 600;
                    margin-bottom: 5px;
                    font-size: 1rem;
                }

                .contact-details p {
                    color: #6c757d;
                    margin-bottom: 2px;
                    font-size: 0.9rem;
                }

                .social-links {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                }

                .social-link {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 50px;
                    height: 50px;
                    border-radius: 12px;
                    color: white;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    font-size: 20px;
                }

                .social-link.facebook {
                    background: linear-gradient(135deg, #3b5998, #2d4373);
                }

                .social-link.twitter {
                    background: linear-gradient(135deg, #1da1f2, #0d8bd9);
                }

                .social-link.instagram {
                    background: linear-gradient(135deg, #e4405f, #c13584);
                }

                .social-link.linkedin {
                    background: linear-gradient(135deg, #0077b5, #005885);
                }

                .social-link:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
                }

                .map-card {
                    border: none;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                }

                .map-container {
                    position: relative;
                    width: 100%;
                    height: 400px;
                }

                .map-container iframe {
                    border-radius: 20px;
                }

                /* Form Styling */
                .form-control, .form-select {
                    border: 2px solid #e9ecef;
                    border-radius: 12px;
                    padding: 12px 16px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }

                .form-control:focus, .form-select:focus {
                    border-color: #3498db;
                    box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25);
                }

                .form-label {
                    font-weight: 600;
                    color: #2c3e50;
                    margin-bottom: 8px;
                }

                /* Responsive Design */
                @media (max-width: 991px) {
                    .contact-info-sidebar {
                        position: static;
                        margin-top: 30px;
                    }

                    .hero-title {
                        font-size: 2.5rem;
                    }

                    .form-title {
                        font-size: 1.5rem;
                    }
                }

                @media (max-width: 768px) {
                    .contact-hero {
                        padding: 60px 0;
                    }

                    .hero-title {
                        font-size: 2rem;
                    }

                    .hero-subtitle {
                        font-size: 1rem;
                    }

                    .contact-item {
                        flex-direction: column;
                        text-align: center;
                    }

                    .social-links {
                        flex-wrap: wrap;
                    }
                }

                @media (max-width: 576px) {
                    .hero-title {
                        font-size: 1.8rem;
                    }

                    .submit-btn {
                        width: 100%;
                    }
                }

                .feedback-card {
                    border: none;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    background: white;
                }
            `}</style>
        </div>
    );
}

export default Contact; 
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FaDna, FaShieldAlt, FaClock, FaUserCheck, FaFileAlt, FaGlobe } from 'react-icons/fa';

function Content() {
    return (
        <>
            <style>
                {`
                /* Hero Section */
                .hero-section {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: #ffffff;
                    padding: 80px 0;
                    min-height: 80vh;
                    display: flex;
                    align-items: center;
                }

                .hero-content {
                    padding-right: 30px;
                }

                .hero-title {
                    font-size: 3.5rem;
                    font-weight: 700;
                    margin-bottom: 20px;
                    line-height: 1.2;
                }

                .hero-description {
                    font-size: 1.2rem;
                    margin-bottom: 30px;
                    line-height: 1.6;
                    opacity: 0.9;
                }

                .hero-buttons {
                    margin-top: 30px;
                }

                .hero-image {
                    text-align: center;
                }

                .hero-image img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 10px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                }

                /* Services Section */
                .services-section {
                    padding: 80px 0;
                    background: #f8f9fa;
                }

                .section-header {
                    margin-bottom: 60px;
                }

                .section-title {
                    font-size: 2.5rem;
                    font-weight: 600;
                    color: #2c3e50;
                    margin-bottom: 20px;
                }

                .section-description {
                    font-size: 1.1rem;
                    color: #6c757d;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .service-card {
                    border: none;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    height: 100%;
                }

                .service-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                }

                .service-icon {
                    font-size: 3rem;
                    color: #3498db;
                    margin-bottom: 20px;
                }

                .service-card .card-title {
                    font-size: 1.3rem;
                    font-weight: 600;
                    color: #2c3e50;
                    margin-bottom: 15px;
                }

                .service-card .card-text {
                    color: #6c757d;
                    line-height: 1.6;
                    margin-bottom: 20px;
                }

                /* Features Section */
                .features-section {
                    padding: 80px 0;
                    background: #ffffff;
                }

                .features-title {
                    font-size: 2.5rem;
                    font-weight: 600;
                    color: #2c3e50;
                    margin-bottom: 40px;
                }

                .feature-item {
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 30px;
                }

                .feature-icon {
                    font-size: 2rem;
                    color: #3498db;
                    margin-right: 20px;
                    min-width: 40px;
                }

                .feature-text h5 {
                    font-size: 1.2rem;
                    font-weight: 600;
                    color: #2c3e50;
                    margin-bottom: 10px;
                }

                .feature-text p {
                    color: #6c757d;
                    line-height: 1.6;
                    margin: 0;
                }

                .features-image {
                    text-align: center;
                }

                .features-image img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 10px;
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
                }

                /* Process Section */
                .process-section {
                    padding: 80px 0;
                    background: #f8f9fa;
                }

                .process-step {
                    text-align: center;
                    padding: 30px 20px;
                    background: #ffffff;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    transition: transform 0.3s ease;
                    height: 100%;
                }

                .process-step:hover {
                    transform: translateY(-5px);
                }

                .step-number {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #3498db, #2980b9);
                    color: #ffffff;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin: 0 auto 20px;
                }

                .process-step h5 {
                    font-size: 1.2rem;
                    font-weight: 600;
                    color: #2c3e50;
                    margin-bottom: 15px;
                }

                .process-step p {
                    color: #6c757d;
                    line-height: 1.6;
                    margin: 0;
                }

                /* CTA Section */
                .cta-section {
                    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
                    color: #ffffff;
                    padding: 80px 0;
                    text-align: center;
                }

                .cta-title {
                    font-size: 2.5rem;
                    font-weight: 600;
                    margin-bottom: 20px;
                }

                .cta-description {
                    font-size: 1.2rem;
                    margin-bottom: 40px;
                    opacity: 0.9;
                    max-width: 600px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .cta-buttons {
                    margin-top: 30px;
                }

                /* Responsive Design */
                @media (max-width: 992px) {
                    .hero-title {
                        font-size: 2.5rem;
                    }
                    
                    .hero-content {
                        padding-right: 0;
                        margin-bottom: 40px;
                    }
                    
                    .features-content {
                        margin-bottom: 40px;
                    }
                    
                    .section-title,
                    .features-title,
                    .cta-title {
                        font-size: 2rem;
                    }
                }

                @media (max-width: 768px) {
                    .hero-section {
                        padding: 60px 0;
                        min-height: auto;
                    }
                    
                    .hero-title {
                        font-size: 2rem;
                    }
                    
                    .hero-description {
                        font-size: 1rem;
                    }
                    
                    .services-section,
                    .features-section,
                    .process-section,
                    .cta-section {
                        padding: 60px 0;
                    }
                    
                    .section-title,
                    .features-title,
                    .cta-title {
                        font-size: 1.8rem;
                    }
                    
                    .service-card,
                    .process-step {
                        margin-bottom: 30px;
                    }
                    
                    .feature-item {
                        margin-bottom: 25px;
                    }
                    
                    .hero-buttons .btn {
                        margin-bottom: 10px;
                        width: 100%;
                    }
                    
                    .cta-buttons .btn {
                        margin-bottom: 10px;
                        width: 100%;
                    }
                }

                @media (max-width: 576px) {
                    .hero-title {
                        font-size: 1.8rem;
                    }
                    
                    .hero-description {
                        font-size: 0.9rem;
                    }
                    
                    .section-title,
                    .features-title,
                    .cta-title {
                        font-size: 1.5rem;
                    }
                    
                    .section-description,
                    .cta-description {
                        font-size: 1rem;
                    }
                    
                    .service-icon {
                        font-size: 2.5rem;
                    }
                    
                    .feature-icon {
                        font-size: 1.5rem;
                    }
                    
                    .step-number {
                        width: 50px;
                        height: 50px;
                        font-size: 1.2rem;
                    }
                }
                `}
            </style>
            <div className="content">
                {/* Hero Section */}
                <section className="hero-section">
                    <Container>
                        <Row className="align-items-center">
                            <Col lg={6} md={12}>
                                <div className="hero-content">
                                    <h1 className="hero-title">
                                        Xét nghiệm DNA chính xác và đáng tin cậy
                                    </h1>
                                    <p className="hero-description">
                                        Chúng tôi cung cấp các dịch vụ xét nghiệm DNA hàng đầu với độ chính xác 99.9%. 
                                        Kết quả nhanh chóng, bảo mật tuyệt đối và được công nhận quốc tế.
                                    </p>
                                    <div className="hero-buttons">
                                        <Button variant="primary" size="lg" className="me-3">
                                            Đặt lịch xét nghiệm
                                        </Button>
                                        <Button variant="outline-primary" size="lg">
                                            Tìm hiểu thêm
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={6} md={12}>
                                <div className="hero-image">
                                    <img src={require('../assets/image.png')} alt="DNA Testing" />
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>

                {/* Services Section */}
                <section className="services-section">
                    <Container>
                        <div className="section-header text-center">
                            <h2 className="section-title">Dịch vụ của chúng tôi</h2>
                            <p className="section-description">
                                Cung cấp đầy đủ các loại xét nghiệm DNA phục vụ mọi nhu cầu
                            </p>
                        </div>
                        <Row>
                            <Col lg={4} md={6} sm={12} className="mb-4">
                                <Card className="service-card">
                                    <Card.Body className="text-center">
                                        <div className="service-icon">
                                            <FaDna />
                                        </div>
                                        <Card.Title>Xét nghiệm ADN</Card.Title>
                                        <Card.Text>
                                            Xác định mối quan hệ với độ chính xác 99.9%. 
                                            Kết quả có trong 3-5 ngày làm việc.
                                        </Card.Text>
                                        <Button variant="outline-primary">Chi tiết</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg={4} md={6} sm={12} className="mb-4">
                                <Card className="service-card">
                                    <Card.Body className="text-center">
                                        <div className="service-icon">
                                            <FaGlobe />
                                        </div>
                                        <Card.Title>Xét nghiệm di truyền</Card.Title>
                                        <Card.Text>
                                            Hỗ trợ thủ tục di truyền với chứng nhận DNA được công nhận quốc tế. 
                                            Tuân thủ các tiêu chuẩn pháp lý.
                                        </Card.Text>
                                        <Button variant="outline-primary">Chi tiết</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg={4} md={6} sm={12} className="mb-4">
                                <Card className="service-card">
                                    <Card.Body className="text-center">
                                        <div className="service-icon">
                                            <FaUserCheck />
                                        </div>
                                        <Card.Title>Xét nghiệm quan hệ huyết thống</Card.Title>
                                        <Card.Text>
                                            Xác định các mối quan hệ huyết thống khác như anh chị em, 
                                            ông bà, chú bác.
                                        </Card.Text>
                                        <Button variant="outline-primary">Chi tiết</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </section>

                {/* Features Section */}
                <section className="features-section">
                    <Container>
                        <Row className="align-items-center">
                            <Col lg={6} md={12}>
                                <div className="features-content">
                                    <h2 className="features-title">Tại sao chọn chúng tôi?</h2>
                                    <div className="feature-item">
                                        <div className="feature-icon">
                                            <FaShieldAlt />
                                        </div>
                                        <div className="feature-text">
                                            <h5>Bảo mật tuyệt đối</h5>
                                            <p>Thông tin cá nhân và kết quả xét nghiệm được bảo mật 100%</p>
                                        </div>
                                    </div>
                                    <div className="feature-item">
                                        <div className="feature-icon">
                                            <FaClock />
                                        </div>
                                        <div className="feature-text">
                                            <h5>Kết quả nhanh chóng</h5>
                                            <p>Nhận kết quả trong 3-5 ngày làm việc</p>
                                        </div>
                                    </div>
                                    <div className="feature-item">
                                        <div className="feature-icon">
                                            <FaFileAlt />
                                        </div>
                                        <div className="feature-text">
                                            <h5>Chứng nhận quốc tế</h5>
                                            <p>Kết quả được công nhận tại hơn 150 quốc gia</p>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={6} md={12}>
                                <div className="features-image">
                                    <img src={require('../assets/image.png')} alt="Features" />
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>

                {/* Process Section */}
                <section className="process-section">
                    <Container>
                        <div className="section-header text-center">
                            <h2 className="section-title">Quy trình xét nghiệm</h2>
                            <p className="section-description">
                                Quy trình đơn giản, nhanh chóng và chuyên nghiệp
                            </p>
                        </div>
                        <Row>
                            <Col lg={3} md={6} sm={12} className="mb-4">
                                <div className="process-step">
                                    <div className="step-number">1</div>
                                    <h5>Đặt lịch</h5>
                                    <p>Liên hệ và đặt lịch xét nghiệm qua điện thoại hoặc online</p>
                                </div>
                            </Col>
                            <Col lg={3} md={6} sm={12} className="mb-4">
                                <div className="process-step">
                                    <div className="step-number">2</div>
                                    <h5>Thu mẫu</h5>
                                    <p>Thu thập mẫu DNA tại nhà hoặc tại trung tâm của chúng tôi</p>
                                </div>
                            </Col>
                            <Col lg={3} md={6} sm={12} className="mb-4">
                                <div className="process-step">
                                    <div className="step-number">3</div>
                                    <h5>Phân tích</h5>
                                    <p>Phân tích mẫu trong phòng thí nghiệm hiện đại</p>
                                </div>
                            </Col>
                            <Col lg={3} md={6} sm={12} className="mb-4">
                                <div className="process-step">
                                    <div className="step-number">4</div>
                                    <h5>Kết quả</h5>
                                    <p>Nhận kết quả qua email hoặc bưu điện</p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>

                {/* CTA Section */}
                <section className="cta-section">
                    <Container>
                        <Row className="justify-content-center">
                            <Col lg={8} md={10} sm={12} className="text-center">
                                <h2 className="cta-title">Sẵn sàng bắt đầu?</h2>
                                <p className="cta-description">
                                    Liên hệ ngay với chúng tôi để được tư vấn miễn phí và đặt lịch xét nghiệm
                                </p>
                                <div className="cta-buttons">
                                    <Button variant="primary" size="lg" className="me-3">
                                        Gọi ngay: 0971051152
                                    </Button>
                                    <Button variant="outline-light" size="lg">
                                        Đặt lịch online
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </div>
        </>
    );
}

export default Content; 
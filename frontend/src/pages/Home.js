import '../component/content.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FaDna, FaShieldAlt, FaClock, FaUserCheck, FaFileAlt, FaGlobe } from 'react-icons/fa';

function Home() {
    return (
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
                                    Liên hệ ngay
                                </Button>
                                <Button variant="outline-primary" size="lg">
                                    Tư vấn miễn phí
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
}

export default Home; 
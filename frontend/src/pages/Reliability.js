import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { FaUsers, FaAward, FaMicroscope, FaGlobe, FaChartLine, FaHandshake } from 'react-icons/fa';

function Reliability() {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero py-5">
                <div className="hero-background"></div>
                <Container>
                    <Row className="justify-content-center text-center">
                        <Col lg={10} md={12}>
                            <h1 className="display-2 fw-bold text-white mb-4">Về chúng tôi</h1>
                            <p className="lead text-white-50 mb-0">
                                Chúng tôi là đơn vị tiên phong trong lĩnh vực xét nghiệm DNA tại Việt Nam, 
                                cung cấp các dịch vụ chính xác và đáng tin cậy nhất.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Mission & Vision */}
            <section className="mission-vision py-5">
                <Container>
                    <Row className="mb-5">
                        <Col lg={6} md={12} className="mb-4">
                            <Card className="h-100 border-0 shadow-lg mission-card">
                                <Card.Body className="text-center p-5">
                                    <div className="mission-icon mb-4">
                                        <FaUsers size={80} color="#007bff" />
                                    </div>
                                    <Card.Title className="display-6 fw-bold mb-4">Sứ mệnh</Card.Title>
                                    <Card.Text className="lead text-muted">
                                        Cung cấp các dịch vụ xét nghiệm DNA chất lượng cao, 
                                        chính xác và đáng tin cậy, giúp khách hàng giải quyết 
                                        các vấn đề về quan hệ huyết thống một cách nhanh chóng và bảo mật.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={6} md={12} className="mb-4">
                            <Card className="h-100 border-0 shadow-lg vision-card">
                                <Card.Body className="text-center p-5">
                                    <div className="vision-icon mb-4">
                                        <FaAward size={80} color="#28a745" />
                                    </div>
                                    <Card.Title className="display-6 fw-bold mb-4">Tầm nhìn</Card.Title>
                                    <Card.Text className="lead text-muted">
                                        Trở thành đơn vị hàng đầu trong lĩnh vực xét nghiệm DNA, 
                                        được công nhận quốc tế và là lựa chọn tin cậy của mọi khách hàng 
                                        khi cần xác định quan hệ huyết thống.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Values */}
            <section className="values-section py-5 bg-light">
                <Container>
                    <Row className="mb-5">
                        <Col lg={12} className="text-center">
                            <h2 className="display-4 fw-bold mb-3">Giá trị cốt lõi</h2>
                            <p className="lead text-muted">Những nguyên tắc định hướng mọi hoạt động của chúng tôi</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={3} md={6} sm={12} className="mb-4">
                            <div className="value-card text-center p-4">
                                <div className="value-icon mb-4">
                                    <FaMicroscope size={60} color="#dc3545" />
                                </div>
                                <h4 className="fw-bold mb-3">Chính xác</h4>
                                <p className="text-muted">Độ chính xác 99.9% trong mọi xét nghiệm</p>
                            </div>
                        </Col>
                        <Col lg={3} md={6} sm={12} className="mb-4">
                            <div className="value-card text-center p-4">
                                <div className="value-icon mb-4">
                                    <FaGlobe size={60} color="#ffc107" />
                                </div>
                                <h4 className="fw-bold mb-3">Quốc tế</h4>
                                <p className="text-muted">Được công nhận tại hơn 150 quốc gia</p>
                            </div>
                        </Col>
                        <Col lg={3} md={6} sm={12} className="mb-4">
                            <div className="value-card text-center p-4">
                                <div className="value-icon mb-4">
                                    <FaUsers size={60} color="#17a2b8" />
                                </div>
                                <h4 className="fw-bold mb-3">Chuyên nghiệp</h4>
                                <p className="text-muted">Đội ngũ chuyên gia giàu kinh nghiệm</p>
                            </div>
                        </Col>
                        <Col lg={3} md={6} sm={12} className="mb-4">
                            <div className="value-card text-center p-4">
                                <div className="value-icon mb-4">
                                    <FaHandshake size={60} color="#6f42c1" />
                                </div>
                                <h4 className="fw-bold mb-3">Tin cậy</h4>
                                <p className="text-muted">Bảo mật thông tin tuyệt đối</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* History */}
            <section className="history-section py-5">
                <Container>
                    <Row className="mb-5">
                        <Col lg={12} className="text-center">
                            <h2 className="display-4 fw-bold mb-3">Lịch sử phát triển</h2>
                            <p className="lead text-muted">Hành trình xây dựng và phát triển của chúng tôi</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12}>
                            <Card className="border-0 shadow-lg">
                                <Card.Body className="p-5">
                                    <Row>
                                        <Col lg={4} md={6} sm={12} className="mb-4">
                                            <div className="timeline-item text-center">
                                                <div className="timeline-year mb-3">2020</div>
                                                <h5 className="fw-bold mb-3">Thành lập</h5>
                                                <p className="text-muted">Thành lập trung tâm xét nghiệm DNA với đội ngũ chuyên gia đầu ngành</p>
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12} className="mb-4">
                                            <div className="timeline-item text-center">
                                                <div className="timeline-year mb-3">2021</div>
                                                <h5 className="fw-bold mb-3">Mở rộng</h5>
                                                <p className="text-muted">Mở rộng dịch vụ ra toàn quốc với hệ thống chi nhánh</p>
                                            </div>
                                        </Col>
                                        <Col lg={4} md={6} sm={12} className="mb-4">
                                            <div className="timeline-item text-center">
                                                <div className="timeline-year mb-3">2023</div>
                                                <h5 className="fw-bold mb-3">Chứng nhận</h5>
                                                <p className="text-muted">Đạt chứng nhận quốc tế ISO 17025 và mở rộng ra thị trường quốc tế</p>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Stats */}
            <section className="stats-section py-5 bg-primary text-white">
                <Container>
                    <Row className="text-center">
                        <Col lg={3} md={6} sm={12} className="mb-4">
                            <div className="stat-item">
                                <div className="stat-number display-4 fw-bold mb-2">10,000+</div>
                                <div className="stat-label">Khách hàng tin tưởng</div>
                            </div>
                        </Col>
                        <Col lg={3} md={6} sm={12} className="mb-4">
                            <div className="stat-item">
                                <div className="stat-number display-4 fw-bold mb-2">99.9%</div>
                                <div className="stat-label">Độ chính xác</div>
                            </div>
                        </Col>
                        <Col lg={3} md={6} sm={12} className="mb-4">
                            <div className="stat-item">
                                <div className="stat-number display-4 fw-bold mb-2">150+</div>
                                <div className="stat-label">Quốc gia công nhận</div>
                            </div>
                        </Col>
                        <Col lg={3} md={6} sm={12} className="mb-4">
                            <div className="stat-item">
                                <div className="stat-number display-4 fw-bold mb-2">5+</div>
                                <div className="stat-label">Năm kinh nghiệm</div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <style jsx>{`
                .about-page {
                    overflow-x: hidden;
                }
                
                .about-hero {
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
                
                .mission-card, .vision-card {
                    transition: all 0.3s ease;
                    border-radius: 20px;
                }
                
                .mission-card:hover, .vision-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 25px 50px rgba(0,0,0,0.15) !important;
                }
                
                .mission-icon, .vision-icon {
                    transition: transform 0.3s ease;
                }
                
                .mission-card:hover .mission-icon,
                .vision-card:hover .vision-icon {
                    transform: scale(1.1);
                }
                
                .value-card {
                    background: white;
                    border-radius: 15px;
                    transition: all 0.3s ease;
                    height: 100%;
                }
                
                .value-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.1);
                }
                
                .value-icon {
                    transition: transform 0.3s ease;
                }
                
                .value-card:hover .value-icon {
                    transform: scale(1.1);
                }
                
                .timeline-year {
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #007bff, #0056b3);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    font-weight: bold;
                    margin: 0 auto;
                    transition: transform 0.3s ease;
                }
                
                .timeline-item:hover .timeline-year {
                    transform: scale(1.1);
                }
                
                .stat-item {
                    transition: transform 0.3s ease;
                }
                
                .stat-item:hover {
                    transform: scale(1.05);
                }
                
                .stats-section {
                    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
                }
            `}</style>
        </div>
    );
}

export default Reliability; 
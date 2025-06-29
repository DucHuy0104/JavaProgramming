import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FaUsers, FaAward, FaMicroscope, FaGlobe, FaChartLine, FaHandshake, FaDna, FaShieldAlt, FaClock, FaFileAlt, FaCertificate, FaUserCheck } from 'react-icons/fa';

function Introduce() {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero py-5">
                <div className="hero-background"></div>
                <Container>
                    <Row className="justify-content-center text-center">
                        <Col lg={10} md={12}>
                            <h1 className="display-2 fw-bold text-white mb-4">
                                Về <span className="brand-name">BLOODLINE DNA</span>
                            </h1>
                            <p className="lead text-white-50 mb-0">
                                Trung tâm xét nghiệm ADN hàng đầu tại Việt Nam, cung cấp dịch vụ xét nghiệm ADN 
                                dân sự và hành chính với độ chính xác 99.9% và giá trị pháp lý đầy đủ.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* About Section */}
            <section className="about-section py-5">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6} md={12} className="mb-4 mb-lg-0">
                            <div className="about-image">
                                <img src={require('../assets/xetnghiemadn.jpg')} alt="BLOODLINE DNA" className="about-img" />
                            </div>
                        </Col>
                        <Col lg={6} md={12}>
                            <div className="about-content">
                                <h2 className="display-4 fw-bold mb-4 text-center">Chúng tôi là ai?</h2>
                                <p className="lead text-muted mb-4 text-center">
                                    BLOODLINE DNA được thành lập với sứ mệnh mang đến dịch vụ xét nghiệm ADN 
                                    chất lượng cao, đáng tin cậy và có giá trị pháp lý cho người dân Việt Nam. 
                                    Chúng tôi cam kết cung cấp kết quả chính xác, nhanh chóng và bảo mật tuyệt đối.
                                </p>
                                <div className="about-features">
                                    <div className="feature-item">
                                        <div className="feature-icon">
                                            <FaMicroscope />
                                        </div>
                                        <div className="feature-text">
                                            <h5>Phòng thí nghiệm hiện đại</h5>
                                            <p>Trang thiết bị tiên tiến, đạt chuẩn quốc tế</p>
                                        </div>
                                    </div>
                                    <div className="feature-item">
                                        <div className="feature-icon">
                                            <FaUsers />
                                        </div>
                                        <div className="feature-text">
                                            <h5>Đội ngũ chuyên gia</h5>
                                            <p>Bác sĩ, kỹ thuật viên giàu kinh nghiệm</p>
                                        </div>
                                    </div>
                                    <div className="feature-item">
                                        <div className="feature-icon">
                                            <FaCertificate />
                                        </div>
                                        <div className="feature-text">
                                            <h5>Chứng nhận chất lượng</h5>
                                            <p>Đạt tiêu chuẩn ISO và được công nhận quốc tế</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Mission & Vision */}
            <section className="mission-vision py-5 bg-light">
                <Container>
                    <Row className="mb-5">
                        <Col lg={6} md={12} className="mb-4">
                            <Card className="h-100 border-0 shadow-lg mission-card">
                                <Card.Body className="text-center p-5">
                                    <div className="mission-icon mb-4">
                                        <FaAward size={80} color="#007bff" />
                                    </div>
                                    <Card.Title className="display-6 fw-bold mb-4">Sứ mệnh</Card.Title>
                                    <Card.Text className="lead text-muted">
                                        Cung cấp dịch vụ xét nghiệm ADN chất lượng cao, đáng tin cậy 
                                        và có giá trị pháp lý, góp phần giải quyết các vấn đề về 
                                        quan hệ huyết thống một cách chính xác và nhanh chóng.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={6} md={12} className="mb-4">
                            <Card className="h-100 border-0 shadow-lg vision-card">
                                <Card.Body className="text-center p-5">
                                    <div className="vision-icon mb-4">
                                        <FaGlobe size={80} color="#28a745" />
                                    </div>
                                    <Card.Title className="display-6 fw-bold mb-4">Tầm nhìn</Card.Title>
                                    <Card.Text className="lead text-muted">
                                        Trở thành trung tâm xét nghiệm ADN hàng đầu tại Việt Nam, 
                                        được công nhận rộng rãi về chất lượng, uy tín và dịch vụ 
                                        khách hàng xuất sắc.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Services Overview */}
            <section className="services-overview py-5">
                <Container>
                    <Row className="mb-5">
                        <Col lg={12} className="text-center">
                            <h2 className="display-4 fw-bold mb-3">Dịch vụ của chúng tôi</h2>
                            <p className="lead text-muted">Cung cấp đầy đủ các loại xét nghiệm DNA phục vụ mọi nhu cầu</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={4} md={6} sm={12} className="mb-4">
                            <Card className="service-card h-100 border-0 shadow-lg">
                                <Card.Body className="text-center p-4">
                                    <div className="service-icon mb-4">
                                        <FaFileAlt size={60} color="#007bff" />
                                    </div>
                                    <Card.Title className="fw-bold mb-3">Xét nghiệm ADN hành chính</Card.Title>
                                    <Card.Text className="text-muted">
                                        Xét nghiệm ADN phục vụ thủ tục hành chính như làm giấy khai sinh, 
                                        thẻ căn cước, hộ chiếu. Kết quả có giá trị pháp lý.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={4} md={6} sm={12} className="mb-4">
                            <Card className="service-card h-100 border-0 shadow-lg">
                                <Card.Body className="text-center p-4">
                                    <div className="service-icon mb-4">
                                        <FaDna size={60} color="#28a745" />
                                    </div>
                                    <Card.Title className="fw-bold mb-3">Xét nghiệm ADN dân sự</Card.Title>
                                    <Card.Text className="text-muted">
                                        Xét nghiệm ADN để xác định mối quan hệ huyết thống cho mục đích cá nhân. 
                                        Độ chính xác 99.9%, kết quả nhanh chóng trong 3-5 ngày.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={4} md={6} sm={12} className="mb-4">
                            <Card className="service-card h-100 border-0 shadow-lg">
                                <Card.Body className="text-center p-4">
                                    <div className="service-icon mb-4">
                                        <FaUserCheck size={60} color="#dc3545" />
                                    </div>
                                    <Card.Title className="fw-bold mb-3">Xét nghiệm ADN huyết thống</Card.Title>
                                    <Card.Text className="text-muted">
                                        Xác định các mối quan hệ huyết thống như cha-con, ông-cháu, 
                                        anh-em với độ chính xác cao.
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
                                    <FaShieldAlt size={60} color="#007bff" />
                                </div>
                                <h4 className="fw-bold mb-3">Uy tín</h4>
                                <p className="text-muted">Cam kết cung cấp dịch vụ chất lượng cao, đáng tin cậy</p>
                            </div>
                        </Col>
                        <Col lg={3} md={6} sm={12} className="mb-4">
                            <div className="value-card text-center p-4">
                                <div className="value-icon mb-4">
                                    <FaDna size={60} color="#28a745" />
                                </div>
                                <h4 className="fw-bold mb-3">Chính xác</h4>
                                <p className="text-muted">Độ chính xác 99.9% với công nghệ phân tích tiên tiến</p>
                            </div>
                        </Col>
                        <Col lg={3} md={6} sm={12} className="mb-4">
                            <div className="value-card text-center p-4">
                                <div className="value-icon mb-4">
                                    <FaClock size={60} color="#ffc107" />
                                </div>
                                <h4 className="fw-bold mb-3">Nhanh chóng</h4>
                                <p className="text-muted">Kết quả trong 3-5 ngày làm việc, tiết kiệm thời gian</p>
                            </div>
                        </Col>
                        <Col lg={3} md={6} sm={12} className="mb-4">
                            <div className="value-card text-center p-4">
                                <div className="value-icon mb-4">
                                    <FaUserCheck size={60} color="#dc3545" />
                                </div>
                                <h4 className="fw-bold mb-3">Bảo mật</h4>
                                <p className="text-muted">Thông tin khách hàng được bảo mật tuyệt đối</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Team Section */}
            <section className="team-section py-5">
                <Container>
                    <Row className="mb-5">
                        <Col lg={12} className="text-center">
                            <h2 className="display-4 fw-bold mb-3">Đội ngũ chuyên gia</h2>
                            <p className="lead text-muted">Đội ngũ bác sĩ và kỹ thuật viên giàu kinh nghiệm</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={4} md={6} sm={12} className="mb-4">
                            <Card className="team-card h-100 border-0 shadow-lg">
                                <Card.Body className="text-center p-4">
                                    <div className="team-avatar mb-4">
                                        <FaUsers size={60} color="#007bff" />
                                    </div>
                                    <Card.Title className="fw-bold mb-3">Bác sĩ chuyên khoa</Card.Title>
                                    <Card.Text className="text-muted">
                                        Đội ngũ bác sĩ chuyên khoa di truyền học với nhiều năm kinh nghiệm 
                                        trong lĩnh vực xét nghiệm ADN và tư vấn di truyền.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={4} md={6} sm={12} className="mb-4">
                            <Card className="team-card h-100 border-0 shadow-lg">
                                <Card.Body className="text-center p-4">
                                    <div className="team-avatar mb-4">
                                        <FaMicroscope size={60} color="#28a745" />
                                    </div>
                                    <Card.Title className="fw-bold mb-3">Kỹ thuật viên</Card.Title>
                                    <Card.Text className="text-muted">
                                        Các kỹ thuật viên được đào tạo chuyên sâu, có chứng chỉ hành nghề 
                                        và thường xuyên cập nhật công nghệ mới.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={4} md={6} sm={12} className="mb-4">
                            <Card className="team-card h-100 border-0 shadow-lg">
                                <Card.Body className="text-center p-4">
                                    <div className="team-avatar mb-4">
                                        <FaFileAlt size={60} color="#dc3545" />
                                    </div>
                                    <Card.Title className="fw-bold mb-3">Chuyên viên tư vấn</Card.Title>
                                    <Card.Text className="text-muted">
                                        Đội ngũ tư vấn chuyên nghiệp, hỗ trợ khách hàng trong quá trình 
                                        thực hiện xét nghiệm và giải thích kết quả.
                                    </Card.Text>
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
                                <div className="stat-number display-4 fw-bold mb-2">50,000+</div>
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
                                <div className="stat-number display-4 fw-bold mb-2">10+</div>
                                <div className="stat-label">Năm kinh nghiệm</div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* CTA Section */}
            <section className="cta-section py-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8} md={10} sm={12} className="text-center">
                            <h2 className="display-4 fw-bold mb-4">Liên hệ với chúng tôi</h2>
                            <p className="lead text-muted mb-4">
                                Để được tư vấn chi tiết và đặt lịch xét nghiệm, vui lòng liên hệ ngay
                            </p>
                            <div className="cta-buttons">
                                <Button variant="primary" size="lg" className="me-3">
                                    Tư vấn miễn phí
                                </Button>
                                <Button variant="outline-primary" size="lg">
                                    Đặt lịch xét nghiệm
                                </Button>
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

                .brand-name {
                    color: #6c63ff;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }

                .about-section {
                    background: white;
                }

                .about-img {
                    max-width: 100%;
                    border-radius: 15px;
                    box-shadow: 0 15px 30px rgba(0,0,0,0.1);
                }

                .about-features {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 32px;
                    margin-top: 16px;
                }

                .feature-item {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                    max-width: 420px;
                    width: 100%;
                    padding: 12px 0;
                }

                .feature-icon {
                    font-size: 44px;
                    color: #5a6dff;
                    min-width: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .feature-text h5 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-bottom: 4px;
                }

                .feature-text p {
                    font-size: 1rem;
                    color: #555;
                    margin-bottom: 0;
                }
                
                .mission-card, .vision-card, .service-card, .team-card {
                    transition: all 0.3s ease;
                    border-radius: 20px;
                }
                
                .mission-card:hover, .vision-card:hover, .service-card:hover, .team-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 25px 50px rgba(0,0,0,0.15) !important;
                }
                
                .mission-icon, .vision-icon, .service-icon, .team-avatar {
                    transition: transform 0.3s ease;
                }
                
                .mission-card:hover .mission-icon,
                .vision-card:hover .vision-icon,
                .service-card:hover .service-icon,
                .team-card:hover .team-avatar {
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
                
                .stat-item {
                    transition: transform 0.3s ease;
                }
                
                .stat-item:hover {
                    transform: scale(1.05);
                }
                
                .stats-section {
                    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
                }

                .cta-section {
                    background: #f8f9fa;
                }

                .about-features .feature-item:first-child {
                    margin-left: auto;
                    margin-right: auto;
                }
            `}</style>
        </div>
    );
}

export default Introduce; 
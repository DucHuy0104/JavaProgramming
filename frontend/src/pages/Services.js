import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FaHome, FaUserNurse, FaHospital, FaArrowRight, FaCheckCircle, FaClock, FaShieldAlt, FaFileAlt } from 'react-icons/fa';

function Services() {
    return (
        <div className="services-page">
            {/* Hero Section */}
            <section className="services-hero py-5">
                <div className="hero-background"></div>
                <Container>
                    <Row className="justify-content-center text-center">
                        <Col lg={10} md={12}>
                            <h1 className="display-2 fw-bold text-white mb-4">Dịch vụ xét nghiệm DNA</h1>
                            <p className="lead text-white-50 mb-0">
                                Chọn dịch vụ phù hợp với nhu cầu của bạn - từ tự lấy mẫu tại nhà đến thu mẫu chuyên nghiệp tại cơ sở
                            </p>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Services Grid */}
            <section className="services-grid py-5">
                <Container>
                    <Row>
                        <Col lg={4} md={6} sm={12} className="mb-4">
                            <Card className="h-100 border-0 shadow-lg service-card">
                                <Card.Body className="text-center p-4">
                                    <div className="service-icon mb-4">
                                        <FaHome size={60} color="#007bff" />
                                    </div>
                                    <Card.Title className="fw-bold mb-3">Tự lấy mẫu tại nhà</Card.Title>
                                    <Card.Text className="text-muted">
                                        Bộ kit tự lấy mẫu được gửi đến nhà bạn. Bạn tự thực hiện lấy mẫu 
                                        theo hướng dẫn và gửi lại cho chúng tôi để phân tích.
                                    </Card.Text>
                                    <div className="service-features mb-3">
                                        <div className="feature-item">
                                            <FaCheckCircle className="text-success me-2" />
                                            <span>Bộ kit được gửi tận nhà</span>
                                        </div>
                                        <div className="feature-item">
                                            <FaCheckCircle className="text-success me-2" />
                                            <span>Hướng dẫn chi tiết</span>
                                        </div>
                                        <div className="feature-item">
                                            <FaCheckCircle className="text-success me-2" />
                                            <span>Tiết kiệm thời gian</span>
                                        </div>
                                        <div className="feature-item">
                                            <FaCheckCircle className="text-success me-2" />
                                            <span>Phù hợp mọi lứa tuổi</span>
                                        </div>
                                    </div>
                                    <div className="service-price mb-3">
                                        <span className="price-label">Giá từ:</span>
                                        <span className="price-amount">2,500,000 VNĐ</span>
                                    </div>
                                    <div className="mt-3">
                                        <Button variant="primary" className="me-2">
                                            Đặt dịch vụ <FaArrowRight className="ms-2" />
                                        </Button>
                                        <Button variant="outline-primary">
                                            Chi tiết
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col lg={4} md={6} sm={12} className="mb-4">
                            <Card className="h-100 border-0 shadow-lg service-card featured">
                                <Card.Body className="text-center p-4">
                                    <div className="featured-badge">Phổ biến</div>
                                    <div className="service-icon mb-4">
                                        <FaUserNurse size={60} color="#28a745" />
                                    </div>
                                    <Card.Title className="fw-bold mb-3">Nhân viên thu mẫu tại nhà</Card.Title>
                                    <Card.Text className="text-muted">
                                        Nhân viên chuyên nghiệp sẽ đến tận nhà để thu mẫu. 
                                        Dịch vụ tiện lợi, an toàn và đảm bảo chất lượng mẫu.
                                    </Card.Text>
                                    <div className="service-features mb-3">
                                        <div className="feature-item">
                                            <FaCheckCircle className="text-success me-2" />
                                            <span>Nhân viên chuyên nghiệp</span>
                                        </div>
                                        <div className="feature-item">
                                            <FaCheckCircle className="text-success me-2" />
                                            <span>Thu mẫu tại nhà</span>
                                        </div>
                                        <div className="feature-item">
                                            <FaCheckCircle className="text-success me-2" />
                                            <span>Đảm bảo chất lượng</span>
                                        </div>
                                        <div className="feature-item">
                                            <FaCheckCircle className="text-success me-2" />
                                            <span>Hỗ trợ mọi lứa tuổi</span>
                                        </div>
                                    </div>
                                    <div className="service-price mb-3">
                                        <span className="price-label">Giá từ:</span>
                                        <span className="price-amount">3,500,000 VNĐ</span>
                                    </div>
                                    <div className="mt-3">
                                        <Button variant="success" className="me-2">
                                            Đặt dịch vụ <FaArrowRight className="ms-2" />
                                        </Button>
                                        <Button variant="outline-success">
                                            Chi tiết
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col lg={4} md={6} sm={12} className="mb-4">
                            <Card className="h-100 border-0 shadow-lg service-card">
                                <Card.Body className="text-center p-4">
                                    <div className="service-icon mb-4">
                                        <FaHospital size={60} color="#dc3545" />
                                    </div>
                                    <Card.Title className="fw-bold mb-3">Thu mẫu tại cơ sở</Card.Title>
                                    <Card.Text className="text-muted">
                                        Đến trực tiếp cơ sở của chúng tôi để được thu mẫu bởi 
                                        đội ngũ y tế chuyên nghiệp với trang thiết bị hiện đại.
                                    </Card.Text>
                                    <div className="service-features mb-3">
                                        <div className="feature-item">
                                            <FaCheckCircle className="text-success me-2" />
                                            <span>Trang thiết bị hiện đại</span>
                                        </div>
                                        <div className="feature-item">
                                            <FaCheckCircle className="text-success me-2" />
                                            <span>Đội ngũ y tế chuyên nghiệp</span>
                                        </div>
                                        <div className="feature-item">
                                            <FaCheckCircle className="text-success me-2" />
                                            <span>Kết quả chính xác nhất</span>
                                        </div>
                                        <div className="feature-item">
                                            <FaCheckCircle className="text-success me-2" />
                                            <span>Chứng nhận pháp lý</span>
                                        </div>
                                    </div>
                                    <div className="service-price mb-3">
                                        <span className="price-label">Giá từ:</span>
                                        <span className="price-amount">4,000,000 VNĐ</span>
                                    </div>
                                    <div className="mt-3">
                                        <Button variant="primary" className="me-2">
                                            Đặt dịch vụ <FaArrowRight className="ms-2" />
                                        </Button>
                                        <Button variant="outline-primary">
                                            Chi tiết
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Comparison Section */}
            <section className="comparison-section py-5 bg-light">
                <Container>
                    <Row className="mb-5">
                        <Col lg={12} className="text-center">
                            <h2 className="display-4 fw-bold mb-3">So sánh các dịch vụ</h2>
                            <p className="lead text-muted">Chọn dịch vụ phù hợp nhất với nhu cầu của bạn</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12}>
                            <Card className="border-0 shadow-lg">
                                <Card.Body className="p-0">
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead className="table-primary">
                                                <tr>
                                                    <th className="text-center">Tính năng</th>
                                                    <th className="text-center">Tự lấy mẫu tại nhà</th>
                                                    <th className="text-center">Nhân viên thu mẫu tại nhà</th>
                                                    <th className="text-center">Thu mẫu tại cơ sở</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="fw-bold">Thời gian</td>
                                                    <td className="text-center">
                                                        <FaClock className="text-warning me-2" />
                                                        2-3 ngày
                                                    </td>
                                                    <td className="text-center">
                                                        <FaClock className="text-warning me-2" />
                                                        1-2 ngày
                                                    </td>
                                                    <td className="text-center">
                                                        <FaClock className="text-warning me-2" />
                                                        Ngay lập tức
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">Độ chính xác</td>
                                                    <td className="text-center">99.5%</td>
                                                    <td className="text-center">99.8%</td>
                                                    <td className="text-center">99.9%</td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">Giá cả</td>
                                                    <td className="text-center text-success fw-bold">Thấp nhất</td>
                                                    <td className="text-center text-warning fw-bold">Trung bình</td>
                                                    <td className="text-center text-danger fw-bold">Cao nhất</td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">Tiện lợi</td>
                                                    <td className="text-center">
                                                        <FaCheckCircle className="text-success me-2" />
                                                        Rất tiện lợi
                                                    </td>
                                                    <td className="text-center">
                                                        <FaCheckCircle className="text-success me-2" />
                                                        Tiện lợi
                                                    </td>
                                                    <td className="text-center">
                                                        <FaCheckCircle className="text-success me-2" />
                                                        Cần di chuyển
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="fw-bold">Chứng nhận pháp lý</td>
                                                    <td className="text-center">
                                                        <FaFileAlt className="text-info me-2" />
                                                        Có
                                                    </td>
                                                    <td className="text-center">
                                                        <FaFileAlt className="text-info me-2" />
                                                        Có
                                                    </td>
                                                    <td className="text-center">
                                                        <FaFileAlt className="text-info me-2" />
                                                        Có
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Process Section */}
            <section className="process-section py-5">
                <Container>
                    <Row className="mb-5">
                        <Col lg={12} className="text-center">
                            <h2 className="display-4 fw-bold mb-3">Quy trình đặt dịch vụ</h2>
                            <p className="lead text-muted">Quy trình đơn giản, nhanh chóng và chuyên nghiệp</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12}>
                            <Card className="border-0 shadow-lg">
                                <Card.Body className="p-5">
                                    <Row>
                                        <Col lg={3} md={6} sm={12} className="mb-4">
                                            <div className="process-step text-center">
                                                <div className="step-number mb-3">1</div>
                                                <h5 className="fw-bold mb-3">Chọn dịch vụ</h5>
                                                <p className="text-muted">Chọn dịch vụ phù hợp với nhu cầu</p>
                                            </div>
                                        </Col>
                                        <Col lg={3} md={6} sm={12} className="mb-4">
                                            <div className="process-step text-center">
                                                <div className="step-number mb-3">2</div>
                                                <h5 className="fw-bold mb-3">Đặt lịch</h5>
                                                <p className="text-muted">Đặt lịch hẹn hoặc nhận bộ kit</p>
                                            </div>
                                        </Col>
                                        <Col lg={3} md={6} sm={12} className="mb-4">
                                            <div className="process-step text-center">
                                                <div className="step-number mb-3">3</div>
                                                <h5 className="fw-bold mb-3">Thu mẫu</h5>
                                                <p className="text-muted">Thu mẫu theo phương thức đã chọn</p>
                                            </div>
                                        </Col>
                                        <Col lg={3} md={6} sm={12} className="mb-4">
                                            <div className="process-step text-center">
                                                <div className="step-number mb-3">4</div>
                                                <h5 className="fw-bold mb-3">Nhận kết quả</h5>
                                                <p className="text-muted">Nhận kết quả chính xác</p>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* CTA Section */}
            <section className="cta-section py-5 bg-primary text-white">
                <Container>
                    <Row className="justify-content-center text-center">
                        <Col lg={8} md={10} sm={12}>
                            <h2 className="display-4 fw-bold mb-4">Sẵn sàng đặt dịch vụ?</h2>
                            <p className="lead mb-4">
                                Liên hệ ngay với chúng tôi để được tư vấn miễn phí và chọn dịch vụ phù hợp
                            </p>
                            <Button variant="light" size="lg" className="px-4 py-3 fw-bold me-3">
                                Liên hệ tư vấn
                            </Button>
                            <Button variant="outline-light" size="lg" className="px-4 py-3 fw-bold">
                                Xem bảng giá
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </section>

            <style jsx>{`
                .services-page {
                    overflow-x: hidden;
                }
                
                .services-hero {
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
                
                .service-card {
                    transition: all 0.3s ease;
                    border-radius: 15px;
                    position: relative;
                }
                
                .service-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
                }
                
                .service-card.featured {
                    border: 2px solid #28a745;
                }
                
                .featured-badge {
                    position: absolute;
                    top: -10px;
                    right: 20px;
                    background: #28a745;
                    color: white;
                    padding: 5px 15px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: bold;
                }
                
                .service-icon {
                    transition: transform 0.3s ease;
                }
                
                .service-card:hover .service-icon {
                    transform: scale(1.1);
                }
                
                .service-features {
                    text-align: left;
                }
                
                .feature-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 8px;
                    font-size: 14px;
                }
                
                .service-price {
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 10px;
                    border: 2px dashed #dee2e6;
                }
                
                .price-label {
                    display: block;
                    font-size: 12px;
                    color: #6c757d;
                    margin-bottom: 5px;
                }
                
                .price-amount {
                    display: block;
                    font-size: 20px;
                    font-weight: bold;
                    color: #007bff;
                }
                
                .step-number {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #007bff, #0056b3);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    font-weight: bold;
                    margin: 0 auto;
                    transition: transform 0.3s ease;
                }
                
                .process-step:hover .step-number {
                    transform: scale(1.1);
                }
                
                .cta-section {
                    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
                }
                
                .table th {
                    border: none;
                    padding: 15px;
                    font-weight: bold;
                }
                
                .table td {
                    border: none;
                    padding: 15px;
                    vertical-align: middle;
                }
                
                .table-hover tbody tr:hover {
                    background-color: rgba(0,123,255,0.05);
                }
            `}</style>
        </div>
    );
}

export default Services; 
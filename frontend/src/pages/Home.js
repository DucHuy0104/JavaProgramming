import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FaDna, FaShieldAlt, FaClock, FaUserCheck, FaFileAlt, FaHome, FaBuilding } from 'react-icons/fa';



function Home() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch services from API
    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8081/api/services');
            const result = await response.json();

            if (result.data) {
                setServices(result.data);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    // Function to get icon based on category
    const getServiceIcon = (category) => {
        switch (category) {
            case 'DNA_HOME':
                return <FaHome />;
            case 'DNA_PROFESSIONAL':
                return <FaUserCheck />;
            case 'DNA_FACILITY':
                return <FaBuilding />;
            default:
                return <FaDna />;
        }
    };

    // Function to format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <>
            <div className="content">
                {/* Welcome Section */}
                <section className="welcome-section">
                    <Container>
                        <Row className="align-items-center">
                            <Col lg={7} md={12}>
                                <div className="welcome-content text-lg-start text-center">
                                    <h1 className="welcome-title mb-3">
                                        CHÀO MỪNG ĐẾN VỚI <span className="brand-name">BLOODLINE DNA</span>
                                    </h1>
                                    <h2 className="welcome-subtitle mb-4">
                                        Địa chỉ tin cậy cho dịch vụ xét nghiệm ADN dân sự & hành chính
                                    </h2>
                                    <ul className="welcome-list mb-4">
                                        <li><span className="welcome-icon"><FaUserCheck /></span> Đội ngũ chuyên gia giàu kinh nghiệm</li>
                                        <li><span className="welcome-icon"><FaShieldAlt /></span> Trang thiết bị hiện đại, quy trình bảo mật</li>
                                        <li><span className="welcome-icon"><FaFileAlt /></span> Kết quả chính xác, nhanh chóng, giá trị pháp lý</li>
                                    </ul>
                                    <div className="welcome-buttons">
                                        <Button variant="primary" size="lg" className="me-3 mb-2">
                                            Đặt lịch xét nghiệm
                                        </Button>
                                        <Button variant="outline-primary" size="lg" className="mb-2">
                                            Tư vấn miễn phí
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={5} md={12} className="text-center mt-4 mt-lg-0">
                                <div className="welcome-logo-wrapper">
                                    <img src={require('../assets/image.png')} alt="Bloodline DNA Logo" className="welcome-logo" />
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>

                {/* Services Section */}
                <section className="services-section">
                    <Container>
                        <div className="section-header text-center">
                            <h2 className="section-title">Dịch vụ xét nghiệm DNA</h2>
                            <p className="section-description">
                                Chúng tôi cung cấp các dịch vụ xét nghiệm DNA chuyên nghiệp với độ chính xác cao
                            </p>
                        </div>

                        {loading ? (
                            <div className="text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-2">Đang tải dịch vụ...</p>
                            </div>
                        ) : (
                            <Row>
                                {services.map((service) => (
                                    <Col lg={4} md={6} sm={12} className="mb-4" key={service.id}>
                                        <Card className="service-card h-100">
                                            <Card.Body className="text-center d-flex flex-column">
                                                <div className="service-icon mb-3">
                                                    {getServiceIcon(service.category)}
                                                </div>
                                                <Card.Title className="mb-3">{service.name}</Card.Title>
                                                <Card.Text className="flex-grow-1 mb-3">
                                                    {service.description}
                                                </Card.Text>

                                                {/* Features */}
                                                {service.features && service.features.length > 0 && (
                                                    <div className="service-features mb-3">
                                                        <ul className="list-unstyled">
                                                            {service.features.map((feature, index) => (
                                                                <li key={index} className="feature-item">
                                                                    <FaShieldAlt className="feature-icon me-2" />
                                                                    {feature}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Price and Duration */}
                                                <div className="service-info mb-3">
                                                    <div className="price-tag">
                                                        <strong>{formatPrice(service.price)}</strong>
                                                    </div>
                                                    {service.durationDays && (
                                                        <div className="duration-tag mt-2">
                                                            <FaClock className="me-1" />
                                                            {service.durationDays} ngày
                                                        </div>
                                                    )}
                                                </div>

                                                <Button variant="primary" className="mt-auto">
                                                    Đặt dịch vụ
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Container>
                </section>

                {/* Service Comparison Section */}
                <section className="comparison-section">
                    <Container>
                        <div className="section-header text-center">
                            <h2 className="section-title">So sánh các dịch vụ</h2>
                            <p className="section-description">
                                Chọn dịch vụ phù hợp với nhu cầu của bạn
                            </p>
                        </div>

                        {!loading && services.length > 0 && (
                            <div className="comparison-table-wrapper">
                                <div className="table-responsive">
                                    <table className="table comparison-table">
                                        <thead>
                                            <tr>
                                                <th>Tiêu chí</th>
                                                {services.map((service) => (
                                                    <th key={service.id} className="text-center">
                                                        {service.name}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><strong>Giá dịch vụ</strong></td>
                                                {services.map((service) => (
                                                    <td key={service.id} className="text-center">
                                                        <span className="price-highlight">
                                                            {formatPrice(service.price)}
                                                        </span>
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr>
                                                <td><strong>Thời gian</strong></td>
                                                {services.map((service) => (
                                                    <td key={service.id} className="text-center">
                                                        {service.durationDays} ngày
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr>
                                                <td><strong>Độ chính xác</strong></td>
                                                {services.map((service) => (
                                                    <td key={service.id} className="text-center">
                                                        99.9%
                                                    </td>
                                                ))}
                                            </tr>
                                            <tr>
                                                <td><strong>Chứng thư uy tín</strong></td>
                                                {services.map((service) => (
                                                    <td key={service.id} className="text-center">
                                                        <FaShieldAlt className="text-success" />
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
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
                                            <h5>Chính xác – Bảo mật – Có giá trị pháp lý</h5>
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
                                            <h5>Thiết bị đạt chuẩn quốc tế, quy trình đạt ISO</h5>
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
            <style>
                {`
                /* Welcome Section */
                .welcome-section {
                    background: linear-gradient(120deg, #e0e7ff 0%, #f8fafc 100%);
                    padding: 70px 0 50px 0;
                    border-bottom: 1px solid #e3e6f0;
                    min-height: 420px;
                }
                .welcome-content {
                    max-width: 600px;
                    margin: 0 auto 0 0;
                }
                .welcome-title {
                    font-size: 2.7rem;
                    font-weight: 800;
                    color: #2c3e50;
                    line-height: 1.15;
                }
                .brand-name {
                    color: #6c63ff;
                    text-shadow: 0 2px 8px rgba(108,99,255,0.08);
                }
                .welcome-subtitle {
                    font-size: 1.3rem;
                    font-weight: 600;
                    color: #34495e;
                    line-height: 1.4;
                }
                .welcome-list {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 24px 0;
                }
                .welcome-list li {
                    font-size: 1.08rem;
                    color: #495057;
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    font-weight: 500;
                }
                .welcome-icon {
                    color: #6c63ff;
                    font-size: 1.3rem;
                    margin-right: 12px;
                    display: inline-flex;
                    align-items: center;
                }
                .welcome-buttons .btn {
                    min-width: 180px;
                    font-size: 1.08rem;
                    font-weight: 600;
                }
                .welcome-logo-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                }
                .welcome-logo {
                    max-width: 320px;
                    width: 100%;
                    border-radius: 22px;
                    box-shadow: 0 8px 32px rgba(108,99,255,0.13);
                    background: #fff;
                    padding: 18px 18px 10px 18px;
                }
                @media (max-width: 992px) {
                    .welcome-title {
                        font-size: 2.1rem;
                    }
                    .welcome-logo {
                        max-width: 220px;
                    }
                }
                @media (max-width: 768px) {
                    .welcome-section {
                        padding: 40px 0 30px 0;
                    }
                    .welcome-title {
                        font-size: 1.5rem;
                    }
                    .welcome-subtitle {
                        font-size: 1.05rem;
                    }
                    .welcome-logo {
                        max-width: 160px;
                        padding: 10px;
                    }
                }
                @media (max-width: 576px) {
                    .welcome-title {
                        font-size: 1.1rem;
                    }
                    .welcome-subtitle {
                        font-size: 0.95rem;
                    }
                    .welcome-list li {
                        font-size: 0.95rem;
                    }
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

                .service-features {
                    text-align: left;
                }

                .feature-item {
                    font-size: 0.9rem;
                    color: #6c757d;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                }

                .feature-icon {
                    color: #28a745;
                    font-size: 0.8rem;
                }

                .service-info {
                    border-top: 1px solid #e9ecef;
                    padding-top: 15px;
                }

                .price-tag {
                    font-size: 1.5rem;
                    color: #007bff;
                    font-weight: 600;
                }

                .duration-tag {
                    font-size: 0.9rem;
                    color: #6c757d;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* Comparison Section */
                .comparison-section {
                    padding: 80px 0;
                    background: #ffffff;
                }

                .comparison-table-wrapper {
                    background: #f8f9fa;
                    border-radius: 15px;
                    padding: 30px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                }

                .comparison-table {
                    margin-bottom: 0;
                    background: white;
                    border-radius: 10px;
                    overflow: hidden;
                }

                .comparison-table th {
                    background: #007bff;
                    color: white;
                    font-weight: 600;
                    border: none;
                    padding: 20px 15px;
                    vertical-align: middle;
                }

                .comparison-table td {
                    padding: 20px 15px;
                    vertical-align: middle;
                    border-color: #e9ecef;
                }

                .comparison-table tbody tr:nth-child(even) {
                    background-color: #f8f9fa;
                }

                .price-highlight {
                    font-size: 1.2rem;
                    font-weight: 600;
                    color: #007bff;
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

                .relationship-list {
                    margin-top: 10px;
                    text-align: center;
                }

                .relationship-item {
                    color: #495057;
                    margin-bottom: 5px;
                    padding-left: 5px;
                }

                .relationship-item:last-child {
                    margin-bottom: 0;
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
                `}
            </style>
        </>
    );
}

export default Home;
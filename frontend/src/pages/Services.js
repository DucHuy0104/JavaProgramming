import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { FaHome, FaUserNurse, FaHospital, FaArrowRight, FaCheckCircle, FaClock, FaShieldAlt, FaFileAlt, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { createOrder } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function Services() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        serviceType: '',
        preferredDate: '',
        preferredTime: '',
        notes: ''
    });

    // Fetch services from API
    useEffect(() => {
        fetchServices();
        fetchApprovedFeedback();
    }, []);

    // Fetch approved feedback
    const fetchApprovedFeedback = async () => {
        try {
            const response = await fetch('http://localhost:8081/api/feedback');
            const result = await response.json();

            if (result) {
                // Chỉ lấy feedback đã được duyệt
                const approvedFeedback = result.filter(fb => fb.status === 'approved')
                    .map(fb => ({
                        rating: fb.rating,
                        comment: fb.message,
                        user: fb.name
                    }));
                setFeedbackData(approvedFeedback);
            }
        } catch (error) {
            console.error('Error fetching feedback:', error);
        }
    };

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8081/api/services');
            const result = await response.json();

            if (result.data) {
                // Transform API data to match component structure
                const transformedServices = result.data.map((service, index) => ({
                    id: service.id,
                    title: service.name,
                    icon: getServiceIcon(service.category),
                    color: getServiceColor(index),
                    price: formatPrice(service.price),
                    features: service.features || getDefaultFeatures(service.category),
                    description: service.description,
                    featured: index === 1, // Make middle service featured
                    durationDays: service.durationDays,
                    category: service.category
                }));
                setServices(transformedServices);
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
                return FaHome;
            case 'DNA_PROFESSIONAL':
                return FaUserNurse;
            case 'DNA_FACILITY':
                return FaHospital;
            default:
                return FaFileAlt;
        }
    };

    // Function to get color based on index
    const getServiceColor = (index) => {
        const colors = ['#007bff', '#28a745', '#dc3545'];
        return colors[index % colors.length];
    };

    // Function to format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Function to get default features based on category
    const getDefaultFeatures = (category) => {
        switch (category) {
            case 'DNA_HOME':
                return [
                    'Bộ kit được gửi tận nhà',
                    'Hướng dẫn chi tiết',
                    'Tiết kiệm thời gian',
                    'Phù hợp mọi lứa tuổi'
                ];
            case 'DNA_PROFESSIONAL':
                return [
                    'Nhân viên chuyên nghiệp',
                    'Thu mẫu tại nhà',
                    'Đảm bảo chất lượng',
                    'Hỗ trợ mọi lứa tuổi'
                ];
            case 'DNA_FACILITY':
                return [
                    'Trang thiết bị hiện đại',
                    'Đội ngũ y tế chuyên nghiệp',
                    'Kết quả chính xác nhất',
                    'Chứng nhận pháp lý'
                ];
            default:
                return [
                    'Dịch vụ chuyên nghiệp',
                    'Kết quả chính xác',
                    'Hỗ trợ tận tình'
                ];
        }
    };

    const handleServiceSelect = (service) => {
        // Kiểm tra đăng nhập trước khi cho phép đặt dịch vụ
        if (!isAuthenticated) {
            setShowLoginModal(true);
            return;
        }

        setSelectedService(service);
        setFormData(prev => ({
            ...prev,
            serviceType: service.title,
            // Pre-fill user info if available
            fullName: user?.fullName || '',
            email: user?.email || '',
            phone: user?.phoneNumber || user?.phone || ''
        }));
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedService(null);
        setFormData({
            fullName: '',
            phone: '',
            email: '',
            address: '',
            serviceType: '',
            preferredDate: '',
            preferredTime: '',
            notes: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Debug log
            console.log('Selected Service:', selectedService);
            console.log('Selected Service Category:', selectedService?.category);

            // Xác định orderType dựa trên category của service
            let orderType = 'in_clinic'; // default
            if (selectedService) {
                switch (selectedService.category) {
                    case 'DNA_HOME':
                        orderType = 'self_submission';
                        break;
                    case 'DNA_PROFESSIONAL':
                        orderType = 'home_collection';
                        break;
                    case 'DNA_FACILITY':
                        orderType = 'in_clinic';
                        break;
                    default:
                        orderType = 'in_clinic';
                }
            }

            console.log('Determined orderType:', orderType);

            await createOrder({
                ...formData,
                orderDate: new Date().toISOString(),
                status: 'pending_registration',
                paymentStatus: 'pending',
                orderType: orderType,
                totalAmount: selectedService ? selectedService.price : 0,
                serviceName: selectedService ? selectedService.name : '',
                serviceCategory: selectedService ? selectedService.category : '',
                customerName: formData.fullName,
                notes: formData.notes
            });
            alert('Yêu cầu đặt dịch vụ đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.');
            handleCloseModal();
        } catch (error) {
            alert('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại!');
        }
    };



    const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [feedbackData, setFeedbackData] = useState([]);

  const closePopup = () => {
    document.getElementById('notification-popup').classList.remove('show');
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Kết Quả Phân Tích DNA', 20, 20);
    autoTable(doc, {
      head: [['Mã Mẫu', 'Độ Dài Chuỗi', 'Tỷ Lệ GC (%)', 'Trạng Thái']],
      body: [
        ['DNA001', 1200, 45.5, 'Hoàn tất'],
        ['DNA002', 850, 38.2, 'Đang xử lý'],
        ['DNA003', 2000, 50.1, 'Hoàn tất'],
      ],
      startY: 30,
      styles: { fillColor: [240, 248, 255] },
      headStyles: { fillColor: [30, 144, 255] },
    });
    doc.save('ket_qua_dna.pdf');
    setPopupMessage('Đã tải kết quả thành công!');
    document.getElementById('notification-popup').classList.add('show');
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;
    const newFeedback = { rating, comment, user: `Người dùng ${feedbackData.length + 1}` };
    setFeedbackData([...feedbackData, newFeedback]);
    setPopupMessage(`Phản hồi đã gửi! Đánh giá: ${rating} sao`);
    document.getElementById('notification-popup').classList.add('show');
    setRating(0);
    setComment('');
  };

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
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3 text-muted">Đang tải dịch vụ...</p>
                        </div>
                    ) : (
                        <Row>
                            {services.map((service) => (
                            <Col lg={4} md={6} sm={12} className="mb-4" key={service.id}>
                                <Card className={`h-100 border-0 shadow-lg service-card ${service.featured ? 'featured' : ''}`}>
                                    <Card.Body className="text-center p-4">
                                        {service.featured && (
                                            <div className="featured-badge">Phổ biến</div>
                                        )}
                                        <div className="service-icon mb-4">
                                            <service.icon size={60} color={service.color} />
                                        </div>
                                        <Card.Title className="fw-bold mb-3">{service.title}</Card.Title>
                                        <Card.Text className="text-muted">
                                            {service.description}
                                        </Card.Text>
                                        {service.features && service.features.length > 0 && (
                                            <div className="service-features mb-3">
                                                {service.features.map((feature, index) => (
                                                    <div className="feature-item" key={index}>
                                                        <FaCheckCircle className="text-success me-2" />
                                                        <span>{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <div className="service-price mb-3">
                                            <span className="price-label">Giá từ:</span>
                                            <span className="price-amount">{service.price}</span>
                                        </div>
                                        <div className="mt-3">
                                            <Button 
                                                variant={service.featured ? "success" : "primary"} 
                                                className="me-2"
                                                onClick={() => handleServiceSelect(service)}
                                            >
                                                Đặt dịch vụ <FaArrowRight className="ms-2" />
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                        </Row>
                    )}
                </Container>
            </section>

            {/* Modal Đặt Dịch Vụ */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>
                        <FaFileAlt className="me-2" />
                        Đặt dịch vụ xét nghiệm DNA
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {selectedService && (
                        <div className="selected-service-info mb-4 p-3 bg-light rounded">
                            <h6 className="fw-bold mb-2">Dịch vụ đã chọn:</h6>
                            <div className="d-flex align-items-center">
                                <selectedService.icon size={30} color={selectedService.color} className="me-3" />
                                <div>
                                    <h6 className="mb-1">{selectedService.title}</h6>
                                    <p className="text-muted mb-0">Giá: {selectedService.price}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Họ và tên *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Nhập họ và tên đầy đủ"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Số điện thoại *</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Nhập số điện thoại"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Nhập email (không bắt buộc)"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Loại dịch vụ *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="serviceType"
                                        value={formData.serviceType}
                                        onChange={handleInputChange}
                                        required
                                        readOnly
                                        className="bg-light"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Địa chỉ *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                                placeholder="Nhập địa chỉ chi tiết"
                            />
                        </Form.Group>
                        
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Ngày mong muốn *</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="preferredDate"
                                        value={formData.preferredDate}
                                        onChange={handleInputChange}
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Thời gian mong muốn</Form.Label>
                                    <Form.Select
                                        name="preferredTime"
                                        value={formData.preferredTime}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Chọn thời gian</option>
                                        <option value="08:00-10:00">08:00 - 10:00</option>
                                        <option value="10:00-12:00">10:00 - 12:00</option>
                                        <option value="14:00-16:00">14:00 - 16:00</option>
                                        <option value="16:00-18:00">16:00 - 18:00</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Ghi chú</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                placeholder="Nhập thông tin bổ sung hoặc yêu cầu đặc biệt (nếu có)"
                            />
                        </Form.Group>
                        
                        <div className="alert alert-info">
                            <small>
                                <strong>Lưu ý:</strong> Sau khi gửi yêu cầu, chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ để xác nhận và sắp xếp lịch hẹn.
                            </small>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        <FaTimes className="me-2" />
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        <FaFileAlt className="me-2" />
                        Gửi yêu cầu
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Login Required Modal */}
            <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Yêu cầu đăng nhập</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                    <div className="mb-3">
                        <FaShieldAlt size={48} className="text-primary mb-3" />
                        <h5>Bạn cần đăng nhập để đặt dịch vụ</h5>
                        <p className="text-muted">
                            Để đảm bảo an toàn và theo dõi đơn hàng, vui lòng đăng nhập trước khi đặt dịch vụ.
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
                        Hủy
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            setShowLoginModal(false);
                            navigate('/login', { state: { from: { pathname: '/services' } } });
                        }}
                    >
                        Đăng nhập ngay
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Comparison Section */}
            <section className="comparison-section py-5 bg-light">
                <Container>
                    <Row className="mb-5">
                        <Col lg={12} className="text-center">
                            <h2 className="display-4 fw-bold mb-3">So sánh các dịch vụ</h2>
                            <p className="lead text-muted">Chọn dịch vụ phù hợp nhất với nhu cầu của bạn</p>
                        </Col>
                    </Row>
                    {!loading && services.length > 0 && (
                        <Row>
                            <Col lg={12}>
                                <Card className="border-0 shadow-lg">
                                    <Card.Body className="p-0">
                                        <div className="table-responsive">
                                            <table className="table table-hover mb-0">
                                                <thead className="table-primary">
                                                    <tr>
                                                        <th className="text-center">Tính năng</th>
                                                        {services.map((service) => (
                                                            <th key={service.id} className="text-center">
                                                                {service.title}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="fw-bold">Giá dịch vụ</td>
                                                        {services.map((service) => (
                                                            <td key={service.id} className="text-center">
                                                                <span className="fw-bold text-primary">
                                                                    {service.price}
                                                                </span>
                                                            </td>
                                                        ))}
                                                    </tr>
                                                    <tr>
                                                        <td className="fw-bold">Thời gian</td>
                                                        {services.map((service) => (
                                                            <td key={service.id} className="text-center">
                                                                <FaClock className="text-warning me-2" />
                                                                {service.durationDays} ngày
                                                            </td>
                                                        ))}
                                                    </tr>
                                                    <tr>
                                                        <td className="fw-bold">Độ chính xác</td>
                                                        {services.map((service) => (
                                                            <td key={service.id} className="text-center">99.9%</td>
                                                        ))}
                                                    </tr>
                                                    <tr>
                                                        <td className="fw-bold">Chứng nhận pháp lý</td>
                                                        {services.map((service) => (
                                                            <td key={service.id} className="text-center">
                                                                <FaShieldAlt className="text-success" />
                                                            </td>
                                                        ))}
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}
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

            {/* Notification Pop-up */}
            <div
              id="notification-popup"
              className="popup fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg z-50 d-none"
              style={{ animation: 'fadeIn 0.3s ease-in' }}
            >
              <p id="popup-message" className="text-gray-700">{popupMessage}</p>
              <Button variant="primary" className="mt-4" onClick={closePopup}>
                Đóng
              </Button>
            </div>

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


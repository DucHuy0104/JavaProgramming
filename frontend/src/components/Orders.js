import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { FaFileAlt, FaDownload, FaEye, FaTimes, FaPlus, FaCalendarAlt, FaDollarSign, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch orders from API
  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Fetching orders with token:', token ? 'Token exists' : 'No token');

      const response = await fetch('http://localhost:8081/api/orders/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Orders data:', data);
        setOrders(data);
        setError(''); // Clear any previous errors
      } else if (response.status === 404) {
        // No orders found - this is normal, not an error
        console.log('No orders found (404)');
        setOrders([]);
        setError('');
      } else {
        console.log('Error response:', response.status, response.statusText);
        throw new Error('Không thể tải danh sách đơn hàng');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Không hiển thị lỗi, chỉ set empty state
      setOrders([]);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <FaFileAlt size={80} className="text-muted mb-4" />
            <h2 className="mb-4">Vui lòng đăng nhập để xem đơn xét nghiệm</h2>
            <Button variant="primary" href="/login">
              Đăng nhập ngay
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending_registration':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'in_progress':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending_registration':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'in_progress':
        return 'Đang xử lý';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatPrice = (price) => {
    if (!price) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Xem chi tiết đơn hàng
  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  // Hủy đơn hàng
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Cancelling order:', orderId);
      console.log('Token:', token ? 'Token exists' : 'No token');

      const response = await fetch(`http://localhost:8081/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      console.log('Cancel response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Cancel result:', result);
        // Refresh danh sách orders
        fetchUserOrders();
        alert('Đơn hàng đã được hủy thành công!');
      } else {
        const errorText = await response.text();
        console.log('Cancel error response:', errorText);
        throw new Error(`Không thể hủy đơn hàng: ${response.status}`);
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại sau.');
    }
  };

  // Đóng modal chi tiết
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Đang tải danh sách đơn hàng...</p>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h2 mb-0">
              <FaFileAlt className="me-3 text-primary" />
              Đơn xét nghiệm của tôi
            </h1>
            <Button variant="primary" href="/services">
              <FaPlus className="me-2" />
              Đặt dịch vụ mới
            </Button>
          </div>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          {orders.length === 0 ? (
            <Card className="text-center py-5">
              <Card.Body>
                <FaFileAlt size={80} className="text-muted mb-4" />
                <h3 className="mb-3">Chưa có đơn xét nghiệm nào</h3>
                <p className="text-muted mb-4">
                  Bạn chưa có đơn xét nghiệm nào. Hãy đặt dịch vụ xét nghiệm ngay!
                </p>
                <Button variant="primary" href="/services">
                  <FaPlus className="me-2" />
                  Đặt dịch vụ ngay
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <Row>
              {orders.map((order) => (
                <Col lg={6} className="mb-4" key={order.id}>
                  <Card className="h-100 shadow-sm">
                    <Card.Header className="bg-primary text-white">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">#{order.orderNumber}</h5>
                        <Badge bg={getStatusVariant(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                      </div>
                    </Card.Header>

                    <Card.Body>
                      <Row className="mb-3">
                        <Col sm={6}>
                          <small className="text-muted">Loại xét nghiệm</small>
                          <p className="mb-0 fw-bold">{order.serviceName}</p>
                        </Col>
                        <Col sm={6}>
                          <small className="text-muted">Khách hàng</small>
                          <p className="mb-0">{order.customerName}</p>
                        </Col>
                      </Row>

                      <Row className="mb-3">
                        <Col sm={6}>
                          <small className="text-muted">
                            <FaCalendarAlt className="me-1" />
                            Ngày đặt
                          </small>
                          <p className="mb-0">{formatDate(order.orderDate)}</p>
                        </Col>
                        <Col sm={6}>
                          <small className="text-muted">
                            <FaDollarSign className="me-1" />
                            Giá tiền
                          </small>
                          <p className="mb-0 fw-bold text-success">
                            {formatPrice(order.totalAmount)}
                          </p>
                        </Col>
                      </Row>

                      {order.notes && (
                        <div className="mb-3">
                          <small className="text-muted">Ghi chú</small>
                          <p className="mb-0 small">{order.notes}</p>
                        </div>
                      )}
                    </Card.Body>

                    <Card.Footer className="bg-light">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleViewDetail(order)}
                          >
                            <FaEye className="me-1" />
                            Chi tiết
                          </Button>
                          {order.status === 'completed' && (
                            <Button variant="outline-success" size="sm" className="ms-2">
                              <FaDownload className="me-1" />
                              Kết quả
                            </Button>
                          )}
                        </div>

                        {order.status === 'pending_registration' && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            <FaTimes className="me-1" />
                            Hủy đơn
                          </Button>
                        )}
                      </div>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>

      {/* Modal Chi tiết đơn hàng */}
      <Modal show={showDetailModal} onHide={handleCloseDetailModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaFileAlt className="me-2" />
            Chi tiết đơn hàng #{selectedOrder?.orderNumber}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <Row className="mb-4">
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Header className="bg-primary text-white">
                      <h6 className="mb-0">Thông tin dịch vụ</h6>
                    </Card.Header>
                    <Card.Body>
                      <p><strong>Dịch vụ:</strong> {selectedOrder.serviceName}</p>
                      <p><strong>Danh mục:</strong> {selectedOrder.serviceCategory}</p>
                      <p><strong>Loại đơn:</strong> {selectedOrder.orderType}</p>
                      <p><strong>Giá tiền:</strong>
                        <span className="text-success fw-bold ms-2">
                          {formatPrice(selectedOrder.totalAmount)}
                        </span>
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Header className="bg-info text-white">
                      <h6 className="mb-0">Thông tin khách hàng</h6>
                    </Card.Header>
                    <Card.Body>
                      <p><strong>Họ tên:</strong> {selectedOrder.customerName}</p>
                      {selectedOrder.email && (
                        <p>
                          <FaEnvelope className="me-2" />
                          <strong>Email:</strong> {selectedOrder.email}
                        </p>
                      )}
                      {selectedOrder.phone && (
                        <p>
                          <FaPhone className="me-2" />
                          <strong>Điện thoại:</strong> {selectedOrder.phone}
                        </p>
                      )}
                      {selectedOrder.address && (
                        <p>
                          <FaMapMarkerAlt className="me-2" />
                          <strong>Địa chỉ:</strong> {selectedOrder.address}
                        </p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col md={6}>
                  <Card>
                    <Card.Header className="bg-warning text-dark">
                      <h6 className="mb-0">Trạng thái đơn hàng</h6>
                    </Card.Header>
                    <Card.Body>
                      <p>
                        <strong>Trạng thái:</strong>
                        <Badge bg={getStatusVariant(selectedOrder.status)} className="ms-2">
                          {getStatusText(selectedOrder.status)}
                        </Badge>
                      </p>
                      <p>
                        <strong>Thanh toán:</strong>
                        <Badge bg={selectedOrder.paymentStatus === 'paid' ? 'success' : 'warning'} className="ms-2">
                          {selectedOrder.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </Badge>
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card>
                    <Card.Header className="bg-secondary text-white">
                      <h6 className="mb-0">Thời gian</h6>
                    </Card.Header>
                    <Card.Body>
                      <p>
                        <FaCalendarAlt className="me-2" />
                        <strong>Ngày đặt:</strong> {formatDate(selectedOrder.orderDate)}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {selectedOrder.notes && (
                <Card>
                  <Card.Header className="bg-light">
                    <h6 className="mb-0">Ghi chú</h6>
                  </Card.Header>
                  <Card.Body>
                    <p className="mb-0" style={{ whiteSpace: 'pre-line' }}>
                      {selectedOrder.notes}
                    </p>
                  </Card.Body>
                </Card>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailModal}>
            Đóng
          </Button>
          {selectedOrder?.status === 'pending_registration' && (
            <Button
              variant="danger"
              onClick={() => {
                handleCancelOrder(selectedOrder.id);
                handleCloseDetailModal();
              }}
            >
              <FaTimes className="me-1" />
              Hủy đơn hàng
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Orders;

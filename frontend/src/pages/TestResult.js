import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Form, Table } from 'react-bootstrap';
import { orderAPI, fileAPI } from '../services/api';

const TestResult = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const searchOrder = async () => {
    if (!orderNumber.trim()) {
      setError('Vui lòng nhập mã đơn hàng');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      console.log('Searching for order:', orderNumber);
      const response = await orderAPI.getOrderByNumber(orderNumber);
      
      if (response.success) {
        setOrder(response.data);
        console.log('Order found:', response.data);
      } else {
        setError('Không tìm thấy đơn hàng với mã: ' + orderNumber);
        setOrder(null);
      }
    } catch (error) {
      console.error('Error searching order:', error);
      setError('Lỗi khi tìm kiếm đơn hàng: ' + (error.message || error));
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const downloadResult = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      console.log('Downloading result for order:', order.id);
      const result = await fileAPI.downloadTestResult(order.id);

      if (result.success) {
        setSuccess('Tải file kết quả thành công!');
      }
    } catch (error) {
      console.error('Error downloading result:', error);
      setError('Lỗi khi tải file: ' + (error.message || error));
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Chờ xử lý',
      'accepted': 'Đã tiếp nhận',
      'kit_sent': 'Đã gửi kit',
      'sample_collected_self': 'Đã lấy mẫu tự thu',
      'sample_collected_home': 'Đã lấy mẫu tại nhà',
      'sample_received_lab': 'Đã nhận mẫu tại lab',
      'testing_in_progress': 'Đang xét nghiệm',
      'results_recorded': 'Kết quả đã ghi nhận',
      'results_delivered': 'Đã trả kết quả',
      'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'info';
      case 'kit_sent': return 'primary';
      case 'sample_collected_self':
      case 'sample_collected_home':
      case 'sample_received_lab': return 'secondary';
      case 'testing_in_progress': return 'warning';
      case 'results_recorded': return 'info';
      case 'results_delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">Tra cứu kết quả xét nghiệm</h4>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              {success && (
                <Alert variant="success" className="mb-3">
                  {success}
                </Alert>
              )}

              <Form onSubmit={(e) => { e.preventDefault(); searchOrder(); }}>
                <Row className="mb-3">
                  <Col md={8}>
                    <Form.Group>
                      <Form.Label>Mã đơn hàng</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nhập mã đơn hàng (ví dụ: ORD-20241207-001)"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4} className="d-flex align-items-end">
                    <Button 
                      variant="primary" 
                      onClick={searchOrder}
                      disabled={loading}
                      className="w-100"
                    >
                      {loading ? 'Đang tìm...' : 'Tìm kiếm'}
                    </Button>
                  </Col>
                </Row>
              </Form>

              {order && (
                <div className="mt-4">
                  <h5>Thông tin đơn hàng</h5>
                  <Table striped bordered hover>
                    <tbody>
                      <tr>
                        <td><strong>Mã đơn hàng:</strong></td>
                        <td>{order.orderNumber}</td>
                      </tr>
                      <tr>
                        <td><strong>Tên khách hàng:</strong></td>
                        <td>{order.customerName}</td>
                      </tr>
                      <tr>
                        <td><strong>Email:</strong></td>
                        <td>{order.email}</td>
                      </tr>
                      <tr>
                        <td><strong>Số điện thoại:</strong></td>
                        <td>{order.phone}</td>
                      </tr>
                      <tr>
                        <td><strong>Dịch vụ:</strong></td>
                        <td>{order.serviceName}</td>
                      </tr>
                      <tr>
                        <td><strong>Tổng tiền:</strong></td>
                        <td>{formatCurrency(order.totalAmount)}</td>
                      </tr>
                      <tr>
                        <td><strong>Trạng thái:</strong></td>
                        <td>
                          <span className={`badge bg-${getStatusVariant(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Ngày đặt:</strong></td>
                        <td>{formatDate(order.orderDate)}</td>
                      </tr>
                      <tr>
                        <td><strong>Kết quả xét nghiệm:</strong></td>
                        <td>
                          {order.resultFilePath && order.status === 'results_delivered' ? (
                            <div>
                              <span className="text-success me-2">✅ Kết quả đã sẵn sàng</span>
                              <Button
                                variant="success"
                                size="sm"
                                onClick={downloadResult}
                                disabled={loading}
                              >
                                {loading ? 'Đang tải...' : '📄 Tải kết quả PDF'}
                              </Button>
                            </div>
                          ) : order.resultFilePath && order.status === 'results_recorded' ? (
                            <span className="text-warning">⏳ Kết quả đang được xử lý</span>
                          ) : (
                            <span className="text-muted">Chưa có kết quả</span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TestResult;

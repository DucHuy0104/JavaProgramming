import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Modal } from 'react-bootstrap';
import { FaCalendarAlt, FaDollarSign, FaEye, FaDownload } from 'react-icons/fa';
import { getUserOrders, testResultAPI, fileAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import WorkflowTracker from './WorkflowTracker';
import TestResultViewer from './TestResultViewer';

const Orders = () => {
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [testResults, setTestResults] = useState({});
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(null);
  const [previousOrders, setPreviousOrders] = useState([]);
  const [hasUpdates, setHasUpdates] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      
      // Thiết lập auto-refresh mỗi 30 giây
      const interval = setInterval(() => {
        console.log('Auto-refreshing orders...');
        fetchOrders();
        setLastRefresh(new Date());
      }, 30000); // 30 giây
      
      setAutoRefreshInterval(interval);
      
      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [isAuthenticated]);

  const fetchOrders = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      
      console.log('Fetching orders...');
      const response = await getUserOrders();
      console.log('Orders fetched successfully:', response.length, 'orders');
      
      // Kiểm tra xem có cập nhật mới không
      if (previousOrders.length > 0) {
        const hasStatusChanges = response.some((newOrder, index) => {
          const oldOrder = previousOrders[index];
          return oldOrder && newOrder.status !== oldOrder.status;
        });
        
        if (hasStatusChanges) {
          setHasUpdates(true);
          // Tự động ẩn thông báo sau 5 giây
          setTimeout(() => setHasUpdates(false), 5000);
        }
      }
      
      setPreviousOrders(response);
      setOrders(response);
      
      // Fetch test results for each order
      console.log('Fetching test results for', response.length, 'orders...');
      const results = {};
      for (const order of response) {
        // Chỉ fetch test result cho các order có trạng thái phù hợp
        if (['testing_in_progress', 'results_recorded', 'results_delivered'].includes(order.status)) {
          try {
            console.log(`Fetching test result for order ${order.id}...`);
            const result = await testResultAPI.getTestResultByOrderId(order.id);
            results[order.id] = result;
            console.log(`Test result fetched successfully for order ${order.id}`);
          } catch (error) {
            // Xử lý các loại lỗi khác nhau
            if (error.isNotFound || error.response?.status === 404) {
              // Không log error cho trường hợp không tìm thấy - đây là bình thường
              console.log(`No test result found for order ${order.id} - This is normal`);
            } else if (error.response?.status === 403) {
              console.log(`Access denied for test result of order ${order.id}`);
            } else if (error.response?.status === 401) {
              console.log(`Unauthorized access for test result of order ${order.id}`);
            } else {
              console.error(`Error fetching test result for order ${order.id}:`, error);
            }
            // Không lưu kết quả nếu có lỗi
            results[order.id] = null;
          }
        } else {
          console.log(`Skipping test result fetch for order ${order.id} with status: ${order.status}`);
          results[order.id] = null;
        }
      }
      
      console.log('All test results processed. Setting results...');
      setTestResults(results);
      setLastRefresh(new Date());
      console.log('Orders and test results updated successfully');
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const getStatusVariant = (status) => {
    const statusMap = {
      'pending_registration': 'warning',
      'accepted': 'success',
      'kit_sent': 'info',
      'sample_collected_self': 'info',
      'sample_in_transit': 'info',
      'sample_received_lab': 'info',
      'testing_in_progress': 'primary',
      'results_recorded': 'success',
      'results_delivered': 'success',
      'sample_collected_clinic': 'info',
      'staff_dispatched': 'info',
      'sample_collected_home': 'info',
      'cancelled': 'danger'
    };
    return statusMap[status] || 'secondary';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'pending_registration': 'Chờ đăng ký',
      'accepted': 'Đã nhận đơn',
      'kit_sent': 'Đã gửi kit',
      'sample_collected_self': 'Đã thu mẫu',
      'sample_in_transit': 'Đang chuyển mẫu',
      'sample_received_lab': 'Đã nhận mẫu',
      'testing_in_progress': 'Đang xét nghiệm',
      'results_recorded': 'Đã ghi nhận KQ',
      'results_delivered': 'Đã trả kết quả',
      'sample_collected_clinic': 'Đã thu mẫu tại CSYT',
      'staff_dispatched': 'Đã cử nhân viên',
      'sample_collected_home': 'Đã thu mẫu tại nhà',
      'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  const getOrderTypeText = (orderType) => {
    const typeMap = {
      'self_submission': 'Tự lấy mẫu tại nhà',
      'home_collection': 'Nhân viên thu mẫu tại nhà',
      'in_clinic': 'Thu mẫu tại cơ sở'
    };
    return typeMap[orderType] || orderType;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleManualRefresh = () => {
    console.log('Manual refresh triggered');
    fetchOrders(false); // Không hiển thị loading spinner
  };

  const handleDownloadResult = async (order) => {
    try {
      console.log('Downloading result for order:', order.id);
      const result = await fileAPI.downloadTestResult(order.id);

      if (result.success) {
        // Hiển thị thông báo thành công (tùy chọn)
        console.log('Download completed successfully');
        // Có thể thêm toast notification ở đây nếu muốn
      }
    } catch (error) {
      console.error('Error downloading result:', error);
      alert('Lỗi khi tải file: ' + (error.message || error));
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Đang tải đơn hàng...</p>
        </div>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h3>Vui lòng đăng nhập để xem đơn hàng</h3>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Đơn hàng của tôi</h2>
          <div className="d-flex align-items-center gap-2">
            <small className="text-muted">
              <i className="fas fa-clock me-1"></i>
              Cập nhật lần cuối: {lastRefresh.toLocaleTimeString('vi-VN')}
            </small>
            <div className="d-flex align-items-center gap-1">
              <small className="text-success">
                <i className="fas fa-sync-alt fa-spin me-1"></i>
                Tự động cập nhật
              </small>
              <button 
                className="btn btn-outline-primary btn-sm ms-2"
                onClick={handleManualRefresh}
                title="Làm mới dữ liệu ngay"
              >
                <i className="fas fa-sync-alt"></i>
              </button>
            </div>
          </div>
        </div>
      
      {/* Thông báo cập nhật */}
      {hasUpdates && (
        <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
          <strong>🔄 Có cập nhật mới!</strong> Trạng thái đơn hàng đã được cập nhật.
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setHasUpdates(false)}
          ></button>
        </div>
      )}
      
      {orders.length === 0 ? (
        <Card>
          <Card.Body className="text-center">
            <h5>Bạn chưa có đơn hàng nào</h5>
            <p className="text-muted">Hãy đặt dịch vụ xét nghiệm để bắt đầu</p>
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

                  <Row className="mb-3">
                    <Col sm={6}>
                      <small className="text-muted">Loại dịch vụ</small>
                      <p className="mb-0">{getOrderTypeText(order.orderType)}</p>
                    </Col>
                    <Col sm={6}>
                      <small className="text-muted">Thanh toán</small>
                      <p className="mb-0">
                        <Badge bg={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
                          {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </Badge>
                      </p>
                    </Col>
                  </Row>

                  {/* Status Notifications */}
                  {order.status === 'accepted' && (
                    <div className="alert alert-success mb-3">
                      <strong>🎉 Đơn hàng đã được nhận!</strong>
                      <br />
                      Admin đã xác nhận và nhận đơn hàng của bạn. Chúng tôi sẽ sớm gửi bộ kit xét nghiệm.
                    </div>
                  )}
                  
                  {order.status === 'kit_sent' && (
                    <div className="alert alert-info mb-3">
                      <strong>📦 Bộ kit đã được gửi!</strong>
                      <br />
                      Bộ kit xét nghiệm đã được gửi đến địa chỉ của bạn. Vui lòng kiểm tra và thu thập mẫu theo hướng dẫn.
                    </div>
                  )}

                  {/* Workflow Tracker */}
                  <WorkflowTracker order={order} onRefresh={handleManualRefresh} />



                  {/* Test Result Viewer */}
                  <TestResultViewer 
                    orderId={order.id} 
                    testResult={testResults[order.id]} 
                  />

                  <div className="d-flex gap-2 mt-3">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleViewDetails(order)}
                    >
                      <FaEye className="me-1" />
                      Xem chi tiết
                    </Button>
                    
                    {order.resultFilePath && order.status === 'results_delivered' && (
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleDownloadResult(order)}
                      >
                        <FaDownload className="me-1" />
                        Tải kết quả PDF
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Detail Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Chi tiết đơn hàng #{selectedOrder?.orderNumber}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Mã đơn hàng:</strong>
                  <p className="mb-0">{selectedOrder.orderNumber}</p>
                </Col>
                <Col md={6}>
                  <strong>Trạng thái:</strong>
                  <p className="mb-0">
                    <Badge bg={getStatusVariant(selectedOrder.status)}>
                      {getStatusText(selectedOrder.status)}
                    </Badge>
                  </p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <strong>Dịch vụ:</strong>
                  <p className="mb-0">{selectedOrder.serviceName}</p>
                </Col>
                <Col md={6}>
                  <strong>Loại dịch vụ:</strong>
                  <p className="mb-0">{getOrderTypeText(selectedOrder.orderType)}</p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <strong>Ngày đặt:</strong>
                  <p className="mb-0">{formatDate(selectedOrder.orderDate)}</p>
                </Col>
                <Col md={6}>
                  <strong>Tổng tiền:</strong>
                  <p className="mb-0 fw-bold text-success">
                    {formatPrice(selectedOrder.totalAmount)}
                  </p>
                </Col>
              </Row>

              {selectedOrder.address && (
                <Row className="mb-3">
                  <Col>
                    <strong>Địa chỉ:</strong>
                    <p className="mb-0">{selectedOrder.address}</p>
                  </Col>
                </Row>
              )}

              {selectedOrder.notes && (
                <Row className="mb-3">
                  <Col>
                    <strong>Ghi chú:</strong>
                    <p className="mb-0">{selectedOrder.notes}</p>
                  </Col>
                </Row>
              )}

              {/* Status Notifications in Modal */}
              {selectedOrder.status === 'accepted' && (
                <div className="alert alert-success mb-3">
                  <strong>🎉 Đơn hàng đã được nhận!</strong>
                  <br />
                  Admin đã xác nhận và nhận đơn hàng của bạn. Chúng tôi sẽ sớm gửi bộ kit xét nghiệm.
                </div>
              )}
              
              {selectedOrder.status === 'kit_sent' && (
                <div className="alert alert-info mb-3">
                  <strong>📦 Bộ kit đã được gửi!</strong>
                  <br />
                  Bộ kit xét nghiệm đã được gửi đến địa chỉ của bạn. Vui lòng kiểm tra và thu thập mẫu theo hướng dẫn.
                </div>
              )}

              {/* Detailed Workflow Tracker */}
              <WorkflowTracker order={selectedOrder} onRefresh={handleManualRefresh} />

              {/* Detailed Test Result */}
              <TestResultViewer 
                orderId={selectedOrder.id} 
                testResult={testResults[selectedOrder.id]} 
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Orders;

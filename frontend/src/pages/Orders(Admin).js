import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Container, Row, Col, Badge, Form, InputGroup, Card } from 'react-bootstrap';
import { FaSearch, FaFilter, FaEye, FaEdit, FaDownload } from 'react-icons/fa';
import { fetchOrders } from '../services/api';


const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);



  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleUpdateStatus = async (order, newStatus) => {
    try {
      // Gọi API cập nhật trạng thái
      const response = await fetch(`http://localhost:8081/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        
        // Cập nhật danh sách orders
        setOrders(orders.map(o =>
          o.id === order.id
            ? { ...o, status: newStatus }
            : o
        ));
        
        // Cập nhật selectedOrder nếu đang mở modal
        setSelectedOrder(prev => prev && prev.id === order.id ? { ...prev, status: newStatus } : prev);
        
        console.log('Cập nhật trạng thái thành công:', updatedOrder);
      } else {
        console.error('Lỗi khi cập nhật trạng thái đơn hàng');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
    }
  };

  const handleUpdatePaymentStatus = async (order, newStatus) => {
    try {
      // Gọi API cập nhật trạng thái thanh toán
      const response = await fetch(`http://localhost:8081/api/orders/${order.id}/payment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ paymentStatus: newStatus })
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        
        // Cập nhật danh sách orders
        setOrders(orders.map(o =>
          o.id === order.id
            ? { ...o, paymentStatus: newStatus }
            : o
        ));
        
        // Cập nhật selectedOrder nếu đang mở modal
        setSelectedOrder(prev => prev && prev.id === order.id ? { ...prev, paymentStatus: newStatus } : prev);
        
        console.log('Cập nhật trạng thái thanh toán thành công:', updatedOrder);
      } else {
        console.error('Lỗi khi cập nhật trạng thái thanh toán');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái thanh toán:', error);
    }
  };

  const handleAcceptOrder = async (order) => {
    try {
      // Gọi API cập nhật trạng thái đơn hàng
      const response = await fetch(`http://localhost:8081/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'accepted' })
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        
        // Cập nhật trạng thái đơn hàng thành "accepted"
        setOrders(orders.map(o =>
          o.id === order.id
            ? { ...o, status: 'accepted' }
            : o
        ));
        
        // Cập nhật selectedOrder nếu đang mở modal
        setSelectedOrder(prev => prev && prev.id === order.id ? { ...prev, status: 'accepted' } : prev);
        
        console.log('Đơn hàng đã được nhận thành công:', updatedOrder);
      } else {
        console.error('Lỗi khi cập nhật trạng thái đơn hàng');
      }
    } catch (error) {
      console.error('Lỗi khi nhận đơn hàng:', error);
    }
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

  const getOrderTypeText = (orderType) => {
    switch (orderType) {
      case 'self_submission':
        return 'Tự lấy mẫu tại nhà';
      case 'home_collection':
        return 'Nhân viên thu mẫu tại nhà';
      case 'in_clinic':
        return 'Thu mẫu tại cơ sở';
      default:
        return orderType || 'Chưa xác định';
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'warning', text: 'Chờ xử lý' },
      processing: { bg: 'info', text: 'Đang xử lý' },
      completed: { bg: 'success', text: 'Hoàn thành' },
      cancelled: { bg: 'danger', text: 'Đã hủy' },
      pending_registration: { bg: 'secondary', text: 'Chờ Đăng ký' },
      accepted: { bg: 'success', text: 'Đã nhận đơn' },
      kit_sent: { bg: 'primary', text: 'Đã gửi Kit' },
      sample_collected_self: { bg: 'info', text: 'Đã thu mẫu (User)' },
      sample_in_transit: { bg: 'warning', text: 'Mẫu đang chuyển' },
      sample_received_lab: { bg: 'info', text: 'Đã nhận mẫu tại Lab' },
      testing_in_progress: { bg: 'primary', text: 'Đang xét nghiệm' },
      results_recorded: { bg: 'secondary', text: 'Đã ghi nhận KQ' },
      results_delivered: { bg: 'success', text: 'Đã trả KQ' },
      sample_collected_clinic: { bg: 'primary', text: 'Đã thu mẫu (CSYT)' },
    };

    const config = statusConfig[status] || { bg: 'secondary', text: status };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'warning', text: 'Chờ thanh toán' },
      paid: { bg: 'success', text: 'Đã thanh toán' },
      refunded: { bg: 'info', text: 'Đã hoàn tiền' },
      failed: { bg: 'danger', text: 'Thanh toán thất bại' }
    };

    const config = statusConfig[status] || { bg: 'secondary', text: status };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const handleCancelClick = (order) => {
    setOrderToCancel(order);
    setShowCancelConfirmModal(true);
  };

  const handleConfirmCancel = async () => {
    if (orderToCancel) {
      await handleUpdateStatus(orderToCancel, 'cancelled');
      setShowCancelConfirmModal(false);
      setOrderToCancel(null);
    }
  };

  const handleCancelModalClose = () => {
    setShowCancelConfirmModal(false);
    setOrderToCancel(null);
  };

  // Filter logic
  const filteredOrders = orders.filter(order => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        order.orderNumber?.toLowerCase().includes(searchLower) ||
        order.serviceName?.toLowerCase().includes(searchLower) ||
        order.customerName?.toLowerCase().includes(searchLower) ||
        order.email?.toLowerCase().includes(searchLower) ||
        order.phone?.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    // Status filter with grouped statuses
    if (statusFilter) {
      if (statusFilter === 'processing') {
        // Đơn đang xử lý - gom tất cả trạng thái từ pending đến results_recorded
        const processingStatuses = [
          'pending_registration',
          'accepted',
          'sample_collected_home',
          'sample_received_lab',
          'testing_in_progress',
          'results_recorded',
          'sample_collected_clinic'
        ];
        if (!processingStatuses.includes(order.status)) {
          return false;
        }
      } else if (statusFilter === 'cancelled') {
        // Đã hủy
        if (order.status !== 'cancelled') {
          return false;
        }
      } else if (statusFilter === 'completed') {
        // Đã trả kết quả
        if (order.status !== 'results_delivered') {
          return false;
        }
      }
    }

    // Service filter
    if (serviceFilter && order.serviceName !== serviceFilter) {
      return false;
    }

    // Payment status filter
    if (paymentStatusFilter && order.paymentStatus !== paymentStatusFilter) {
      return false;
    }

    // Date filter
    if (dateFilter) {
      const orderDate = new Date(order.orderDate);
      const filterDate = new Date(dateFilter);

      // Compare only date part (ignore time)
      if (orderDate.toDateString() !== filterDate.toDateString()) {
        return false;
      }
    }

    return true;
  });

  // Get unique values for filters
  const uniqueServices = [...new Set(orders.map(order => order.serviceName))].filter(Boolean);
  const uniquePaymentStatuses = [...new Set(orders.map(order => order.paymentStatus))].filter(Boolean);

  const handleDownloadResult = async (order) => {
    try {
      // Gọi API để tải kết quả xét nghiệm
      const response = await fetch(`http://localhost:8081/api/test-results/order/${order.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const testResult = await response.json();
        
        if (testResult.pdfUrl) {
          // Mở PDF trong tab mới
          window.open(testResult.pdfUrl, '_blank');
          setDownloadSuccess(true);
          setTimeout(() => setDownloadSuccess(false), 3000);
        } else {
          // Tạo và tải file JSON
          const blob = new Blob([JSON.stringify(testResult, null, 2)], { type: 'application/json' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `ket-qua-xet-nghiem-${order.orderNumber}.json`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          setDownloadSuccess(true);
          setTimeout(() => setDownloadSuccess(false), 3000);
        }
      } else {
        console.error('Không tìm thấy kết quả xét nghiệm cho đơn hàng này');
        alert('Chưa có kết quả xét nghiệm cho đơn hàng này');
      }
    } catch (error) {
      console.error('Lỗi khi tải kết quả:', error);
      alert('Có lỗi xảy ra khi tải kết quả xét nghiệm');
    }
  };



  const handleDeleteOrder = async (order) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa đơn hàng ${order.orderNumber}? Hành động này không thể hoàn tác.`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/api/orders/${order.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert('Đã xóa đơn hàng thành công!');
        // Reload orders để cập nhật
        loadOrders();
      } else {
        const errorData = await response.text();
        alert(`Lỗi: ${errorData}`);
      }
    } catch (error) {
      console.error('Lỗi khi xóa đơn hàng:', error);
      alert('Có lỗi xảy ra khi xóa đơn hàng');
    }
  };

  return (
    <Container fluid className="p-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h2 mb-0">
              <FaFilter className="me-3 text-primary" />
              Quản lý đơn hàng
            </h1>
            <div className="d-flex align-items-center gap-2">
              <Badge bg="info" className="fs-6">
                {filteredOrders.length} / {orders.length} đơn hàng
              </Badge>
            </div>
          </div>
        </Col>
      </Row>



      {/* Bộ lọc */}
      <Card className="mb-4">
        <Card.Header className="bg-light">
          <h5 className="mb-0">
            <FaFilter className="me-2" />
            Bộ lọc tìm kiếm
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4} className="mb-3">
              <Form.Label>Tìm kiếm</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Tìm theo mã đơn, tên KH, email, SĐT..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </Col>

            <Col md={2} className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="processing">Đơn đang xử lý</option>
                <option value="completed">Đã trả kết quả</option>
                <option value="cancelled">Đã hủy</option>
              </Form.Select>
            </Col>

            <Col md={2} className="mb-3">
              <Form.Label>Thanh toán</Form.Label>
              <Form.Select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
              >
                <option value="">Tất cả</option>
                {uniquePaymentStatuses.map(status => (
                  <option key={status} value={status}>
                    {getPaymentStatusBadge(status).props.children}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={2} className="mb-3">
              <Form.Label>Dịch vụ</Form.Label>
              <Form.Select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
              >
                <option value="">Tất cả dịch vụ</option>
                {uniqueServices.map(service => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={2} className="mb-3">
              <Form.Label>Ngày đặt</Form.Label>
              <Form.Control
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </Col>
          </Row>

          {(searchQuery || statusFilter || serviceFilter || dateFilter || paymentStatusFilter) && (
            <Row>
              <Col>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('');
                    setServiceFilter('');
                    setDateFilter('');
                    setPaymentStatusFilter('');
                  }}
                >
                  Xóa bộ lọc
                </Button>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Dịch vụ</th>
            <th>Ngày đặt</th>
            <th>Tổng tiền</th>
            <th>Loại đơn</th>
            <th>Trạng thái</th>
            <th>Thanh toán</th>
            <th>Kết quả</th>
            <th>Ghi chú</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length === 0 ? (
            <tr>
              <td colSpan="11" className="text-center py-4">
                <div className="text-muted">
                  <FaSearch size={48} className="mb-3" />
                  <p>Không tìm thấy đơn hàng nào phù hợp với bộ lọc.</p>
                </div>
              </td>
            </tr>
          ) : (
            filteredOrders.map(order => (
            <tr key={order.id}>
              <td>{order.orderNumber}</td>
              <td>{order.customerName}</td>
              <td>{order.serviceName}</td>
              <td>{formatDate(order.orderDate)}</td>
              <td>{formatPrice(order.totalAmount)}</td>
              <td>{getOrderTypeText(order.orderType)}</td>
              <td>{getStatusBadge(order.status)}</td>
              <td>{getPaymentStatusBadge(order.paymentStatus)}</td>
              <td>
                {(order.status === 'results_recorded' || order.status === 'results_delivered') ? (
                  <Badge bg="success">📄 Sẵn sàng</Badge>
                ) : order.status === 'testing_in_progress' ? (
                  <Badge bg="primary">🔬 Đang xét nghiệm</Badge>
                ) : (
                  <Badge bg="secondary">⏳ Chờ kết quả</Badge>
                )}
              </td>
              <td>{order.notes}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleViewOrder(order)}
                >
                  Xem
                </Button>
                

                

                

                
                {order.orderType === 'self_submission' && (
                  <>
                    {order.status === 'pending_registration' && (
                      <Button variant="outline-success" size="sm" onClick={() => handleAcceptOrder(order)}>Nhận Đơn</Button>
                    )}
                    {order.status === 'accepted' && (
                      <Button variant="outline-info" size="sm" onClick={() => handleUpdateStatus(order, 'kit_sent')}>Gửi Kit</Button>
                    )}
                    {order.status === 'kit_sent' && (
                      <Button variant="outline-info" size="sm" onClick={() => handleUpdateStatus(order, 'sample_collected_self')}>User Đã Thu Mẫu</Button>
                    )}
                    {order.status === 'sample_collected_self' && (
                      <Button variant="outline-info" size="sm" onClick={() => handleUpdateStatus(order, 'sample_in_transit')}>Đang Chuyển Mẫu</Button>
                    )}
                    {order.status === 'sample_in_transit' && (
                      <Button variant="outline-success" size="sm" onClick={() => handleUpdateStatus(order, 'sample_received_lab')}>Đã Nhận Mẫu</Button>
                    )}
                    {order.status === 'sample_received_lab' && (
                      <Button variant="outline-success" size="sm" onClick={() => handleUpdateStatus(order, 'testing_in_progress')}>Bắt Đầu Xét Nghiệm</Button>
                    )}
                    {order.status === 'testing_in_progress' && (
                      <Button variant="outline-success" size="sm" onClick={() => handleUpdateStatus(order, 'results_recorded')}>Ghi Nhận Kết Quả</Button>
                    )}
                    {order.status === 'results_recorded' && (
                      <Button variant="outline-success" size="sm" onClick={() => handleUpdateStatus(order, 'results_delivered')}>Trả Kết Quả</Button>
                    )}
                  </>
                )}

                {order.orderType === 'in_clinic' && (
                  <>
                    {order.status === 'pending_registration' && (
                      <Button variant="outline-success" size="sm" onClick={() => handleAcceptOrder(order)}>Nhận Đơn</Button>
                    )}
                    {order.status === 'accepted' && (
                      <Button variant="outline-success" size="sm" onClick={() => handleUpdateStatus(order, 'sample_collected_clinic')}>Thu Thập Mẫu</Button>
                    )}
                    {order.status === 'sample_collected_clinic' && (
                      <Button variant="outline-success" size="sm" onClick={() => handleUpdateStatus(order, 'testing_in_progress')}>Bắt Đầu Xét Nghiệm</Button>
                    )}
                    {order.status === 'testing_in_progress' && (
                      <Button variant="outline-success" size="sm" onClick={() => handleUpdateStatus(order, 'results_recorded')}>Ghi Nhận Kết Quả</Button>
                    )}
                    {order.status === 'results_recorded' && (
                      <Button variant="outline-success" size="sm" onClick={() => handleUpdateStatus(order, 'results_delivered')}>Trả Kết Quả</Button>
                    )}
                  </>
                )}

                {order.orderType === 'home_collection' && (
                  <>
                    {order.status === 'pending_registration' && (
                      <Button variant="outline-success" size="sm" onClick={() => handleAcceptOrder(order)}>Nhận Đơn</Button>
                    )}
                    {order.status === 'accepted' && (
                      <Button variant="outline-info" size="sm" onClick={() => handleUpdateStatus(order, 'staff_dispatched')}>Cử Nhân Viên</Button>
                    )}
                    {order.status === 'staff_dispatched' && (
                      <Button variant="outline-success" size="sm" onClick={() => handleUpdateStatus(order, 'sample_collected_home')}>Đã Thu Mẫu Tại Nhà</Button>
                    )}
                    {order.status === 'sample_collected_home' && (
                      <Button variant="outline-success" size="sm" onClick={() => handleUpdateStatus(order, 'sample_received_lab')}>Đã Nhận Mẫu Tại Lab</Button>
                    )}
                    {order.status === 'sample_received_lab' && (
                      <Button variant="outline-success" size="sm" onClick={() => handleUpdateStatus(order, 'testing_in_progress')}>Bắt Đầu Xét Nghiệm</Button>
                    )}
                    {order.status === 'testing_in_progress' && (
                      <Button variant="outline-success" size="sm" onClick={() => handleUpdateStatus(order, 'results_recorded')}>Ghi Nhận Kết Quả</Button>
                    )}
                    {order.status === 'results_recorded' && (
                      <Button variant="outline-success" size="sm" onClick={() => handleUpdateStatus(order, 'results_delivered')}>Trả Kết Quả</Button>
                    )}
                  </>
                )}
                
                {/* Chỉ hiển thị nút hủy đơn khi đơn hàng chưa hoàn thành và chưa bị hủy */}
                {(order.status === 'pending_registration' || 
                  order.status === 'accepted' || 
                  order.status === 'kit_sent' || 
                  order.status === 'sample_collected_self' || 
                  order.status === 'sample_in_transit' || 
                  order.status === 'sample_received_lab' || 
                  order.status === 'sample_collected_clinic' || 
                  order.status === 'staff_dispatched' || 
                  order.status === 'sample_collected_home') && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="ms-2"
                    onClick={() => handleCancelClick(order)}
                  >
                    Hủy Đơn
                  </Button>
                )}
                
                {/* Nút tải kết quả - hiển thị khi đã có kết quả */}
                {(order.status === 'results_recorded' || order.status === 'results_delivered') && (
                  <Button
                    variant="outline-success"
                    size="sm"
                    className="ms-2"
                    onClick={() => handleDownloadResult(order)}
                    title="Tải kết quả xét nghiệm"
                  >
                    📄 Tải KQ
                  </Button>
                )}

                {/* Nút xóa đơn hàng */}
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="ms-2"
                  onClick={() => handleDeleteOrder(order)}
                  title="Xóa đơn hàng"
                >
                  🗑️ Xóa
                </Button>
              </td>
            </tr>
            ))
          )}
        </tbody>
      </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết đơn hàng - {selectedOrder?.orderNumber}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <h5>Thông tin đơn hàng</h5>
                  <p><strong>Mã đơn:</strong> {selectedOrder.orderNumber}</p>
                  <p><strong>Khách hàng:</strong> {selectedOrder.customerName}</p>
                  <p><strong>Dịch vụ:</strong> {selectedOrder.serviceName}</p>
                  <p><strong>Ngày đặt:</strong> {formatDate(selectedOrder.orderDate)}</p>
                  <p><strong>Loại đơn:</strong> {getOrderTypeText(selectedOrder.orderType)}</p>
                  <p><strong>Ghi chú:</strong> {selectedOrder.notes}</p>
                </Col>
                <Col md={6}>
                  <h5>Trạng thái</h5>
                  <p>
                    <strong>Trạng thái đơn hàng:</strong>{' '}
                    {getStatusBadge(selectedOrder.status)}
                  </p>
                  <p>
                    <strong>Trạng thái thanh toán:</strong>{' '}
                    {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                  </p>
                  <p><strong>Tổng tiền:</strong> {formatPrice(selectedOrder.totalAmount)}</p>
                  
                  {/* Thông tin kết quả xét nghiệm */}
                  {(selectedOrder.status === 'results_recorded' || selectedOrder.status === 'results_delivered') && (
                    <div className="mt-3 p-3 bg-light rounded">
                      <h6 className="text-success mb-2">📊 Kết quả xét nghiệm</h6>
                      <p className="mb-1">
                        <strong>Trạng thái:</strong> 
                        <Badge bg="success" className="ms-2">Sẵn sàng tải</Badge>
                      </p>
                      <p className="mb-1">
                        <strong>Ngày có kết quả:</strong> {selectedOrder.resultsReadyDate ? formatDate(selectedOrder.resultsReadyDate) : 'Chưa cập nhật'}
                      </p>
                      <p className="mb-0">
                        <strong>Ngày trả kết quả:</strong> {selectedOrder.resultsDeliveredDate ? formatDate(selectedOrder.resultsDeliveredDate) : 'Chưa cập nhật'}
                      </p>
                    </div>
                  )}

                  {/* Thông tin nhân viên thu mẫu tại nhà */}
                  {selectedOrder.orderType === 'home_collection' && (
                    <div className="mt-3 p-3 bg-info bg-opacity-10 rounded">
                      <h6 className="text-info mb-2">🏠 Thông tin thu mẫu tại nhà</h6>
                      <p className="mb-1">
                        <strong>Địa chỉ:</strong> {selectedOrder.address || 'Chưa cập nhật'}
                      </p>
                      <p className="mb-1">
                        <strong>Nhân viên được phân công:</strong> {selectedOrder.staffAssigned || 'Chưa phân công'}
                      </p>
                      <p className="mb-1">
                        <strong>Ngày hẹn:</strong> {selectedOrder.appointmentDate ? formatDate(selectedOrder.appointmentDate) : 'Chưa cập nhật'}
                      </p>
                      <p className="mb-0">
                        <strong>Dự kiến hoàn thành:</strong> {selectedOrder.estimatedCompletionDate ? formatDate(selectedOrder.estimatedCompletionDate) : 'Chưa cập nhật'}
                      </p>
                    </div>
                  )}
                </Col>
              </Row>

              <div className="mt-4">
                <h5>Cập nhật trạng thái</h5>
                <div className="d-flex gap-2 flex-wrap">
                  
                  {selectedOrder.orderType === 'self_submission' && selectedOrder.status !== 'results_delivered' && selectedOrder.status !== 'cancelled' && (
                    <>
                      {selectedOrder.status === 'pending_registration' && (
                        <Button variant="success" onClick={() => handleAcceptOrder(selectedOrder)}>Nhận Đơn Hàng</Button>
                      )}
                      {selectedOrder.status === 'accepted' && (
                        <Button variant="success" onClick={() => handleUpdateStatus(selectedOrder, 'kit_sent')}>Gửi Kit</Button>
                      )}
                      {selectedOrder.status === 'kit_sent' && (
                        <Button variant="success" onClick={() => handleUpdateStatus(selectedOrder, 'sample_collected_self')}>User Đã Thu Mẫu</Button>
                      )}
                      {selectedOrder.status === 'sample_collected_self' && (
                        <Button variant="success" onClick={() => handleUpdateStatus(selectedOrder, 'sample_in_transit')}>Đang Chuyển Mẫu</Button>
                      )}
                      {selectedOrder.status === 'sample_in_transit' && (
                        <Button variant="success" onClick={() => handleUpdateStatus(selectedOrder, 'sample_received_lab')}>Đã Nhận Mẫu tại Lab</Button>
                      )}
                      {selectedOrder.status === 'sample_received_lab' && (
                        <Button variant="success" onClick={() => handleUpdateStatus(selectedOrder, 'testing_in_progress')}>Bắt Đầu Xét Nghiệm</Button>
                      )}
                      {selectedOrder.status === 'testing_in_progress' && (
                        <Button variant="success" onClick={() => handleUpdateStatus(selectedOrder, 'results_recorded')}>Ghi Nhận Kết Quả</Button>
                      )}
                      {selectedOrder.status === 'results_recorded' && (
                        <Button variant="success" onClick={() => handleUpdateStatus(selectedOrder, 'results_delivered')}>Trả Kết Quả</Button>
                      )}
                    </>
                  )}

                  {selectedOrder.orderType === 'in_clinic' && selectedOrder.status !== 'results_delivered' && selectedOrder.status !== 'cancelled' && (
                    <>
                      {selectedOrder.status === 'pending_registration' && (
                        <Button variant="success" onClick={() => handleAcceptOrder(selectedOrder)}>Nhận Đơn Hàng</Button>
                      )}
                      {selectedOrder.status === 'accepted' && (
                        <Button variant="success" onClick={() => handleUpdateStatus(selectedOrder, 'sample_collected_clinic')}>Thu Thập Mẫu tại CSYT</Button>
                      )}
                      {selectedOrder.status === 'sample_collected_clinic' && (
                        <Button variant="success" onClick={() => handleUpdateStatus(selectedOrder, 'testing_in_progress')}>Bắt Đầu Xét Nghiệm</Button>
                      )}
                      {selectedOrder.status === 'testing_in_progress' && (
                        <Button variant="success" onClick={() => handleUpdateStatus(selectedOrder, 'results_recorded')}>Ghi Nhận Kết Quả</Button>
                      )}
                      {selectedOrder.status === 'results_recorded' && (
                        <Button variant="success" onClick={() => handleUpdateStatus(selectedOrder, 'results_delivered')}>Trả Kết Quả</Button>
                      )}
                    </>
                  )}

                  {selectedOrder.orderType === 'home_collection' && selectedOrder.status !== 'results_delivered' && selectedOrder.status !== 'cancelled' && (
                    <>
                      {selectedOrder.status === 'pending_registration' && (
                        <Button variant="success" onClick={() => handleAcceptOrder(selectedOrder)}>Nhận Đơn Hàng</Button>
                      )}
                      {selectedOrder.status === 'accepted' && (
                        <Button variant="info" onClick={() => handleUpdateStatus(selectedOrder, 'staff_dispatched')}>Cử Nhân Viên Thu Mẫu</Button>
                      )}
                      {selectedOrder.status === 'staff_dispatched' && (
                        <Button variant="success" onClick={() => handleUpdateStatus(selectedOrder, 'sample_collected_home')}>Đã Thu Mẫu Tại Nhà</Button>
                      )}
                      {selectedOrder.status === 'sample_collected_home' && (
                        <Button variant="success" onClick={() => handleUpdateStatus(selectedOrder, 'sample_received_lab')}>Đã Nhận Mẫu Tại Lab</Button>
                      )}
                      {selectedOrder.status === 'sample_received_lab' && (
                        <Button variant="success" onClick={() => handleUpdateStatus(selectedOrder, 'testing_in_progress')}>Bắt Đầu Xét Nghiệm</Button>
                      )}
                      {selectedOrder.status === 'testing_in_progress' && (
                        <Button variant="success" onClick={() => handleUpdateStatus(selectedOrder, 'results_recorded')}>Ghi Nhận Kết Quả</Button>
                      )}
                      {selectedOrder.status === 'results_recorded' && (
                        <Button variant="success" onClick={() => handleUpdateStatus(selectedOrder, 'results_delivered')}>Trả Kết Quả</Button>
                      )}
                    </>
                  )}

                  {/* Chỉ hiển thị nút hủy đơn khi đơn hàng chưa hoàn thành và chưa bị hủy */}
                  {(selectedOrder.status === 'pending_registration' || 
                    selectedOrder.status === 'accepted' || 
                    selectedOrder.status === 'kit_sent' || 
                    selectedOrder.status === 'sample_collected_self' || 
                    selectedOrder.status === 'sample_in_transit' || 
                    selectedOrder.status === 'sample_received_lab' || 
                    selectedOrder.status === 'sample_collected_clinic' || 
                    selectedOrder.status === 'staff_dispatched' || 
                    selectedOrder.status === 'sample_collected_home') && (
                    <Button
                      variant="danger"
                      onClick={() => handleUpdateStatus(selectedOrder, 'cancelled')}
                    >
                      Hủy Đơn Hàng
                    </Button>
                  )}

                  {selectedOrder.paymentStatus === 'pending' && (
                    <Button
                      variant="primary"
                      onClick={() => handleUpdatePaymentStatus(selectedOrder, 'paid')}
                    >
                      Xác nhận Đã Thanh Toán
                    </Button>
                  )}
                  {selectedOrder.paymentStatus === 'paid' && (
                    <Button
                      variant="secondary"
                      onClick={() => handleUpdatePaymentStatus(selectedOrder, 'refunded')}
                    >
                      Hoàn tiền
                    </Button>
                  )}
                  




                  {/* Nút tải kết quả trong modal */}
                  {(selectedOrder.status === 'results_recorded' || selectedOrder.status === 'results_delivered') && (
                    <Button
                      variant="success"
                      onClick={() => handleDownloadResult(selectedOrder)}
                    >
                      📄 Tải Kết Quả Xét Nghiệm
                    </Button>
                  )}



                  {/* Nút xóa đơn hàng trong modal */}
                  <Button
                    variant="danger"
                    className="ms-2"
                    onClick={() => handleDeleteOrder(selectedOrder)}
                  >
                    🗑️ Xóa Đơn Hàng
                  </Button>
                </div>
              </div>




            </>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showCancelConfirmModal} onHide={handleCancelModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận hủy đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderToCancel && (
            <>
              <p>Bạn có chắc chắn muốn hủy đơn hàng <strong>{orderToCancel.orderNumber}</strong>?</p>
              <p>Thông tin đơn hàng:</p>
              <ul>
                <li>Khách hàng: {orderToCancel.customerName}</li>
                <li>Dịch vụ: {orderToCancel.serviceName}</li>
                <li>Trạng thái hiện tại: {getStatusBadge(orderToCancel.status)}</li>
              </ul>
              <p className="text-danger">Lưu ý: Hành động này không thể hoàn tác.</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelModalClose}>
            Đóng
          </Button>
          <Button variant="danger" onClick={handleConfirmCancel}>
            Xác nhận hủy đơn
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrdersAdmin; 
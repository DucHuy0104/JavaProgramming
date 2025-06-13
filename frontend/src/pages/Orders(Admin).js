import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Container, Row, Col, Badge } from 'react-bootstrap';

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      // TODO: Thay thế bằng API call thực tế
      // const response = await fetch('/api/orders');
      // const data = await response.json();
      // setOrders(data);
      
      // Dữ liệu mẫu
      setOrders([
        {
          id: 1,
          orderNumber: 'ORD001',
          customerName: 'Nguyễn Văn A',
          serviceName: 'Xét nghiệm ADN cha con',
          orderDate: '2024-03-01',
          totalAmount: 5000000,
          orderType: 'self_submission',
          status: 'sample_in_transit',
          paymentStatus: 'paid'
        },
        {
          id: 2,
          orderNumber: 'ORD002',
          customerName: 'Trần Thị B',
          serviceName: 'Xét nghiệm ADN huyết thống',
          orderDate: '2024-03-05',
          totalAmount: 7000000,
          orderType: 'in_clinic',
          status: 'pending_registration',
          paymentStatus: 'pending'
        },
        {
          id: 3,
          orderNumber: 'ORD003',
          customerName: 'Lê Văn C',
          serviceName: 'Xét nghiệm ADN pháp lý',
          orderDate: '2024-03-10',
          totalAmount: 10000000,
          orderType: 'self_submission',
          status: 'results_delivered',
          paymentStatus: 'paid'
        },
        {
          id: 4,
          orderNumber: 'ORD004',
          customerName: 'Phạm Thị D',
          serviceName: 'Xét nghiệm ADN theo yêu cầu',
          orderDate: '2024-03-15',
          totalAmount: 6000000,
          orderType: 'in_clinic',
          status: 'testing_in_progress',
          paymentStatus: 'paid'
        }
      ]);
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
      // TODO: Gọi API cập nhật trạng thái
      // await fetch(`/api/orders/${order.id}`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ status: newStatus })
      // });
      
      setOrders(orders.map(o =>
        o.id === order.id
          ? { ...o, status: newStatus }
          : o
      ));
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
    }
  };

  const handleUpdatePaymentStatus = async (order, newStatus) => {
    try {
      // TODO: Gọi API cập nhật trạng thái thanh toán
      // await fetch(`/api/orders/${order.id}/payment`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ paymentStatus: newStatus })
      // });
      
      setOrders(orders.map(o =>
        o.id === order.id
          ? { ...o, paymentStatus: newStatus }
          : o
      ));
      setSelectedOrder(prev => prev ? { ...prev, paymentStatus: newStatus } : null);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái thanh toán:', error);
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'warning', text: 'Chờ xử lý' },
      processing: { bg: 'info', text: 'Đang xử lý' },
      completed: { bg: 'success', text: 'Hoàn thành' },
      cancelled: { bg: 'danger', text: 'Đã hủy' },
      pending_registration: { bg: 'secondary', text: 'Chờ Đăng ký' },
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

  return (
    <Container fluid className="p-4">
      <h1 className="h2 mb-4">Quản lý đơn hàng</h1>

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
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.orderNumber}</td>
              <td>{order.customerName}</td>
              <td>{order.serviceName}</td>
              <td>{formatDate(order.orderDate)}</td>
              <td>{formatPrice(order.totalAmount)}</td>
              <td>{order.orderType === 'self_submission' ? 'Tự gửi mẫu' : 'Tại CSYT'}</td>
              <td>{getStatusBadge(order.status)}</td>
              <td>{getPaymentStatusBadge(order.paymentStatus)}</td>
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
                
                {(order.status !== 'results_delivered' && order.status !== 'cancelled') && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="ms-2"
                    onClick={() => handleCancelClick(order)}
                  >
                    Hủy Đơn
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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
                  <p><strong>Loại đơn:</strong> {selectedOrder.orderType === 'self_submission' ? 'Tự gửi mẫu' : 'Tại CSYT'}</p>
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
                </Col>
              </Row>

              <div className="mt-4">
                <h5>Cập nhật trạng thái</h5>
                <div className="d-flex gap-2 flex-wrap">
                  {selectedOrder.orderType === 'self_submission' && selectedOrder.status !== 'results_delivered' && selectedOrder.status !== 'cancelled' && (
                    <>
                      {selectedOrder.status === 'pending_registration' && (
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

                  {(selectedOrder.status !== 'results_delivered' && selectedOrder.status !== 'cancelled') && (
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
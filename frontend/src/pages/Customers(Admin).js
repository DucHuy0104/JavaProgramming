import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Container, Row, Col, Badge } from 'react-bootstrap';
import debounce from 'lodash/debounce';

const CustomersAdmin = () => {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  });
  // New state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    loadCustomers();
  }, [filters]);

  const loadCustomers = async () => {
    try {
      // TODO: Thay thế bằng API call thực tế
      // const queryParams = new URLSearchParams(filters);
      // const response = await fetch(`/api/customers?${queryParams}`);
      // const data = await response.json();
      // setCustomers(data);
      
      // Dữ liệu trống - chờ kết nối API
      setCustomers([]);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    }
  };

  const loadOrderHistory = async (customerId) => {
    try {
      // TODO: Thay thế bằng API call thực tế
      // const response = await fetch(`/api/customers/${customerId}/orders`);
      // const data = await response.json();
      // setOrderHistory(data);
      
      // Dữ liệu trống - chờ kết nối API
      setOrderHistory([]);
    } catch (error) {
      console.error('Lỗi khi tải lịch sử đặt hàng:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      setFilters(prev => ({ ...prev, search: value }));
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleViewCustomer = async (customer) => {
    setSelectedCustomer(customer);
    setIsEditing(false); // Set to view mode
    await loadOrderHistory(customer.id);
    setShowModal(true);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setEditFormData({ ...customer }); // Populate form with customer data
    setIsEditing(true); // Set to edit mode
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // TODO: Gọi API cập nhật thông tin khách hàng
        // await fetch(`/api/customers/${editFormData.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(editFormData)
        // });
        setCustomers(customers.map(c =>
          c.id === editFormData.id ? editFormData : c
        ));
        alert('Thông tin khách hàng đã được cập nhật!');
      } else {
        // TODO: Gọi API thêm khách hàng mới (nếu có chức năng thêm)
        // const response = await fetch('/api/customers', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(editFormData)
        // });
        // const newCustomer = await response.json();
        // setCustomers([...customers, newCustomer]);
        // alert('Khách hàng mới đã được thêm!');
      }
      setShowModal(false);
      setSelectedCustomer(null);
      setIsEditing(false);
      setEditFormData({});
    } catch (error) {
      console.error('Lỗi khi lưu thông tin khách hàng:', error);
      alert('Đã xảy ra lỗi khi lưu thông tin khách hàng.');
    }
  };

  const handleToggleStatus = async (customer) => {
    try {
      // TODO: Gọi API cập nhật trạng thái
      // await fetch(`/api/customers/${customer.id}`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({
      //     status: customer.status === 'active' ? 'blocked' : 'active'
      //   })
      // });
      
      setCustomers(customers.map(c =>
        c.id === customer.id
          ? { ...c, status: c.status === 'active' ? 'blocked' : 'active' }
          : c
      ));
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
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

  return (
    <Container fluid className="p-4">
      <h1 className="h2 mb-4">Quản lý khách hàng</h1>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            onChange={handleSearchChange}
          />
        </Col>
        <Col md={4}>
          <Form.Select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="blocked">Đã khóa</option>
          </Form.Select>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Lịch sử đặt</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.fullName}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>{customer.orderCount} đơn</td>
              <td>
                <Badge bg={customer.status === 'active' ? 'success' : 'danger'}>
                  {customer.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                </Badge>
              </td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleViewCustomer(customer)}
                >
                  Xem
                </Button>
                <Button
                  variant="outline-info"
                  size="sm"
                  onClick={() => handleEditCustomer(customer)}
                >
                  Sửa
                </Button>
                {customer.status === 'active' && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="ms-2"
                    onClick={() => handleToggleStatus(customer)}
                  >
                    Khóa
                  </Button>
                )}
                {customer.status === 'blocked' && (
                  <Button
                    variant="outline-success"
                    size="sm"
                    className="ms-2"
                    onClick={() => handleToggleStatus(customer)}
                  >
                    Kích hoạt
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Sửa thông tin khách hàng' : 'Chi tiết khách hàng'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCustomer && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <h5>Thông tin cá nhân</h5>
                  {isEditing ? (
                    <Form onSubmit={handleSaveCustomer}>
                      <Form.Group className="mb-3">
                        <Form.Label>Họ tên</Form.Label>
                        <Form.Control
                          type="text"
                          name="fullName"
                          value={editFormData.fullName || ''}
                          onChange={handleFormChange}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={editFormData.email || ''}
                          onChange={handleFormChange}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Số điện thoại</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={editFormData.phone || ''}
                          onChange={handleFormChange}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Địa chỉ</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="address"
                          value={editFormData.address || ''}
                          onChange={handleFormChange}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Trạng thái</Form.Label>
                        <Form.Select
                          name="status"
                          value={editFormData.status || ''}
                          onChange={handleFormChange}
                          required
                        >
                          <option value="active">Hoạt động</option>
                          <option value="blocked">Đã khóa</option>
                        </Form.Select>
                      </Form.Group>
                      <Button variant="primary" type="submit">
                        Lưu thay đổi
                      </Button>
                      <Button variant="secondary" className="ms-2" onClick={() => setIsEditing(false)}>
                        Hủy
                      </Button>
                    </Form>
                  ) : (
                    <>
                      <p><strong>Họ tên:</strong> {selectedCustomer.fullName}</p>
                      <p><strong>Email:</strong> {selectedCustomer.email}</p>
                      <p><strong>Số điện thoại:</strong> {selectedCustomer.phone}</p>
                      <p><strong>Địa chỉ:</strong> {selectedCustomer.address}</p>
                      <p><strong>Ngày tham gia:</strong> {formatDate(selectedCustomer.joinDate)}</p>
                      <p><strong>Trạng thái:</strong>{' '}
                        <Badge bg={selectedCustomer.status === 'active' ? 'success' : 'danger'}>
                          {selectedCustomer.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                        </Badge>
                      </p>
                    </>
                  )}
                </Col>
                <Col md={6}>
                  <h5>Lịch sử đặt hàng</h5>
                  {orderHistory.length > 0 ? (
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>Dịch vụ</th>
                          <th>Ngày đặt</th>
                          <th>Trạng thái</th>
                          <th>Tổng tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderHistory.map(order => (
                          <tr key={order.id}>
                            <td>{order.serviceName}</td>
                            <td>{formatDate(order.orderDate)}</td>
                            <td>
                              <Badge bg={order.status === 'completed' ? 'success' : 'info'}>
                                {order.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                              </Badge>
                            </td>
                            <td>{formatPrice(order.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p>Chưa có đơn hàng nào.</p>
                  )}
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CustomersAdmin; 
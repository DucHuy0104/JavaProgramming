import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Container, Row, Col, Badge, Alert } from 'react-bootstrap';
import debounce from 'lodash/debounce';
import { useNavigate } from 'react-router-dom';
import { userAPI, orderAPI, authAPI } from '../services/api';

const CustomersAdmin = () => {
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState(false);

  // Kiểm tra quyền truy cập khi component mount
  useEffect(() => {
    checkPermission();
  }, []);

  useEffect(() => {
    if (hasPermission) {
      loadCustomers();
    }
  }, [filters, hasPermission]);

  const checkPermission = () => {
    const user = authAPI.getCurrentUser();
    if (!user) {
      setError('Bạn cần đăng nhập để truy cập trang này');
      navigate('/login');
      return;
    }

    // Chỉ ADMIN và MANAGER mới có quyền xem danh sách khách hàng
    if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
      setError('Bạn không có quyền truy cập trang này. Chỉ Admin và Manager mới có thể xem danh sách khách hàng.');
      setHasPermission(false);
      return;
    }

    setHasPermission(true);
  };

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError('');

      // Debug: Kiểm tra token và user
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('Current token:', token ? 'exists' : 'missing');
      console.log('Current user:', user);
      console.log('User role:', user.role);

      const response = await userAPI.getCustomers(filters.search, filters.status);
      if (response.success) {

        // Lấy tất cả orders một lần để tối ưu hiệu suất
        let allOrders = [];
        try {
          allOrders = await orderAPI.getAllOrders();
        } catch (error) {
          console.error('Lỗi khi lấy danh sách orders:', error);
        }

        // Thêm thông tin số đơn hàng cho mỗi khách hàng
        const customersWithOrderCount = response.data.map(customer => {
          const customerOrders = allOrders.filter(order => order.email === customer.email);
          return {
            ...customer,
            orderCount: customerOrders.length
          };
        });

        setCustomers(customersWithOrderCount);
      } else {
        setError(response.message || 'Lỗi khi tải dữ liệu khách hàng');
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
      console.error('Error type:', typeof error);
      console.error('Error structure:', error);

      // Xử lý error message an toàn
      let errorMessage = 'Lỗi khi tải dữ liệu khách hàng';
      if (typeof error === 'string') {
        errorMessage += ': ' + error;
      } else if (error && error.message) {
        errorMessage += ': ' + error.message;
      } else if (error && error.response && error.response.data && error.response.data.message) {
        errorMessage += ': ' + error.response.data.message;
      } else {
        errorMessage += ': ' + JSON.stringify(error);
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadOrderHistory = async (customerId) => {
    try {
      // Sử dụng API orders để lấy lịch sử đặt hàng
      const customer = customers.find(c => c.id === customerId);
      if (customer) {
        const orders = await orderAPI.getAllOrders();
        const customerOrders = orders.filter(order => order.email === customer.email);
        setOrderHistory(customerOrders);
      } else {
        setOrderHistory([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải lịch sử đặt hàng:', error);
      setOrderHistory([]);
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
        // Sử dụng API users để cập nhật thông tin khách hàng
        const response = await userAPI.updateProfile(editFormData.id, {
          fullName: editFormData.fullName,
          phoneNumber: editFormData.phoneNumber,
          address: editFormData.address,
          dateOfBirth: editFormData.dateOfBirth,
          gender: editFormData.gender
        });

        if (response.success) {
          setCustomers(customers.map(c =>
            c.id === editFormData.id ? { ...c, ...editFormData } : c
          ));
          alert('Thông tin khách hàng đã được cập nhật!');
          loadCustomers(); // Reload để lấy dữ liệu mới
        } else {
          alert('Lỗi: ' + response.message);
        }
      } else {
        // TODO: Gọi API thêm khách hàng mới (nếu có chức năng thêm)
        alert('Chức năng thêm khách hàng mới chưa được triển khai');
      }
      setShowModal(false);
      setSelectedCustomer(null);
      setIsEditing(false);
      setEditFormData({});
    } catch (error) {
      console.error('Lỗi khi lưu thông tin khách hàng:', error);

      let errorMessage = 'Đã xảy ra lỗi khi lưu thông tin khách hàng';
      if (typeof error === 'string') {
        errorMessage += ': ' + error;
      } else if (error && error.message) {
        errorMessage += ': ' + error.message;
      }

      alert(errorMessage);
    }
  };

  const handleToggleStatus = async (customer) => {
    try {
      const newStatus = customer.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

      // Sử dụng API users để cập nhật trạng thái
      const response = await userAPI.changeUserStatus(customer.id, newStatus);

      if (response.success) {
        setCustomers(customers.map(c =>
          c.id === customer.id
            ? { ...c, status: newStatus }
            : c
        ));
        alert(`Đã ${newStatus === 'ACTIVE' ? 'kích hoạt' : 'vô hiệu hóa'} khách hàng thành công!`);
      } else {
        alert('Lỗi: ' + response.message);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);

      let errorMessage = 'Lỗi khi cập nhật trạng thái';
      if (typeof error === 'string') {
        errorMessage += ': ' + error;
      } else if (error && error.message) {
        errorMessage += ': ' + error.message;
      }

      alert(errorMessage);
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

  // Nếu không có quyền, hiển thị thông báo
  if (!hasPermission && error) {
    return (
      <Container fluid className="py-4">
        <h1 className="h2 mb-4">Quản lý khách hàng</h1>
        <Alert variant="danger" className="mb-4">
          <Alert.Heading>Không có quyền truy cập</Alert.Heading>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            Vui lòng liên hệ Admin để được cấp quyền truy cập.
          </p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      <h1 className="h2 mb-4">Quản lý khách hàng</h1>

      {error && hasPermission && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

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
            <option value="ACTIVE">Hoạt động</option>
            <option value="INACTIVE">Đã khóa</option>
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
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center">Đang tải dữ liệu...</td>
            </tr>
          ) : customers.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">Không có khách hàng nào</td>
            </tr>
          ) : (
            customers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.fullName}</td>
                <td>{customer.email}</td>
                <td>{customer.phoneNumber || 'N/A'}</td>
                <td>{customer.orderCount} đơn</td>
                <td>
                  <Badge bg={customer.status === 'ACTIVE' ? 'success' : 'danger'}>
                    {customer.status === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}
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
                {customer.status === 'ACTIVE' && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="ms-2"
                    onClick={() => handleToggleStatus(customer)}
                  >
                    Khóa
                  </Button>
                )}
                {customer.status === 'INACTIVE' && (
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
            ))
          )}
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
                          name="phoneNumber"
                          value={editFormData.phoneNumber || ''}
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
                          <option value="ACTIVE">Hoạt động</option>
                          <option value="INACTIVE">Đã khóa</option>
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
                      <p><strong>Số điện thoại:</strong> {selectedCustomer.phoneNumber || 'N/A'}</p>
                      <p><strong>Địa chỉ:</strong> {selectedCustomer.address || 'N/A'}</p>
                      <p><strong>Ngày sinh:</strong> {selectedCustomer.dateOfBirth || 'N/A'}</p>
                      <p><strong>Giới tính:</strong> {selectedCustomer.gender || 'N/A'}</p>
                      <p><strong>Ngày tham gia:</strong> {formatDate(selectedCustomer.createdAt)}</p>
                      <p><strong>Trạng thái:</strong>{' '}
                        <Badge bg={selectedCustomer.status === 'ACTIVE' ? 'success' : 'danger'}>
                          {selectedCustomer.status === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}
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
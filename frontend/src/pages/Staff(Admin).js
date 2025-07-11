import React, { useState, useEffect, useCallback } from 'react';
import { staffAPI } from '../services/api';
import { Container, Row, Col, Form, Button, Table, Modal, Badge, Card, InputGroup, Dropdown, Alert, Spinner, Pagination} from 'react-bootstrap';
import { FaSearch, FaEdit, FaTrash, FaEye, FaFilter, FaSort, FaDownload, FaUserPlus, FaUsers} from 'react-icons/fa';

const getRoleText = (role) => {
  const roleMap = {
    'ADMIN': 'Admin',
    'STAFF': 'Nhân viên',
    'MANAGER': 'Quản lý',
    'CUSTOMER': 'Khách hàng',
    // Legacy support
    'admin': 'Admin',
    'staff': 'Nhân viên',
    'manager': 'Quản lý',
    'supervisor': 'Giám sát',
  };
  return roleMap[role] || role;
};

const getRoleBadgeVariant = (role) => {
  const variantMap = {
    'ADMIN': 'danger',
    'MANAGER': 'warning',
    'STAFF': 'primary',
    'CUSTOMER': 'success',
    // Legacy support
    'admin': 'danger',
    'manager': 'warning',
    'supervisor': 'info',
    'staff': 'primary',
  };
  return variantMap[role] || 'secondary';
};

const getStatusVariant = (status) => {
  switch (status?.toUpperCase()) {
    case 'ACTIVE':
      return 'success';
    case 'INACTIVE':
      return 'secondary';
    case 'PENDING':
      return 'warning';
    // Legacy support
    case 'active':
      return 'success';
    case 'inactive':
      return 'secondary';
    case 'pending':
      return 'warning';
    default:
      return 'secondary';
  }
};

const getStatusText = (status) => {
  const statusMap = {
    'ACTIVE': 'Hoạt động',
    'INACTIVE': 'Không hoạt động',
    'PENDING': 'Chờ duyệt',
    // Legacy support
    'active': 'Hoạt động',
    'inactive': 'Không hoạt động',
    'pending': 'Chờ duyệt',
  };
  return statusMap[status] || status;
};



const StaffAdmin = () => {
  const [staffList, setStaffList] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStaff, setCurrentStaff] = useState({
    id: null,
    fullName: '',
    email: '',
    phone: '',
    role: '',
    status: 'active',
    password: '',
    address: '',
    hireDate: '',
    salary: '',
    avatar: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showAlert, setShowAlert] = useState({ show: false, message: '', variant: 'success' });

  // No sample data - using real API

  const loadStaff = useCallback(async () => {
    setIsLoading(true);
    try {
      // Kiểm tra user có token và role ADMIN không
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      console.log('Current user:', user);
      console.log('Token exists:', !!token);

      if (!token) {
        throw new Error('Bạn cần đăng nhập để truy cập trang này');
      }

      if (user.role !== 'ADMIN') {
        throw new Error('Bạn không có quyền truy cập trang này ');
      }

      // Thử gọi API admin/staff trước, nếu không được thì gọi từng role
      let allStaff = [];

      try {
        const response = await staffAPI.getAdminStaffUsers();
        if (response.success) {
          allStaff = [
            ...response.data.admins.map(user => ({ ...user, role: 'ADMIN' })),
            ...response.data.managers.map(user => ({ ...user, role: 'MANAGER' })),
            ...response.data.staff.map(user => ({ ...user, role: 'STAFF' }))
          ];
        }
      } catch (adminError) {
        console.log('Admin API failed, trying individual role APIs:', adminError);

        // Fallback: gọi từng role riêng lẻ
        const [adminResponse, managerResponse, staffResponse] = await Promise.allSettled([
          staffAPI.getUsersByRole('ADMIN'),
          staffAPI.getUsersByRole('MANAGER'),
          staffAPI.getUsersByRole('STAFF')
        ]);

        const admins = adminResponse.status === 'fulfilled' && adminResponse.value.success ?
          adminResponse.value.data.map(user => ({ ...user, role: 'ADMIN' })) : [];
        const managers = managerResponse.status === 'fulfilled' && managerResponse.value.success ?
          managerResponse.value.data.map(user => ({ ...user, role: 'MANAGER' })) : [];
        const staff = staffResponse.status === 'fulfilled' && staffResponse.value.success ?
          staffResponse.value.data.map(user => ({ ...user, role: 'STAFF' })) : [];

        allStaff = [...admins, ...managers, ...staff];
      }

      setStaffList(allStaff);

      // Apply filters
      let filtered = allStaff.filter(staff => {
        const matchesSearch = (
          staff.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (staff.phoneNumber && staff.phoneNumber.includes(searchQuery))
        );
        const matchesRole = roleFilter ? staff.role === roleFilter : true;
        const matchesStatus = statusFilter ? staff.status === statusFilter : true;
        return matchesSearch && matchesRole && matchesStatus;
      });

      // Sorting
      filtered.sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      setFilteredStaff(filtered);
      showNotification(`Đã tải ${allStaff.length} nhân viên thành công`, 'success');
    } catch (error) {
      console.error('Error loading staff:', error);
      showNotification('Có lỗi xảy ra khi tải dữ liệu: ' + error.message, 'danger');
      setStaffList([]);
      setFilteredStaff([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, roleFilter, statusFilter, sortField, sortDirection]);

  useEffect(() => {
    const handler = setTimeout(() => {
      loadStaff();
    }, 300);
    return () => clearTimeout(handler);
  }, [loadStaff]);

  const showNotification = (message, variant = 'success') => {
    setShowAlert({ show: true, message, variant });
    setTimeout(() => setShowAlert({ show: false, message: '', variant: 'success' }), 3000);
  };

  const handleAddStaff = () => {
    setIsEditing(false);
    setCurrentStaff({
      id: null,
      fullName: '',
      email: '',
      phone: '',
      role: '',
      status: 'active',
      password: '',
      address: '',
      hireDate: '',
      salary: '',
      avatar: '',
    });
    setShowModal(true);
  };

  const handleEditStaff = (staff) => {
    setIsEditing(true);
    setCurrentStaff({ ...staff, password: '' });
    setShowModal(true);
  };

  const handleViewStaff = (staff) => {
    setCurrentStaff(staff);
    setShowViewModal(true);
  };

  const handleDeleteStaff = async (id, staffName) => {
    // Kiểm tra không cho xóa chính mình
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (currentUser.id === id) {
      showNotification('Bạn không thể xóa chính mình!', 'warning');
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn xóa nhân viên "${staffName}"?\n\nHành động này không thể hoàn tác!`)) {
      setIsLoading(true);

      try {
        console.log('Deleting staff with ID:', id);
        const response = await staffAPI.deleteUser(id);

        if (response.success) {
          showNotification('Nhân viên đã được xóa thành công!', 'success');
          // Reload staff list để cập nhật từ server
          loadStaff();
        } else {
          throw new Error(response.message || 'Không thể xóa nhân viên');
        }
      } catch (error) {
        console.error('Error deleting staff:', error);

        let errorMessage = 'Có lỗi xảy ra khi xóa nhân viên';

        if (error.message) {
          errorMessage = error.message;
        } else if (typeof error === 'string') {
          errorMessage = error;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        showNotification(errorMessage, 'danger');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentStaff({
      id: null,
      fullName: '',
      email: '',
      phone: '',
      role: '',
      status: 'active',
      password: '',
      address: '',
      hireDate: '',
      salary: '',
      avatar: '',
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCurrentStaff(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('=== FORM SUBMIT DEBUG ===');
    console.log('Current staff data:', currentStaff);
    console.log('Is editing:', isEditing);

    try {
      if (isEditing) {
        // TODO: Implement update user API
        showNotification('Chức năng cập nhật đang được phát triển', 'warning');
      } else {
        // Validation
        console.log('Validating form data...');
        console.log('fullName:', currentStaff.fullName);
        console.log('email:', currentStaff.email);
        console.log('password:', currentStaff.password ? '***' : 'empty');
        console.log('role:', currentStaff.role);

        if (!currentStaff.fullName || !currentStaff.email || !currentStaff.password || !currentStaff.role) {
          console.log('Validation failed - missing required fields');
          showNotification('Vui lòng điền đầy đủ thông tin bắt buộc!', 'danger');
          setIsLoading(false);
          return;
        }

        if (currentStaff.password.length < 6) {
          showNotification('Mật khẩu phải có ít nhất 6 ký tự!', 'danger');
          setIsLoading(false);
          return;
        }

        // Tạo admin user mới
        const userData = {
          fullName: currentStaff.fullName,
          email: currentStaff.email,
          phoneNumber: currentStaff.phone || null,
          password: currentStaff.password,
          address: currentStaff.address || null,
          dateOfBirth: currentStaff.hireDate || null,
          gender: 'Male', // Default
          role: currentStaff.role
        };

        console.log('Sending user data:', userData);
        const response = await staffAPI.createAdminUser(userData);
        console.log('Create user response:', response);

        if (response.success) {
          showNotification('Nhân viên đã được thêm thành công!', 'success');
          handleCloseModal();
          // Reload staff list
          loadStaff();
        } else {
          throw new Error(response.message || 'Không thể tạo nhân viên');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      console.error('Error details:', error);

      let errorMessage = 'Có lỗi xảy ra khi tạo nhân viên';

      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      showNotification(errorMessage, 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExport = () => {
    // Simulate export functionality
    showNotification('Đang xuất dữ liệu...', 'info');
    setTimeout(() => {
      showNotification('Xuất dữ liệu thành công!', 'success');
    }, 2000);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStaff.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);



  return (
    <Container fluid>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="mb-1">
                <FaUsers className="me-2" />
                Quản lý nhân viên
              </h1>
              <p className="text-muted">Quản lý thông tin và phân quyền nhân viên</p>
            </div>
            <div>
              <Button variant="outline-primary" className="me-2" onClick={handleExport}>
                <FaDownload className="me-1" />
                Xuất Excel
              </Button>
              <Button variant="success" onClick={handleAddStaff}>
                <FaUserPlus className="me-1" />
                Thêm nhân viên
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Alert */}
      {showAlert.show && (
        <Alert variant={showAlert.variant} dismissible onClose={() => setShowAlert({ show: false, message: '', variant: 'success' })}>
          {showAlert.message}
        </Alert>
      )}

      {/* Search and Filter */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={2}>
              <Form.Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="">Tất cả vai trò</option>
                <option value="admin">Admin</option>
                <option value="manager">Quản lý</option>
                <option value="staff">Nhân viên</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
                <option value="pending">Chờ duyệt</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button variant="outline-secondary" onClick={() => {
                setSearchQuery('');
                setRoleFilter('');
                setStatusFilter('');
              }}>
                <FaFilter className="me-1" />
                Xóa bộ lọc
              </Button>
            </Col>
            <Col md={2}>
              <div className="text-end">
                <small className="text-muted">
                  Tổng: {filteredStaff.length} nhân viên
                </small>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Staff Table */}
      <Card>
        <Card.Body>
          {isLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <>
              <Table striped bordered hover responsive>
                <thead className="table-primary">
                  <tr>
                    <th>
                      <div className="d-flex align-items-center">
                        ID
                        <FaSort 
                          className="ms-1 cursor-pointer" 
                          onClick={() => handleSort('id')}
                        />
                      </div>
                    </th>
                    <th>
                      <div className="d-flex align-items-center">
                        Họ tên
                        <FaSort 
                          className="ms-1 cursor-pointer" 
                          onClick={() => handleSort('fullName')}
                        />
                      </div>
                    </th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>
                      <div className="d-flex align-items-center">
                        Vai trò
                        <FaSort 
                          className="ms-1 cursor-pointer" 
                          onClick={() => handleSort('role')}
                        />
                      </div>
                    </th>
                    <th>
                      <div className="d-flex align-items-center">
                        Trạng thái
                        <FaSort 
                          className="ms-1 cursor-pointer" 
                          onClick={() => handleSort('status')}
                        />
                      </div>
                    </th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((staff) => (
                    <tr key={staff.id}>
                      <td>
                        <Badge bg="secondary" className="fs-6 px-2 py-1">
                          {staff.id}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          {staff.fullName}
                        </div>
                      </td>
                      <td>{staff.email}</td>
                      <td>{staff.phoneNumber || staff.phone || 'N/A'}</td>
                      <td>
                        <Badge bg={getRoleBadgeVariant(staff.role)}>
                          {getRoleText(staff.role)}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={getStatusVariant(staff.status)}>
                          {getStatusText(staff.status)}
                        </Badge>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <Button 
                            variant="outline-info" 
                            size="sm" 
                            onClick={() => handleViewStaff(staff)}
                            title="Xem chi tiết"
                          >
                            <FaEye />
                          </Button>
                          <Button 
                            variant="outline-warning" 
                            size="sm" 
                            onClick={() => handleEditStaff(staff)}
                            title="Chỉnh sửa"
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteStaff(staff.id, staff.fullName)}
                            title="Xóa"
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentItems.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        <div className="text-muted">
                          <FaUsers size={48} className="mb-3" />
                          <p>Không tìm thấy nhân viên nào.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <Pagination>
                    <Pagination.First 
                      onClick={() => paginate(1)} 
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev 
                      onClick={() => paginate(currentPage - 1)} 
                      disabled={currentPage === 1}
                    />
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                      <Pagination.Item
                        key={number}
                        active={number === currentPage}
                        onClick={() => paginate(number)}
                      >
                        {number}
                      </Pagination.Item>
                    ))}
                    
                    <Pagination.Next 
                      onClick={() => paginate(currentPage + 1)} 
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last 
                      onClick={() => paginate(totalPages)} 
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>



      {/* Modal thêm/sửa nhân viên */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? 'Chỉnh sửa thông tin nhân viên' : 'Thêm nhân viên mới'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Họ tên <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={currentStaff.fullName}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={currentStaff.email}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={currentStaff.phone}
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Vai trò <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="role"
                    value={currentStaff.role}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Chọn vai trò</option>
                    <option value="ADMIN">Admin</option>
                    <option value="MANAGER">Quản lý</option>
                    <option value="STAFF">Nhân viên</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày thuê</Form.Label>
                  <Form.Control
                    type="date"
                    name="hireDate"
                    value={currentStaff.hireDate}
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Lương (VNĐ)</Form.Label>
                  <Form.Control
                    type="number"
                    name="salary"
                    value={currentStaff.salary}
                    onChange={handleFormChange}
                    placeholder="0"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mật khẩu {!isEditing && <span className="text-danger">*</span>}</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={currentStaff.password}
                    onChange={handleFormChange}
                    required={!isEditing}
                    placeholder={isEditing ? "Để trống nếu không thay đổi" : ""}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="address"
                value={currentStaff.address}
                onChange={handleFormChange}
              />
            </Form.Group>

            {isEditing && (
              <Form.Group className="mb-3">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select
                  name="status"
                  value={currentStaff.status}
                  onChange={handleFormChange}
                  required
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                  <option value="pending">Chờ duyệt</option>
                </Form.Select>
              </Form.Group>
            )}

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Hủy
              </Button>
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Đang lưu...
                  </>
                ) : (
                  'Lưu thay đổi'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal xem chi tiết nhân viên */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết nhân viên</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            <img 
              src={currentStaff.avatar} 
              alt={currentStaff.fullName}
              className="rounded-circle"
              width="100"
              height="100"
            />
            <h5 className="mt-2">{currentStaff.fullName}</h5>
            <Badge bg={getRoleBadgeVariant(currentStaff.role)}>
              {getRoleText(currentStaff.role)}
            </Badge>
          </div>
          
          <Row>
            <Col md={6}>
              <p><strong>Email:</strong> {currentStaff.email}</p>
              <p><strong>Số điện thoại:</strong> {currentStaff.phone}</p>
            </Col>
            <Col md={6}>
              <p><strong>Ngày thuê:</strong> {currentStaff.hireDate}</p>
              <p><strong>Lương:</strong> {currentStaff.salary ? `${parseInt(currentStaff.salary).toLocaleString('vi-VN')} VNĐ` : 'N/A'}</p>
              <p><strong>Trạng thái:</strong> 
                <Badge bg={getStatusVariant(currentStaff.status)} className="ms-2">
                  {getStatusText(currentStaff.status)}
                </Badge>
              </p>
            </Col>
          </Row>
          
          {currentStaff.address && (
            <p><strong>Địa chỉ:</strong> {currentStaff.address}</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={() => {
            setShowViewModal(false);
            handleEditStaff(currentStaff);
          }}>
            Chỉnh sửa
          </Button>
        </Modal.Footer>
      </Modal>


    </Container>
  );
};

export default StaffAdmin;
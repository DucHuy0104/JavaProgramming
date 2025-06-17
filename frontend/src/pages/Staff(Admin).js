import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Form, 
  Button, 
  Table, 
  Modal, 
  Badge, 
  Card,
  InputGroup,
  Dropdown,
  Alert,
  Spinner,
  Pagination
} from 'react-bootstrap';
import { 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaFilter,
  FaSort,
  FaDownload,
  FaUserPlus,
  FaUsers,
  FaClipboardList
} from 'react-icons/fa';

const getRoleText = (role) => {
  const roleMap = {
    'admin': 'Admin',
    'staff': 'Nhân viên',
    'manager': 'Quản lý',
    'supervisor': 'Giám sát',
  };
  return roleMap[role] || role;
};

const getRoleBadgeVariant = (role) => {
  const variantMap = {
    'admin': 'danger',
    'manager': 'warning',
    'supervisor': 'info',
    'staff': 'primary',
  };
  return variantMap[role] || 'secondary';
};

const getStatusVariant = (status) => {
  switch (status) {
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
    'active': 'Hoạt động',
    'inactive': 'Không hoạt động',
    'pending': 'Chờ duyệt',
  };
  return statusMap[status] || status;
};

const getStatusStep = (status) => {
  const statusMap = {
    'collected': 1,
    'processing': 2,
    'completed': 3,
    'delivered': 4
  };
  return statusMap[status] || 0;
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
    department: '',
    hireDate: '',
    salary: '',
    avatar: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('fullName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showAlert, setShowAlert] = useState({ show: false, message: '', variant: 'success' });
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [sampleForm, setSampleForm] = useState({
    orderCode: '',
    collectionDate: '',
    customerName: '',
    customerPhone: '',
    serviceType: '',
    notes: ''
  });

  // Sample data mở rộng
  const sampleStaff = [
    {
      id: 1,
      fullName: 'Nguyễn Văn Admin',
      email: 'admin@example.com',
      phone: '0912345678',
      role: 'admin',
      status: 'active',
      address: 'Hà Nội',
      department: 'IT',
      hireDate: '2023-01-15',
      salary: '25000000',
      avatar: 'https://via.placeholder.com/50',
    },
    {
      id: 2,
      fullName: 'Trần Thị Staff',
      email: 'staff@example.com',
      phone: '0987654321',
      role: 'staff',
      status: 'active',
      address: 'TP.HCM',
      department: 'Sales',
      hireDate: '2023-03-20',
      salary: '15000000',
      avatar: 'https://via.placeholder.com/50',
    },
    {
      id: 3,
      fullName: 'Lê Văn Manager',
      email: 'manager@example.com',
      phone: '0901122334',
      role: 'manager',
      status: 'active',
      address: 'Đà Nẵng',
      department: 'Marketing',
      hireDate: '2022-11-10',
      salary: '20000000',
      avatar: 'https://via.placeholder.com/50',
    },
    {
      id: 4,
      fullName: 'Phạm Thị Supervisor',
      email: 'supervisor@example.com',
      phone: '0977888999',
      role: 'supervisor',
      status: 'pending',
      address: 'Cần Thơ',
      department: 'HR',
      hireDate: '2024-01-05',
      salary: '18000000',
      avatar: 'https://via.placeholder.com/50',
    },
  ];

  const sampleOrders = [
    {
      id: 1,
      orderCode: 'ADN001',
      collectionDate: '2024-01-15',
      customerName: 'Nguyễn Văn A',
      customerPhone: '0912345678',
      serviceType: 'Xét nghiệm ADN cha con',
      status: 'collected', // collected, processing, completed, delivered
      notes: 'Thu mẫu tại nhà',
      staffId: 1,
      createdAt: '2024-01-15T08:00:00'
    },
    {
      id: 2,
      orderCode: 'ADN002',
      collectionDate: '2024-01-16',
      customerName: 'Trần Thị B',
      customerPhone: '0987654321',
      serviceType: 'Xét nghiệm ADN huyết thống',
      status: 'processing',
      notes: 'Khách hàng yêu cầu thu mẫu sáng sớm',
      staffId: 2,
      createdAt: '2024-01-16T09:30:00'
    },
    {
      id: 3,
      orderCode: 'ADN003',
      collectionDate: '2024-01-17',
      customerName: 'Lê Văn C',
      customerPhone: '0901122334',
      serviceType: 'Xét nghiệm máu tổng quát',
      status: 'completed',
      notes: '',
      staffId: 1,
      createdAt: '2024-01-17T10:15:00'
    }
  ];

  const loadStaff = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filtered = sampleStaff.filter(staff => {
        const matchesSearch = (
          staff.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          staff.phone.includes(searchQuery)
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
    } catch (error) {
      console.error('Error loading staff:', error);
      showNotification('Có lỗi xảy ra khi tải dữ liệu', 'danger');
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
      department: '',
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

  const handleDeleteStaff = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      setIsLoading(true);
      setTimeout(() => {
        setStaffList(staffList.filter(staff => staff.id !== id));
        showNotification('Nhân viên đã được xóa thành công');
        setIsLoading(false);
      }, 500);
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
      department: '',
      hireDate: '',
      salary: '',
      avatar: '',
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCurrentStaff(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      if (isEditing) {
        setStaffList(staffList.map(s => 
          s.id === currentStaff.id ? { ...currentStaff, password: currentStaff.password || s.password } : s
        ));
        showNotification('Thông tin nhân viên đã được cập nhật thành công!');
      } else {
        const newId = Math.max(...staffList.map(s => s.id), 0) + 1;
        const newStaff = { ...currentStaff, id: newId };
        setStaffList([...staffList, newStaff]);
        showNotification('Nhân viên đã được thêm thành công!');
      }
      handleCloseModal();
      setIsLoading(false);
    }, 500);
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

  const handleAddSample = () => {
    setSampleForm({
      orderCode: '',
      collectionDate: '',
      customerName: '',
      customerPhone: '',
      serviceType: '',
      notes: ''
    });
    setShowSampleModal(true);
  };

  const handleSampleSubmit = (e) => {
    e.preventDefault();
    // Logic xử lý thêm đơn thu mẫu
    console.log('Sample form:', sampleForm);
    setShowSampleModal(false);
    showNotification('Đơn thu mẫu đã được tạo thành công!');
  };

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
                <option value="supervisor">Giám sát</option>
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
                <thead className="table-dark">
                  <tr>
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
                    <th>Phòng ban</th>
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
                        <div className="d-flex align-items-center">
                          <img 
                            src={staff.avatar} 
                            alt={staff.fullName}
                            className="rounded-circle me-2"
                            width="32"
                            height="32"
                          />
                          {staff.fullName}
                        </div>
                      </td>
                      <td>{staff.email}</td>
                      <td>{staff.phone}</td>
                      <td>
                        <Badge bg={getRoleBadgeVariant(staff.role)}>
                          {getRoleText(staff.role)}
                        </Badge>
                      </td>
                      <td>{staff.department}</td>
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
                            onClick={() => handleDeleteStaff(staff.id)}
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

      {/* Sample Collection Section */}
      <Card className="mt-4">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <FaClipboardList className="me-2" />
              Quản lý thu mẫu
            </h5>
            <Button variant="primary" size="sm" onClick={handleAddSample}>
              <FaPlus className="me-1" />
              Tạo đơn thu mẫu
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Mã đơn</th>
                <th>Ngày thu</th>
                <th>Khách hàng</th>
                <th>Dịch vụ</th>
                <th>Trạng thái</th>
                <th>Nhân viên</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {sampleOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>{order.orderCode}</strong>
                  </td>
                  <td>{new Date(order.collectionDate).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <div>
                      <div><strong>{order.customerName}</strong></div>
                      <small className="text-muted">{order.customerPhone}</small>
                    </div>
                  </td>
                  <td>{order.serviceType}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <Badge bg={getStatusVariant(order.status)} className="me-2">
                        {getStatusText(order.status)}
                      </Badge>
                      {/* Progress Steps */}
                      <div className="d-flex align-items-center">
                        {[1, 2, 3, 4].map((step) => (
                          <div key={step} className="d-flex align-items-center">
                            <div 
                              className={`rounded-circle d-flex align-items-center justify-content-center ${
                                step <= getStatusStep(order.status) 
                                  ? 'bg-success text-white' 
                                  : 'bg-light text-muted'
                              }`}
                              style={{ width: '24px', height: '24px', fontSize: '12px' }}
                            >
                              {step}
                            </div>
                            {step < 4 && (
                              <div 
                                className={`mx-1 ${
                                  step < getStatusStep(order.status) ? 'text-success' : 'text-muted'
                                }`}
                                style={{ width: '20px', height: '2px' }}
                              >
                                ─
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td>
                    {staffList.find(s => s.id === order.staffId)?.fullName || 'N/A'}
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      <Button variant="outline-info" size="sm" title="Xem chi tiết">
                        <FaEye />
                      </Button>
                      <Button variant="outline-warning" size="sm" title="Cập nhật trạng thái">
                        <FaEdit />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
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
                    <option value="admin">Admin</option>
                    <option value="manager">Quản lý</option>
                    <option value="supervisor">Giám sát</option>
                    <option value="staff">Nhân viên</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phòng ban</Form.Label>
                  <Form.Control
                    type="text"
                    name="department"
                    value={currentStaff.department}
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>
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
              <p><strong>Phòng ban:</strong> {currentStaff.department}</p>
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

      {/* Modal tạo đơn thu mẫu */}
      <Modal show={showSampleModal} onHide={() => setShowSampleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Tạo đơn thu mẫu mới</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSampleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mã đơn <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="orderCode"
                    value={sampleForm.orderCode}
                    onChange={(e) => setSampleForm({...sampleForm, orderCode: e.target.value})}
                    placeholder="ADN001"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày thu mẫu <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="date"
                    name="collectionDate"
                    value={sampleForm.collectionDate}
                    onChange={(e) => setSampleForm({...sampleForm, collectionDate: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên khách hàng <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="customerName"
                    value={sampleForm.customerName}
                    onChange={(e) => setSampleForm({...sampleForm, customerName: e.target.value})}
                    placeholder="Nhập tên khách hàng"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="tel"
                    name="customerPhone"
                    value={sampleForm.customerPhone}
                    onChange={(e) => setSampleForm({...sampleForm, customerPhone: e.target.value})}
                    placeholder="0912345678"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Loại dịch vụ <span className="text-danger">*</span></Form.Label>
              <Form.Select
                name="serviceType"
                value={sampleForm.serviceType}
                onChange={(e) => setSampleForm({...sampleForm, serviceType: e.target.value})}
                required
              >
                <option value="">Chọn dịch vụ</option>
                <option value="Xét nghiệm ADN cha con">Xét nghiệm ADN cha con</option>
                <option value="Xét nghiệm ADN huyết thống">Xét nghiệm ADN huyết thống</option>
                <option value="Xét nghiệm máu tổng quát">Xét nghiệm máu tổng quát</option>
                <option value="Xét nghiệm nước tiểu">Xét nghiệm nước tiểu</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ghi chú</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="notes"
                value={sampleForm.notes}
                onChange={(e) => setSampleForm({...sampleForm, notes: e.target.value})}
                placeholder="Ghi chú về đơn thu mẫu..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSampleModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              Tạo đơn
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default StaffAdmin; 
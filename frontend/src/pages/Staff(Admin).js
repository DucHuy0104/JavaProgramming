import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Table, Modal, Badge, Card } from 'react-bootstrap';

const getRoleText = (role) => {
  const roleMap = {
    'admin': 'Admin',
    'staff': 'Staff',
    'manager': 'Manager',
  };
  return roleMap[role] || role;
};

const getStatusVariant = (status) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'secondary';
    default:
      return 'secondary';
  }
};

const StaffAdmin = () => {
  const [staffList, setStaffList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStaff, setCurrentStaff] = useState({
    id: null,
    fullName: '',
    email: '',
    phone: '',
    role: '',
    status: 'active',
    password: '',
  });

  // Sample data
  const sampleStaff = [
    {
      id: 1,
      fullName: 'Nguyễn Văn Admin',
      email: 'admin@example.com',
      phone: '0912345678',
      role: 'admin',
      status: 'active',
    },
    {
      id: 2,
      fullName: 'Trần Thị Staff',
      email: 'staff@example.com',
      phone: '0987654321',
      role: 'staff',
      status: 'active',
    },
    {
      id: 3,
      fullName: 'Lê Văn Manager',
      email: 'manager@example.com',
      phone: '0901122334',
      role: 'manager',
      status: 'inactive',
    },
  ];

  const loadStaff = useCallback(async () => {
    // Simulate API call
    let filteredStaff = sampleStaff.filter(staff => {
      const matchesSearch = (
        staff.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const matchesRole = roleFilter ? staff.role === roleFilter : true;
      const matchesStatus = statusFilter ? staff.status === statusFilter : true;
      return matchesSearch && matchesRole && matchesStatus;
    });
    setStaffList(filteredStaff);
  }, [searchQuery, roleFilter, statusFilter]);

  useEffect(() => {
    const handler = setTimeout(() => {
      loadStaff();
    }, 300); // Debounce for search input
    return () => clearTimeout(handler);
  }, [searchQuery, roleFilter, statusFilter, loadStaff]);

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
    });
    setShowModal(true);
  };

  const handleEditStaff = (staff) => {
    setIsEditing(true);
    setCurrentStaff({ ...staff, password: '' }); // Don't pre-fill password
    setShowModal(true);
  };

  const handleDeleteStaff = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      // Simulate API call to delete
      console.log(`Deleting staff ${id}`);
      setStaffList(staffList.filter(staff => staff.id !== id));
      alert('Nhân viên đã được xóa.');
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
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCurrentStaff(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate saving to API
    console.log('Saving staff:', currentStaff);
    if (isEditing) {
      setStaffList(staffList.map(s => (s.id === currentStaff.id ? { ...currentStaff, password: currentStaff.password || s.password } : s)));
      alert('Thông tin nhân viên đã được cập nhật!');
    } else {
      const newId = Math.max(...staffList.map(s => s.id), 0) + 1;
      const newStaff = { ...currentStaff, id: newId };
      setStaffList([...staffList, newStaff]);
      alert('Nhân viên đã được thêm!');
    }
    handleCloseModal();
  };

  return (
    <Container fluid>
      <h1 className="my-4">Quản lý nhân viên</h1>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm theo tên, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">Tất cả vai trò</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button variant="primary" onClick={loadStaff}>Lọc</Button>
        </Col>
      </Row>

      <Button variant="success" className="mb-3" onClick={handleAddStaff}>+ Thêm nhân viên</Button>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((staff) => (
            <tr key={staff.id}>
              <td>{staff.fullName}</td>
              <td>{staff.email}</td>
              <td>{getRoleText(staff.role)}</td>
              <td>
                <Badge bg={getStatusVariant(staff.status)}>{staff.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}</Badge>
              </td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditStaff(staff)}>
                  Sửa
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDeleteStaff(staff.id)}>
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
          {staffList.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">Không có nhân viên nào.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal thêm/sửa nhân viên */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Sửa thông tin nhân viên' : 'Thêm nhân viên mới'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Họ tên:</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={currentStaff.fullName}
                onChange={handleFormChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={currentStaff.email}
                onChange={handleFormChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại:</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={currentStaff.phone}
                onChange={handleFormChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Vai trò:</Form.Label>
              <Form.Select
                name="role"
                value={currentStaff.role}
                onChange={handleFormChange}
                required
              >
                <option value="">Chọn vai trò</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu:</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={currentStaff.password}
                onChange={handleFormChange}
                required={!isEditing} // Required only for new staff
              />
            </Form.Group>

            {isEditing && (
              <Form.Group className="mb-3">
                <Form.Label>Trạng thái:</Form.Label>
                <Form.Select
                  name="status"
                  value={currentStaff.status}
                  onChange={handleFormChange}
                  required
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </Form.Select>
              </Form.Group>
            )}

            <Button variant="primary" type="submit">
              Lưu thay đổi
            </Button>
            <Button variant="secondary" className="ms-2" onClick={handleCloseModal}>
              Hủy
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default StaffAdmin; 
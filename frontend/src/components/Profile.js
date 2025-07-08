import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert, Spinner, Modal, Form } from 'react-bootstrap';
import { FaUser, FaEdit, FaKey, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBirthdayCake, FaVenusMars, FaUserTag, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch profile data from API
  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  if (!user) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <FaUser size={80} className="text-muted mb-4" />
            <h2 className="mb-4">Vui lòng đăng nhập để xem thông tin tài khoản</h2>
            <Button variant="primary" href="/login">
              Đăng nhập ngay
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8081/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        const data = result.data || result; // Handle both formats
        setProfileData(data);
        setEditForm(data);
      } else {
        throw new Error('Không thể tải thông tin profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback to user data from context
      setProfileData(user);
      setEditForm(user);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8081/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const result = await response.json();
        setProfileData(result.data || result);
        setShowEditModal(false);
        alert('Cập nhật thông tin thành công!');
      } else {
        throw new Error('Không thể cập nhật thông tin');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại sau.');
    }
  };

  const handleChangePasswordSubmit = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8081/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword
        })
      });

      if (response.ok) {
        setShowPasswordModal(false);
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        alert('Đổi mật khẩu thành công!');
      } else {
        const error = await response.text();
        throw new Error(error || 'Không thể đổi mật khẩu');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Có lỗi xảy ra khi đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu hiện tại.');
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'ADMIN': return 'danger';
      case 'MANAGER': return 'warning';
      case 'STAFF': return 'info';
      default: return 'success';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'ADMIN': return 'Quản trị viên';
      case 'MANAGER': return 'Quản lý';
      case 'STAFF': return 'Nhân viên';
      default: return 'Khách hàng';
    }
  };

  const getGenderText = (gender) => {
    switch (gender) {
      case 'Male': return 'Nam';
      case 'Female': return 'Nữ';
      default: return 'Khác';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
  };

  if (loading) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Đang tải thông tin profile...</p>
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
              <FaUser className="me-3 text-primary" />
              Thông tin tài khoản
            </h1>
            <div>
              <Button variant="outline-primary" className="me-2" onClick={handleEditProfile}>
                <FaEdit className="me-2" />
                Chỉnh sửa
              </Button>
              <Button variant="outline-secondary" onClick={handleChangePassword}>
                <FaKey className="me-2" />
                Đổi mật khẩu
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <FaUser className="me-2" />
                Thông tin cá nhân
              </h5>
            </Card.Header>

            <Card.Body>
              <Row>
                <Col lg={6} className="mb-4">
                  <Card className="h-100">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0">Thông tin cơ bản</h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="mb-3">
                        <small className="text-muted">
                          <FaUser className="me-2" />
                          Họ và tên
                        </small>
                        <p className="mb-0 fw-bold">{profileData?.fullName || 'Chưa cập nhật'}</p>
                      </div>

                      <div className="mb-3">
                        <small className="text-muted">
                          <FaEnvelope className="me-2" />
                          Email
                        </small>
                        <p className="mb-0">{profileData?.email}</p>
                      </div>

                      <div className="mb-3">
                        <small className="text-muted">
                          <FaPhone className="me-2" />
                          Số điện thoại
                        </small>
                        <p className="mb-0">{profileData?.phoneNumber || 'Chưa cập nhật'}</p>
                      </div>

                      <div className="mb-0">
                        <small className="text-muted">
                          <FaMapMarkerAlt className="me-2" />
                          Địa chỉ
                        </small>
                        <p className="mb-0">{profileData?.address || 'Chưa cập nhật'}</p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={6} className="mb-4">
                  <Card className="h-100">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0">Thông tin bổ sung</h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="mb-3">
                        <small className="text-muted">
                          <FaBirthdayCake className="me-2" />
                          Ngày sinh
                        </small>
                        <p className="mb-0">{formatDate(profileData?.dateOfBirth)}</p>
                      </div>

                      <div className="mb-3">
                        <small className="text-muted">
                          <FaVenusMars className="me-2" />
                          Giới tính
                        </small>
                        <p className="mb-0">{getGenderText(profileData?.gender)}</p>
                      </div>

                      <div className="mb-3">
                        <small className="text-muted">
                          <FaUserTag className="me-2" />
                          Vai trò
                        </small>
                        <div>
                          <Badge bg={getRoleBadgeVariant(profileData?.role)}>
                            {getRoleText(profileData?.role)}
                          </Badge>
                        </div>
                      </div>

                      <div className="mb-0">
                        <small className="text-muted">
                          <FaCheckCircle className="me-2" />
                          Trạng thái
                        </small>
                        <div>
                          <Badge bg={profileData?.status === 'ACTIVE' ? 'success' : 'warning'}>
                            {profileData?.status === 'ACTIVE' ? 'Hoạt động' : 'Chờ kích hoạt'}
                          </Badge>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal Chỉnh sửa thông tin */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaEdit className="me-2" />
            Chỉnh sửa thông tin cá nhân
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.fullName || ''}
                    onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="tel"
                    value={editForm.phoneNumber || ''}
                    onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                value={editForm.address || ''}
                onChange={(e) => setEditForm({...editForm, address: e.target.value})}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày sinh</Form.Label>
                  <Form.Control
                    type="date"
                    value={editForm.dateOfBirth || ''}
                    onChange={(e) => setEditForm({...editForm, dateOfBirth: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giới tính</Form.Label>
                  <Form.Select
                    value={editForm.gender || ''}
                    onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                    <option value="Other">Khác</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSaveProfile}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Đổi mật khẩu */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaKey className="me-2" />
            Đổi mật khẩu
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu hiện tại</Form.Label>
              <Form.Control
                type="password"
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                placeholder="Nhập mật khẩu hiện tại"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                placeholder="Nhập mật khẩu mới"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Xác nhận mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                placeholder="Nhập lại mật khẩu mới"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleChangePasswordSubmit}>
            Đổi mật khẩu
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;

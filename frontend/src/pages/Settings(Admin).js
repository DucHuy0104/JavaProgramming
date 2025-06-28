import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Badge,
  Spinner
} from 'react-bootstrap';
import {
  FaUser,
  FaLock,
  FaShieldAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { settingsAPI } from '../services/api';

const SettingsAdmin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showAlert, setShowAlert] = useState({ show: false, message: '', variant: 'success' });
  const [loading, setLoading] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || 'Male'
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Fetch current profile data from backend
  const fetchCurrentProfile = async () => {
    try {
      console.log('Fetching current profile...');
      const response = await settingsAPI.getCurrentProfile();
      console.log('Profile response:', response);

      if (response.success && response.data) {
        const userData = response.data;
        console.log('Setting profile form with data:', userData);

        setProfileForm({
          fullName: userData.fullName || '',
          email: userData.email || '',
          phoneNumber: userData.phoneNumber || '',
          address: userData.address || '',
          dateOfBirth: userData.dateOfBirth || '',
          gender: userData.gender || 'Male'
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback to localStorage user data
      console.log('Using fallback localStorage data:', user);
      const fallbackForm = {
        fullName: user?.fullName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        address: user?.address || '',
        dateOfBirth: user?.dateOfBirth || '',
        gender: user?.gender || 'Male'
      };
      console.log('Fallback form:', fallbackForm);
      setProfileForm(fallbackForm);
    }
  };

  // Fetch profile data on component mount
  useEffect(() => {
    console.log('Component mounted, fetching profile...');
    fetchCurrentProfile();
  }, []);

  // Debug: Log profileForm changes
  useEffect(() => {
    console.log('ProfileForm updated:', profileForm);
    console.log('ProfileForm phoneNumber:', profileForm.phoneNumber);
  }, [profileForm]);

  // Sync form with user data when user changes (fallback)
  useEffect(() => {
    console.log('User data changed:', user);
    if (!profileForm.fullName && !profileForm.email) {
      setProfileForm({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        address: user?.address || '',
        dateOfBirth: user?.dateOfBirth || '',
        gender: user?.gender || 'Male'
      });
    }
  }, [user, profileForm.fullName, profileForm.email]);

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });



  // Show notification helper
  const showNotification = (message, variant = 'success') => {
    setShowAlert({ show: true, message, variant });
    setTimeout(() => {
      setShowAlert({ show: false, message: '', variant: 'success' });
    }, 3000);
  };

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  // Save profile changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Updating profile with data:', profileForm);
      const response = await settingsAPI.updateProfile(profileForm);
      console.log('Update profile response:', response);

      if (response.success) {
        showNotification('Thông tin cá nhân đã được cập nhật thành công!', 'success');
        setIsEditingProfile(false);
        // Cập nhật user context nếu cần
      } else {
        throw new Error(response.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.message || error.toString() || 'Có lỗi xảy ra khi cập nhật thông tin';
      showNotification('Có lỗi xảy ra khi cập nhật thông tin: ' + errorMessage, 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotification('Mật khẩu xác nhận không khớp!', 'danger');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showNotification('Mật khẩu mới phải có ít nhất 6 ký tự!', 'danger');
      return;
    }

    setLoading(true);

    // Kiểm tra authentication
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('Current token:', token ? token.substring(0, 20) + '...' : 'missing');
    console.log('Current user:', user);

    if (!token) {
      showNotification('Bạn cần đăng nhập lại để thực hiện thao tác này', 'danger');
      setLoading(false);
      return;
    }

    // Test authentication first
    try {
      console.log('Testing authentication...');
      const testResponse = await fetch('http://localhost:8081/api/users/test-auth', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Auth test response status:', testResponse.status);

      if (testResponse.status === 403) {
        showNotification('Token đã hết hạn, vui lòng đăng nhập lại', 'danger');
        setLoading(false);
        return;
      }

      if (testResponse.ok) {
        const testData = await testResponse.json();
        console.log('Auth test data:', testData);
      }
    } catch (tokenError) {
      console.error('Auth test error:', tokenError);
      showNotification('Lỗi kết nối đến server', 'danger');
      setLoading(false);
      return;
    }

    try {
      const passwordData = {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      };

      console.log('Sending password change request:', passwordData);
      const response = await settingsAPI.changePassword(passwordData);
      console.log('Password change response:', response);

      if (response.success) {
        showNotification('Mật khẩu đã được thay đổi thành công!', 'success');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        throw new Error(response.message || 'Đổi mật khẩu thất bại');
      }
    } catch (error) {
      console.error('Password change error:', error);
      const errorMessage = error.message || error.toString() || 'Lỗi không xác định';
      showNotification('Có lỗi xảy ra khi thay đổi mật khẩu: ' + errorMessage, 'danger');
    } finally {
      setLoading(false);
    }
  };



  // Get role badge variant
  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'ADMIN': return 'danger';
      case 'MANAGER': return 'warning';
      case 'STAFF': return 'primary';
      default: return 'secondary';
    }
  };

  // Get role text
  const getRoleText = (role) => {
    switch (role) {
      case 'ADMIN': return 'Quản trị viên';
      case 'MANAGER': return 'Quản lý';
      case 'STAFF': return 'Nhân viên';
      default: return role;
    }
  };

  // Get role permissions
  const getRolePermissions = (role) => {
    switch (role) {
      case 'ADMIN':
        return [
          'Quản lý toàn bộ hệ thống',
          'Tạo/sửa/xóa tài khoản admin/manager/staff',
          'Xem tất cả báo cáo và thống kê',
          'Quản lý dịch vụ và giá cả',
          'Truy cập tất cả chức năng'
        ];
      case 'MANAGER':
        return [
          'Quản lý đơn hàng và khách hàng',
          'Xem báo cáo kinh doanh',
          'Quản lý nhân viên (không bao gồm admin)',
          'Phê duyệt kết quả xét nghiệm',
          'Quản lý blog và nội dung'
        ];
      case 'STAFF':
        return [
          'Xử lý đơn hàng',
          'Cập nhật trạng thái mẫu',
          'Liên hệ với khách hàng',
          'Nhập kết quả xét nghiệm',
          'Xem thông tin cơ bản'
        ];
      default:
        return [];
    }
  };

  return (
    <Container fluid className="p-4">
      {/* Alert */}
      {showAlert.show && (
        <Alert variant={showAlert.variant} className="mb-4">
          {showAlert.message}
        </Alert>
      )}

      <Row>
        <Col md={3}>
          {/* Settings Navigation */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <FaUser className="me-2" />
                Cài đặt tài khoản
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="list-group list-group-flush">
                <button
                  className={`list-group-item list-group-item-action ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <FaUser className="me-2" />
                  Thông tin cá nhân
                </button>
                <button
                  className={`list-group-item list-group-item-action ${activeTab === 'password' ? 'active' : ''}`}
                  onClick={() => setActiveTab('password')}
                >
                  <FaLock className="me-2" />
                  Đổi mật khẩu
                </button>

                <button
                  className={`list-group-item list-group-item-action ${activeTab === 'permissions' ? 'active' : ''}`}
                  onClick={() => setActiveTab('permissions')}
                >
                  <FaShieldAlt className="me-2" />
                  Phân quyền
                </button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={9}>
          {/* Profile Information */}
          {activeTab === 'profile' && (
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <FaUser className="me-2" />
                  Thông tin cá nhân
                </h5>
                {!isEditingProfile ? (
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    <FaEdit className="me-1" />
                    Chỉnh sửa
                  </Button>
                ) : (
                  <div>
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      className="me-2"
                      onClick={() => {
                        setIsEditingProfile(false);
                        setProfileForm({
                          fullName: user?.fullName || '',
                          email: user?.email || '',
                          phoneNumber: user?.phoneNumber || '',
                          address: user?.address || '',
                          dateOfBirth: user?.dateOfBirth || '',
                          gender: user?.gender || 'Male'
                        });
                      }}
                    >
                      <FaTimes className="me-1" />
                      Hủy
                    </Button>
                  </div>
                )}
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSaveProfile}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Họ tên</Form.Label>
                        <Form.Control
                          type="text"
                          name="fullName"
                          value={profileForm.fullName}
                          onChange={handleProfileChange}
                          disabled={!isEditingProfile}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={profileForm.email}
                          onChange={handleProfileChange}
                          disabled={!isEditingProfile}
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
                          name="phoneNumber"
                          value={profileForm.phoneNumber || ''}
                          onChange={handleProfileChange}
                          disabled={!isEditingProfile}
                          placeholder={profileForm.phoneNumber ? profileForm.phoneNumber : "Chưa có số điện thoại"}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Giới tính</Form.Label>
                        <Form.Select
                          name="gender"
                          value={profileForm.gender}
                          onChange={handleProfileChange}
                          disabled={!isEditingProfile}
                        >
                          <option value="Male">Nam</option>
                          <option value="Female">Nữ</option>
                          <option value="Other">Khác</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Ngày sinh</Form.Label>
                        <Form.Control
                          type="date"
                          name="dateOfBirth"
                          value={profileForm.dateOfBirth}
                          onChange={handleProfileChange}
                          disabled={!isEditingProfile}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Địa chỉ</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={profileForm.address}
                      onChange={handleProfileChange}
                      disabled={!isEditingProfile}
                    />
                  </Form.Group>

                  {isEditingProfile && (
                    <div className="d-flex justify-content-end">
                      <Button 
                        type="submit" 
                        variant="primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <FaSave className="me-1" />
                            Lưu thay đổi
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </Form>
              </Card.Body>
            </Card>
          )}

          {/* Change Password */}
          {activeTab === 'password' && (
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <FaLock className="me-2" />
                  Đổi mật khẩu
                </h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleChangePassword}>
                  <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu hiện tại</Form.Label>
                    <div className="input-group">
                      <Form.Control
                        type={showPasswords.current ? "text" : "password"}
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      >
                        {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu mới</Form.Label>
                    <div className="input-group">
                      <Form.Control
                        type={showPasswords.new ? "text" : "password"}
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        required
                        placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                        minLength={6}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      >
                        {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                    <div className="input-group">
                      <Form.Control
                        type={showPasswords.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        placeholder="Nhập lại mật khẩu mới"
                        minLength={6}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      >
                        {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </div>
                  </Form.Group>

                  <div className="d-flex justify-content-end">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Đang thay đổi...
                        </>
                      ) : (
                        <>
                          <FaLock className="me-1" />
                          Đổi mật khẩu
                        </>
                      )}
                    </Button>
                  </div>
                </Form>

                <hr className="my-4" />

                <div className="alert alert-info">
                  <h6>Lưu ý bảo mật:</h6>
                  <ul className="mb-0">
                    <li>Mật khẩu phải có ít nhất 6 ký tự</li>
                    <li>Nên sử dụng kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                    <li>Không sử dụng thông tin cá nhân dễ đoán</li>
                    <li>Thay đổi mật khẩu định kỳ để đảm bảo bảo mật</li>
                  </ul>
                </div>
              </Card.Body>
            </Card>
          )}



          {/* Permissions */}
          {activeTab === 'permissions' && (
            <Card>
              <Card.Header>
                <h5 className="mb-0">
                  <FaShieldAlt className="me-2" />
                  Phân quyền tài khoản
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-4">
                  <h6>Vai trò hiện tại:</h6>
                  <Badge bg={getRoleBadgeVariant(user?.role)} className="fs-6 px-3 py-2">
                    {getRoleText(user?.role)}
                  </Badge>
                </div>

                <div className="mb-4">
                  <h6>Quyền hạn:</h6>
                  <ul className="list-group">
                    {getRolePermissions(user?.role).map((permission, index) => (
                      <li key={index} className="list-group-item d-flex align-items-center">
                        <span className="text-success me-2">✓</span>
                        {permission}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="alert alert-warning">
                  <h6>Lưu ý:</h6>
                  <p className="mb-0">
                    Phân quyền được quản lý bởi quản trị viên hệ thống.
                    Nếu bạn cần thay đổi quyền hạn, vui lòng liên hệ với quản trị viên.
                  </p>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>


    </Container>
  );
};

export default SettingsAdmin;

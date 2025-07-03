import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Container, Row, Col, Badge, Card, Alert, Spinner, InputGroup} from 'react-bootstrap';
import { FaPlus, FaEdit, FaEye, FaEyeSlash, FaSearch, FaFilter, FaDownload, FaCog} from 'react-icons/fa';

const ServicesAdmin = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAlert, setShowAlert] = useState({ show: false, message: '', variant: 'success' });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: '',
    status: 'active'
  });

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchQuery, statusFilter]);

  const loadServices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8081/api/services/admin/all');
      const data = await response.json();

      if (data.success) {
        // Chuyển đổi dữ liệu từ backend sang format frontend
        const formattedServices = data.data.map(service => ({
          id: service.id,
          name: service.name,
          description: service.description,
          price: service.price,
          duration: service.durationDays ? `${service.durationDays} ngày` : 'Chưa xác định',
          category: getCategoryDisplayName(service.category),
          status: service.isActive ? 'active' : 'inactive',
          isActive: service.isActive
        }));
        console.log('Formatted services:', formattedServices);
        setServices(formattedServices);
        showNotification('Tải dữ liệu thành công!', 'success');
      } else {
        throw new Error(data.message || 'Lỗi khi tải dữ liệu');
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
      showNotification('Có lỗi xảy ra khi tải dữ liệu: ' + error.message, 'danger');
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function để chuyển đổi category name
  const getCategoryDisplayName = (category) => {
    switch (category) {
      case 'DNA_HOME':
        return 'Tự lấy mẫu tại nhà';
      case 'DNA_PROFESSIONAL':
        return 'Nhân viên thu mẫu tại nhà';
      case 'DNA_FACILITY':
        return 'Thử mẫu tại cơ sở';
      default:
        return category || 'Chưa phân loại';
    }
  };

  // Helper function để chuyển đổi ngược lại
  const getCategoryBackendName = (displayName) => {
    switch (displayName) {
      case 'Tự lấy mẫu tại nhà':
        return 'DNA_HOME';
      case 'Nhân viên thu mẫu tại nhà':
        return 'DNA_PROFESSIONAL';
      case 'Thử mẫu tại cơ sở':
        return 'DNA_FACILITY';
      default:
        return displayName;
    }
  };

  const filterServices = () => {
    let filtered = services.filter(service => {
      const matchesSearch = (
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const matchesStatus = statusFilter ? service.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
    setFilteredServices(filtered);
  };

  const showNotification = (message, variant = 'success') => {
    setShowAlert({ show: true, message, variant });
    setTimeout(() => setShowAlert({ show: false, message: '', variant: 'success' }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('Input change:', name, value); // Debug log
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Chuẩn bị dữ liệu gửi lên backend
      const serviceData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: getCategoryBackendName(formData.category),
        durationDays: formData.duration ? parseInt(formData.duration.replace(/\D/g, '')) : null,
        isActive: formData.status === 'active',
        features: [] // Có thể thêm sau
      };

      console.log('Sending data:', serviceData);

      let response;
      if (selectedService) {
        // Cập nhật dịch vụ
        console.log('Updating service ID:', selectedService.id);
        response = await fetch(`http://localhost:8081/api/services/${selectedService.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(serviceData)
        });
      } else {
        // Thêm dịch vụ mới
        console.log('Creating new service');
        response = await fetch('http://localhost:8081/api/services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(serviceData)
        });
      }

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        showNotification(selectedService ? 'Dịch vụ đã được cập nhật thành công!' : 'Dịch vụ đã được thêm thành công!');
        handleCloseModal();
        loadServices(); // Reload danh sách
      } else {
        throw new Error(result.message || 'Lỗi khi lưu dịch vụ');
      }
    } catch (error) {
      console.error('Lỗi khi lưu dịch vụ:', error);
      showNotification('Có lỗi xảy ra khi lưu dịch vụ: ' + error.message, 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration,
      category: service.category,
      status: service.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn vô hiệu hóa dịch vụ này? Dịch vụ sẽ không hiển thị cho khách hàng.')) {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8081/api/services/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          showNotification('Dịch vụ đã được vô hiệu hóa thành công!');
          loadServices(); // Reload danh sách
        } else {
          throw new Error(result.message || 'Lỗi khi vô hiệu hóa dịch vụ');
        }
      } catch (error) {
        console.error('Lỗi khi vô hiệu hóa dịch vụ:', error);
        showNotification('Có lỗi xảy ra khi vô hiệu hóa dịch vụ: ' + error.message, 'danger');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleReactivate = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn kích hoạt lại dịch vụ này?')) {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8081/api/services/${id}/reactivate`, {
          method: 'PUT'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          showNotification('Dịch vụ đã được kích hoạt thành công!');
          loadServices(); // Reload danh sách
        } else {
          throw new Error(result.message || 'Lỗi khi kích hoạt dịch vụ');
        }
      } catch (error) {
        console.error('Lỗi khi kích hoạt dịch vụ:', error);
        showNotification('Có lỗi xảy ra khi kích hoạt dịch vụ: ' + error.message, 'danger');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddNew = () => {
    setSelectedService(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      category: '',
      status: 'active'
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedService(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      category: '',
      status: 'active'
    });
  };



  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleExport = () => {
    showNotification('Đang xuất dữ liệu...', 'info');
    setTimeout(() => {
      showNotification('Xuất dữ liệu thành công!', 'success');
    }, 2000);
  };

  return (
    <Container fluid>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="mb-1">
                <FaCog className="me-2" />
                Quản lý dịch vụ
              </h1>
              <p className="text-muted">Quản lý danh sách dịch vụ và giá cả</p>
            </div>
            <div>
              <Button variant="outline-primary" className="me-2" onClick={handleExport}>
                <FaDownload className="me-1" />
                Xuất Excel
              </Button>
              <Button variant="success" onClick={handleAddNew}>
                <FaPlus className="me-1" />
                Thêm dịch vụ
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
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Tìm kiếm theo tên, mô tả, danh mục..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Vô hiệu hóa</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Button variant="outline-secondary" onClick={() => {
                setSearchQuery('');
                setStatusFilter('');
              }}>
                <FaFilter className="me-1" />
                Xóa bộ lọc
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Services Table */}
      <Card>
        <Card.Body>
          {isLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>Tên dịch vụ</th>
                  <th>Mô tả</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Thời gian</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map(service => (
                  <tr key={service.id}>
                    <td>
                      <strong>{service.name}</strong>
                    </td>
                    <td>
                      <div style={{ maxWidth: '300px' }}>
                        {service.description.length > 100 
                          ? `${service.description.substring(0, 100)}...` 
                          : service.description
                        }
                      </div>
                    </td>
                    <td>
                      <Badge bg="info">{service.category}</Badge>
                    </td>
                    <td>
                      <strong className="text-success">
                        {formatPrice(service.price)}
                      </strong>
                    </td>
                    <td>{service.duration}</td>
                    <td>
                      <Badge bg={service.isActive ? 'success' : 'secondary'}>
                        {service.isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
                      </Badge>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => handleEdit(service)}
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </Button>
                        {service.isActive ? (
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => handleDelete(service.id)}
                            title="Vô hiệu hóa dịch vụ"
                          >
                            <FaEyeSlash />
                          </Button>
                        ) : (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleReactivate(service.id)}
                            title="Kích hoạt lại dịch vụ"
                          >
                            <FaEye />
                          </Button>
                        )}

                      </div>
                    </td>
                  </tr>
                ))}
                {filteredServices.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <div className="text-muted">
                        <FaCog size={48} className="mb-3" />
                        <p>Không tìm thấy dịch vụ nào.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Modal thêm/sửa dịch vụ */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedService ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Tên dịch vụ <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nhập tên dịch vụ"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả <span className="text-danger">*</span></Form.Label>
              <textarea
                className="form-control"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Mô tả chi tiết về dịch vụ"
                required
                style={{ resize: 'vertical', minHeight: '100px' }}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giá (VNĐ) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Danh mục</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="Tự lấy mẫu tại nhà">Tự lấy mẫu tại nhà</option>
                    <option value="Nhân viên thu mẫu tại nhà">Nhân viên thu mẫu tại nhà</option>
                    <option value="Thử mẫu tại cơ sở">Thử mẫu tại cơ sở</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Thời gian thực hiện</Form.Label>
                  <Form.Control
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: 3-5 ngày"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Vô hiệu hóa</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
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
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default ServicesAdmin; 
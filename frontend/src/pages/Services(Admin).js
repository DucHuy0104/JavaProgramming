import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Container, Row, Col, Badge, Card, Alert, Spinner, InputGroup} from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter, FaDownload, FaCog} from 'react-icons/fa';

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Dữ liệu mẫu mở rộng
      const sampleServices = [
        {
          id: 1,
          name: 'Xét nghiệm ADN cha con',
          description: 'Xét nghiệm xác định mối quan hệ huyết thống cha con với độ chính xác 99.9%',
          price: 5000000,
          duration: '3-5 ngày',
          category: 'ADN',
          status: 'active'
        },
        {
          id: 2,
          name: 'Xét nghiệm ADN huyết thống',
          description: 'Xét nghiệm xác định mối quan hệ huyết thống tổng quát',
          price: 7000000,
          duration: '3-5 ngày',
          category: 'ADN',
          status: 'active'
        },
        {
          id: 3,
          name: 'Xét nghiệm máu tổng quát',
          description: 'Xét nghiệm máu cơ bản để kiểm tra sức khỏe tổng thể',
          price: 500000,
          duration: '1-2 ngày',
          category: 'Xét nghiệm máu',
          status: 'active'
        },
        {
          id: 4,
          name: 'Xét nghiệm nước tiểu',
          description: 'Xét nghiệm nước tiểu để kiểm tra chức năng thận',
          price: 300000,
          duration: '1 ngày',
          category: 'Xét nghiệm nước tiểu',
          status: 'inactive'
        }
      ];
      
      setServices(sampleServices);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
      showNotification('Có lỗi xảy ra khi tải dữ liệu', 'danger');
    } finally {
      setIsLoading(false);
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (selectedService) {
        // Cập nhật dịch vụ
        setServices(services.map(service =>
          service.id === selectedService.id
            ? { ...service, ...formData, price: parseFloat(formData.price) }
            : service
        ));
        showNotification('Dịch vụ đã được cập nhật thành công!');
      } else {
        // Thêm dịch vụ mới
        const newService = {
          id: Math.max(...services.map(s => s.id), 0) + 1,
          ...formData,
          price: parseFloat(formData.price)
        };
        setServices([...services, newService]);
        showNotification('Dịch vụ đã được thêm thành công!');
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Lỗi khi lưu dịch vụ:', error);
      showNotification('Có lỗi xảy ra khi lưu dịch vụ', 'danger');
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

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      setIsLoading(true);
      setTimeout(() => {
        setServices(services.filter(service => service.id !== id));
        showNotification('Dịch vụ đã được xóa thành công!');
        setIsLoading(false);
      }, 500);
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

  const handleToggleStatus = async (service) => {
    try {
      setServices(services.map(s =>
        s.id === service.id
          ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' }
          : s
      ));
      showNotification(`Dịch vụ đã được ${service.status === 'active' ? 'ngừng hoạt động' : 'kích hoạt'}!`);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      showNotification('Có lỗi xảy ra khi cập nhật trạng thái', 'danger');
    }
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
                <option value="inactive">Ngừng hoạt động</option>
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
                      <Badge bg={service.status === 'active' ? 'success' : 'danger'}>
                        {service.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
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
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => handleToggleStatus(service)}
                          title={service.status === 'active' ? 'Ngừng hoạt động' : 'Kích hoạt'}
                        >
                          {service.status === 'active' ? 'Tắt' : 'Bật'}
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(service.id)}
                          title="Xóa"
                        >
                          <FaTrash />
                        </Button>
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
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Mô tả chi tiết về dịch vụ"
                required
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
                    <option value="ADN">ADN</option>
                    <option value="Xét nghiệm máu">Xét nghiệm máu</option>
                    <option value="Xét nghiệm nước tiểu">Xét nghiệm nước tiểu</option>
                    <option value="Xét nghiệm sinh hóa">Xét nghiệm sinh hóa</option>
                    <option value="Khác">Khác</option>
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
                    <option value="inactive">Ngừng hoạt động</option>
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
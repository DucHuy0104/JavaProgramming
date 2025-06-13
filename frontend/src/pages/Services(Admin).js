import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Container, Row, Col, Badge } from 'react-bootstrap';

const ServicesAdmin = () => {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    status: 'active'
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      // TODO: Thay thế bằng API call thực tế
      // const response = await fetch('/api/services');
      // const data = await response.json();
      // setServices(data);
      
      // Dữ liệu mẫu
      setServices([
        {
          id: 1,
          name: 'Xét nghiệm ADN cha con',
          description: 'Xét nghiệm xác định mối quan hệ huyết thống cha con',
          price: 5000000,
          duration: '3-5 ngày',
          status: 'active'
        },
        {
          id: 2,
          name: 'Xét nghiệm ADN huyết thống',
          description: 'Xét nghiệm xác định mối quan hệ huyết thống',
          price: 7000000,
          duration: '3-5 ngày',
          status: 'active'
        }
      ]);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    }
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
    try {
      if (selectedService) {
        // TODO: Gọi API cập nhật dịch vụ
        // await fetch(`/api/services/${selectedService.id}`, {
        //   method: 'PUT',
        //   body: JSON.stringify(formData)
        // });
        
        setServices(services.map(service =>
          service.id === selectedService.id
            ? { ...service, ...formData }
            : service
        ));
      } else {
        // TODO: Gọi API tạo dịch vụ mới
        // const response = await fetch('/api/services', {
        //   method: 'POST',
        //   body: JSON.stringify(formData)
        // });
        // const newService = await response.json();
        
        const newService = {
          id: services.length + 1,
          ...formData
        };
        setServices([...services, newService]);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Lỗi khi lưu dịch vụ:', error);
    }
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration,
      status: service.status
    });
    setShowModal(true);
  };

  const handleAddNew = () => {
    setSelectedService(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
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
      status: 'active'
    });
  };

  const handleToggleStatus = async (service) => {
    try {
      // TODO: Gọi API cập nhật trạng thái
      // await fetch(`/api/services/${service.id}`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({
      //     status: service.status === 'active' ? 'inactive' : 'active'
      //   })
      // });
      
      setServices(services.map(s =>
        s.id === service.id
          ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' }
          : s
      ));
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0">Quản lý dịch vụ</h1>
        <Button variant="primary" onClick={handleAddNew}>
          Thêm dịch vụ mới
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Tên dịch vụ</th>
            <th>Mô tả</th>
            <th>Giá</th>
            <th>Thời gian</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {services.map(service => (
            <tr key={service.id}>
              <td>{service.name}</td>
              <td>{service.description}</td>
              <td>{formatPrice(service.price)}</td>
              <td>{service.duration}</td>
              <td>
                <Badge bg={service.status === 'active' ? 'success' : 'danger'}>
                  {service.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
                </Badge>
              </td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(service)}
                >
                  Sửa
                </Button>
                <Button
                  variant={service.status === 'active' ? 'outline-danger' : 'outline-success'}
                  size="sm"
                  onClick={() => handleToggleStatus(service)}
                >
                  {service.status === 'active' ? 'Ngừng hoạt động' : 'Kích hoạt'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedService ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Tên dịch vụ</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giá (VND)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Thời gian (ví dụ: '3-5 ngày')</Form.Label>
                  <Form.Control
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Đóng
            </Button>
            <Button variant="primary" type="submit">
              Lưu thay đổi
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default ServicesAdmin; 
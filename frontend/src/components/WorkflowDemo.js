import React, { useState } from 'react';
import { Card, Button, Row, Col, Badge } from 'react-bootstrap';
import WorkflowTracker from './WorkflowTracker';

const WorkflowDemo = () => {
  const [currentOrder, setCurrentOrder] = useState({
    id: 1,
    orderNumber: 'ORD1234567890',
    customerName: 'Nguyễn Văn A',
    serviceName: 'Xét nghiệm ADN dân sự',
    orderType: 'self_submission',
    status: 'pending_registration',
    orderDate: new Date().toISOString(),
    totalAmount: 2500000,
    paymentStatus: 'pending',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    email: 'nguyenvana@email.com',
    phone: '0901234567',
    notes: 'Khách hàng yêu cầu gửi kit vào buổi sáng'
  });

  const workflowSteps = [
    { key: 'pending_registration', label: 'Chờ đăng ký' },
    { key: 'kit_sent', label: 'Đã gửi kit' },
    { key: 'sample_collected_self', label: 'Đã thu mẫu' },
    { key: 'sample_in_transit', label: 'Đang chuyển mẫu' },
    { key: 'sample_received_lab', label: 'Đã nhận mẫu' },
    { key: 'testing_in_progress', label: 'Đang xét nghiệm' },
    { key: 'results_recorded', label: 'Đã ghi nhận KQ' },
    { key: 'results_delivered', label: 'Đã trả kết quả' }
  ];

  const getNextStatus = (currentStatus) => {
    const currentIndex = workflowSteps.findIndex(step => step.key === currentStatus);
    if (currentIndex < workflowSteps.length - 1) {
      return workflowSteps[currentIndex + 1].key;
    }
    return currentStatus;
  };

  const handleNextStep = () => {
    const nextStatus = getNextStatus(currentOrder.status);
    if (nextStatus !== currentOrder.status) {
      setCurrentOrder(prev => ({
        ...prev,
        status: nextStatus
      }));
    }
  };

  const handleReset = () => {
    setCurrentOrder(prev => ({
      ...prev,
      status: 'pending_registration'
    }));
  };

  const handleChangeOrderType = (orderType) => {
    setCurrentOrder(prev => ({
      ...prev,
      orderType: orderType
    }));
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">Workflow Tracking Demo</h2>
      
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Thông tin đơn hàng</h5>
            </Card.Header>
            <Card.Body>
              <p><strong>Mã đơn:</strong> {currentOrder.orderNumber}</p>
              <p><strong>Khách hàng:</strong> {currentOrder.customerName}</p>
              <p><strong>Dịch vụ:</strong> {currentOrder.serviceName}</p>
              <p><strong>Loại dịch vụ:</strong> 
                <Badge bg="info" className="ms-2">
                  {currentOrder.orderType === 'self_submission' ? 'Tự lấy mẫu tại nhà' : 
                   currentOrder.orderType === 'in_clinic' ? 'Thu mẫu tại cơ sở' : 
                   'Nhân viên thu mẫu tại nhà'}
                </Badge>
              </p>
              <p><strong>Trạng thái hiện tại:</strong> 
                <Badge bg="primary" className="ms-2">
                  {workflowSteps.find(step => step.key === currentOrder.status)?.label}
                </Badge>
              </p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Điều khiển</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <label className="form-label">Loại dịch vụ:</label>
                <div className="d-flex gap-2">
                  <Button 
                    size="sm" 
                    variant={currentOrder.orderType === 'self_submission' ? 'primary' : 'outline-primary'}
                    onClick={() => handleChangeOrderType('self_submission')}
                  >
                    Tự lấy mẫu
                  </Button>
                  <Button 
                    size="sm" 
                    variant={currentOrder.orderType === 'in_clinic' ? 'primary' : 'outline-primary'}
                    onClick={() => handleChangeOrderType('in_clinic')}
                  >
                    Tại cơ sở
                  </Button>
                  <Button 
                    size="sm" 
                    variant={currentOrder.orderType === 'home_collection' ? 'primary' : 'outline-primary'}
                    onClick={() => handleChangeOrderType('home_collection')}
                  >
                    Thu mẫu tại nhà
                  </Button>
                </div>
              </div>
              
              <div className="d-flex gap-2">
                <Button 
                  variant="success" 
                  onClick={handleNextStep}
                  disabled={currentOrder.status === 'results_delivered'}
                >
                  Bước tiếp theo
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <WorkflowTracker order={currentOrder} />
    </div>
  );
};

export default WorkflowDemo; 
import React, { useState, useEffect } from 'react';
import { Card, Badge, ProgressBar, Row, Col, Button } from 'react-bootstrap';
import { 
  FaCalendarAlt, 
  FaBox, 
  FaUserCheck, 
  FaTruck, 
  FaFlask, 
  FaFileAlt, 
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaSync,
  FaBell
} from 'react-icons/fa';

const WorkflowTracker = ({ order, onRefresh }) => {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    setLastUpdated(new Date());
  }, [order.status]);

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
    setLastUpdated(new Date());
  };
  const getWorkflowSteps = (orderType) => {
    if (orderType === 'self_submission') {
      return [
        { key: 'pending_registration', label: 'Đăng ký đặt hẹn', icon: FaCalendarAlt, description: 'Khách hàng đã đặt đơn hàng' },
        { key: 'accepted', label: 'Admin nhận đơn', icon: FaUserCheck, description: 'Admin đã xác nhận và nhận đơn hàng' },
        { key: 'kit_sent', label: 'Gửi bộ kit', icon: FaBox, description: 'Bộ kit xét nghiệm đã được gửi đến khách hàng' },
        { key: 'sample_collected_self', label: 'Thu thập mẫu', icon: FaUserCheck, description: 'Khách hàng đã thu thập mẫu theo hướng dẫn' },
        { key: 'sample_in_transit', label: 'Chuyển mẫu', icon: FaTruck, description: 'Mẫu đang được chuyển đến phòng lab' },
        { key: 'sample_received_lab', label: 'Nhận mẫu tại lab', icon: FaFlask, description: 'Phòng lab đã nhận và kiểm tra mẫu' },
        { key: 'testing_in_progress', label: 'Thực hiện xét nghiệm', icon: FaFlask, description: 'Đang tiến hành xét nghiệm mẫu' },
        { key: 'results_recorded', label: 'Ghi nhận kết quả', icon: FaFileAlt, description: 'Kết quả xét nghiệm đã được ghi nhận' },
        { key: 'results_delivered', label: 'Trả kết quả', icon: FaCheckCircle, description: 'Kết quả đã được gửi đến khách hàng' }
      ];
    } else if (orderType === 'in_clinic') {
      return [
        { key: 'pending_registration', label: 'Đăng ký đặt hẹn', icon: FaCalendarAlt, description: 'Khách hàng đã đặt đơn hàng' },
        { key: 'accepted', label: 'Admin nhận đơn', icon: FaUserCheck, description: 'Admin đã xác nhận và nhận đơn hàng' },
        { key: 'sample_collected_clinic', label: 'Thu thập mẫu tại CSYT', icon: FaUserCheck, description: 'Nhân viên đã thu thập mẫu tại cơ sở y tế' },
        { key: 'testing_in_progress', label: 'Thực hiện xét nghiệm', icon: FaFlask, description: 'Đang tiến hành xét nghiệm mẫu' },
        { key: 'results_recorded', label: 'Ghi nhận kết quả', icon: FaFileAlt, description: 'Kết quả xét nghiệm đã được ghi nhận' },
        { key: 'results_delivered', label: 'Trả kết quả', icon: FaCheckCircle, description: 'Kết quả đã được gửi đến khách hàng' }
      ];
    } else if (orderType === 'home_collection') {
      return [
        { key: 'pending_registration', label: 'Đăng ký đặt hẹn', icon: FaCalendarAlt, description: 'Khách hàng đã đặt đơn hàng' },
        { key: 'accepted', label: 'Admin nhận đơn', icon: FaUserCheck, description: 'Admin đã xác nhận và nhận đơn hàng' },
        { key: 'staff_dispatched', label: 'Nhân viên được cử', icon: FaUserCheck, description: 'Nhân viên đã được cử đến địa chỉ khách hàng' },
        { key: 'sample_collected_home', label: 'Thu thập mẫu tại nhà', icon: FaUserCheck, description: 'Nhân viên đã thu thập mẫu tại nhà khách hàng' },
        { key: 'sample_received_lab', label: 'Nhận mẫu tại lab', icon: FaFlask, description: 'Phòng lab đã nhận và kiểm tra mẫu' },
        { key: 'testing_in_progress', label: 'Thực hiện xét nghiệm', icon: FaFlask, description: 'Đang tiến hành xét nghiệm mẫu' },
        { key: 'results_recorded', label: 'Ghi nhận kết quả', icon: FaFileAlt, description: 'Kết quả xét nghiệm đã được ghi nhận' },
        { key: 'results_delivered', label: 'Trả kết quả', icon: FaCheckCircle, description: 'Kết quả đã được gửi đến khách hàng' }
      ];
    }
    return [];
  };

  const getStepStatus = (stepKey, currentStatus) => {
    const steps = getWorkflowSteps(order.orderType);
    const currentIndex = steps.findIndex(step => step.key === currentStatus);
    const stepIndex = steps.findIndex(step => step.key === stepKey);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const getProgressPercentage = () => {
    const steps = getWorkflowSteps(order.orderType);
    const currentIndex = steps.findIndex(step => step.key === order.status);
    return currentIndex >= 0 ? ((currentIndex + 1) / steps.length) * 100 : 0;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'current': return 'primary';
      case 'pending': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FaCheckCircle className="text-success" />;
      case 'current': return <FaClock className="text-primary" />;
      case 'pending': return <FaExclamationTriangle className="text-muted" />;
      default: return <FaExclamationTriangle className="text-muted" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status) => {
    const statusMap = {
      'pending_registration': 'Chờ đăng ký',
      'kit_sent': 'Đã gửi kit',
      'sample_collected_self': 'Đã thu mẫu',
      'sample_in_transit': 'Đang chuyển mẫu',
      'sample_received_lab': 'Đã nhận mẫu',
      'testing_in_progress': 'Đang xét nghiệm',
      'results_recorded': 'Đã ghi nhận KQ',
      'results_delivered': 'Đã trả kết quả',
      'sample_collected_clinic': 'Đã thu mẫu tại CSYT',
      'staff_dispatched': 'Đã cử nhân viên',
      'sample_collected_home': 'Đã thu mẫu tại nhà',
      'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  const getOrderTypeText = (orderType) => {
    const typeMap = {
      'self_submission': 'Tự lấy mẫu tại nhà',
      'home_collection': 'Nhân viên thu mẫu tại nhà',
      'in_clinic': 'Thu mẫu tại cơ sở'
    };
    return typeMap[orderType] || orderType;
  };

  if (!order) return null;

  const steps = getWorkflowSteps(order.orderType);
  const progressPercentage = getProgressPercentage();

  return (
    <Card className="mb-4">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <FaCalendarAlt className="me-2" />
            Theo dõi quá trình xét nghiệm
          </h5>
          <div className="d-flex align-items-center gap-2">
            <small className="text-muted">
              <FaBell className="me-1" />
              Cập nhật lần cuối: {lastUpdated.toLocaleTimeString('vi-VN')}
            </small>
            <Button 
              variant="outline-primary" 
              size="sm" 
              onClick={handleRefresh}
              title="Làm mới trạng thái"
            >
              <FaSync />
            </Button>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col md={6}>
            <small className="text-muted">Mã đơn hàng</small>
            <p className="mb-0 fw-bold">{order.orderNumber}</p>
          </Col>
          <Col md={6}>
            <small className="text-muted">Loại dịch vụ</small>
            <p className="mb-0">{getOrderTypeText(order.orderType)}</p>
          </Col>
        </Row>
        
        <Row className="mb-3">
          <Col md={6}>
            <small className="text-muted">Trạng thái hiện tại</small>
            <p className="mb-0">
              <Badge bg={order.status === 'cancelled' ? 'danger' : 'primary'}>
                {getStatusText(order.status)}
              </Badge>
            </p>
          </Col>
          <Col md={6}>
            <small className="text-muted">Tiến độ</small>
            <ProgressBar 
              now={progressPercentage} 
              label={`${Math.round(progressPercentage)}%`}
              className="mt-1"
            />
          </Col>
        </Row>

        <div className="workflow-steps mt-4">
          {steps.map((step, index) => {
            const stepStatus = getStepStatus(step.key, order.status);
            const IconComponent = step.icon;
            
            return (
              <div key={step.key} className={`workflow-step ${stepStatus} mb-4 p-3 border rounded ${stepStatus === 'current' ? 'border-primary bg-light' : ''}`}>
                <div className="d-flex align-items-start">
                  <div className={`step-icon me-3 ${getStatusColor(stepStatus)}`} style={{ fontSize: '1.5rem', minWidth: '2rem' }}>
                    {stepStatus === 'completed' ? (
                      <FaCheckCircle className="text-success" />
                    ) : (
                      <IconComponent className={stepStatus === 'current' ? 'text-primary' : 'text-muted'} />
                    )}
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="mb-1 fw-bold">{step.label}</h6>
                      {getStatusIcon(stepStatus)}
                    </div>
                    <p className="text-muted mb-2 small">{step.description}</p>
                    <small className={`${stepStatus === 'completed' ? 'text-success' : stepStatus === 'current' ? 'text-primary' : 'text-muted'}`}>
                      {stepStatus === 'completed' && order[`${step.key.replace(/_/g, '')}Date`] && 
                        `✅ Hoàn thành: ${formatDate(order[`${step.key.replace(/_/g, '')}Date`])}`
                      }
                      {stepStatus === 'current' && '🔄 Đang thực hiện...'}
                      {stepStatus === 'pending' && '⏳ Chờ thực hiện'}
                    </small>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`step-connector mt-3 ${stepStatus === 'completed' ? 'completed' : ''}`} 
                       style={{ 
                         height: '20px', 
                         width: '2px', 
                         backgroundColor: stepStatus === 'completed' ? '#28a745' : '#dee2e6',
                         marginLeft: '1rem'
                       }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Summary */}
        <div className="mt-4 p-3 bg-light rounded">
          <h6 className="mb-3">📊 Tóm tắt tiến độ</h6>
          <Row>
            <Col md={4}>
              <div className="text-center">
                <h4 className="text-primary mb-1">{Math.round(progressPercentage)}%</h4>
                <small className="text-muted">Tiến độ tổng thể</small>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <h4 className="text-success mb-1">
                  {steps.filter(step => getStepStatus(step.key, order.status) === 'completed').length}
                </h4>
                <small className="text-muted">Bước đã hoàn thành</small>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <h4 className="text-info mb-1">
                  {steps.length - steps.filter(step => getStepStatus(step.key, order.status) === 'completed').length}
                </h4>
                <small className="text-muted">Bước còn lại</small>
              </div>
            </Col>
          </Row>
        </div>

        {order.estimatedCompletionDate && (
          <div className="mt-3 p-3 bg-light rounded">
            <small className="text-muted">
              <FaClock className="me-1" />
              Dự kiến hoàn thành: {formatDate(order.estimatedCompletionDate)}
            </small>
          </div>
        )}

        {/* Current Status Alert */}
        {order.status === 'accepted' && (
          <div className="mt-3 alert alert-success">
            <strong>🎉 Đơn hàng đã được nhận!</strong>
            <br />
            Admin đã xác nhận đơn hàng của bạn. Bước tiếp theo sẽ là gửi bộ kit xét nghiệm.
          </div>
        )}
        
        {order.status === 'kit_sent' && (
          <div className="mt-3 alert alert-info">
            <strong>📦 Bộ kit đã được gửi!</strong>
            <br />
            Bộ kit xét nghiệm đã được gửi đến địa chỉ của bạn. Vui lòng kiểm tra và thu thập mẫu theo hướng dẫn.
          </div>
        )}

        {order.status === 'testing_in_progress' && (
          <div className="mt-3 alert alert-primary">
            <strong>🔬 Đang xét nghiệm!</strong>
            <br />
            Mẫu của bạn đang được xét nghiệm tại phòng lab. Quá trình này có thể mất 1-3 ngày làm việc.
          </div>
        )}

        {order.status === 'results_delivered' && (
          <div className="mt-3 alert alert-success">
            <strong>✅ Hoàn thành!</strong>
            <br />
            Kết quả xét nghiệm đã được gửi đến bạn. Bạn có thể tải xuống kết quả từ phần bên dưới.
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default WorkflowTracker; 
import React from 'react';
import { Card, Badge, ProgressBar, Row, Col } from 'react-bootstrap';
import { 
  FaCalendarAlt, 
  FaBox, 
  FaUserCheck, 
  FaTruck, 
  FaFlask, 
  FaFileAlt, 
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle
} from 'react-icons/fa';

const WorkflowTracker = ({ order }) => {
  const getWorkflowSteps = (orderType) => {
    if (orderType === 'self_submission') {
      return [
        { key: 'pending_registration', label: 'Đăng ký đặt hẹn', icon: FaCalendarAlt },
        { key: 'kit_sent', label: 'Gửi bộ kit', icon: FaBox },
        { key: 'sample_collected_self', label: 'Thu thập mẫu', icon: FaUserCheck },
        { key: 'sample_in_transit', label: 'Chuyển mẫu', icon: FaTruck },
        { key: 'sample_received_lab', label: 'Nhận mẫu tại lab', icon: FaFlask },
        { key: 'testing_in_progress', label: 'Thực hiện xét nghiệm', icon: FaFlask },
        { key: 'results_recorded', label: 'Ghi nhận kết quả', icon: FaFileAlt },
        { key: 'results_delivered', label: 'Trả kết quả', icon: FaCheckCircle }
      ];
    } else if (orderType === 'in_clinic') {
      return [
        { key: 'pending_registration', label: 'Đăng ký đặt hẹn', icon: FaCalendarAlt },
        { key: 'sample_collected_clinic', label: 'Thu thập mẫu tại CSYT', icon: FaUserCheck },
        { key: 'testing_in_progress', label: 'Thực hiện xét nghiệm', icon: FaFlask },
        { key: 'results_recorded', label: 'Ghi nhận kết quả', icon: FaFileAlt },
        { key: 'results_delivered', label: 'Trả kết quả', icon: FaCheckCircle }
      ];
    } else if (orderType === 'home_collection') {
      return [
        { key: 'pending_registration', label: 'Đăng ký đặt hẹn', icon: FaCalendarAlt },
        { key: 'staff_dispatched', label: 'Nhân viên được cử', icon: FaUserCheck },
        { key: 'sample_collected_home', label: 'Thu thập mẫu tại nhà', icon: FaUserCheck },
        { key: 'sample_received_lab', label: 'Nhận mẫu tại lab', icon: FaFlask },
        { key: 'testing_in_progress', label: 'Thực hiện xét nghiệm', icon: FaFlask },
        { key: 'results_recorded', label: 'Ghi nhận kết quả', icon: FaFileAlt },
        { key: 'results_delivered', label: 'Trả kết quả', icon: FaCheckCircle }
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
        <h5 className="mb-0">
          <FaCalendarAlt className="me-2" />
          Theo dõi quá trình xét nghiệm
        </h5>
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
              <div key={step.key} className={`workflow-step ${stepStatus} mb-3`}>
                <div className="d-flex align-items-center">
                  <div className={`step-icon me-3 ${getStatusColor(stepStatus)}`}>
                    {stepStatus === 'completed' ? (
                      <FaCheckCircle />
                    ) : (
                      <IconComponent />
                    )}
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-1">{step.label}</h6>
                      {getStatusIcon(stepStatus)}
                    </div>
                    <small className="text-muted">
                      {stepStatus === 'completed' && order[`${step.key.replace(/_/g, '')}Date`] && 
                        `Hoàn thành: ${formatDate(order[`${step.key.replace(/_/g, '')}Date`])}`
                      }
                      {stepStatus === 'current' && 'Đang thực hiện...'}
                      {stepStatus === 'pending' && 'Chờ thực hiện'}
                    </small>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`step-connector ${stepStatus === 'completed' ? 'completed' : ''}`} />
                )}
              </div>
            );
          })}
        </div>

        {order.estimatedCompletionDate && (
          <div className="mt-3 p-3 bg-light rounded">
            <small className="text-muted">
              <FaClock className="me-1" />
              Dự kiến hoàn thành: {formatDate(order.estimatedCompletionDate)}
            </small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default WorkflowTracker; 
import React, { useState } from 'react';
import { Card, Badge, Row, Col, Button, Alert, ProgressBar } from 'react-bootstrap';
import { 
  FaUserMd, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaClock, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaRoute,
  FaFlask,
  FaFileAlt
} from 'react-icons/fa';

const HomeCollectionTracker = ({ order, onRefresh }) => {
  const [showDetails, setShowDetails] = useState(false);

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

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending_registration': { bg: 'secondary', text: 'Chờ đăng ký' },
      'accepted': { bg: 'success', text: 'Đã nhận đơn' },
      'staff_dispatched': { bg: 'info', text: 'Đã cử nhân viên' },
      'sample_collected_home': { bg: 'success', text: 'Đã thu mẫu tại nhà' },
      'sample_received_lab': { bg: 'primary', text: 'Đã nhận mẫu tại lab' },
      'testing_in_progress': { bg: 'warning', text: 'Đang xét nghiệm' },
      'results_recorded': { bg: 'info', text: 'Đã ghi nhận KQ' },
      'results_delivered': { bg: 'success', text: 'Đã trả KQ' }
    };

    const config = statusConfig[status] || { bg: 'secondary', text: status };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const getProgressPercentage = () => {
    const steps = [
      'pending_registration',
      'accepted', 
      'staff_dispatched',
      'sample_collected_home',
      'sample_received_lab',
      'testing_in_progress',
      'results_recorded',
      'results_delivered'
    ];
    const currentIndex = steps.indexOf(order.status);
    return currentIndex >= 0 ? ((currentIndex + 1) / steps.length) * 100 : 0;
  };

  const getCurrentStepInfo = () => {
    switch (order.status) {
      case 'pending_registration':
        return {
          title: 'Chờ xác nhận đơn hàng',
          description: 'Đơn hàng đang chờ admin xác nhận và phân công nhân viên',
          icon: FaInfoCircle,
          color: 'secondary'
        };
      case 'accepted':
        return {
          title: 'Đã nhận đơn hàng',
          description: 'Admin đã xác nhận đơn hàng. Sẽ sớm phân công nhân viên thu mẫu',
          icon: FaCheckCircle,
          color: 'success'
        };
      case 'staff_dispatched':
        return {
          title: 'Nhân viên đã được cử',
          description: `Nhân viên ${order.staffAssigned || 'đã được phân công'} sẽ liên hệ để sắp xếp lịch hẹn`,
          icon: FaUserMd,
          color: 'info'
        };
      case 'sample_collected_home':
        return {
          title: 'Đã thu mẫu tại nhà',
          description: 'Nhân viên đã thu thập mẫu thành công. Mẫu sẽ được chuyển đến phòng lab',
          icon: FaCheckCircle,
          color: 'success'
        };
      case 'sample_received_lab':
        return {
          title: 'Đã nhận mẫu tại lab',
          description: 'Phòng lab đã nhận và kiểm tra mẫu. Sẽ bắt đầu xét nghiệm',
          icon: FaFlask,
          color: 'primary'
        };
      case 'testing_in_progress':
        return {
          title: 'Đang xét nghiệm',
          description: 'Mẫu đang được xét nghiệm tại phòng lab. Quá trình này có thể mất 1-3 ngày',
          icon: FaFlask,
          color: 'warning'
        };
      case 'results_recorded':
        return {
          title: 'Đã ghi nhận kết quả',
          description: 'Kết quả xét nghiệm đã được ghi nhận và đang được duyệt',
          icon: FaFileAlt,
          color: 'info'
        };
      case 'results_delivered':
        return {
          title: 'Đã trả kết quả',
          description: 'Kết quả xét nghiệm đã được gửi đến khách hàng',
          icon: FaCheckCircle,
          color: 'success'
        };
      default:
        return {
          title: 'Trạng thái không xác định',
          description: 'Không thể xác định trạng thái hiện tại',
          icon: FaExclamationTriangle,
          color: 'secondary'
        };
    }
  };

  const currentStep = getCurrentStepInfo();
  const IconComponent = currentStep.icon;
  const progressPercentage = getProgressPercentage();

  return (
    <Card className="mb-4 border-info">
      <Card.Header className="bg-info bg-opacity-10">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 text-info">
            <FaRoute className="me-2" />
            Theo dõi thu mẫu tại nhà
          </h5>
          <Button
            variant="outline-info"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Ẩn chi tiết' : 'Xem chi tiết'}
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {/* Current Status */}
        <Row className="mb-3">
          <Col md={8}>
            <div className="d-flex align-items-center mb-2">
              <IconComponent className={`me-2 text-${currentStep.color}`} size={20} />
              <h6 className="mb-0">{currentStep.title}</h6>
            </div>
            <p className="text-muted mb-2">{currentStep.description}</p>
            <div className="d-flex align-items-center gap-3">
              <span>Trạng thái: {getStatusBadge(order.status)}</span>
              <span>Tiến độ: {Math.round(progressPercentage)}%</span>
            </div>
          </Col>
          <Col md={4}>
            <ProgressBar 
              now={progressPercentage} 
              variant={currentStep.color}
              label={`${Math.round(progressPercentage)}%`}
            />
          </Col>
        </Row>

        {/* Basic Info */}
        <Row className="mb-3">
          <Col md={6}>
            <small className="text-muted">Mã đơn hàng</small>
            <p className="mb-0 fw-bold">{order.orderNumber}</p>
          </Col>
          <Col md={6}>
            <small className="text-muted">Mã theo dõi</small>
            <p className="mb-0 fw-bold">{order.trackingNumber || 'Chưa có'}</p>
          </Col>
        </Row>

        {/* Detailed Info */}
        {showDetails && (
          <>
            <Row className="mb-3">
              <Col md={6}>
                <small className="text-muted">
                  <FaMapMarkerAlt className="me-1" />
                  Địa chỉ thu mẫu
                </small>
                <p className="mb-0">{order.address || 'Chưa cập nhật'}</p>
              </Col>
              <Col md={6}>
                <small className="text-muted">
                  <FaUserMd className="me-1" />
                  Nhân viên phân công
                </small>
                <p className="mb-0">{order.staffAssigned || 'Chưa phân công'}</p>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <small className="text-muted">
                  <FaClock className="me-1" />
                  Ngày hẹn
                </small>
                <p className="mb-0">{order.appointmentDate ? formatDate(order.appointmentDate) : 'Chưa cập nhật'}</p>
              </Col>
              <Col md={6}>
                <small className="text-muted">
                  <FaClock className="me-1" />
                  Dự kiến hoàn thành
                </small>
                <p className="mb-0">{order.estimatedCompletionDate ? formatDate(order.estimatedCompletionDate) : 'Chưa cập nhật'}</p>
              </Col>
            </Row>

            {/* Timeline */}
            <div className="mt-4">
              <h6 className="mb-3">📅 Lịch trình thực hiện</h6>
              <div className="timeline">
                {order.acceptedDate && (
                  <div className="timeline-item mb-2">
                    <small className="text-success">✅ {formatDate(order.acceptedDate)} - Đã nhận đơn hàng</small>
                  </div>
                )}
                {order.appointmentDate && (
                  <div className="timeline-item mb-2">
                    <small className="text-info">📅 {formatDate(order.appointmentDate)} - Lịch hẹn thu mẫu</small>
                  </div>
                )}
                {order.sampleCollectedDate && (
                  <div className="timeline-item mb-2">
                    <small className="text-success">🏠 {formatDate(order.sampleCollectedDate)} - Đã thu mẫu tại nhà</small>
                  </div>
                )}
                {order.sampleReceivedDate && (
                  <div className="timeline-item mb-2">
                    <small className="text-primary">🔬 {formatDate(order.sampleReceivedDate)} - Đã nhận mẫu tại lab</small>
                  </div>
                )}
                {order.testingStartedDate && (
                  <div className="timeline-item mb-2">
                    <small className="text-warning">⚡ {formatDate(order.testingStartedDate)} - Bắt đầu xét nghiệm</small>
                  </div>
                )}
                {order.resultsReadyDate && (
                  <div className="timeline-item mb-2">
                    <small className="text-info">📊 {formatDate(order.resultsReadyDate)} - Có kết quả</small>
                  </div>
                )}
                {order.resultsDeliveredDate && (
                  <div className="timeline-item mb-2">
                    <small className="text-success">📤 {formatDate(order.resultsDeliveredDate)} - Đã trả kết quả</small>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {(order.sampleNotes || order.resultNotes) && (
              <div className="mt-3">
                <h6 className="mb-2">📝 Ghi chú</h6>
                {order.sampleNotes && (
                  <div className="mb-2">
                    <small className="text-muted">Ghi chú về mẫu:</small>
                    <p className="mb-0 small">{order.sampleNotes}</p>
                  </div>
                )}
                {order.resultNotes && (
                  <div className="mb-2">
                    <small className="text-muted">Ghi chú về kết quả:</small>
                    <p className="mb-0 small">{order.resultNotes}</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Status-specific alerts */}
        {order.status === 'staff_dispatched' && (
          <Alert variant="info" className="mt-3">
            <strong>🚗 Nhân viên đã được cử!</strong>
            <br />
            Nhân viên thu mẫu sẽ liên hệ với bạn trong thời gian sớm nhất để sắp xếp lịch hẹn thu mẫu tại nhà.
            Vui lòng chuẩn bị giấy tờ tùy thân và đảm bảo có người ở nhà vào thời gian hẹn.
          </Alert>
        )}

        {order.status === 'sample_collected_home' && (
          <Alert variant="success" className="mt-3">
            <strong>🏠 Đã thu mẫu thành công!</strong>
            <br />
            Nhân viên đã thu thập mẫu tại nhà bạn. Mẫu sẽ được chuyển đến phòng lab để tiến hành xét nghiệm.
            Bạn sẽ nhận được thông báo khi có kết quả.
          </Alert>
        )}

        {order.status === 'testing_in_progress' && (
          <Alert variant="primary" className="mt-3">
            <strong>🔬 Đang xét nghiệm!</strong>
            <br />
            Mẫu của bạn đang được xét nghiệm tại phòng lab. Quá trình này thường mất 1-3 ngày làm việc.
            Bạn sẽ nhận được thông báo ngay khi có kết quả.
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default HomeCollectionTracker; 
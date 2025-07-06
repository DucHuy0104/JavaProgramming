import React, { useState } from 'react';
import { Card, Badge, Button, Row, Col, Modal, Alert } from 'react-bootstrap';
import { 
  FaFileAlt, 
  FaDownload, 
  FaEye, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaFlask,
  FaUserMd,
  FaCalendarAlt,
  FaShieldAlt
} from 'react-icons/fa';

const TestResultViewer = ({ orderId, testResult }) => {
  const [showModal, setShowModal] = useState(false);

  const getResultBadge = (result) => {
    if (!result) return <Badge bg="secondary">Chưa có</Badge>;

    const resultConfig = {
      'positive': { bg: 'success', text: 'Dương tính', icon: FaCheckCircle },
      'negative': { bg: 'danger', text: 'Âm tính', icon: FaExclamationTriangle },
      'inconclusive': { bg: 'warning', text: 'Không xác định', icon: FaExclamationTriangle },
      'pending': { bg: 'info', text: 'Đang xử lý', icon: FaFlask }
    };

    const config = resultConfig[result.toLowerCase()] || { bg: 'secondary', text: result, icon: FaFileAlt };
    const IconComponent = config.icon;
    
    return (
      <Badge bg={config.bg} className="d-flex align-items-center gap-1">
        <IconComponent />
        {config.text}
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { bg: 'warning', text: 'Chờ xử lý' },
      'approved': { bg: 'success', text: 'Đã duyệt' },
      'delivered': { bg: 'info', text: 'Đã gửi' },
      'cancelled': { bg: 'danger', text: 'Đã hủy' }
    };

    const config = statusConfig[status] || { bg: 'secondary', text: status };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatConfidenceLevel = (level) => {
    if (!level) return '';
    return `${level}%`;
  };

  const handleDownloadPDF = () => {
    if (testResult?.pdfUrl) {
      window.open(testResult.pdfUrl, '_blank');
    }
  };

  const handleViewDetails = () => {
    setShowModal(true);
  };

  const renderResultDetails = () => {
    if (!testResult?.resultDetails) return null;

    try {
      const details = JSON.parse(testResult.resultDetails);
      return (
        <div className="result-details">
          {Object.entries(details).map(([key, value]) => (
            <div key={key} className="mb-2">
              <strong>{key}:</strong> {value}
            </div>
          ))}
        </div>
      );
    } catch (error) {
      return (
        <div className="result-details">
          <pre>{testResult.resultDetails}</pre>
        </div>
      );
    }
  };

  if (!testResult) {
    return (
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">
            <FaFileAlt className="me-2" />
            Kết quả xét nghiệm
          </h5>
        </Card.Header>
        <Card.Body>
          <Alert variant="info">
            <FaFlask className="me-2" />
            <strong>Kết quả xét nghiệm đang được xử lý</strong>
            <br />
            <small>
              • Quá trình xét nghiệm thường mất 1-3 ngày làm việc<br />
              • Bạn sẽ nhận được thông báo khi có kết quả<br />
              • Kết quả sẽ được gửi qua email và có thể xem trên ứng dụng
            </small>
          </Alert>
          <div className="mt-3">
            <h6 className="text-muted mb-2">📋 Các bước tiếp theo:</h6>
            <ul className="list-unstyled">
              <li className="mb-1">
                <FaCheckCircle className="me-2 text-success" size={12} />
                Mẫu đang được xét nghiệm tại phòng lab
              </li>
              <li className="mb-1">
                <FaCheckCircle className="me-2 text-success" size={12} />
                Kết quả sẽ được duyệt bởi chuyên gia
              </li>
              <li className="mb-1">
                <FaCheckCircle className="me-2 text-success" size={12} />
                Báo cáo chi tiết sẽ được tạo
              </li>
              <li className="mb-1">
                <FaCheckCircle className="me-2 text-success" size={12} />
                Kết quả sẽ được gửi đến bạn
              </li>
            </ul>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">
            <FaFileAlt className="me-2" />
            Kết quả xét nghiệm
          </h5>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <small className="text-muted">Kết quả</small>
              <div className="mt-1">
                {getResultBadge(testResult.result)}
              </div>
            </Col>
            <Col md={6}>
              <small className="text-muted">Trạng thái</small>
              <div className="mt-1">
                {getStatusBadge(testResult.status)}
              </div>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <small className="text-muted">
                <FaCalendarAlt className="me-1" />
                Ngày xét nghiệm
              </small>
              <p className="mb-0">{formatDate(testResult.testDate)}</p>
            </Col>
            <Col md={6}>
              <small className="text-muted">
                <FaUserMd className="me-1" />
                Nhân viên thực hiện
              </small>
              <p className="mb-0">{testResult.staff?.name || 'Chưa phân công'}</p>
            </Col>
          </Row>

          {testResult.confidenceLevel && (
            <Row className="mb-3">
              <Col md={6}>
                <small className="text-muted">
                  <FaShieldAlt className="me-1" />
                  Độ tin cậy
                </small>
                <p className="mb-0">{formatConfidenceLevel(testResult.confidenceLevel)}</p>
              </Col>
              <Col md={6}>
                <small className="text-muted">Phương pháp</small>
                <p className="mb-0">{testResult.testMethod || 'Chưa cập nhật'}</p>
              </Col>
            </Row>
          )}

          {testResult.labNotes && (
            <Row className="mb-3">
              <Col>
                <small className="text-muted">Ghi chú từ phòng lab</small>
                <p className="mb-0">{testResult.labNotes}</p>
              </Col>
            </Row>
          )}

          <div className="d-flex gap-2 mt-3">
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={handleViewDetails}
            >
              <FaEye className="me-1" />
              Xem chi tiết
            </Button>
            
            {testResult.pdfUrl && (
              <Button 
                variant="outline-success" 
                size="sm"
                onClick={handleDownloadPDF}
              >
                <FaDownload className="me-1" />
                Tải PDF
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Modal for detailed view */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaFileAlt className="me-2" />
            Chi tiết kết quả xét nghiệm
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <Col md={6}>
              <strong>Kết quả:</strong>
              <div className="mt-1">{getResultBadge(testResult.result)}</div>
            </Col>
            <Col md={6}>
              <strong>Trạng thái:</strong>
              <div className="mt-1">{getStatusBadge(testResult.status)}</div>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <strong>Ngày xét nghiệm:</strong>
              <p className="mb-0">{formatDate(testResult.testDate)}</p>
            </Col>
            <Col md={6}>
              <strong>Ngày tạo:</strong>
              <p className="mb-0">{formatDate(testResult.createdAt)}</p>
            </Col>
          </Row>

          {testResult.confidenceLevel && (
            <Row className="mb-3">
              <Col md={6}>
                <strong>Độ tin cậy:</strong>
                <p className="mb-0">{formatConfidenceLevel(testResult.confidenceLevel)}</p>
              </Col>
              <Col md={6}>
                <strong>Phương pháp:</strong>
                <p className="mb-0">{testResult.testMethod || 'Chưa cập nhật'}</p>
              </Col>
            </Row>
          )}

          {testResult.qualityControl && (
            <Row className="mb-3">
              <Col>
                <strong>Kiểm soát chất lượng:</strong>
                <p className="mb-0">{testResult.qualityControl}</p>
              </Col>
            </Row>
          )}

          {testResult.labNotes && (
            <Row className="mb-3">
              <Col>
                <strong>Ghi chú từ phòng lab:</strong>
                <p className="mb-0">{testResult.labNotes}</p>
              </Col>
            </Row>
          )}

          {testResult.resultDetails && (
            <Row className="mb-3">
              <Col>
                <strong>Chi tiết kết quả:</strong>
                <div className="mt-2 p-3 bg-light rounded">
                  {renderResultDetails()}
                </div>
              </Col>
            </Row>
          )}

          {testResult.estimatedDeliveryDate && (
            <Row className="mb-3">
              <Col>
                <strong>Dự kiến trả kết quả:</strong>
                <p className="mb-0">{formatDate(testResult.estimatedDeliveryDate)}</p>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          {testResult.pdfUrl && (
            <Button variant="success" onClick={handleDownloadPDF}>
              <FaDownload className="me-1" />
              Tải PDF
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TestResultViewer; 
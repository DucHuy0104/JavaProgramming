import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Table, Modal, Badge, Card } from 'react-bootstrap';

const generateStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <>
      {'★'.repeat(fullStars)}
      {halfStar ? '⯨' : ''}
      {'☆'.repeat(emptyStars)}
    </>
  );
};

const getStatusText = (status) => {
  const statusMap = {
    'pending': 'Chờ duyệt',
    'approved': 'Đã duyệt',
    'rejected': 'Đã từ chối',
  };
  return statusMap[status] || status;
};

const getStatusVariant = (status) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'approved':
      return 'success';
    case 'rejected':
      return 'danger';
    default:
      return 'secondary';
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN');
};

const FeedbackAdmin = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalFeedback, setTotalFeedback] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Sample data
  const sampleFeedback = [
    {
      id: 1,
      customerName: 'Nguyễn Văn A',
      customerEmail: 'a.nguyen@example.com',
      content: 'Dịch vụ rất tốt, nhân viên nhiệt tình và chuyên nghiệp. Tôi rất hài lòng!',
      rating: 5,
      createdAt: '2023-01-15',
      status: 'approved',
    },
    {
      id: 2,
      customerName: 'Trần Thị B',
      customerEmail: 'b.tran@example.com',
      content: 'Quá trình xét nghiệm nhanh chóng, nhưng kết quả hơi lâu.',
      rating: 4,
      createdAt: '2023-02-20',
      status: 'pending',
    },
    {
      id: 3,
      customerName: 'Lê Văn C',
      customerEmail: 'c.le@example.com',
      content: 'Chất lượng dịch vụ không như mong đợi, cần cải thiện thêm.',
      rating: 2,
      createdAt: '2023-03-10',
      status: 'rejected',
    },
    {
      id: 4,
      customerName: 'Phạm Thu D',
      customerEmail: 'd.pham@example.com',
      content: 'Rất hài lòng với sự tư vấn của đội ngũ y bác sĩ. Cảm ơn nhiều!',
      rating: 5,
      createdAt: '2023-04-05',
      status: 'approved',
    },
  ];

  const loadFeedback = useCallback(async () => {
    // Simulate API call
    let filteredFeedback = sampleFeedback.filter(feedback => {
      const matchesSearch = feedback.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRating = ratingFilter ? feedback.rating === parseInt(ratingFilter) : true;
      const matchesStatus = statusFilter ? feedback.status === statusFilter : true;
      const matchesDate = dateFilter ? feedback.createdAt === dateFilter : true;
      return matchesSearch && matchesRating && matchesStatus && matchesDate;
    });

    setFeedbackList(filteredFeedback);

    // Calculate stats
    const total = filteredFeedback.length;
    const sumRatings = filteredFeedback.reduce((acc, curr) => acc + curr.rating, 0);
    setTotalFeedback(total);
    setAverageRating(total > 0 ? sumRatings / total : 0);
  }, [searchQuery, ratingFilter, statusFilter, dateFilter]);

  useEffect(() => {
    loadFeedback();
  }, [loadFeedback]);

  const handleViewDetails = (feedback) => {
    setSelectedFeedback(feedback);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFeedback(null);
  };

  const handleApproveReject = (id, status) => {
    // Simulate API call to update status
    console.log(`Updating feedback ${id} to ${status}`);
    const updatedList = feedbackList.map(f =>
      f.id === id ? { ...f, status: status } : f
    );
    setFeedbackList(updatedList);
    if (selectedFeedback && selectedFeedback.id === id) {
      setSelectedFeedback(prev => ({ ...prev, status: status }));
    }
    alert(`Feedback đã được ${status === 'approved' ? 'duyệt' : 'từ chối'}.`);
  };

  return (
    <Container fluid>
      <h1 className="my-4">Quản lý feedback & rating</h1>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm theo nội dung..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <Form.Select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
            <option value="">Tất cả rating</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Đã từ chối</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Control type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
        </Col>
        <Col md={2}>
          <Button variant="primary" onClick={loadFeedback}>Lọc</Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="h-100">
            <Card.Body>
              <h3 className="card-title">Rating trung bình</h3>
              <div className="rating-average d-flex align-items-center">
                <span className="me-2" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{averageRating.toFixed(1)}</span>
                <div className="stars" style={{ fontSize: '1.2rem', color: '#f5b100' }}>{generateStars(averageRating)}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100">
            <Card.Body>
              <h3 className="card-title">Tổng số feedback</h3>
              <div className="total-feedback" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalFeedback}</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Khách hàng</th>
            <th>Nội dung</th>
            <th>Rating</th>
            <th>Ngày gửi</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {feedbackList.map((feedback) => (
            <tr key={feedback.id}>
              <td>{feedback.customerName}</td>
              <td>{feedback.content.substring(0, 100)}{feedback.content.length > 100 ? '...' : ''}</td>
              <td>
                <div className="stars" style={{ color: '#f5b100' }}>{generateStars(feedback.rating)}</div>
              </td>
              <td>{formatDate(feedback.createdAt)}</td>
              <td>
                <Badge bg={getStatusVariant(feedback.status)}>{getStatusText(feedback.status)}</Badge>
              </td>
              <td>
                <Button variant="info" size="sm" className="me-2" onClick={() => handleViewDetails(feedback)}>
                  Xem
                </Button>
                {feedback.status === 'pending' && (
                  <>
                    <Button variant="success" size="sm" className="me-2" onClick={() => handleApproveReject(feedback.id, 'approved')}>Duyệt</Button>
                    <Button variant="danger" size="sm" onClick={() => handleApproveReject(feedback.id, 'rejected')}>Từ chối</Button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {feedbackList.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">Không có feedback nào.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal chi tiết feedback */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFeedback && (
            <>
              <h5>Thông tin Feedback</h5>
              <p><strong>Khách hàng:</strong> {selectedFeedback.customerName} ({selectedFeedback.customerEmail})</p>
              <p><strong>Rating:</strong> <div className="stars d-inline-block" style={{ color: '#f5b100' }}>{generateStars(selectedFeedback.rating)}</div></p>
              <p><strong>Nội dung:</strong> {selectedFeedback.content}</p>
              <p><strong>Ngày gửi:</strong> {formatDate(selectedFeedback.createdAt)}</p>
              <p><strong>Trạng thái:</strong> <Badge bg={getStatusVariant(selectedFeedback.status)}>{getStatusText(selectedFeedback.status)}</Badge></p>
              
              {selectedFeedback.status === 'pending' && (
                <div className="mt-3">
                  <Button variant="success" className="me-2" onClick={() => handleApproveReject(selectedFeedback.id, 'approved')}>Duyệt feedback</Button>
                  <Button variant="danger" onClick={() => handleApproveReject(selectedFeedback.id, 'rejected')}>Từ chối feedback</Button>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Đóng</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FeedbackAdmin; 
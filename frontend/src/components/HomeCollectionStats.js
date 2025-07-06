import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { 
  FaHome, 
  FaUserMd, 
  FaClock, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaRoute,
  FaFlask
} from 'react-icons/fa';

const HomeCollectionStats = ({ orders }) => {
  // Lọc đơn hàng thu mẫu tại nhà
  const homeCollectionOrders = orders.filter(order => order.orderType === 'home_collection');
  
  // Tính toán thống kê
  const stats = {
    total: homeCollectionOrders.length,
    pending: homeCollectionOrders.filter(o => o.status === 'pending_registration').length,
    accepted: homeCollectionOrders.filter(o => o.status === 'accepted').length,
    staffDispatched: homeCollectionOrders.filter(o => o.status === 'staff_dispatched').length,
    sampleCollected: homeCollectionOrders.filter(o => o.status === 'sample_collected_home').length,
    inLab: homeCollectionOrders.filter(o => o.status === 'sample_received_lab').length,
    testing: homeCollectionOrders.filter(o => o.status === 'testing_in_progress').length,
    resultsReady: homeCollectionOrders.filter(o => o.status === 'results_recorded').length,
    completed: homeCollectionOrders.filter(o => o.status === 'results_delivered').length,
    cancelled: homeCollectionOrders.filter(o => o.status === 'cancelled').length
  };

  // Tính tỷ lệ hoàn thành
  const completionRate = stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0;
  
  // Tính thời gian trung bình (giả định)
  const avgProcessingTime = '2-3 ngày';

  // Lấy danh sách nhân viên đang hoạt động
  const activeStaff = [...new Set(homeCollectionOrders
    .filter(o => o.staffAssigned && o.status !== 'cancelled' && o.status !== 'results_delivered')
    .map(o => o.staffAssigned))];

  return (
    <Card className="mb-4 border-warning">
      <Card.Header className="bg-warning bg-opacity-10">
        <h5 className="mb-0 text-warning">
          <FaHome className="me-2" />
          Thống kê thu mẫu tại nhà
        </h5>
      </Card.Header>
      <Card.Body>
        <Row>
          {/* Tổng số đơn hàng */}
          <Col md={3} className="mb-3">
            <div className="text-center p-3 bg-primary bg-opacity-10 rounded">
              <FaHome className="text-primary mb-2" size={24} />
              <h4 className="text-primary mb-1">{stats.total}</h4>
              <small className="text-muted">Tổng đơn hàng</small>
            </div>
          </Col>

          {/* Đang xử lý */}
          <Col md={3} className="mb-3">
            <div className="text-center p-3 bg-warning bg-opacity-10 rounded">
              <FaClock className="text-warning mb-2" size={24} />
              <h4 className="text-warning mb-1">
                {stats.pending + stats.accepted + stats.staffDispatched + stats.sampleCollected + stats.inLab + stats.testing}
              </h4>
              <small className="text-muted">Đang xử lý</small>
            </div>
          </Col>

          {/* Hoàn thành */}
          <Col md={3} className="mb-3">
            <div className="text-center p-3 bg-success bg-opacity-10 rounded">
              <FaCheckCircle className="text-success mb-2" size={24} />
              <h4 className="text-success mb-1">{stats.completed}</h4>
              <small className="text-muted">Đã hoàn thành</small>
            </div>
          </Col>

          {/* Tỷ lệ hoàn thành */}
          <Col md={3} className="mb-3">
            <div className="text-center p-3 bg-info bg-opacity-10 rounded">
              <FaRoute className="text-info mb-2" size={24} />
              <h4 className="text-info mb-1">{completionRate}%</h4>
              <small className="text-muted">Tỷ lệ hoàn thành</small>
            </div>
          </Col>
        </Row>

        {/* Chi tiết trạng thái */}
        <Row className="mt-3">
          <Col md={6}>
            <h6 className="mb-3">📊 Chi tiết trạng thái</h6>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex justify-content-between align-items-center">
                <span>Chờ xác nhận:</span>
                <Badge bg="secondary">{stats.pending}</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span>Đã nhận đơn:</span>
                <Badge bg="success">{stats.accepted}</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span>Đã cử nhân viên:</span>
                <Badge bg="info">{stats.staffDispatched}</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span>Đã thu mẫu:</span>
                <Badge bg="success">{stats.sampleCollected}</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span>Đã nhận tại lab:</span>
                <Badge bg="primary">{stats.inLab}</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span>Đang xét nghiệm:</span>
                <Badge bg="warning">{stats.testing}</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span>Có kết quả:</span>
                <Badge bg="info">{stats.resultsReady}</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span>Đã hủy:</span>
                <Badge bg="danger">{stats.cancelled}</Badge>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <h6 className="mb-3">👥 Thông tin nhân viên</h6>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex justify-content-between align-items-center">
                <span>Nhân viên đang hoạt động:</span>
                <Badge bg="info">{activeStaff.length}</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span>Thời gian xử lý TB:</span>
                <Badge bg="primary">{avgProcessingTime}</Badge>
              </div>
              
              {activeStaff.length > 0 && (
                <div className="mt-2">
                  <small className="text-muted">Danh sách nhân viên:</small>
                  <div className="mt-1">
                    {activeStaff.map((staff, index) => (
                      <Badge key={index} bg="light" text="dark" className="me-1 mb-1">
                        {staff}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Col>
        </Row>

        {/* Thông tin bổ sung */}
        <Row className="mt-3">
          <Col>
            <div className="p-3 bg-light rounded">
              <h6 className="mb-2">📈 Hiệu suất thu mẫu tại nhà</h6>
              <div className="row">
                <div className="col-md-4">
                  <small className="text-muted">Đơn hàng hôm nay:</small>
                  <p className="mb-0 fw-bold">
                    {homeCollectionOrders.filter(o => {
                      const today = new Date().toDateString();
                      const orderDate = new Date(o.orderDate).toDateString();
                      return orderDate === today;
                    }).length}
                  </p>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">Đơn hàng tuần này:</small>
                  <p className="mb-0 fw-bold">
                    {homeCollectionOrders.filter(o => {
                      const now = new Date();
                      const orderDate = new Date(o.orderDate);
                      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                      return orderDate >= weekAgo;
                    }).length}
                  </p>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">Đơn hàng tháng này:</small>
                  <p className="mb-0 fw-bold">
                    {homeCollectionOrders.filter(o => {
                      const now = new Date();
                      const orderDate = new Date(o.orderDate);
                      return orderDate.getMonth() === now.getMonth() && 
                             orderDate.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default HomeCollectionStats; 
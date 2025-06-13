import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Container, Row, Col, Badge } from 'react-bootstrap';

const ResultsAdmin = () => {
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      // TODO: Thay thế bằng API call thực tế
      // const response = await fetch('/api/results');
      // const data = await response.json();
      // setResults(data);
      
      // Dữ liệu mẫu
      setResults([
        {
          id: 1,
          orderId: 'ORD001',
          customerName: 'Nguyễn Văn A',
          serviceName: 'Xét nghiệm ADN cha con',
          testDate: '2024-03-01',
          status: 'results_delivered',
          result: 'positive',
          pdfUrl: '/results/result1.pdf'
        },
        {
          id: 2,
          orderId: 'ORD002',
          customerName: 'Trần Thị B',
          serviceName: 'Xét nghiệm ADN huyết thống',
          testDate: '2024-03-05',
          status: 'testing_in_progress',
          result: null,
          pdfUrl: null
        },
        {
          id: 3,
          orderId: 'ORD003',
          customerName: 'Lê Văn C',
          serviceName: 'Xét nghiệm ADN dân sự',
          testDate: '2024-03-10',
          status: 'results_recorded',
          result: 'inconclusive',
          pdfUrl: null
        }
      ]);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    }
  };

  const handleViewResult = (result) => {
    setSelectedResult(result);
    setShowModal(true);
  };

  const handleDownloadPDF = (pdfUrl) => {
    // TODO: Thay thế bằng logic tải file thực tế hoặc hiển thị trong iframe
    window.open(pdfUrl, '_blank');
  };

  const handleMarkResultRecorded = async (result) => {
    // Simulate API call to mark result as recorded
    try {
      // await fetch(`/api/results/${result.id}/recorded`, { method: 'PATCH' });
      setResults(prevResults => prevResults.map(r =>
        r.id === result.id ? { ...r, status: 'results_recorded' } : r
      ));
      setSelectedResult(prev => prev ? { ...prev, status: 'results_recorded' } : null);
    } catch (error) {
      console.error('Lỗi khi ghi nhận kết quả:', error);
    }
  };

  const handleUploadAndDeliverPDF = async (result) => {
    // Simulate API call to upload PDF and mark as delivered
    try {
      // const response = await fetch(`/api/results/${result.id}/upload-pdf`, { method: 'POST', body: formData });
      // const data = await response.json(); // assuming it returns the pdfUrl

      const newPdfUrl = `/results/result_${result.orderId}.pdf`; // Dummy PDF URL
      setResults(prevResults => prevResults.map(r =>
        r.id === result.id ? { ...r, status: 'results_delivered', pdfUrl: newPdfUrl } : r
      ));
      setSelectedResult(prev => prev ? { ...prev, status: 'results_delivered', pdfUrl: newPdfUrl } : null);
      alert('Đã gửi kết quả PDF thành công!');
    } catch (error) {
      console.error('Lỗi khi gửi kết quả PDF:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      testing_in_progress: { bg: 'info', text: 'Đang xét nghiệm' },
      results_recorded: { bg: 'warning', text: 'Đã ghi nhận KQ' },
      results_delivered: { bg: 'success', text: 'Đã trả KQ' },
      cancelled: { bg: 'danger', text: 'Đã hủy' },
      // Trạng thái cũ nếu còn sót
      completed: { bg: 'success', text: 'Hoàn thành' },
      processing: { bg: 'info', text: 'Đang xử lý' },
    };

    const config = statusConfig[status] || { bg: 'secondary', text: status };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const getResultBadge = (result) => {
    if (!result) return <Badge bg="secondary">Chưa có</Badge>;

    const resultConfig = {
      positive: { bg: 'success', text: 'Dương tính' },
      negative: { bg: 'danger', text: 'Âm tính' },
      inconclusive: { bg: 'warning', text: 'Không xác định' }
    };

    const config = resultConfig[result] || { bg: 'secondary', text: result };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  return (
    <Container fluid className="p-4">
      <h1 className="h2 mb-4">Quản lý kết quả xét nghiệm</h1>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Dịch vụ</th>
            <th>Ngày xét nghiệm</th>
            <th>Trạng thái</th>
            <th>Kết quả</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {results.map(result => (
            <tr key={result.id}>
              <td>{result.orderId}</td>
              <td>{result.customerName}</td>
              <td>{result.serviceName}</td>
              <td>{formatDate(result.testDate)}</td>
              <td>{getStatusBadge(result.status)}</td>
              <td>{getResultBadge(result.result)}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleViewResult(result)}
                >
                  Xem
                </Button>
                
                {result.status === 'testing_in_progress' && (
                  <Button
                    variant="outline-success"
                    size="sm"
                    className="me-2"
                    onClick={() => handleMarkResultRecorded(result)}
                  >
                    Ghi nhận KQ
                  </Button>
                )}

                {result.status === 'results_recorded' && !result.pdfUrl && (
                  <Button
                    variant="outline-info"
                    size="sm"
                    className="me-2"
                    onClick={() => handleUploadAndDeliverPDF(result)}
                  >
                    Gửi PDF
                  </Button>
                )}

                {result.pdfUrl && (
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => handleDownloadPDF(result.pdfUrl)}
                  >
                    Tải PDF
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết kết quả - Đơn hàng: {selectedResult?.orderId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedResult && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <h5>Thông tin đơn hàng</h5>
                  <p><strong>Mã đơn:</strong> {selectedResult.orderId}</p>
                  <p><strong>Khách hàng:</strong> {selectedResult.customerName}</p>
                  <p><strong>Dịch vụ:</strong> {selectedResult.serviceName}</p>
                </Col>
                <Col md={6}>
                  <h5>Thông tin xét nghiệm</h5>
                  <p><strong>Ngày xét nghiệm:</strong> {formatDate(selectedResult.testDate)}</p>
                  <p><strong>Trạng thái:</strong> {getStatusBadge(selectedResult.status)}</p>
                  <p><strong>Kết quả:</strong> {getResultBadge(selectedResult.result)}</p>
                </Col>
              </Row>

              {selectedResult.pdfUrl && (
                <div className="text-center mt-4">
                  <p>Báo cáo kết quả đã sẵn sàng.</p>
                  <Button
                    variant="primary"
                    onClick={() => handleDownloadPDF(selectedResult.pdfUrl)}
                  >
                    Tải báo cáo PDF
                  </Button>
                </div>
              )}

              {selectedResult.status === 'testing_in_progress' && (
                <div className="text-center mt-4">
                  <Button
                    variant="success"
                    onClick={() => handleMarkResultRecorded(selectedResult)}
                  >
                    Ghi nhận Kết quả Xét nghiệm
                  </Button>
                </div>
              )}

              {selectedResult.status === 'results_recorded' && !selectedResult.pdfUrl && (
                <div className="text-center mt-4">
                  <Button
                    variant="info"
                    onClick={() => handleUploadAndDeliverPDF(selectedResult)}
                  >
                    Gửi Kết quả PDF
                  </Button>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ResultsAdmin; 
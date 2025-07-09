import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { blogAPI } from '../services/api';
import './BlogList.css';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const getCategoryColor = (category) => {
    const colors = {
      'news': 'primary',
      'science': 'success',
      'guide': 'info',
      'faq': 'warning'
    };
    return colors[category] || 'secondary';
  };

  const getCategoryText = (category) => {
    const categoryMap = {
      'guide': 'Hướng dẫn',
      'news': 'Tin tức',
      'science': 'Khoa học',
      'faq': 'FAQ',
    };
    return categoryMap[category] || category;
  };

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getBlogs(currentPage, 6);
      
      if (response.success) {
        setBlogs(response.data.content || response.data);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setError('Không thể tải danh sách blog');
      }
    } catch (err) {
      setError('Lỗi kết nối đến server');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };



  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Đang tải...</span>
          </Spinner>
          <p className="mt-3">Đang tải tin tức...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">Tin Tức & Kiến Thức</h1>
        <p className="lead text-muted">
          Cập nhật những thông tin mới nhất về xét nghiệm ADN và các nghiên cứu khoa học
        </p>
      </div>

      {/* News Grid */}
      <Row>
        {blogs.map((blog) => (
          <Col lg={6} className="mb-4" key={blog.id}>
            <Card className="h-100 shadow-sm border-0 news-card">
              <Row className="g-0 h-100">
                {/* Image Column */}
                <Col md={5}>
                  <div className="news-image-container">
                    {blog.imageUrl ? (
                      <Card.Img
                        src={`http://localhost:8081${blog.imageUrl}`}
                        alt={blog.title}
                        className="news-image"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=DNA+Testing';
                        }}
                      />
                    ) : (
                      <Card.Img
                        src="https://via.placeholder.com/400x300?text=DNA+Testing"
                        alt="Default"
                        className="news-image"
                      />
                    )}
                  </div>
                </Col>

                {/* Content Column */}
                <Col md={7}>
                  <Card.Body className="d-flex flex-column h-100 p-4">
                    {/* Category Badge */}
                    <div className="mb-2">
                      <Badge bg={getCategoryColor(blog.category)} className="mb-2">
                        {getCategoryText(blog.category)}
                      </Badge>
                    </div>

                    {/* Title */}
                    <Card.Title className="h5 fw-bold text-dark mb-3 line-clamp-2">
                      {blog.title}
                    </Card.Title>

                    {/* Summary */}
                    <Card.Text className="text-muted mb-3 line-clamp-3 flex-grow-1">
                      {blog.summary || blog.content?.substring(0, 150) + '...'}
                    </Card.Text>

                    {/* Footer */}
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          <i className="fas fa-calendar-alt me-1"></i>
                          {formatDate(blog.publishedAt)}
                        </small>
                        <small className="text-muted">
                          <i className="fas fa-eye me-1"></i>
                          {blog.viewCount || 0} lượt xem
                        </small>
                      </div>
                      <div className="mt-2 d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          <i className="fas fa-user me-1"></i>
                          {blog.author}
                        </small>
                        <Link
                          to={`/blog/${blog.id}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          Đọc thêm →
                        </Link>
                      </div>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Empty State */}
      {blogs.length === 0 && (
        <div className="text-center py-5">
          <i className="fas fa-newspaper fa-3x text-muted mb-3"></i>
          <h4 className="text-muted">Chưa có tin tức nào</h4>
          <p className="text-muted">Hãy quay lại sau để xem những tin tức mới nhất!</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  currentPage === index
                    ? 'text-white bg-indigo-600 border border-indigo-600'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </nav>
        </div>
      )}
    </Container>
  );
};

export default BlogList;


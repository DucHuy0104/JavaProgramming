import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { blogAPI } from '../services/api';
import './BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlogDetail();
  }, [id]);

  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getBlogById(id);
      setBlog(response.data);
    } catch (error) {
      console.error('Error fetching blog detail:', error);
      setError('Không thể tải chi tiết bài viết');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Tin tức': 'primary',
      'Khoa học': 'success',
      'Sức khỏe': 'info',
      'Công nghệ': 'warning',
      'Giáo dục': 'secondary'
    };
    return colors[category] || 'primary';
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {error}
          <div className="mt-2">
            <Button variant="outline-primary" onClick={() => navigate('/blogs')}>
              Quay lại danh sách
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!blog) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          Không tìm thấy bài viết
          <div className="mt-2">
            <Button variant="outline-primary" onClick={() => navigate('/blogs')}>
              Quay lại danh sách
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="blog-detail-page">
      {/* Header Navigation */}
      <Container className="mt-3">
        <Button 
          variant="outline-secondary" 
          onClick={() => navigate('/blogs')}
          className="mb-3"
        >
          ← Quay lại danh sách
        </Button>
      </Container>

      {/* Main Content */}
      <Container className="mb-5">
        <Row className="justify-content-center">
          <Col lg={8} md={10}>
            <Card className="blog-detail-card shadow-sm">
              {/* Category Badge */}
              <div className="p-3 pb-0">
                <Badge bg={getCategoryColor(blog.category)} className="mb-2">
                  {blog.category}
                </Badge>
              </div>

              {/* Title */}
              <Card.Header className="bg-white border-0 pt-0">
                <h1 className="blog-title mb-3">{blog.title}</h1>
                
                {/* Meta Info */}
                <div className="blog-meta text-muted">
                  <div className="d-flex flex-wrap gap-3">
                    <span>
                      <i className="fas fa-user me-1"></i>
                      Tác giả: <strong>{blog.author}</strong>
                    </span>
                    <span>
                      <i className="fas fa-calendar me-1"></i>
                      {formatDate(blog.publishedAt || blog.createdAt)}
                    </span>
                    <span>
                      <i className="fas fa-eye me-1"></i>
                      {blog.viewCount || 0} lượt xem
                    </span>
                  </div>
                </div>
              </Card.Header>

              {/* Featured Image */}
              {blog.imageUrl && (
                <div className="blog-image-container">
                  <img
                    src={`http://localhost:8080${blog.imageUrl}`}
                    alt={blog.title}
                    className="blog-featured-image"
                  />
                </div>
              )}

              {/* Content */}
              <Card.Body>
                {/* Summary */}
                {blog.summary && (
                  <div className="blog-summary mb-4">
                    <p className="lead text-muted">{blog.summary}</p>
                  </div>
                )}

                {/* Main Content */}
                <div 
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* Tags */}
                {blog.tags && (
                  <div className="blog-tags mt-4 pt-3 border-top">
                    <h6 className="mb-2">Tags:</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {blog.tags.split(',').map((tag, index) => (
                        <Badge key={index} bg="light" text="dark" className="tag-badge">
                          #{tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card.Body>

              {/* Footer */}
              <Card.Footer className="bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    Cập nhật lần cuối: {formatDate(blog.updatedAt)}
                  </small>
                  <div className="d-flex gap-2">
                    <Button variant="outline-primary" size="sm">
                      <i className="fas fa-share me-1"></i>
                      Chia sẻ
                    </Button>
                    <Button variant="outline-secondary" size="sm">
                      <i className="fas fa-bookmark me-1"></i>
                      Lưu
                    </Button>
                  </div>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BlogDetail;

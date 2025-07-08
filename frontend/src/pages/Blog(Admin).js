import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Table, Modal, Badge, Card } from 'react-bootstrap';
import { blogAPI } from '../services/api';

const getCategoryText = (category) => {
  const categoryMap = {
    'guide': 'Hướng dẫn',
    'news': 'Tin tức',
    'science': 'Khoa học',
    'faq': 'FAQ',
  };
  return categoryMap[category] || category;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN');
};

const BlogAdmin = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState({
    id: null,
    title: '',
    category: '',
    author: 'Admin',
    content: '',
    imageUrl: '',
    status: 'DRAFT',
    publishDate: '',
  });
  const [loading, setLoading] = useState(false);

  // Load posts từ API
  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await blogAPI.getBlogs(0, 50); // lấy tối đa 50 bài
      if (response.success) {
        setPosts(response.data);
      } else {
        alert(response.message || 'Không thể tải danh sách blog');
      }
    } catch (err) {
      alert('Lỗi khi tải danh sách blog: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Lọc bài viết theo search/category/date
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter ? post.category === categoryFilter : true;
    const matchesDate = dateFilter ? (post.publishedAt && post.publishedAt.slice(0, 10) === dateFilter) : true;
    return matchesSearch && matchesCategory && matchesDate;
  });

  const handleAddPost = () => {
    setIsEditing(false);
    setCurrentPost({
      id: null,
      title: '',
      category: '',
      author: 'Admin',
      content: '',
      imageUrl: '',
      status: 'DRAFT',
      publishDate: '',
    });
    setShowModal(true);
  };

  const handleEditPost = (post) => {
    setIsEditing(true);
    setCurrentPost({ ...post });
    setShowModal(true);
  };

  const handleDeletePost = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        await blogAPI.deleteBlog(id);
        setPosts(posts.filter(post => post.id !== id));
        alert('Bài viết đã được xóa.');
      } catch (err) {
        alert('Lỗi khi xóa bài viết: ' + (err.message || err));
      }
    }
  };

  const handlePreviewPost = (id) => {

  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentPost({
      id: null,
      title: '',
      category: '',
      author: 'Admin',
      content: '',
      imageUrl: '',
      status: 'DRAFT',
      publishDate: '',
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCurrentPost(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let blogData = {
        title: currentPost.title,
        category: currentPost.category,
        author: currentPost.author,
        content: currentPost.content,
        summary: currentPost.summary || '',
        tags: currentPost.tags || '',
      };
      let createdBlog;
      if (isEditing && currentPost.id) {
        // Sửa bài viết
        const res = await blogAPI.updateBlog(currentPost.id, blogData);
        alert('Bài viết đã được cập nhật!');
        loadPosts();
      } else {
        // Thêm mới
        const res = await blogAPI.createBlog(blogData);
        createdBlog = res.data;
        // Publish ngay sau khi tạo
        await blogAPI.publishBlog(createdBlog.id);
        alert('Bài viết đã được thêm và xuất bản!');
        loadPosts();
      }
      handleCloseModal();
    } catch (err) {
      alert('Lỗi khi lưu bài viết: ' + (err.message || err));
    }
  };

  return (
    <Container fluid>
      <h1 className="my-4">Quản lý bài viết</h1>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm theo tiêu đề..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">Tất cả chủ đề</option>
            <option value="guide">Hướng dẫn</option>
            <option value="news">Tin tức</option>
            <option value="science">Khoa học</option>
            <option value="faq">FAQ</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Control type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
        </Col>
        <Col md={2}>
          <Button variant="primary" onClick={loadPosts}>Lọc</Button>
        </Col>
      </Row>

      <Button variant="success" className="mb-3" onClick={handleAddPost}>+ Thêm bài viết</Button>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Chủ đề</th>
            <th>Tác giả</th>
            <th>Ngày đăng</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredPosts.map((post) => (
            <tr key={post.id}>
<td>{post.title}</td>
              <td>{getCategoryText(post.category)}</td>
              <td>{post.author}</td>
              <td>{formatDate(post.publishedAt)}</td>
              <td>
                <Badge bg={post.status === 'PUBLISHED' ? 'success' : 'secondary'}>
                  {post.status === 'PUBLISHED' ? 'Đã đăng' : 'Bản nháp'}
                </Badge>
              </td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditPost(post)}>
                  Sửa
                </Button>
                <Button variant="info" size="sm" className="me-2" onClick={() => handlePreviewPost(post.id)}>
                  Xem trước
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDeletePost(post.id)}>
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
          {filteredPosts.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">Không có bài viết nào.</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Sửa bài viết' : 'Thêm bài viết mới'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={currentPost.title}
                onChange={handleFormChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Chủ đề</Form.Label>
              <Form.Select
                name="category"
                value={currentPost.category}
                onChange={handleFormChange}
                required
              >
                <option value="">Chọn chủ đề</option>
                <option value="guide">Hướng dẫn</option>
                <option value="news">Tin tức</option>
                <option value="science">Khoa học</option>
                <option value="faq">FAQ</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nội dung</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="content"
                value={currentPost.content}
                onChange={handleFormChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                name="status"
                value={currentPost.status}
                onChange={handleFormChange}
required
              >
                <option value="DRAFT">Bản nháp</option>
                <option value="PUBLISHED">Đã đăng</option>
              </Form.Select>
            </Form.Group>

            {isEditing && currentPost.publishDate && (
              <Form.Group className="mb-3">
                <Form.Label>Ngày đăng</Form.Label>
                <Form.Control
                  type="text"
                  value={formatDate(currentPost.publishDate)}
                  disabled
                />
              </Form.Group>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Đóng
            </Button>
            <Button variant="primary" type="submit">
              Lưu bài viết
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default BlogAdmin;
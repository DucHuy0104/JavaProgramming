import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Table, Modal, Badge, Card } from 'react-bootstrap';

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
    image: null,
    status: 'draft',
    publishDate: '',
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Sample data
  const samplePosts = [
    {
      id: 1,
      title: 'Hướng dẫn xét nghiệm DNA tại nhà',
      category: 'guide',
      author: 'Admin',
      content: 'Đây là nội dung hướng dẫn chi tiết về cách tự lấy mẫu DNA tại nhà một cách an toàn và hiệu quả...',
      image: 'https://via.placeholder.com/150/0000FF/808080?text=DNA_Guide',
      status: 'published',
      publishDate: '2023-01-20',
    },
    {
      id: 2,
      title: 'Tin tức: Công nghệ DNA mới nhất',
      category: 'news',
      author: 'Admin',
      content: 'Cập nhật những tiến bộ vượt bậc trong công nghệ giải mã DNA, mở ra nhiều cơ hội mới...',
      image: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=DNA_News',
      status: 'draft',
      publishDate: '2023-02-15',
    },
    {
      id: 3,
      title: 'FAQ: Các câu hỏi thường gặp về xét nghiệm di truyền',
      category: 'faq',
      author: 'Admin',
      content: 'Giải đáp các thắc mắc phổ biến liên quan đến xét nghiệm di truyền và ý nghĩa của chúng...',
      image: null,
      status: 'published',
      publishDate: '2023-03-01',
    },
  ];

  const loadPosts = useCallback(async () => {
    // Simulate API call
    let filteredPosts = samplePosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter ? post.category === categoryFilter : true;
      const matchesDate = dateFilter ? post.publishDate === dateFilter : true;
      return matchesSearch && matchesCategory && matchesDate;
    });
    setPosts(filteredPosts);
  }, [searchQuery, categoryFilter, dateFilter]);

  useEffect(() => {
    const handler = setTimeout(() => {
      loadPosts();
    }, 300); // Debounce for search input
    return () => clearTimeout(handler);
  }, [searchQuery, categoryFilter, dateFilter, loadPosts]);

  const handleAddPost = () => {
    setIsEditing(false);
    setCurrentPost({
      id: null,
      title: '',
      category: '',
      author: 'Admin',
      content: '',
      image: null,
      status: 'draft',
      publishDate: '',
    });
    setImagePreview(null);
    setShowModal(true);
  };

  const handleEditPost = (post) => {
    setIsEditing(true);
    setCurrentPost({ ...post });
    setImagePreview(post.image);
    setShowModal(true);
  };

  const handleDeletePost = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      // Simulate API call to delete
      console.log(`Deleting post ${id}`);
      setPosts(posts.filter(post => post.id !== id));
      alert('Bài viết đã được xóa.');
    }
  };

  const handlePreviewPost = (id) => {
    // Simulate viewing post details (e.g., in a new tab or another modal)
    alert(`Xem trước bài viết ${id}`);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentPost({
      id: null,
      title: '',
      category: '',
      author: 'Admin',
      content: '',
      image: null,
      status: 'draft',
      publishDate: '',
    });
    setImagePreview(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCurrentPost(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentPost(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setCurrentPost(prev => ({ ...prev, image: null }));
      setImagePreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate saving to API
    console.log('Saving post:', currentPost);
    if (isEditing) {
      setPosts(posts.map(p => (p.id === currentPost.id ? { ...currentPost, image: imagePreview } : p)));
      alert('Bài viết đã được cập nhật!');
    } else {
      const newId = Math.max(...posts.map(p => p.id), 0) + 1;
      const newPost = { ...currentPost, id: newId, publishDate: formatDate(new Date()) };
      setPosts([...posts, newPost]);
      alert('Bài viết đã được thêm!');
    }
    handleCloseModal();
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
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>{getCategoryText(post.category)}</td>
              <td>{post.author}</td>
              <td>{formatDate(post.publishDate)}</td>
              <td>
                <Badge bg={post.status === 'published' ? 'success' : 'secondary'}>
                  {post.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
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
          {posts.length === 0 && (
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

            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Ảnh đại diện</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} />
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', height: 'auto' }} />
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                name="status"
                value={currentPost.status}
                onChange={handleFormChange}
                required
              >
                <option value="draft">Bản nháp</option>
                <option value="published">Đã đăng</option>
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
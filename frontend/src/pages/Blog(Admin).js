import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Table, Modal, Badge, Card, Tab, Tabs } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './BlogAdmin.css';
import { blogAPI, fileAPI } from '../services/api';

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
    author: '',
    content: '',
    imageUrl: '',
    status: 'DRAFT',
    publishDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Cấu hình ReactQuill
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'align', 'color', 'background',
    'script', 'code-block'
  ];

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
      author: '',
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
      author: '',
      content: '',
      imageUrl: '',
      status: 'DRAFT',
      publishDate: '',
    });
    // Reset image states
    setSelectedImage(null);
    setImagePreview(null);
    setUploadingImage(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCurrentPost(prev => ({ ...prev, [name]: value }));
  };

  // Xử lý chọn ảnh và tự động upload
  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);

      // Tạo preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Tự động upload ảnh
      setUploadingImage(true);
      try {
        const result = await fileAPI.uploadBlogImage(file);

        // Cập nhật imageUrl trong currentPost
        setCurrentPost(prev => ({
          ...prev,
          imageUrl: result.imageUrl
        }));

        alert('Upload ảnh thành công!');
      } catch (error) {
        alert('Lỗi khi upload ảnh: ' + (error.message || error));
      } finally {
        setUploadingImage(false);
      }
    }
  };

  // Upload ảnh thủ công (backup)
  const handleImageUpload = async () => {
    if (!selectedImage) return;

    setUploadingImage(true);
    try {
      const result = await fileAPI.uploadBlogImage(selectedImage);

      // Cập nhật imageUrl trong currentPost
      setCurrentPost(prev => ({
        ...prev,
        imageUrl: result.imageUrl
      }));

      alert('Upload ảnh thành công!');
    } catch (error) {
      alert('Lỗi khi upload ảnh: ' + (error.message || error));
    } finally {
      setUploadingImage(false);
    }
  };

  // Xóa ảnh đã chọn
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setCurrentPost(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!currentPost.title.trim()) {
      alert('Vui lòng nhập tiêu đề bài viết');
      return;
    }
    if (!currentPost.category) {
      alert('Vui lòng chọn chủ đề');
      return;
    }
    if (!currentPost.author.trim()) {
      alert('Vui lòng nhập tên tác giả');
      return;
    }
    if (!currentPost.content.trim()) {
      alert('Vui lòng nhập mô tả bài viết');
      return;
    }

    try {
      let blogData = {
        title: currentPost.title.trim(),
        category: currentPost.category,
        author: currentPost.author.trim(),
        content: currentPost.content.trim(),
        summary: currentPost.summary?.trim() || '',
        tags: currentPost.tags?.trim() || '',
        imageUrl: currentPost.imageUrl || '',
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
              <Form.Label>Tác giả <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="author"
                value={currentPost.author}
                onChange={handleFormChange}
                placeholder="VD: Bác sĩ Nguyễn Văn A, Chuyên gia ADN..."
                required
              />
              <Form.Text className="text-muted">
                Nhập tên tác giả hoặc chuyên gia viết bài
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nội dung bài viết</Form.Label>
              <div className="border rounded" style={{ minHeight: '300px' }}>
                <ReactQuill
                  theme="snow"
                  value={currentPost.content}
                  onChange={(content) => setCurrentPost(prev => ({ ...prev, content }))}
                  modules={quillModules}
                  formats={quillFormats}
                  style={{ height: '250px', marginBottom: '50px' }}
                  placeholder="Nhập nội dung bài viết..."
                />
              </div>
            </Form.Group>

            {/* Preview Tab */}
            <Form.Group className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label>Xem trước nội dung</Form.Label>
                <Button
                  variant="outline-info"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? 'Ẩn xem trước' : 'Xem trước'}
                </Button>
              </div>
              {showPreview && (
                <Card className="p-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <div
                    dangerouslySetInnerHTML={{ __html: currentPost.content }}
                    style={{ lineHeight: '1.6' }}
                  />
                </Card>
              )}
            </Form.Group>

            {/* Upload ảnh */}
            <Form.Group className="mb-3">
              <Form.Label>Ảnh bài viết</Form.Label>
              <div className="d-flex flex-column gap-2">
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  disabled={uploadingImage}
                />

                {uploadingImage && (
                  <div className="text-info">
                    <small>🔄 Đang upload ảnh...</small>
                  </div>
                )}

                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
                      className="border rounded"
                    />
                    <div className="mt-2">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={handleRemoveImage}
                        disabled={uploadingImage}
                      >
                        Xóa ảnh
                      </Button>
                      {currentPost.imageUrl && (
                        <small className="text-success ms-2">✅ Ảnh đã được upload</small>
                      )}
                    </div>
                  </div>
                )}

                {currentPost.imageUrl && !imagePreview && (
                  <div className="mt-2">
                    <img
                      src={`http://localhost:8081${currentPost.imageUrl}`}
                      alt="Current"
                      style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
                      className="border rounded"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        console.log('Image not found:', currentPost.imageUrl);
                      }}
                    />
                    <div className="mt-1">
                      <small className="text-muted">Ảnh hiện tại</small>
                    </div>
                  </div>
                )}
              </div>
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
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../services/api';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Blog về Xét nghiệm ADN</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {blog.imageUrl && (
              <img 
                src={blog.imageUrl} 
                alt={blog.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x200?text=DNA+Testing';
                }}
              />
            )}
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {blog.category}
                </span>
                <span className="text-gray-500 text-sm">
                  {formatDate(blog.publishedAt)}
                </span>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                {blog.title}
              </h2>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {blog.summary}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">
                  Tác giả: {blog.author}
                </span>
                <Link 
                  to={`/blogs/${blog.id}`}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Đọc thêm →
                </Link>
              </div>
              
              {blog.viewCount !== undefined && (
                <div className="mt-2 text-gray-500 text-sm">
                  {blog.viewCount} lượt xem
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
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
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default BlogList;

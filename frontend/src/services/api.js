import axios from 'axios';

// Base URL của backend
const API_BASE_URL = 'http://localhost:8081/api';

// Tạo axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm JWT token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired hoặc invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  // Đăng ký
  register: async (userData) => {
    try {
      const response = await api.post('/users/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Đăng nhập
  login: async (credentials) => {
    try {
      console.log('Sending login credentials:', credentials);
      const response = await api.post('/users/login', credentials);
      console.log('Login response:', response.data);

      // Backend trả về: { success: true, message: "...", data: { token, redirectUrl, id, fullName, role, ... } }
      const authData = response.data.data;
      const { token, redirectUrl, ...user } = authData;

      console.log('Extracted token:', token);
      console.log('Extracted redirectUrl:', redirectUrl);
      console.log('Extracted user:', user);

      // Lưu token và user info vào localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return { token, redirectUrl, user };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Blog APIs
export const blogAPI = {
  // Lấy danh sách blogs
  getBlogs: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`/blogs?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy chi tiết blog
  getBlogById: async (id) => {
    try {
      const response = await api.get(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Tìm kiếm blogs
  searchBlogs: async (keyword, page = 0, size = 10) => {
    try {
      const response = await api.get(`/blogs/search?keyword=${keyword}&page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Staff APIs
export const staffAPI = {
  // Lấy tất cả admin/manager/staff users
  getAdminStaffUsers: async () => {
    try {
      console.log('API: Calling /users/admin/staff');
      const response = await api.get('/users/admin/staff');
      console.log('API: getAdminStaffUsers response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API: getAdminStaffUsers error:', error);
      console.error('API: Error response:', error.response?.data);
      throw error.response?.data || error.message;
    }
  },

  // Lấy users theo role cụ thể
  getUsersByRole: async (role) => {
    try {
      const response = await api.get(`/users/role/${role}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Tạo admin user (ADMIN only)
  createAdminUser: async (userData) => {
    try {
      console.log('API: Creating admin user with data:', userData);
      const response = await api.post('/users/admin/create', userData);
      console.log('API: createAdminUser response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API: createAdminUser error:', error);
      console.error('API: Error response:', error.response?.data);
      throw error.response?.data || error.message;
    }
  },

  // Lấy tất cả users (ADMIN only)
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cập nhật trạng thái user
  updateUserStatus: async (userId, status) => {
    try {
      const response = await api.patch(`/users/${userId}/status?status=${status}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Xóa user
  deleteUser: async (userId) => {
    try {
      console.log('API: Deleting user with ID:', userId);
      const response = await api.delete(`/users/${userId}`);
      console.log('API: Delete user response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API: Delete user error:', error);
      console.error('API: Error response:', error.response?.data);
      throw error.response?.data || error.message;
    }
  }
};

// Settings APIs
export const settingsAPI = {
  // Lấy thông tin profile hiện tại
  getCurrentProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      const errorMessage = error.response?.data?.message ||
                          error.response?.data ||
                          error.message ||
                          'Có lỗi xảy ra khi lấy thông tin';
      throw new Error(errorMessage);
    }
  },

  // Cập nhật thông tin cá nhân
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      const errorMessage = error.response?.data?.message ||
                          error.response?.data ||
                          error.message ||
                          'Có lỗi xảy ra khi cập nhật thông tin';
      throw new Error(errorMessage);
    }
  },

  // Đổi mật khẩu
  changePassword: async (passwordData) => {
    try {
      console.log('API: Sending change password request to /users/change-password');
      const response = await api.put('/users/change-password', passwordData);
      console.log('API: Change password response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API: Change password error:', error);
      console.error('API: Error response:', error.response?.data);

      // Xử lý error response từ backend
      if (error.response?.data) {
        throw error.response.data;
      } else if (error.message) {
        throw { message: error.message };
      } else {
        throw { message: 'Lỗi kết nối mạng' };
      }
    }
  },

  // Lấy thông tin profile hiện tại
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Order APIs
export const orderAPI = {
  // Lấy tất cả orders (admin)
  getAllOrders: async () => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy orders của user hiện tại
  getUserOrders: async () => {
    try {
      const response = await api.get('/orders/user');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Tạo order mới
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cập nhật trạng thái order
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.patch(`/orders/${orderId}`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cập nhật trạng thái thanh toán
  updatePaymentStatus: async (orderId, paymentStatus) => {
    try {
      const response = await api.patch(`/orders/${orderId}/payment`, { paymentStatus });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Test Result APIs
export const testResultAPI = {
  // Lấy test result theo order ID
  getTestResultByOrderId: async (orderId) => {
    try {
      const response = await api.get(`/test-results/order/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Tạo test result mới
  createTestResult: async (testResultData) => {
    try {
      const response = await api.post('/test-results', testResultData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cập nhật test result
  updateTestResult: async (testResultId, testResultData) => {
    try {
      const response = await api.put(`/test-results/${testResultId}`, testResultData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Duyệt test result
  approveTestResult: async (testResultId) => {
    try {
      const response = await api.post(`/test-results/${testResultId}/approve`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Legacy exports for backward compatibility
export async function createOrder(orderData) {
  return orderAPI.createOrder(orderData);
}

export async function fetchOrders() {
  return orderAPI.getAllOrders();
}

export async function getUserOrders() {
  return orderAPI.getUserOrders();
}

export default api;

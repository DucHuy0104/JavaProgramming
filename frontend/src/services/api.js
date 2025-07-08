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

    // For FormData, remove the default Content-Type to let axios set it automatically
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
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
  },

};

// User APIs
export const userAPI = {
  // Lấy tất cả users (admin only)
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      // Xử lý error an toàn
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi không xác định khi lấy danh sách users';
      throw { message: errorMessage, originalError: error };
    }
  },

  // Lấy danh sách khách hàng (chỉ role CUSTOMER)
  getCustomers: async (search = '', status = '') => {
    try {
      const response = await userAPI.getAllUsers();
      if (response.success) {
        let customers = response.data.filter(user => user.role === 'CUSTOMER');

        // Apply search filter
        if (search && search.trim()) {
          const searchLower = search.toLowerCase();
          customers = customers.filter(customer =>
            customer.fullName.toLowerCase().includes(searchLower) ||
            customer.email.toLowerCase().includes(searchLower) ||
            (customer.phoneNumber && customer.phoneNumber.includes(search))
          );
        }

        // Apply status filter
        if (status && status.trim()) {
          customers = customers.filter(customer => customer.status === status);
        }

        return { success: true, data: customers };
      }
      return response;
    } catch (error) {
      console.error('Error in getCustomers:', error);
      // Xử lý error an toàn
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi không xác định';
      throw { message: errorMessage, originalError: error };
    }
  },

  // Cập nhật profile user
  updateProfile: async (userId, profileData) => {
    try {
      const response = await api.put(`/users/${userId}/profile`, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Thay đổi trạng thái user
  changeUserStatus: async (userId, status) => {
    try {
      const response = await api.patch(`/users/${userId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
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
  },

  // Lấy order theo order number
  getOrderByNumber: async (orderNumber) => {
    try {
      const response = await api.get(`/orders/number/${orderNumber}`);
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
      console.log(`API: Fetching test result for order ${orderId}`);
      const response = await api.get(`/test-results/order/${orderId}`);
      console.log(`API: Test result response for order ${orderId}:`, response.data);
      return response.data;
    } catch (error) {
      // Xử lý lỗi 404 một cách êm ái - không log error cho trường hợp này
      if (error.response?.status === 404) {
        console.log(`API: No test result found for order ${orderId} - This is normal`);
        const notFoundError = new Error('Không tìm thấy kết quả xét nghiệm');
        notFoundError.response = error.response;
        notFoundError.isNotFound = true;
        throw notFoundError;
      }
      
      // Log error cho các lỗi khác
      console.error(`API: Error fetching test result for order ${orderId}:`, error);
      console.error(`API: Error status:`, error.response?.status);
      
      // Throw error với đầy đủ thông tin
      const errorToThrow = new Error(error.response?.data?.message || error.message);
      errorToThrow.response = error.response;
      throw errorToThrow;
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
  },
};

// Dashboard APIs
export const dashboardAPI = {
  // Lấy thống kê dashboard
  getStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error.response?.data || error.message;
    }
  },

  // Lấy dữ liệu biểu đồ đơn hàng
  getOrdersChart: async () => {
    try {
      const response = await api.get('/dashboard/orders-chart');
      return response.data;
    } catch (error) {
      console.error('Error getting orders chart:', error);
      throw error.response?.data || error.message;
    }
  },

  // Lấy dữ liệu biểu đồ doanh thu
  getRevenueChart: async () => {
    try {
      const response = await api.get('/dashboard/revenue-chart');
      return response.data;
    } catch (error) {
      console.error('Error getting revenue chart:', error);
      throw error.response?.data || error.message;
    }
  }
};

// File Upload APIs
export const fileAPI = {
  // Upload file kết quả xét nghiệm
  uploadTestResult: async (orderId, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      console.log('Uploading with token:', token ? 'Token exists' : 'No token');

      const response = await api.post(`/files/upload-result/${orderId}`, formData, {
        headers: {
          // Không set Content-Type để axios tự động set với boundary
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading test result:', error);
      console.error('Error details:', error.response);
      throw error.response?.data || error.message;
    }
  },

  // Download file kết quả xét nghiệm
  downloadTestResult: async (orderId) => {
    try {
      const response = await api.get(`/files/download-result/${orderId}`, {
        responseType: 'blob'
      });

      // Tạo URL để download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `KetQua_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true, message: 'Tải file thành công!' };
    } catch (error) {
      console.error('Error downloading test result:', error);
      throw error.response?.data || error.message;
    }
  },

  // Xóa file kết quả xét nghiệm
  deleteTestResult: async (orderId) => {
    try {
      const response = await api.delete(`/files/delete-result/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting test result:', error);
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

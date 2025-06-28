import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Vui lòng đăng nhập để xem thông tin tài khoản
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Thông tin tài khoản</h1>
        
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Thông tin cá nhân</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên
                </label>
                <p className="text-lg text-gray-900">{user.fullName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <p className="text-lg text-gray-900">{user.email}</p>
              </div>
              
              {user.phoneNumber && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <p className="text-lg text-gray-900">{user.phoneNumber}</p>
                </div>
              )}
              
              {user.address && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ
                  </label>
                  <p className="text-lg text-gray-900">{user.address}</p>
                </div>
              )}
              
              {user.dateOfBirth && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày sinh
                  </label>
                  <p className="text-lg text-gray-900">{user.dateOfBirth}</p>
                </div>
              )}
              
              {user.gender && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giới tính
                  </label>
                  <p className="text-lg text-gray-900">
                    {user.gender === 'Male' ? 'Nam' : user.gender === 'Female' ? 'Nữ' : 'Khác'}
                  </p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vai trò
                </label>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                  user.role === 'MANAGER' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'STAFF' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user.role === 'ADMIN' ? 'Quản trị viên' :
                   user.role === 'MANAGER' ? 'Quản lý' :
                   user.role === 'STAFF' ? 'Nhân viên' :
                   'Khách hàng'}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.status === 'ACTIVE' ? 'Hoạt động' : 'Chờ kích hoạt'}
                </span>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                Chỉnh sửa thông tin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

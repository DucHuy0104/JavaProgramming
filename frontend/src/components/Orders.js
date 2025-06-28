import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Orders = () => {
  const { user } = useAuth();
  const [orders] = useState([
    // Sample data - sẽ được thay thế bằng API call thực tế
    {
      id: 1,
      orderNumber: 'DNA001',
      testType: 'Xét nghiệm ADN cha con',
      status: 'Đang xử lý',
      orderDate: '2024-01-15',
      expectedDate: '2024-01-22',
      price: '2,500,000 VNĐ'
    },
    {
      id: 2,
      orderNumber: 'DNA002',
      testType: 'Xét nghiệm ADN anh em',
      status: 'Hoàn thành',
      orderDate: '2024-01-10',
      completedDate: '2024-01-17',
      price: '3,000,000 VNĐ'
    }
  ]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Vui lòng đăng nhập để xem đơn xét nghiệm
          </h2>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đang xử lý':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hoàn thành':
        return 'bg-green-100 text-green-800';
      case 'Đã hủy':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Đơn xét nghiệm của tôi</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Chưa có đơn xét nghiệm nào
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn chưa có đơn xét nghiệm nào. Hãy đặt lịch xét nghiệm ngay!
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
              Đặt lịch xét nghiệm
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">
                      Đơn hàng #{order.orderNumber}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Loại xét nghiệm
                      </label>
                      <p className="text-lg text-gray-900">{order.testType}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày đặt
                      </label>
                      <p className="text-lg text-gray-900">{order.orderDate}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {order.status === 'Hoàn thành' ? 'Ngày hoàn thành' : 'Ngày dự kiến'}
                      </label>
                      <p className="text-lg text-gray-900">
                        {order.completedDate || order.expectedDate}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giá tiền
                      </label>
                      <p className="text-lg font-semibold text-blue-600">{order.price}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <div className="flex space-x-3">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                        Xem chi tiết
                      </button>
                      {order.status === 'Hoàn thành' && (
                        <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                          Tải kết quả
                        </button>
                      )}
                    </div>
                    
                    {order.status === 'Đang xử lý' && (
                      <button className="text-red-600 hover:text-red-800 font-medium">
                        Hủy đơn
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors">
            Đặt lịch xét nghiệm mới
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders;

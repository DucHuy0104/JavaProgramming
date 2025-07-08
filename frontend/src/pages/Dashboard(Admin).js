import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tab, Tabs, Alert } from 'react-bootstrap';
import { Line, Bar } from 'react-chartjs-2';
import { dashboardAPI } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';


// Đăng ký các components cần thiết cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalServices: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [orderChartData, setOrderChartData] = useState({
    labels: [],
    datasets: []
  });

  const [revenueChartData, setRevenueChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('Loading dashboard data...');
      const response = await dashboardAPI.getStats();

      if (response.success) {
        console.log('Dashboard stats loaded:', response.data);
        setStats({
          totalOrders: response.data.totalOrders || 0,
          totalRevenue: response.data.totalRevenue || 0,
          totalCustomers: response.data.totalCustomers || 0,
          totalServices: response.data.totalServices || 0
        });
      } else {
        setError('Không thể tải dữ liệu dashboard');
      }

      // Tải dữ liệu biểu đồ thực tế
      await loadChartsData();

    } catch (error) {
      console.error('Lỗi khi tải dữ liệu dashboard:', error);
      setError('Lỗi khi tải dữ liệu dashboard: ' + (error.message || error));
    } finally {
      setLoading(false);
    }
  };

  const loadChartsData = async () => {
    try {
      console.log('Loading charts data...');

      // Tải dữ liệu biểu đồ đơn hàng
      const ordersChartResponse = await dashboardAPI.getOrdersChart();
      if (ordersChartResponse.success) {
        console.log('Orders chart data:', ordersChartResponse.data);
        setOrderChartData({
          labels: ordersChartResponse.data.labels,
          datasets: [{
            label: 'Số đơn hàng',
            data: ordersChartResponse.data.data,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1
          }]
        });
      }

      // Tải dữ liệu biểu đồ doanh thu
      const revenueChartResponse = await dashboardAPI.getRevenueChart();
      if (revenueChartResponse.success) {
        console.log('Revenue chart data:', revenueChartResponse.data);
        setRevenueChartData({
          labels: revenueChartResponse.data.labels,
          datasets: [{
            label: 'Doanh thu (VNĐ)',
            data: revenueChartResponse.data.data,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        });
      }

    } catch (error) {
      console.error('Lỗi khi tải dữ liệu biểu đồ:', error);
      // Nếu lỗi, sử dụng dữ liệu trống
      setOrderChartData({
        labels: [],
        datasets: [{
          label: 'Số đơn hàng',
          data: [],
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1
        }]
      });

      setRevenueChartData({
        labels: [],
        datasets: [{
          label: 'Doanh thu (VNĐ)',
          data: [],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <Container fluid className="p-4">
        <h1 className="h2 mb-4">Dashboard</h1>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Đang tải dữ liệu...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      <h1 className="h2 mb-4">Dashboard</h1>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Thống kê tổng quan */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Tổng đơn hàng</Card.Title>
              <h2 className="mb-0">{stats.totalOrders}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Tổng doanh thu</Card.Title>
              <h2 className="mb-0">{formatPrice(stats.totalRevenue)}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Tổng khách hàng</Card.Title>
              <h2 className="mb-0">{stats.totalCustomers}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Tổng dịch vụ</Card.Title>
              <h2 className="mb-0">{stats.totalServices}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs cho các loại thống kê */}
      <Tabs defaultActiveKey="overview" className="mb-4">
        <Tab eventKey="overview" title="Tổng quan">
          <Row>
            <Col md={6}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Thống kê đơn hàng</Card.Title>
                  <div style={{ height: '300px' }}>
                    <Line
                      data={orderChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: true,
                            text: 'Số đơn hàng theo tháng'
                          }
                        }
                      }}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Thống kê doanh thu</Card.Title>
                  <div style={{ height: '300px' }}>
                    <Bar
                      data={revenueChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: true,
                            text: 'Doanh thu theo tháng'
                          }
                        }
                      }}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
        

      </Tabs>
    </Container>
  );
};

export default DashboardAdmin; 
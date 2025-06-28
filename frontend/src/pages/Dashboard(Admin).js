import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Line, Bar } from 'react-chartjs-2';
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
      // TODO: Thay thế bằng API call thực tế
      // const response = await fetch('/api/dashboard/stats');
      // const data = await response.json();
      // setStats(data.stats);
      // setOrderChartData(data.orderChart);
      // setRevenueChartData(data.revenueChart);

      // Dữ liệu trống - chờ kết nối API
      setStats({
        totalOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        totalServices: 0
      });

      // Biểu đồ trống
      setOrderChartData({
        labels: [],
        datasets: []
      });

      setRevenueChartData({
        labels: [],
        datasets: []
      });
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu dashboard:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <Container fluid className="p-4">
      <h1 className="h2 mb-4">Dashboard</h1>

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

      {/* Biểu đồ */}
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
    </Container>
  );
};

export default DashboardAdmin; 
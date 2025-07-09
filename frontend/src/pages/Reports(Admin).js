import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
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
import { dashboardAPI } from '../services/api';
import { userAPI } from '../services/api';

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

// Hàm format số tiền
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

// Hàm format số phần trăm
const formatPercent = (value) => {
  return `${value > 0 ? '+' : ''}${value}%`;
};

const ReportsAdmin = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // State cho biểu đồ doanh thu
  const [revenuePeriod, setRevenuePeriod] = useState('month');
  const [revenueType, setRevenueType] = useState('total');
  const [revenueData, setRevenueData] = useState({
    labels: [],
    datasets: [{
      label: 'Doanh thu',
      data: [],
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      fill: true
    }]
  });
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueGrowth, setRevenueGrowth] = useState(0);

  // State cho biểu đồ đơn hàng
  const [orderPeriod, setOrderPeriod] = useState('month');
  const [orderType, setOrderType] = useState('total');
  const [orderData, setOrderData] = useState({
    labels: [],
    datasets: [{
      label: 'Số đơn',
      data: [],
      backgroundColor: '#10b981',
      borderRadius: 4
    }]
  });
  const [totalOrders, setTotalOrders] = useState(0);
  const [orderGrowth, setOrderGrowth] = useState(0);

  // State cho biểu đồ khách hàng
  const [customerPeriod, setCustomerPeriod] = useState('month');
  const [customerType, setCustomerType] = useState('new');
  const [customerData, setCustomerData] = useState({
    labels: [],
    datasets: [{
      label: 'Khách hàng mới',
      data: [],
      backgroundColor: '#f59e0b',
      borderRadius: 4
    }]
  });
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [customerGrowth, setCustomerGrowth] = useState(0);

  // Options cho biểu đồ
  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => formatCurrency(value)
        }
      }
    }
  };

  const orderCustomerOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  // useEffect để tải dữ liệu khi component mount hoặc bộ lọc thay đổi
  useEffect(() => {
    const loadRevenueData = async () => {
      try {
        const response = await dashboardAPI.getRevenueChart();
        if (response.success) {
          const labels = response.data.labels || [];
          const dataArr = response.data.data || [];
          setRevenueData(prev => ({
            ...prev,
            labels: labels,
            datasets: [{ ...prev.datasets[0], data: dataArr }]
          }));
          // Tính tổng doanh thu
          let total = response.data.total;
          if (typeof total === 'undefined') {
            total = dataArr.reduce((sum, v) => sum + (v || 0), 0);
          }
          setTotalRevenue(total);
          // Tính tăng trưởng từ backend
          let growth = response.data.growth;
          if (typeof growth === 'undefined' && dataArr.length > 1) {
            // Fallback: tính theo tháng trước nếu backend không có
            const last = dataArr[dataArr.length - 1];
            const prev = dataArr[dataArr.length - 2];
            growth = prev ? Math.round(((last - prev) / prev) * 100) : 0;
          }
          setRevenueGrowth(growth || 0);
        }
      } catch (error) {
        setRevenueData(prev => ({ ...prev, labels: [], datasets: [{ ...prev.datasets[0], data: [] }] }));
        setTotalRevenue(0);
        setRevenueGrowth(0);
      }
    };

    const loadOrderData = async () => {
      try {
        const response = await dashboardAPI.getOrdersChart();
        if (response.success) {
          const labels = response.data.labels || [];
          const dataArr = response.data.data || [];
          setOrderData(prev => ({
            ...prev,
            labels: labels,
            datasets: [{ ...prev.datasets[0], data: dataArr }]
          }));
          // Tính tổng đơn hàng
          let total = response.data.total;
          if (typeof total === 'undefined') {
            total = dataArr.reduce((sum, v) => sum + (v || 0), 0);
          }
          setTotalOrders(total);
          // Tính tăng trưởng từ backend
          let growth = response.data.growth;
          if (typeof growth === 'undefined' && dataArr.length > 1) {
            // Fallback: tính theo tháng trước nếu backend không có
            const last = dataArr[dataArr.length - 1];
            const prev = dataArr[dataArr.length - 2];
            growth = prev ? Math.round(((last - prev) / prev) * 100) : 0;
          }
          setOrderGrowth(growth || 0);
        }
      } catch (error) {
        setOrderData(prev => ({ ...prev, labels: [], datasets: [{ ...prev.datasets[0], data: [] }] }));
        setTotalOrders(0);
        setOrderGrowth(0);
      }
    };

    // Phần khách hàng: nếu có API thì thay thế, chưa có thì giữ nguyên
    const loadCustomerData = async () => {
      try {
        // Gọi API lấy dữ liệu biểu đồ khách hàng
        const chartRes = await dashboardAPI.getCustomersChart();
        console.log('Chart API:', chartRes);
        let labels = [], dataArr = [], growth = 0;
        if (chartRes.success) {
          labels = chartRes.data.labels || [];
          dataArr = chartRes.data.data || [];
          setCustomerData(prev => ({
            ...prev,
            labels: labels,
            datasets: [{ ...prev.datasets[0], data: dataArr }]
          }));
          // Tính tăng trưởng
          growth = chartRes.data.growth;
          if (typeof growth === 'undefined' && dataArr.length > 1) {
            const last = dataArr[dataArr.length - 1];
            const prev = dataArr[dataArr.length - 2];
            growth = prev ? Math.round(((last - prev) / prev) * 100) : 0;
          }
        } else {
          setCustomerData(prev => ({ ...prev, labels: [], datasets: [{ ...prev.datasets[0], data: [] }] }));
        }
        // Lấy tổng số khách hàng từ dashboard
        const statsRes = await dashboardAPI.getStats();
        console.log('Stats API:', statsRes);
        let total = 0;
        if (statsRes.success && statsRes.data && typeof statsRes.data.totalCustomers !== 'undefined') {
          total = statsRes.data.totalCustomers;
        }
        setTotalCustomers(total);
        setCustomerGrowth(growth || 0);
      } catch (error) {
        console.error('Customer Data Error:', error);
        setCustomerData(prev => ({ ...prev, labels: [], datasets: [{ ...prev.datasets[0], data: [] }] }));
        setTotalCustomers(0);
        setCustomerGrowth(0);
      }
    };

    loadRevenueData();
    loadOrderData();
    loadCustomerData();
  }, [revenuePeriod, revenueType, orderPeriod, orderType, customerPeriod, customerType]);

  const handleDateRangeSubmit = (e) => {
    e.preventDefault();
    console.log('Viewing report for date range:', startDate, 'to', endDate);
    // Thực hiện logic xem báo cáo theo khoảng thời gian
  };

  return (
    <Container fluid>
      <h1 className="my-4">Báo cáo & Thống kê</h1>
      <Form onSubmit={handleDateRangeSubmit} className="mb-4">
        <Row>
          <Col md={3}>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Button variant="primary" type="submit">Xem báo cáo</Button>
          </Col>
        </Row>
      </Form>

      <Row className="g-4">
        <Col lg={6}>
          <Card className="h-100">
            <Card.Body>
              <h3 className="card-title">Thống kê doanh thu</h3>
              <div className="chart-filters d-flex gap-2 mb-3">
                <Form.Select value={revenuePeriod} onChange={(e) => setRevenuePeriod(e.target.value)}>
                  <option value="week">Tuần này</option>
                  <option value="month">Tháng này</option>
                  <option value="quarter">Quý này</option>
                  <option value="year">Năm nay</option>
                </Form.Select>
                <Form.Select value={revenueType} onChange={(e) => setRevenueType(e.target.value)}>
                  <option value="total">Tổng doanh thu</option>
                  <option value="byService">Theo dịch vụ</option>
                  <option value="byLocation">Theo chi nhánh</option>
                </Form.Select>
              </div>
              <div className="chart-wrapper" style={{ height: '200px' }}>
                <Line
                  data={revenueData}
                  options={revenueOptions}
                />
              </div>
              <div className="mt-3">
                <p className="h5 mb-0">Tổng doanh thu: {formatCurrency(totalRevenue)}</p>
                <p className="text-muted">Tăng trưởng: {formatPercent(revenueGrowth)}</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="h-100">
            <Card.Body>
              <h3 className="card-title">Thống kê đơn hàng</h3>
              <div className="chart-filters d-flex gap-2 mb-3">
                <Form.Select value={orderPeriod} onChange={(e) => setOrderPeriod(e.target.value)}>
                  <option value="week">Tuần này</option>
                  <option value="month">Tháng này</option>
                  <option value="quarter">Quý này</option>
                  <option value="year">Năm nay</option>
                </Form.Select>
                <Form.Select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                  <option value="total">Tổng đơn hàng</option>
                  <option value="byService">Theo dịch vụ</option>
                  <option value="byLocation">Theo chi nhánh</option>
                </Form.Select>
              </div>
              <div className="chart-wrapper" style={{ height: '200px' }}>
                <Bar
                  data={orderData}
                  options={orderCustomerOptions}
                />
              </div>
              <div className="mt-3">
                <p className="h5 mb-0">Tổng đơn hàng: {totalOrders}</p>
                <p className="text-muted">Tăng trưởng: {formatPercent(orderGrowth)}</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mt-4">
        <Col lg={12}>
          <Card className="h-100">
            <Card.Body>
              <h3 className="card-title">Thống kê khách hàng</h3>
              <div className="chart-filters d-flex gap-2 mb-3">
                <Form.Select value={customerPeriod} onChange={(e) => setCustomerPeriod(e.target.value)}>
                  <option value="week">Tuần này</option>
                  <option value="month">Tháng này</option>
                  <option value="quarter">Quý này</option>
                  <option value="year">Năm nay</option>
                </Form.Select>
                <Form.Select value={customerType} onChange={(e) => setCustomerType(e.target.value)}>
                  <option value="new">Khách hàng mới</option>
                  <option value="returning">Khách hàng quay lại</option>
                </Form.Select>
              </div>
              <div className="chart-wrapper" style={{ height: '200px' }}>
                <Bar
                  data={customerData}
                  options={orderCustomerOptions}
                />
              </div>
              <div className="mt-3">
                <p className="h5 mb-0">Tổng số khách hàng: {totalCustomers}</p>
                <p className="text-muted">Tăng trưởng: {formatPercent(customerGrowth)}</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ReportsAdmin; 
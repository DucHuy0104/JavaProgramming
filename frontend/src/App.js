import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components for user interface
import Header from './component/header';
import Footer from './component/footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Reliability from './pages/Reliability';

// Components for admin interface
import LayoutAdmin from './component/Layout(Admin)';
import DashboardAdmin from './pages/Dashboard(Admin)';
import OrdersAdmin from './pages/Orders(Admin)';
import ServicesAdmin from './pages/Services(Admin)';
import CustomersAdmin from './pages/Customers(Admin)';
import ResultsAdmin from './pages/Results(Admin)';
import ReportsAdmin from './pages/Reports(Admin)';
import FeedbackAdmin from './pages/Feedback(Admin)';
import BlogAdmin from './pages/Blog(Admin)';
import StaffAdmin from './pages/Staff(Admin)';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public (user) routes */}
        <Route path="/" element={
          <>
            <Header />
            <Routes>
              <Route index element={<Home />} />
              <Route path="reliability" element={<Reliability />} />
              <Route path="services" element={<Services />} />
              <Route path="contact" element={<Contact />} />
            </Routes>
            <Footer />
          </>
        } />

        {/* Admin routes with layout */}
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<DashboardAdmin />} />
          <Route path="orders" element={<OrdersAdmin />} />
          <Route path="services" element={<ServicesAdmin />} />
          <Route path="customers" element={<CustomersAdmin />} />
          <Route path="results" element={<ResultsAdmin />} />
          <Route path="reports" element={<ReportsAdmin />} />
          <Route path="feedback" element={<FeedbackAdmin />} />
          <Route path="blog" element={<BlogAdmin />} />
          <Route path="staff" element={<StaffAdmin />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={
          <>
            <Header />
            <div className="container mt-5">
              <h1>404 - Page Not Found</h1>
              <p>The page you are looking for does not exist.</p>
            </div>
            <Footer />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;

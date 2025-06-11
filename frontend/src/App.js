import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './component/header';
import Footer from './component/footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Reliability from './pages/Reliability';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Reliability" element={<Reliability />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

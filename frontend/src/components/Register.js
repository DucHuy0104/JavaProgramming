import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    address: '',
    dateOfBirth: '',
    gender: 'Male',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate password
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Send all data including confirmPassword to backend
    const registerData = formData;

    console.log('Sending registration data:', registerData);

    const result = await register(registerData);

    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="form-box opacity-100 translate-x-0 transition-all duration-700 ease-out" style={{ position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', zIndex: '10' }}>
      <Link
        to="/home"
        className="back-to-home absolute top-4 left-4 z-50"
        aria-label="Back to Home"
      >
        <span className="back-icon">🏠</span> Back to Home
      </Link>
      <div className="box relative" style={{ position: 'relative', width: '100%', maxWidth: '600px', background: 'rgba(255, 255, 255, 0.95)', borderRadius: '15px', padding: '25px', boxShadow: '0 0 25px rgba(74, 144, 226, 0.7)', transition: 'all 0.5s ease', overflow: 'hidden', zIndex: '10' }}>
        <div className="box::before" style={{ content: "''", position: 'absolute', width: '130%', height: '130%', background: 'linear-gradient(45deg, #4A90E2, #ADD8E6, #4A90E2)', borderRadius: '15px', animation: 'dnaRotate 10s linear infinite', filter: 'blur(10px)', zIndex: '-1', opacity: '0.5' }}></div>
        <div className="box::after" style={{ content: "''", position: 'absolute', inset: '3px', background: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: '2px solid rgba(74, 144, 226, 0.5)', zIndex: '-1', transition: 'background 0.5s ease' }}></div>
        <h2 className="text-2xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] to-[#ADD8E6] animate-pulse" style={{ marginBottom: '1rem' }}>
          Join the DNA Revolution!
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3 relative z-10" style={{ position: 'relative', zIndex: '10' }} aria-live="polite">
          {error && (
            <div className="notification" tabIndex="-1" role="alert" style={{ position: 'fixed', top: '10px', left: '50%', transform: 'translateX(-50%)', background: '#ff4d4d', color: '#ffffff', padding: '8px 18px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', zIndex: '1000', animation: 'fadeIn 0.5s ease-in-out', maxWidth: '90%', boxShadow: '0 0 10px rgba(0, 0, 0, 0.4)' }}>
              {error}
            </div>
          )}
          {success && (
            <div className="notification" tabIndex="-1" role="alert" style={{ position: 'fixed', top: '10px', left: '50%', transform: 'translateX(-50%)', background: '#4dabf5', color: '#ffffff', padding: '8px 18px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', zIndex: '1000', animation: 'fadeIn 0.5s ease-in-out', maxWidth: '90%', boxShadow: '0 0 10px rgba(0, 0, 0, 0.4)' }}>
              {success}
            </div>
          )}
          <div className="relative">
            <input
              name="fullName"
              type="text"
              required
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="input-field glow-input"
              style={{ width: '100%', padding: '10px', margin: '8px 0', border: '2px solid #bbdefb', borderRadius: '8px', color: '#333333', fontSize: '12px', transition: 'all 0.3s ease', paddingLeft: '30px', background: 'rgba(255, 255, 255, 0.95)', boxShadow: 'inset 0 0 3px rgba(0, 0, 0, 0.1)' }}
              aria-label="Full Name"
            />
            <span className="absolute left-2 top-2 text-[#4A90E2] text-lg" style={{ position: 'absolute', left: '8px', top: '8px', fontSize: '18px' }}>🧬</span>
          </div>
          <div className="relative">
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="input-field glow-input"
              style={{ width: '100%', padding: '10px', margin: '8px 0', border: '2px solid #bbdefb', borderRadius: '8px', color: '#333333', fontSize: '12px', transition: 'all 0.3s ease', paddingLeft: '30px', background: 'rgba(255, 255, 255, 0.95)', boxShadow: 'inset 0 0 3px rgba(0, 0, 0, 0.1)' }}
              aria-label="Email"
            />
            <span className="absolute left-2 top-2 text-[#4A90E2] text-lg" style={{ position: 'absolute', left: '8px', top: '8px', fontSize: '18px' }}>🧬</span>
          </div>
          <div className="relative">
            <input
              name="phoneNumber"
              type="tel"
              placeholder="Phone"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="input-field glow-input"
              style={{ width: '100%', padding: '10px', margin: '8px 0', border: '2px solid #bbdefb', borderRadius: '8px', color: '#333333', fontSize: '12px', transition: 'all 0.3s ease', paddingLeft: '30px', background: 'rgba(255, 255, 255, 0.95)', boxShadow: 'inset 0 0 3px rgba(0, 0, 0, 0.1)' }}
              aria-label="Phone Number"
            />
            <span className="absolute left-2 top-2 text-[#4A90E2] text-lg" style={{ position: 'absolute', left: '8px', top: '8px', fontSize: '18px' }}>🧬</span>
          </div>
          <div className="relative">
            <input
              name="password"
              type="password"
              required
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="input-field glow-input"
              style={{ width: '100%', padding: '10px', margin: '8px 0', border: '2px solid #bbdefb', borderRadius: '8px', color: '#333333', fontSize: '12px', transition: 'all 0.3s ease', paddingLeft: '30px', background: 'rgba(255, 255, 255, 0.95)', boxShadow: 'inset 0 0 3px rgba(0, 0, 0, 0.1)' }}
              aria-label="Password"
            />
            <span className="absolute left-2 top-2 text-[#4A90E2] text-lg" style={{ position: 'absolute', left: '8px', top: '8px', fontSize: '18px' }}>🧬</span>
          </div>
          <div className="relative">
            <input
              name="confirmPassword"
              type="password"
              required
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field glow-input"
              style={{ width: '100%', padding: '10px', margin: '8px 0', border: '2px solid #bbdefb', borderRadius: '8px', color: '#333333', fontSize: '12px', transition: 'all 0.3s ease', paddingLeft: '30px', background: 'rgba(255, 255, 255, 0.95)', boxShadow: 'inset 0 0 3px rgba(0, 0, 0, 0.1)' }}
              aria-label="Confirm Password"
            />
            <span className="absolute left-2 top-2 text-[#4A90E2] text-lg" style={{ position: 'absolute', left: '8px', top: '8px', fontSize: '18px' }}>🧬</span>
          </div>
          <div className="relative">
            <input
              name="address"
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="input-field glow-input"
              style={{ width: '100%', padding: '10px', margin: '8px 0', border: '2px solid #bbdefb', borderRadius: '8px', color: '#333333', fontSize: '12px', transition: 'all 0.3s ease', paddingLeft: '30px', background: 'rgba(255, 255, 255, 0.95)', boxShadow: 'inset 0 0 3px rgba(0, 0, 0, 0.1)' }}
              aria-label="Address"
            />
            <span className="absolute left-2 top-2 text-[#4A90E2] text-lg" style={{ position: 'absolute', left: '8px', top: '8px', fontSize: '18px' }}>🧬</span>
          </div>
          <div className="relative">
            <input
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="input-field glow-input"
              style={{ width: '100%', padding: '10px', margin: '8px 0', border: '2px solid #bbdefb', borderRadius: '8px', color: '#333333', fontSize: '12px', transition: 'all 0.3s ease', paddingLeft: '30px', background: 'rgba(255, 255, 255, 0.95)', boxShadow: 'inset 0 0 3px rgba(0, 0, 0, 0.1)' }}
              aria-label="Date of Birth"
            />
            <span className="absolute left-2 top-2 text-[#4A90E2] text-lg" style={{ position: 'absolute', left: '8px', top: '8px', fontSize: '18px' }}>🧬</span>
          </div>
          <div className="relative">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="input-field glow-input"
              style={{ width: '100%', padding: '10px', margin: '8px 0', border: '2px solid #bbdefb', borderRadius: '8px', color: '#333333', fontSize: '12px', transition: 'all 0.3s ease', paddingLeft: '30px', background: 'rgba(255, 255, 255, 0.95)', boxShadow: 'inset 0 0 3px rgba(0, 0, 0, 0.1)', appearance: 'none' }}
              aria-label="Gender"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <span className="absolute left-2 top-2 text-[#4A90E2] text-lg" style={{ position: 'absolute', left: '8px', top: '8px', fontSize: '18px' }}>🧬</span>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn relative mb-4"
            style={{ background: 'linear-gradient(45deg, #4A90E2, #90caf9)', color: '#ffffff', padding: '10px', border: 'none', borderRadius: '8px', width: '100%', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden', boxShadow: '0 0 10px rgba(74, 144, 226, 0.6)', marginBottom: '1rem' }}
            aria-label="Register"
          >
            {loading ? (
              <svg className="progress-ring active w-4 h-4 animate-spin mx-auto" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'none' }}>
                <circle cx="8" cy="8" r="6" stroke="#ffffff" strokeWidth="2" fill="none" />
                <path d="M8 1a7 7 0 0 1 7 7" stroke="#4A90E2" strokeWidth="2" fill="none" />
              </svg>
            ) : (
              'Register'
            )}
          </button>
          <div className="text-center">
            <Link
              to="/login"
              className="btn bg-transparent text-[#4A90E2] border-2 border-[#4A90E2] hover:bg-[#4A90E2] hover:text-white transition-all duration-300 mb-4"
              style={{ background: 'transparent', color: '#4A90E2', padding: '10px', border: '2px solid #4A90E2', borderRadius: '8px', width: '100%', fontSize: '12px', fontWeight: '600', textAlign: 'center', display: 'block', transition: 'all 0.3s ease', marginBottom: '1rem' }}
              aria-label="Switch to Login"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
      <div className="dna-decoration" style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', opacity: '0.6', zIndex: '0' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="dna-strand"
            style={{ position: 'absolute', width: '3px', height: '200px', background: 'linear-gradient(to bottom, #4A90E2, #ADD8E6, #4A90E2)', animation: 'dnaStrandMove 10s linear infinite', transformOrigin: 'center', borderRadius: '3px', left: `${i * 20}%`, animationDelay: `${i * 1}s` }}
          ></div>
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{ position: 'absolute', width: '8px', height: '8px', background: 'rgba(74, 144, 226, 0.9)', borderRadius: '50%', animation: 'particleFloat 8s infinite ease-in-out', boxShadow: '0 0 10px rgba(74, 144, 226, 0.8)', left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s` }}
          ></div>
        ))}
      </div>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

        body {
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(135deg, #0a0f2b, #1e3a8a);
          overflow-x: hidden;
          transition: background 0.5s ease;
          margin: 0;
          position: relative;
          height: 100vh;
        }
        .dark-mode {
          background: linear-gradient(135deg, #1a2526, #2d3a4a);
        }
        .dark-mode .box {
          background: rgba(30, 41, 59, 0.98);
          color: #e2e8f0;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.6);
        }
        .dark-mode .input-field,
        .dark-mode select {
          background: #2d3748;
          color: #e2e8f0;
          border-color: #4a5568;
        }
        .dark-mode .btn {
          background: linear-gradient(45deg, #2b6cb0, #63b3ed);
        }
        .input-field:focus,
        select:focus {
          border-color: #4A90E2;
          outline: none;
          box-shadow: 0 0 8px rgba(74, 144, 226, 0.7) inset, 0 0 12px rgba(74, 144, 226, 0.5);
        }
        .btn:hover {
          background: linear-gradient(45deg, #90caf9, #4A90E2);
          transform: translateY(-2px);
          box-shadow: 0 0 15px rgba(74, 144, 226, 0.8);
        }
        .btn:active::after {
          content: '';
          position: absolute;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          top: 50%;
          left: 50%;
          animation: rippleEffect 0.6s ease-out;
        }
        .glow {
          box-shadow: 0 0 15px rgba(74, 144, 226, 0.9);
        }
        .glow-input:focus {
          box-shadow: 0 0 15px rgba(74, 144, 226, 0.9), 0 0 8px rgba(74, 144, 226, 0.7) inset;
        }
        .back-to-home {
          position: absolute;
          top: 20px;
          left: 20px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid #4A90E2;
          border-radius: 8px;
          color: #4A90E2;
          text-decoration: none;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.3s ease, transform 0.6s ease;
          box-shadow: 0 0 10px rgba(74, 144, 226, 0.3);
          z-index: 50;
        }
        .back-to-home:hover {
          background: #4A90E2;
          color: #ffffff;
          transform: translateX(-2px) rotate(-5deg);
          box-shadow: 0 0 15px rgba(74, 144, 226, 0.5);
        }
        .back-to-home .back-icon {
          font-size: 14px;
          transition: transform 0.3s ease;
        }
        .back-to-home:hover .back-icon {
          transform: scale(1.2);
        }
        @keyframes dnaRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes dnaStrandMove {
          0% { transform: translateY(-200px) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(360deg); }
        }
        @keyframes particleFloat {
          0% { transform: translateY(0) scale(1); opacity: 0.9; }
          50% { transform: translateY(-50px) scale(1.3); opacity: 0.6; }
          100% { transform: translateY(0) scale(1); opacity: 0.9; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes rippleEffect {
          to { width: 150px; height: 150px; opacity: 0; }
        }
        @media (max-width: 640px) {
          .box {
            padding: 15px;
            max-width: 100%;
          }
          .back-to-home {
            top: 10px;
            left: 10px;
            padding: 6px 10px;
            font-size: 10px;
          }
        }
      `}</style>
      <Link
        to="/home"
        className="back-to-home absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50"
        aria-label="Back to Home"
      >
        <span className="back-icon">🏠</span> Back to Home
      </Link>
    </div>
  );
};

export default Register;
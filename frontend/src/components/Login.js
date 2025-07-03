import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Login = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [uname, setUname] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const buttonRef = useRef(null);
  let animationFrameId = null;

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const validateInputs = () => {
    if (!uname || !pass) return 'Please fill all fields to unlock your DNA insights!';
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(uname)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await login({
        emailOrPhone: uname, // email hoặc phone
        password: pass
      });

      if (result.success) {
        const from = location.state?.from?.pathname || result.redirectUrl || '/home';
        navigate(from, { replace: true });
      } else {
        setError(result.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi đăng nhập');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    setIsVisible(true);
    const savedUname = localStorage.getItem('username');
    if (savedUname) setUname(savedUname);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    if (error) {
      const errorElement = document.querySelector('.notification');
      if (errorElement) errorElement.focus();
    }
  }, [error]);

  return (
    <div
      className={`form-box ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'} transition-all duration-700 ease-out`}
    >
      <Link
        to="/home"
        className="back-to-home absolute top-4 left-4 z-50"
        aria-label="Back to Home"
      >
        <span className="back-icon">🏠</span> Back to Home
      </Link>
      <div className="box relative">
        <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] to-[#ADD8E6] animate-pulse">
          Unlock Your DNA Legacy!
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10" aria-live="polite">
          {error && (
            <div className="notification" tabIndex="-1" role="alert">
              {error}
            </div>
          )}

          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              value={uname}
              onChange={(e) => setUname(e.target.value)}
              className="input-field glow-input"
              aria-label="Email"
              autoComplete="email"
              name="email"
            />
            <span className="absolute left-2 top-3 text-[#4A90E2] text-xl">🧬</span>
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="input-field glow-input"
              aria-label="Password"
              autoComplete="current-password"
              name="password"
            />
            <span className="absolute left-2 top-3 text-[#4A90E2] text-xl">🧬</span>
          </div>
          <div className="flex items-center justify-between text-base text-[#333333]">
            <label className="flex items-center">
              <input
                type="checkbox"
                onChange={(e) => localStorage.setItem('rememberMe', e.target.checked)}
                className="mr-2 glow-checkbox w-4 h-4"
                aria-label="Remember me"
              /> Remember me
            </label>
            <Link
              to="/forgot-password"
              className="text-[#4A90E2] hover:text-[#90caf9] transition-colors duration-300 font-medium underline"
              aria-label="Forgot Password"
            >
            Forgot Password?
            </Link>
          </div>
          <button
            ref={buttonRef} 
            type="submit"
            className="btn relative mb-4"
            disabled={!uname || !pass || isLoading}
            aria-label="Login"
          >
            {isLoading ? (
              <svg className="progress-ring active w-5 h-5 animate-spin mx-auto" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="#ffffff" strokeWidth="3" fill="none" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="#4A90E2" strokeWidth="3" fill="none" />
              </svg>
            ) : (
              'Login'
            )}
          </button>
          <Link
            to="/register"
            className="btn bg-transparent text-[#4A90E2] border-2 border-[#4A90E2] hover:bg-[#4A90E2] hover:text-white transition-all duration-300 mb-4"
            aria-label="Switch to Register"
          >
            Register
          </Link>

        </form>

      </div>
      <div className="dna-decoration absolute inset-0 z-0 opacity-0.6">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="dna-strand"
            style={{ left: `${i * 14.28}%`, animationDelay: `${i * 1.5}s` }}
          ></div>
        ))}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 7}s` }}
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
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
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
        .form-box {
          position: relative;
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 15px;
          z-index: 10;
        }
        .box {
          position: relative;
          width: 100%;
          max-width: 800px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 0 40px rgba(74, 144, 226, 0.6);
          transition: all 0.5s ease;
          overflow: hidden;
          z-index: 10;
        }
        .box::before {
          content: '';
          position: absolute;
          width: 130%;
          height: 130%;
          background: linear-gradient(45deg, #4A90E2, #ADD8E6, #4A90E2);
          border-radius: 20px;
          animation: dnaRotate 10s linear infinite;
          filter: blur(15px);
          z-index: -1;
          opacity: 0.5;
        }
        .box::after {
          content: '';
          position: absolute;
          inset: 5px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 15px;
          border: 2px solid rgba(74, 144, 226, 0.5);
          z-index: -1;
          transition: background 0.5s ease;
        }
        .dark-mode .box::after {
          background: #2d3748;
        }
        .dna-decoration {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: 0.6;
          z-index: 0;
        }
        .dna-strand {
          position: absolute;
          width: 4px;
          height: 300px;
          background: linear-gradient(to bottom, #4A90E2, #ADD8E6, #4A90E2);
          animation: dnaStrandMove 14s linear infinite;
          transform-origin: center;
          border-radius: 4px;
        }
        .particle {
          position: absolute;
          width: 10px;
          height: 10px;
          background: rgba(74, 144, 226, 0.9);
          border-radius: 50%;
          animation: particleFloat 12s infinite ease-in-out;
          box-shadow: 0 0 15px rgba(74, 144, 226, 0.7);
        }
        .input-field, select {
          width: 100%;
          padding: 12px;
          margin: 10px 0;
          border: 2px solid #bbdefb;
          border-radius: 10px;
          color: #333333;
          font-size: 14px;
          transition: all 0.3s ease;
          padding-left: 40px;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.1);
        }
        .input-field:focus, select:focus {
          border-color: #4A90E2;
          outline: none;
          box-shadow: 0 0 12px rgba(74, 144, 226, 0.6) inset, 0 0 20px rgba(74, 144, 226, 0.4);
        }
        .btn {
          background: linear-gradient(45deg, #4A90E2, #90caf9);
          color: #ffffff;
          padding: 12px;
          border: none;
          border-radius: 10px;
          width: 100%;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 15px rgba(74, 144, 226, 0.5);
        }
        .btn:hover {
          background: linear-gradient(45deg, #90caf9, #4A90E2);
          transform: translateY(-2px);
          box-shadow: 0 0 25px rgba(74, 144, 226, 0.7);
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
          box-shadow: 0 0 20px rgba(74, 144, 226, 0.8);
        }
        .glow-input:focus {
          box-shadow: 0 0 20px rgba(74, 144, 226, 0.8), 0 0 12px rgba(74, 144, 226, 0.6) inset;
        }
        .notification {
          position: fixed;
          top: 15px;
          left: 50%;
          transform: translateX(-50%);
          background: #4dabf5;
          color: #ffffff;
          padding: 10px 25px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          z-index: 1000;
          animation: fadeIn 0.5s ease-in-out;
          max-width: 90%;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
        }
        .sub-form-container {
          margin-top: 20px;
          padding: 15px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          transition: all 0.3s ease-out;
          overflow: hidden;
          z-index: 20;
          position: relative;
          backdrop-filter: blur(5px);
          max-width: 100%;
          width: 100%;
        }
        .sub-form-container.closed {
          max-height: 0;
          opacity: 0;
          padding: 0 15px;
        }
        .sub-form-container.open {
          max-height: 600px;
          opacity: 1;
          width: 100%;
        }
        .sub-form-toggle {
          background: #E6F0FA;
          color: #333333;
          padding: 8px;
          border-radius: 10px;
          width: 100%;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
        }
        .sub-form-toggle:hover {
          background: #90caf9;
          color: #ffffff;
          transform: scale(1.02);
          box-shadow: 0 0 12px rgba(74, 144, 226, 0.2);
        }
        .dark-mode .sub-form-toggle {
          background: #2d3748;
          color: #e2e8f0;
        }
        .dark-mode .sub-form-container {
          background: rgba(45, 55, 72, 0.5);
        }
        .progress-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: none;
        }
        .progress-ring.active {
          display: block;
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
          0% { transform: translateY(-300px) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(360deg); }
        }
        @keyframes particleFloat {
          0% { transform: translateY(0) scale(1); opacity: 0.9; }
          50% { transform: translateY(-80px) scale(1.5); opacity: 0.6; }
          100% { transform: translateY(0) scale(1); opacity: 0.9; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes rippleEffect {
          to { width: 250px; height: 250px; opacity: 0; }
        }
        @media (max-width: 640px) {
          .box {
            padding: 20px;
            max-width: 100%;
          }
          .sub-form-container {
            padding: 10px;
          }
          .sub-form-container .flex {
            flex-direction: column;
            gap: 10px;
          }
          .sub-form-container input {
            width: 100%;
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

export default Login;
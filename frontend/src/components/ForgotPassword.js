import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const validateEmail = () => {
    if (!email) return 'Please enter your email to reset your password!';
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateEmail();
    if (validationError) {
      setError(validationError);
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await resetPassword(email);
      if (result.success) {
        setSuccess('Password reset link sent! Check your email.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(result.message || 'Failed to send reset link.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (error || success) {
      const notification = document.querySelector('.notification');
      if (notification) notification.focus();
    }
  }, [error, success]);

  return (
    <div
      className={`form-box ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'} transition-all duration-700 ease-out`}
    >
      <Link
        to="/login"
        className="back-to-home absolute top-4 left-4 z-50"
        aria-label="Back to Login"
      >
        <span className="back-icon">⬅</span> Back to Login
      </Link>
      <div className="box relative">
        <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] to-[#ADD8E6] animate-pulse">
          Reset Your DNA Access!
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10" aria-live="polite">
          {(error || success) && (
            <div className="notification" tabIndex="-1" role="alert">
              {error || success}
            </div>
          )}
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field glow-input"
              aria-label="Email for password reset"
            />
            <span className="absolute left-2 top-3 text-[#4A90E2] text-xl">🧬</span>
          </div>
          <button
            type="submit"
            className="btn relative mb-4"
            disabled={isLoading || !email}
            aria-label="Reset Password"
          >
            {isLoading ? (
              <svg className="progress-ring active w-5 h-5 animate-spin mx-auto" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="#ffffff" strokeWidth="3" fill="none" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="#4A90E2" strokeWidth="3" fill="none" />
              </svg>
            ) : (
              'Reset Password'
            )}
          </button>
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
        .dark-mode .input-field {
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
        .input-field {
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
        .input-field:focus {
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
        .notification.error {
          background: #ff4d4d;
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
          .back-to-home {
            top: 10px;
            left: 10px;
            padding: 6px 10px;
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
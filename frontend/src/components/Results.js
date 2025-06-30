import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const Results = () => {
  const [resultsData, setResultsData] = useState([
    { id: 'DNA001', length: 1200, gcContent: 45.5, status: 'Hoàn tất' },
    { id: 'DNA002', length: 850, gcContent: 38.2, status: 'Đang xử lý' },
    { id: 'DNA003', length: 2000, gcContent: 50.1, status: 'Hoàn tất' },
  ]);
  const [feedbackData, setFeedbackData] = useState([
    { rating: 5, comment: 'Hệ thống rất dễ dùng, kết quả chính xác!', user: 'Người dùng A' },
    { rating: 4, comment: 'Giao diện đẹp, nhưng muốn thêm biểu đồ.', user: 'Người dùng B' },
  ]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

  // Simulate authentication check
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) navigate('/login');
  }, [navigate]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Kết Quả Phân Tích DNA', 20, 20);
    autoTable(doc, {
      head: [['Mã Mẫu', 'Độ Dài Chuỗi', 'Tỷ Lệ GC (%)', 'Trạng Thái']],
      body: resultsData.map(data => [data.id, data.length, data.gcContent, data.status]),
      startY: 30,
      styles: { fillColor: [240, 248, 255] },
      headStyles: { fillColor: [30, 144, 255] },
    });
    doc.save('ket_qua_dna.pdf');
    setPopupMessage('Đã tải kết quả thành công!');
    document.getElementById('notification-popup').classList.add('show');
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;
    const newFeedback = { rating, comment, user: `Người dùng ${feedbackData.length + 1}` };
    setFeedbackData([...feedbackData, newFeedback]);
    setPopupMessage(`Phản hồi đã gửi! Đánh giá: ${rating} sao`);
    document.getElementById('notification-popup').classList.add('show');
    setRating(0);
    setComment('');
  };

  const closePopup = () => {
    document.getElementById('notification-popup').classList.remove('show');
  };

  return (
    <div className="dna-background min-h-screen relative overflow-x-hidden" style={{ background: 'linear-gradient(135deg, #1E90FF, #F0F8FF)' }}>
      <Link to="/home" className="back-to-home absolute top-4 left-4 z-50 text-white">
        <span className="back-icon">🏠</span> Back to Home
      </Link>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-white text-center mb-8">Cổng Phân Tích DNA</h1>

        {/* Results Page */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Kết Quả Phân Tích</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-100">
                  <th className="border border-blue-200 p-2 text-left">Mã Mẫu</th>
                  <th className="border border-blue-200 p-2 text-left">Độ Dài Chuỗi</th>
                  <th className="border border-blue-200 p-2 text-left">Tỷ Lệ GC (%)</th>
                  <th className="border border-blue-200 p-2 text-left">Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {resultsData.map((data, index) => (
                  <tr key={index}>
                    <td className="border border-blue-200 p-2">{data.id}</td>
                    <td className="border border-blue-200 p-2">{data.length}</td>
                    <td className="border border-blue-200 p-2">{data.gcContent}</td>
                    <td className="border border-blue-200 p-2">{data.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            id="download-pdf"
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={handleDownloadPDF}
          >
            Tải Kết Quả (PDF)
          </button>
        </section>

        {/* Feedback Form */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Gửi Phản Hồi</h2>
          <form id="feedback-form" onSubmit={handleFeedbackSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Đánh Giá</label>
              <div className="star-rating flex flex-row-reverse justify-end">
                {[5, 4, 3, 2, 1].map((star) => (
                  <React.Fragment key={star}>
                    <input
                      type="radio"
                      id={`star${star}`}
                      name="rating"
                      value={star}
                      checked={rating === star}
                      onChange={() => setRating(star)}
                      required
                    />
                    <label htmlFor={`star${star}`} title={`${star} sao`}>★</label>
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="comment" className="block text-gray-700 mb-2">Bình Luận</label>
              <textarea
                id="comment"
                name="comment"
                rows="4"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Ý kiến của bạn..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Gửi Phản Hồi
            </button>
          </form>
        </section>

        {/* Feedback List */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Phản Hồi Công Khai</h2>
          <div id="feedback-items">
            {feedbackData.map((data, index) => (
              <div key={index} className="border-b border-gray-200 py-4">
                <div className="flex items-center mb-2">
                  <span className="text-blue-600">{Array(data.rating).fill('★').join('')}{Array(5 - data.rating).fill('☆').join('')}</span>
                  <span className="ml-2 text-gray-600 text-sm">bởi {data.user}</span>
                </div>
                <p className="text-gray-700">{data.comment}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Notification Pop-up */}
        <div id="notification-popup" className="popup">
          <p id="popup-message" className="text-gray-700">{popupMessage}</p>
          <button
            id="close-popup"
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={closePopup}
          >
            Đóng
          </button>
        </div>
      </div>

      <style jsx>{`
        .dna-background::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255, 255, 255, 0.2) 10px,
            rgba(255, 255, 255, 0.2) 20px
          );
          opacity: 0.1;
          z-index: -1;
        }
        .star-rating input {
          display: none;
        }
        .star-rating label {
          font-size: 2rem;
          color: #d1d5db;
          cursor: pointer;
          transition: color 0.2s;
        }
        .star-rating input:checked ~ label,
        .star-rating label:hover,
        .star-rating label:hover ~ label {
          color: #1E90FF;
        }
        .popup {
          display: none;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          z-index: 50;
          animation: fadeIn 0.3s ease-in;
        }
        .popup.show {
          display: block;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -60%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
        .back-to-home {
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid #1E90FF;
          border-radius: 8px;
          color: #1E90FF;
          text-decoration: none;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.3s ease, transform 0.6s ease;
          box-shadow: 0 0 10px rgba(30, 144, 255, 0.3);
          z-index: 50;
        }
        .back-to-home:hover {
          background: #1E90FF;
          color: #ffffff;
          transform: translateX(-2px) rotate(-5deg);
          box-shadow: 0 0 15px rgba(30, 144, 255, 0.5);
        }
        .back-to-home .back-icon {
          font-size: 14px;
          transition: transform 0.3s ease;
        }
        .back-to-home:hover .back-icon {
          transform: scale(1.2);
        }
        @media (max-width: 640px) {
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

export default Results;
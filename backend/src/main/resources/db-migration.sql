-- Migration script to add new columns for workflow tracking
-- Run this script after starting the application for the first time

-- Add new columns to orders table
ALTER TABLE orders 
ADD COLUMN appointment_date DATETIME NULL COMMENT 'Ngày hẹn xét nghiệm',
ADD COLUMN kit_sent_date DATETIME NULL COMMENT 'Ngày gửi kit (cho self_submission)',
ADD COLUMN sample_collected_date DATETIME NULL COMMENT 'Ngày thu mẫu',
ADD COLUMN sample_received_date DATETIME NULL COMMENT 'Ngày nhận mẫu tại lab',
ADD COLUMN testing_started_date DATETIME NULL COMMENT 'Ngày bắt đầu xét nghiệm',
ADD COLUMN results_ready_date DATETIME NULL COMMENT 'Ngày có kết quả',
ADD COLUMN results_delivered_date DATETIME NULL COMMENT 'Ngày trả kết quả',
ADD COLUMN estimated_completion_date DATETIME NULL COMMENT 'Ngày dự kiến hoàn thành',
ADD COLUMN staff_assigned VARCHAR(255) NULL COMMENT 'Nhân viên được phân công',
ADD COLUMN tracking_number VARCHAR(100) NULL COMMENT 'Mã theo dõi (cho kit/sample)',
ADD COLUMN sample_notes TEXT NULL COMMENT 'Ghi chú về mẫu',
ADD COLUMN result_notes TEXT NULL COMMENT 'Ghi chú về kết quả';

-- Add new columns to test_results table
ALTER TABLE test_results 
ADD COLUMN test_date DATETIME NULL COMMENT 'Ngày thực hiện xét nghiệm',
ADD COLUMN result_details TEXT NULL COMMENT 'Chi tiết kết quả xét nghiệm (JSON format)',
ADD COLUMN confidence_level DOUBLE NULL COMMENT 'Độ tin cậy của kết quả (0-100%)',
ADD COLUMN test_method VARCHAR(255) NULL COMMENT 'Phương pháp xét nghiệm',
ADD COLUMN lab_notes TEXT NULL COMMENT 'Ghi chú từ phòng lab',
ADD COLUMN quality_control VARCHAR(255) NULL COMMENT 'Thông tin kiểm soát chất lượng',
ADD COLUMN pdf_url VARCHAR(500) NULL COMMENT 'URL của file PDF kết quả',
ADD COLUMN is_urgent BOOLEAN DEFAULT FALSE COMMENT 'Đánh dấu xét nghiệm khẩn cấp',
ADD COLUMN estimated_delivery_date DATETIME NULL COMMENT 'Ngày dự kiến trả kết quả';

-- Create indexes for better performance
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_type ON orders(order_type);
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_order_date ON orders(order_date);

CREATE INDEX idx_test_results_order_id ON test_results(order_id);
CREATE INDEX idx_test_results_status ON test_results(status);
CREATE INDEX idx_test_results_staff_id ON test_results(staff_id);

-- Insert sample data for testing (optional)
-- INSERT INTO orders (order_number, customer_name, service_name, service_category, order_date, total_amount, order_type, status, payment_status, address, email, phone, notes) 
-- VALUES 
-- ('ORD1234567890', 'Nguyễn Văn A', 'Xét nghiệm ADN dân sự', 'DNA_HOME', NOW(), 2500000.00, 'self_submission', 'pending_registration', 'pending', '123 Đường ABC, Quận 1, TP.HCM', 'nguyenvana@email.com', '0901234567', 'Khách hàng yêu cầu gửi kit vào buổi sáng'),
-- ('ORD1234567891', 'Trần Thị B', 'Xét nghiệm ADN hành chính', 'DNA_FACILITY', NOW(), 3000000.00, 'in_clinic', 'pending_registration', 'pending', '456 Đường XYZ, Quận 2, TP.HCM', 'tranthib@email.com', '0901234568', 'Khách hàng muốn xét nghiệm vào thứ 2');

-- Update existing orders to have proper status if needed
-- UPDATE orders SET status = 'pending_registration' WHERE status IS NULL OR status = ''; 
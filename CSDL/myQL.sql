-- Tạo bảng người dùng (cấu trúc ví dụ)
CREATE TABLE users (
    id INTEGER GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

-- Tạo bảng nhân viên (cấu trúc ví dụ)
CREATE TABLE staff (
    id INTEGER GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);


-- Tạo bảng dịch vụ xét nghiệm
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT
);

-- Tạo bảng đặt hẹn dịch vụ xét nghiệm
CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    service_id INT NOT NULL,
    address VARCHAR(255),
    time DATETIME NOT NULL,
    type ENUM('self', 'staff') NOT NULL, -- 'self': tự thu mẫu, 'staff': nhân viên thu mẫu
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- Tạo bảng mẫu tự thu bởi người dùng
CREATE TABLE user_samples (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL,
    status ENUM('pending', 'received', 'testing', 'completed') DEFAULT 'pending',
    FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);

-- Tạo bảng mẫu thu bởi nhân viên y tế
CREATE TABLE staff_samples (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL,
    staff_id INT NOT NULL,
    date DATETIME NOT NULL,
    status ENUM('pending', 'collected', 'testing', 'completed') DEFAULT 'pending',
    FOREIGN KEY (appointment_id) REFERENCES appointments(id),
    FOREIGN KEY (staff_id) REFERENCES staff(id)
);

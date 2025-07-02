-- DNA Testing Database - Common Queries
-- Sử dụng với SQLTools trong VS Code

-- ================================
-- 1. DATABASE OVERVIEW
-- ================================

-- Xem tất cả bảng
SHOW TABLES;

-- Xem kích thước database
SELECT 
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES 
WHERE table_schema = 'dna_testing_db'
ORDER BY (data_length + index_length) DESC;

-- ================================
-- 2. USER MANAGEMENT
-- ================================

-- Xem tất cả users
SELECT id, full_name, email, phone_number, role, status, created_at 
FROM users 
ORDER BY created_at DESC;

-- Đếm users theo role
SELECT role, COUNT(*) as count 
FROM users 
GROUP BY role;

-- Tìm user theo email
SELECT * FROM users WHERE email = 'admin@example.com';

-- Xem users có phone number
SELECT id, full_name, email, phone_number 
FROM users 
WHERE phone_number IS NOT NULL AND phone_number != '';

-- Xem admin users
SELECT * FROM users WHERE role IN ('ADMIN', 'MANAGER');

-- ================================
-- 3. BLOG MANAGEMENT
-- ================================

-- Xem tất cả blogs (nếu có)
SELECT * FROM blogs ORDER BY created_at DESC;

-- Đếm blogs theo status (nếu có)
-- SELECT status, COUNT(*) as count FROM blogs GROUP BY status;

-- ================================
-- 4. DATA MAINTENANCE
-- ================================

-- Backup user data
SELECT 
    id, full_name, email, phone_number, role, status, 
    created_at, updated_at
FROM users
INTO OUTFILE '/tmp/users_backup.csv'
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n';

-- Update user phone number
-- UPDATE users SET phone_number = '0123456789' WHERE email = 'user@example.com';

-- ================================
-- 5. DEBUGGING QUERIES
-- ================================

-- Check user authentication data
SELECT id, email, role, status, created_at 
FROM users 
WHERE email = 'admin@example.com';

-- Verify phone number data
SELECT 
    id, 
    full_name, 
    email, 
    phone_number,
    CASE 
        WHEN phone_number IS NULL THEN 'NULL'
        WHEN phone_number = '' THEN 'EMPTY'
        ELSE 'HAS_VALUE'
    END as phone_status
FROM users;

-- Check table structure
DESCRIBE users;
SHOW CREATE TABLE users;

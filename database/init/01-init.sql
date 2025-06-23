-- Initialize DNA Testing Database
-- This script will run when MySQL container starts for the first time

-- Create database if not exists (already created by docker-compose)
-- CREATE DATABASE IF NOT EXISTS dna_testing_db;

-- Use the database
USE dna_testing_db;

-- Set charset
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Create some initial data if needed
-- This will be populated by Spring Boot JPA when the application starts

-- You can add initial data here if needed
-- For example:
-- INSERT INTO users (full_name, email, password, role, status, created_at) 
-- VALUES ('Admin User', 'admin@dnatesting.com', '$2a$10$...', 'ADMIN', 'ACTIVE', NOW());

-- Show tables (for verification)
SHOW TABLES;

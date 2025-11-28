-- TRONG FILE: backend/src/main/resources/schema.sql

-- Xóa bảng nếu đã tồn tại để đảm bảo môi trường sạch mỗi khi khởi động
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- Tạo bảng users
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Tạo bảng products
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    quantity INT NOT NULL
);
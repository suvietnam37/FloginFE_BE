-- Tạo bảng users với cú pháp MySQL
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Tạo bảng products với cú pháp MySQL
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DOUBLE NOT NULL,
    quantity INT NOT NULL
);

INSERT INTO users(username, password) VALUES ('testuser', '$2a$10$xR.wC3EG4BVtCc5Q3SqGXupjK/fX9jw2Uec.Qr8LwyYhA4yWa.qgu');

INSERT INTO products (name, price, quantity) VALUES ('Laptop Dell XPS 15', 35000000, 10);
INSERT INTO products (name, price, quantity) VALUES ('Bàn phím cơ Keychron K2', 2500000, 50);
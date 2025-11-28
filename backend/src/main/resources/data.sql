-- TRONG FILE: backend/src/main/resources/data.sql

MERGE INTO users (username, password) KEY(username) VALUES ('testuser', '$2a$10$xR.wC3EG4BVtCc5Q3SqGXupjK/fX9jw2Uec.Qr8LwyYhA4yWa.qgu');

MERGE INTO products (name, price, quantity) KEY(name) VALUES ('Laptop Dell XPS 15', 35000000, 10);
MERGE INTO products (name, price, quantity) KEY(name) VALUES ('Bàn phím cơ Keychron K2', 2500000, 50);
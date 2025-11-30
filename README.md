# Bài tập lớn môn Kiểm thử Phần mềm - Ứng dụng Flogin
**Niên khóa 2024-2025 - Trường Đại học Sài Gòn**

**Flogin** là một ứng dụng web full-stack được phát triển nhằm mục đích thực hành và áp dụng các kỹ thuật kiểm thử phần mềm hiện đại. Ứng dụng bao gồm hai chức năng chính:
- Hệ thống **Đăng nhập / Đăng ký** người dùng (xác thực bằng JWT)
- Quản lý **Sản phẩm** (CRUD hoàn chỉnh)

[![CI/CD Pipeline](https://github.com/suvietnam37/FloginFE_BE/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/suvietnam37/FloginFE_BE/actions/workflows/ci.yml)

## Mục lục
- [Giới thiệu](#giới-thiệu)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Hướng dẫn cài đặt và chạy ứng dụng](#hướng-dẫn-cài-đặt-và-chạy-ứng-dụng)
  - [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
  - [Các bước cài đặt](#các-bước-cài-đặt)
  - [Chạy ứng dụng](#chạy-ứng-dụng)
- [Hướng dẫn chạy kiểm thử](#hướng-dẫn-chạy-kiểm-thử)
  - [Backend Testing](#backend-testing)
  - [Frontend Testing](#frontend-testing)
  - [End-to-End Testing (Cypress)](#end-to-end-testing-cypress)
  - [Performance Testing (k6)](#performance-testing-k6)
- [CI/CD Pipeline](#cicd-pipeline)
- [Thành viên nhóm](#thành-viên-nhóm)

## Giới thiệu

Dự án là bài tập lớn môn **Kiểm thử Phần mềm** tại Trường Đại học Sài Gòn. Mục tiêu chính là xây dựng một ứng dụng web hoàn chỉnh và áp dụng đầy đủ các cấp độ kiểm thử theo mô hình **Pyramid Testing**:

| Cấp độ kiểm thử         | Công cụ sử dụng                  | Mục tiêu đạt được |
|-------------------------|-----------------------------------|-------------------|
| Unit Testing            | JUnit 5 + Mockito, Vitest         | > 80% coverage    |
| Integration Testing     | Spring Boot Test, MockMvc         | Kiểm tra luồng API |
| Component Testing       | React Testing Library             | Kiểm tra UI component |
| End-to-End Testing      | Cypress                           | Kiểm tra toàn bộ flow người dùng |
| Performance Testing     | k6                                | Đánh giá tải API  |
| Security Testing        | OWASP ZAP (manual) + kiểm tra JWT | Phát hiện lỗ hổng cơ bản |
| Code Coverage           | JaCoCo (Backend), Vitest Coverage (Frontend) | Báo cáo chi tiết |

## Công nghệ sử dụng

### Backend
- Java 17 + Spring Boot 3.x
- Spring Security + JWT Authentication
- Spring Data JPA (Hibernate)
- MySQL
- Maven
- JUnit 5, Mockito, MockMvc, Spring Boot Test
- JaCoCo (code coverage)

### Frontend
- React 18 + Vite
- React Router DOM v6
- Axios
- Tailwind CSS (hoặc CSS Modules)
- Vitest + React Testing Library
- Cypress

### DevOps & Tools
- Git & GitHub
- GitHub Actions (CI/CD)
- k6 (Performance Testing)
- Docker (tùy chọn chạy MySQL)

## Cấu trúc dự án
FloginFE_BE/
├── .github/workflows/          # CI/CD pipelines
├── backend/                    # Spring Boot Backend
│   ├── src/main/java/...
│   ├── src/test/java/...
│   └── pom.xml
├── frontend/                   # React Frontend (Vite)
│   ├── src/...
│   ├── tests/...
│   ├── cypress/...
│   └── vite.config.ts
├── performance-tests/         # k6 scripts
│   ├── login-test.js
│   └── product-test.js
└── README.md
text## Hướng dẫn cài đặt và chạy ứng dụng

### Yêu cầu hệ thống
- Git
- JDK 17
- Apache Maven 3.8+
- Node.js 20+
- MySQL 8.0+ (hoặc Docker)
- k6 (cho performance test)

### Các bước cài đặt

1. **Clone repository**
   ```bash
   git clone https://github.com/suvietnam37/FloginFE_BE.git
   cd FloginFE_BE

Cấu hình cơ sở dữ liệu
Tạo database tên flogin_db trong MySQL
Chỉnh sửa file:textbackend/src/main/resources/application.propertiespropertiesspring.datasource.url=jdbc:mysql://localhost:3306/flogin_db?useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

Cài đặt dependenciesBackend:Bashcd backend
mvn clean installFrontend:Bashcd ../frontend
npm install

Chạy ứng dụng
Mở 2 terminal riêng biệt:
Terminal 1 - Backend (port 8080)
Bashcd backend
mvn spring-boot:run
Terminal 2 - Frontend (port 5173)
Bashcd frontend
npm run dev
Truy cập ứng dụng tại: http://localhost:5173
Hướng dẫn chạy kiểm thử
Backend Testing
Bashcd backend

Chạy tất cả Unit + Integration Tests:Bashmvn test
Chạy test + tạo báo cáo coverage (JaCoCo):Bashmvn clean verify→ Mở báo cáo: backend/target/site/jacoco/index.html

Frontend Testing
Bashcd frontend

Chạy Unit & Component Tests (Vitest):Bashnpm test
Chạy test + báo cáo coverage:Bashnpm run coverage

End-to-End Testing (Cypress)
Yêu cầu: Cả Backend và Frontend phải đang chạy
Bashcd frontend

Chạy headless (CI/CD):Bashnpm run test:e2e
Chạy giao diện tương tác:Bashnpx cypress open

Performance Testing (k6)
Yêu cầu: Backend phải đang chạy
Bashcd performance-tests

Test hiệu năng API Login:Bashk6 run login-test.js
Test hiệu năng API Product:Bashk6 run product-test.js

CI/CD Pipeline
Pipeline tự động chạy trên mọi push/PR vào nhánh main:

Build backend + frontend
Chạy toàn bộ unit & integration tests
Tạo code coverage report
Chạy E2E tests (headless)
Badge trạng thái hiển thị trên README

Xem chi tiết: GitHub Actions
Thành viên nhóm
STT,Họ và tên,MSSV,Vai trò chính
1,Sử Việt Nam,3123410230,"Nhóm trưởng, Backend, CI/CD"
2,Nguyễn Phạm Cao Khả,3123410144,"Frontend, Cypress E2E"
3,Võ Hoàng Phúc Hy,3123410142,"Backend Testing, Performance"
4,Trịnh Thế Minh,3123410224,"Frontend Testing, Documentation"
Cảm ơn thầy cô và các bạn đã xem dự án!
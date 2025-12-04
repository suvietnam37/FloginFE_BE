# Flogin — Bài tập lớn môn Kiểm thử Phần mềm

**Niên khóa 2024-2025 — Trường Đại học Sài Gòn**

Flogin là một ứng dụng web full-stack phục vụ mục đích học tập và kiểm thử: gồm tính năng xác thực người dùng (JWT) và quản lý sản phẩm (CRUD).

[![CI/CD Pipeline](https://github.com/suvietnam37/FloginFE_BE/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/suvietnam37/FloginFE_BE/actions/workflows/ci.yml)

## Mục lục
- [Giới thiệu](#giới-thiệu)
- [Công nghệ](#công-nghệ)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Yêu cầu & Cài đặt nhanh](#yêu-cầu--cài-đặt-nhanh)
- [Cấu hình database](#cấu-hình-database)
- [Chạy ứng dụng (phát triển)](#chạy-ứng-dụng-phát-triển)
- [Kiểm thử & Coverage](#kiểm-thử--coverage)
- [Nâng cấp Java lên Java 21 (LTS)](#nâng-cấp-java-lên-java-21-lts)
- [CI/CD](#cicd)
- [Thành viên nhóm](#thành-viên-nhóm)

## Giới thiệu

Ứng dụng gồm:
- Đăng ký / Đăng nhập (JWT)
- Quản lý Sản phẩm (CRUD)

Mục tiêu bài tập: xây dựng ứng dụng mẫu và áp dụng các kỹ thuật kiểm thử (unit, integration, component, E2E, performance).

## Công nghệ

- Backend: Java, Spring Boot, Spring Security, Spring Data JPA, MySQL, Maven
- Frontend: React 18, Vite, Axios
- Testing: JUnit 5, Mockito, MockMvc (backend); Vitest, React Testing Library (frontend); Cypress (E2E)
- CI/CD: GitHub Actions
- Performance: k6

## Cấu trúc dự án (tóm tắt)

```
FloginFE_BE/
├─ backend/                # Spring Boot app (Maven)
├─ frontend/               # React + Vite app
├─ performance-tests/      # k6 scripts
└─ .github/                # workflows, upgrade plan
```

## Yêu cầu & Cài đặt nhanh (Windows PowerShell)

- Git
- JDK 17 hoặc JDK 21 (nếu nâng cấp)
- Maven 3.8+
- Node.js 18+
- MySQL 8+

```powershell
git clone https://github.com/suvietnam37/FloginFE_BE.git
cd FloginFE_BE

# Backend
cd backend
./mvnw.cmd -DskipTests clean install

# Frontend (mở terminal khác)
cd ..\frontend
npm install
```

## Cấu hình database

Tạo database (ví dụ `flogin_db`) và chỉnh `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/flogin_db?useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

## Chạy ứng dụng (phát triển)

```powershell
# Terminal 1: Backend
cd backend
./mvnw.cmd spring-boot:run

# Terminal 2: Frontend
cd frontend
npm run dev
```

Truy cập: http://localhost:5173

## Kiểm thử & Coverage

### Backend

```powershell
cd backend
./mvnw.cmd test
# tạo báo cáo coverage
./mvnw.cmd clean verify
# báo cáo JaCoCo: backend/target/site/jacoco/index.html
```

### Frontend

```powershell
cd frontend
npm test
npm run coverage
```

### E2E (Cypress)

Yêu cầu: Backend + Frontend đang chạy.

```powershell
cd frontend
npm run test:e2e   # headless
npx cypress open    # tương tác
```

### Performance (k6)

```powershell
cd performance-tests
k6 run login-test.js
k6 run product-test.js
```

## Nâng cấp Java lên Java 21 (LTS)

Ghi chú nhanh:

- `backend/pom.xml` hiện dùng `<java.version>17</java.version>` và `maven-compiler-plugin` source/target = 17.
- Công cụ nâng cấp đã tạo kế hoạch tại:

```
backend/.github/java-upgrade/20251130102302/plan.md
```

Nếu bạn chỉ muốn README (không làm gì khác), nhận biết:

- Để thực sự build bằng Java 21, cần cài JDK 21 và cập nhật `pom.xml` (thay `<java.version>` và plugin compiler thành 21).
- Hoặc chạy OpenRewrite upgrade theo `plan.md` để tự động sửa code nếu cần.

## CI/CD

- Pipeline GitHub Actions (nhánh `main`) build + test + coverage + E2E.

## Thành viên nhóm

| STT | Họ và tên | MSSV | Nhiệm vụ |
|---:|---|---:| ---:|
| 1 | Sử Việt Nam | 3123410230 | Phân tích và Thiết kế Test Cases, Unit Tests, Security Testing, Viết báo cáo |
| 2 | Nguyễn Phạm Cao Khả | 3123410144 | Mock Testing, Performance Testing, Giao diện Product |
| 3 | Võ Hoàng Phúc Hy | 3123410142 | Automation Testing và CI/CD |
| 4 | Trịnh Thế Minh | 3123410224 | Integration Testing, Giao diện Login |
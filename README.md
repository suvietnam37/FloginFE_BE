# Bài tập lớn môn Kiểm thử Phần mềm - Ứng dụng Flogin
_Niên khóa 2024-2025_

Dự án **Flogin** là một ứng dụng web full-stack, được xây dựng với mục đích áp dụng và thực hành các kỹ thuật kiểm thử phần mềm. Ứng dụng bao gồm hai chức năng chính: hệ thống **Đăng nhập** người dùng và quản lý **Sản phẩm** (CRUD).

## Mục lục
- [Giới thiệu](#giới-thiệu)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc Dự án](#cấu-trúc-dự-án)
- [Hướng dẫn Cài đặt và Chạy](#hướng-dẫn-cài-đặt-và-chạy)
  - [Yêu cầu](#yêu-cầu)
  - [Các bước Cài đặt](#các-bước-cài-đặt)
  - [Chạy Ứng dụng](#chạy-ứng-dụng)
- [Hướng dẫn Chạy Kiểm thử](#hướng-dẫn-chạy-kiểm-thử)
  - [Backend Testing](#backend-testing)
  - [Frontend Testing](#frontend-testing)
- [Thành viên Nhóm](#thành-viên-nhóm)

## Giới thiệu
Dự án này là một phần của môn học Kiểm thử Phần mềm tại trường Đại học Sài Gòn. Mục tiêu là xây dựng một ứng dụng hoàn chỉnh và áp dụng các cấp độ kiểm thử khác nhau để đảm bảo chất lượng, bao gồm:
- **Unit Testing:** Kiểm tra từng đơn vị code (hàm, service) một cách độc lập.
- **Integration Testing:** Kiểm tra sự phối hợp giữa các thành phần (Controller, Service, Component).
- **End-to-End (E2E) Testing:** Tự động hóa việc kiểm tra toàn bộ luồng nghiệp vụ từ góc nhìn người dùng.
- **Performance Testing:** Đánh giá hiệu năng và khả năng chịu tải của API.
- **Security Testing:** Kiểm tra các lỗ hổng bảo mật cơ bản.
- **CI/CD:** Xây dựng pipeline tích hợp liên tục với GitHub Actions.

## Công nghệ sử dụng
- **Backend:**
  - Java 17
  - Spring Boot 3.2+
  - Spring Data JPA & Spring Security
  - Maven
  - PostgreSQL
- **Frontend:**
  - React 18+ & Vite
  - Axios
  - React Router
- **Testing & DevOps:**
  - **Backend:** JUnit 5, Mockito, JaCoCo
  - **Frontend:** Vitest, React Testing Library, Cypress
  - **Performance:** k6
  - **CI/CD:** GitHub Actions

## Cấu trúc Dự án
Dự án được tổ chức theo cấu trúc monorepo, chứa cả hai phần Backend và Frontend trong cùng một repository.
FloginFE_BE/
├── .github/workflows/ # Cấu hình CI/CD cho GitHub Actions
├── backend/ # Dự án Backend (Spring Boot)
├── frontend/ # Dự án Frontend (React)
├── performance-tests/ # Kịch bản test hiệu năng (k6)
└── README.md
*(Để xem cấu trúc chi tiết hơn, vui lòng tham khảo file báo cáo.)*

## Hướng dẫn Cài đặt và Chạy

### Yêu cầu
- [Git](https://git-scm.com/)
- [JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
- [Apache Maven](https://maven.apache.org/)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/) (hoặc Docker)
- [k6](https://k6.io/docs/getting-started/installation/) (để chạy Performance Test)

### Các bước Cài đặt
1. **Clone repository:**
   ```bash
   git clone https://github.com/suvietnam37/FloginFE_BE.git
   cd FloginFE_BE
   Cấu hình Backend:
Mở file backend/src/main/resources/application.properties.
Cập nhật thông tin kết nối đến CSDL PostgreSQL của bạn:
Properties
spring.datasource.url=jdbc:postgresql://localhost:5432/flogin_db
spring.datasource.username=your_username
spring.datasource.password=your_password
Tạo một database trong PostgreSQL với tên flogin_db.
Cài đặt dependencies cho Backend:
cd backend
mvn clean install
cd ..
Cài đặt dependencies cho Frontend:
cd frontend
npm install
cd ..
Chạy Ứng dụng
Bạn sẽ cần hai cửa sổ terminal riêng biệt.
Terminal 1: Chạy Backend Server
code
Bash
cd backend
mvn spring-boot:run
Server sẽ chạy trên http://localhost:8080.
Terminal 2: Chạy Frontend App
cd frontend
npm run dev
Ứng dụng sẽ chạy trên http://localhost:5173.
Hướng dẫn Chạy Kiểm thử
Backend Testing
Điều hướng vào thư mục backend.
Chạy tất cả Unit & Integration Tests:
mvn test
Tạo báo cáo Độ bao phủ code (Coverage):
Lệnh này sẽ chạy test và tạo báo cáo trong backend/target/site/jacoco/index.html.
mvn clean test
Frontend Testing
Điều hướng vào thư mục frontend.
Chạy tất cả Unit & Component Tests:
npm test
Tạo báo cáo Độ bao phủ code (Coverage):
npm run coverage
Kết quả sẽ được hiển thị trong terminal.
Chạy End-to-End (E2E) Tests với Cypress:
Quan trọng: Đảm bảo cả hai server Backend và Frontend đều đang chạy.
# Chạy Cypress ở chế độ headless (chạy ngầm trong terminal)
npm run test:e2e

# Hoặc mở giao diện Cypress để chạy tương tác
npx cypress open
Performance Testing
Điều hướng vào thư mục performance-tests.
Quan trọng: Đảm bảo server Backend đang chạy.
# Chạy test hiệu năng cho API Login
k6 run login-test.js

# Chạy test hiệu năng cho API Product
k6 run product-test.js
1.  **Chạy trên máy:**
    *   Mở Terminal 1, chạy backend: `cd backend` -> `mvn spring-boot:run`.
    *   Mở Terminal 2, chạy frontend: `cd frontend` -> `npm run dev`.
    *   Mở Terminal 3, chạy E2E test: `cd frontend` -> `npx cypress open` (để xem trực quan) hoặc `npm run test:e2e` (để chạy trong terminal).
2.  **Chạy trên CI/CD:**
    *   Commit và push tất cả các file đã thay đổi lên GitHub.
    *   Vào repository của bạn, chọn tab "Actions" để xem workflow tự động chạy.


## Performance Testing
    Bạn có thể viết vào báo cáo của mình như sau:
Phân tích kết quả:
"Kết quả kiểm thử hiệu năng cho thấy API Login hoạt động tốt với số lượng người dùng ít, nhưng hiệu năng suy giảm nghiêm trọng khi số lượng người dùng đồng thời (concurrent users) tăng cao."
"Với mức tải 500-1000 VUs, thời gian phản hồi p(95) lên tới 50 giây và tỷ lệ lỗi là 3.67%, vượt xa ngưỡng cho phép. Nguyên nhân chính được xác định là do chi phí tính toán cao của thuật toán băm mật khẩu BCrypt, gây quá tải CPU khi có nhiều request đăng nhập đồng thời."
Đưa ra Recommendations:
Tối ưu hóa BCrypt Cost Factor: "Trong SecurityConfig.java, BCryptPasswordEncoder có thể được cấu hình với một "strength" hoặc "cost factor" (mặc định là 10). Giảm giá trị này (ví dụ: xuống 8 hoặc 9) sẽ làm cho việc băm mật khẩu nhanh hơn, cải thiện hiệu năng đăng nhập, nhưng sẽ phải đánh đổi một chút về bảo mật. Cần cân nhắc sự đánh đổi này."
code
Java
// Ví dụ trong SecurityConfig.java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(8); // Giảm cost factor
}
```    *   **Triển khai Rate Limiting:** "Để bảo vệ hệ thống khỏi các cuộc tấn công brute-force và giảm tải đột biến, cần triển khai cơ chế Rate Limiting. Ví dụ: giới hạn mỗi địa chỉ IP chỉ được phép thực hiện 5 lần đăng nhập thất bại trong 1 phút."
Nâng cấp tài nguyên Server (Scaling Up): "Đối với môi trường production, cần đảm bảo server có đủ tài nguyên CPU để xử lý tải dự kiến."
Tăng số lượng Instance (Scaling Out): "Triển khai ứng dụng trên nhiều instance và sử dụng một Load Balancer để phân phối tải đều, giúp hệ thống có khả năng xử lý nhiều request đồng thời hơn."
Tóm lại: Kết quả k6 của bạn không phải là một thất bại, mà nó đã thành công trong việc tìm ra điểm yếu về hiệu năng của ứng dụng. Đây chính xác là mục đích của Performance Testing. Hãy trình bày phân tích và các đề xuất trên vào báo cáo của bạn.
// trong frontend/cypress/e2e/login.cy.js

describe('Login E2E Tests', () => {
  beforeEach(() => {
    // Truy cập vào trang login trước mỗi bài test
    cy.visit('/login');
  });

  it('should display an error for invalid credentials', () => {
    // ACT: Nhập sai thông tin
    cy.get('[data-testid="username-input"]').type('wronguser');
    cy.get('[data-testid="password-input"]').type('wrongpass');
    cy.get('[data-testid="login-button"]').click();

    // ASSERT: Kiểm tra thông báo lỗi
    cy.get('[data-testid="login-message"]')
      .should('be.visible')
      .and('contain', 'Sai tên đăng nhập hoặc mật khẩu');
  });

  it('should login successfully and redirect to /products for valid credentials', () => {
    // ARRANGE:
    // Đảm bảo có user 'testuser'/'Test123' trong CSDL backend (từ file data.sql)

    // ACT: Nhập đúng thông tin
    cy.get('[data-testid="username-input"]').type('testuser');
    cy.get('[data-testid="password-input"]').type('Test123');
    cy.get('[data-testid="login-button"]').click();

    // ASSERT: Kiểm tra đã chuyển trang
    cy.url().should('include', '/products');
    // Kiểm tra xem trang products có nội dung mong muốn không
    cy.contains('h2', 'Trang Quản lý Sản phẩm').should('be.visible');
  });
});
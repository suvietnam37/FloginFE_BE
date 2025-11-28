import LoginPage from '../pages/LoginPage';

describe('Login E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  // --- Test Success/Error Flows ---

  it('should login successfully and redirect to /products for valid credentials', () => {
    // ACT: Sử dụng phương thức từ Page Object
    LoginPage.login('testuser', 'Test123');

    // ASSERT
    cy.url().should('include', '/products');
    cy.contains('h2', 'Trang Quản lý Sản phẩm').should('be.visible');
  });

  it('should display an API error message for invalid credentials', () => {
    // ACT
    LoginPage.login('wronguser', 'wrongpass123'); // Thêm số vào password

    // ASSERT
    LoginPage.getApiErrorMessage()
      .should('be.visible')
      .and('contain', 'Sai tên đăng nhập hoặc mật khẩu');
  });

  it('should log in successfully and redirect for valid credentials', () => {
    LoginPage.login('testuser', 'Test123');

    // ASSERT
    cy.url().should('include', '/products');
    cy.contains('h2', 'Quản lý sản phẩm').should('be.visible');
  });
});
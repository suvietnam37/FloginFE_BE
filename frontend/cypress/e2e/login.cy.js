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
    LoginPage.login('wronguser', 'wrongpass');

    // ASSERT
    LoginPage.getApiErrorMessage()
      .should('be.visible')
      .and('contain', 'Sai tên đăng nhập hoặc mật khẩu');
  });

  // --- Test Validation Messages ---

  it('should display a validation error message for a short username', () => {
    // ACT: Chỉ nhập username không hợp lệ và submit
    LoginPage.login('ab', 'anypassword');

    // ASSERT: Kiểm tra thông báo lỗi validation từ frontend
    // (Giả sử logic validation trong component của bạn sẽ hiển thị lỗi này)
    LoginPage.getValidationErrorMessage()
      .should('be.visible')
      .and('contain', 'Tên đăng nhập phải có ít nhất 3 ký tự');
    
    // Kiểm tra xem trang không chuyển hướng
    cy.url().should('not.include', '/products');
  });
});
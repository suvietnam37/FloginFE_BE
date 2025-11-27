// trong frontend/cypress/e2e/product.cy.js
import ProductPage from '../pages/ProductPage';

describe('Product CRUD E2E Tests', () => {
  beforeEach(() => {
    // Đăng nhập trước khi vào trang sản phẩm
    cy.visit('/login');
    cy.get('[data-testid="username-input"]').type('testuser');
    cy.get('[data-testid="password-input"]').type('Test123');
    cy.get('[data-testid="login-button"]').click();
    cy.url().should('include', '/products');
  });

  it('should create, update, and delete a product', () => {
    const productName = `Sản phẩm Test ${Date.now()}`;
    const updatedPrice = '12345';

    // 1. CREATE
    ProductPage.createProduct(productName, '9999', '10');

    // ASSERT CREATE
    ProductPage.findProductInList(productName)
      .should('be.visible')
      .and('contain', '9999');

    // 2. UPDATE
    ProductPage.findProductInList(productName)
      .contains('button', 'Sửa')
      .click();
    
    ProductPage.getPriceInput().clear().type(updatedPrice);
    ProductPage.getSubmitButton().click(); // Nút này bây giờ là "Lưu thay đổi"

    // ASSERT UPDATE
    ProductPage.findProductInList(productName)
      .should('contain', updatedPrice);

    // 3. DELETE
    ProductPage.findProductInList(productName)
      .contains('button', 'Xóa')
      .click();
    
    // Cypress tự động accept confirm dialog
    
    // ASSERT DELETE
    ProductPage.findProductInList(productName).should('not.exist');
  });
});
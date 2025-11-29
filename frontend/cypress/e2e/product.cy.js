// TRONG FILE: frontend/cypress/e2e/product.cy.js

import LoginPage from '../pages/LoginPage';
import ProductPage from '../pages/ProductPage';

describe('Product CRUD E2E Tests', () => {

  beforeEach(() => {
    cy.session('loggedInUser', () => {
      LoginPage.visit();
      LoginPage.login('testuser', 'Test123');

      cy.url().should('include', '/products');
      cy.contains('h2', 'Quản lý sản phẩm').should('be.visible');
    });

    ProductPage.visit();
  });

  it('should allow a user to CREATE and READ a new product', () => {
    const productName = `Sản phẩm Test ${Date.now()}`;
    
    // CREATE
    ProductPage.fillProductForm({ name: productName, price: '12345', quantity: '10' });
    ProductPage.submitForm();

    // READ (Assert)
    ProductPage.findProductByName(productName)
      .should('be.visible')
      .and('contain', '12345')
      .and('contain', '10');
  });

  it('should allow a user to UPDATE a product', () => {
    const initialName = `Sản phẩm để Update ${Date.now()}`;
    const updatedName = `ĐÃ UPDATE - ${Date.now()}`;

    // Dùng cy.intercept để "nghe" các request API
    cy.intercept('POST', '/api/products').as('createProduct');
    cy.intercept('PUT', '/api/products/*').as('updateProduct');

    // --- SETUP: Tạo sản phẩm ---
    ProductPage.fillProductForm({ name: initialName, price: '5000', quantity: '5' });
    ProductPage.submitForm();

    // Chờ cho request createProduct hoàn thành và lấy ID từ response
    cy.wait('@createProduct').then(({ response }) => {
        // Lấy ID thật từ backend
        const productId = response.body.id;
        expect(productId).to.be.a('number'); // Đảm bảo ID là một số

        // --- UPDATE ---
        // Tìm đúng hàng dựa trên ID thật và nhấn nút Sửa
        cy.get(`[data-testid="btn-edit-${productId}"]`).click();
        
        ProductPage.fillProductForm({ name: updatedName });
        ProductPage.submitForm();

        // Chờ cho request update hoàn thành
        cy.wait('@updateProduct').its('response.statusCode').should('eq', 200);

        // --- ASSERT UPDATE ---
        ProductPage.findProductByName(initialName).should('not.exist');
        ProductPage.findProductByName(updatedName).should('be.visible');
    });
  });

  it('should allow a user to DELETE a product', () => {
    const productName = `Sản phẩm để Xóa ${Date.now()}`;

    // Setup: Tạo một sản phẩm để xóa
    ProductPage.fillProductForm({ name: productName, price: '111', quantity: '1' });
    ProductPage.submitForm();
    ProductPage.findProductByName(productName).should('be.visible');
    
    // DELETE
    ProductPage.findProductByName(productName).find('[data-testid^="btn-delete-"]').click();

    // Assert Delete
    ProductPage.findProductByName(productName).should('not.exist');
  });
});
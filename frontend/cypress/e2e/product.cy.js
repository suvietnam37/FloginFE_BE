// TRONG FILE: frontend/cypress/e2e/product.cy.js

import LoginPage from '../pages/LoginPage';
import ProductPage from '../pages/ProductPage';

describe('Product CRUD E2E Tests', () => {

  beforeEach(() => {
    cy.session('loggedInUser', () => {
      LoginPage.visit();
      LoginPage.login('testuser', 'Test123');
      cy.url().should('include', '/products');
    });
    ProductPage.visit();
  });

  it('should correctly handle the full CRUD lifecycle of a product', () => {
    const initialName = `Sản phẩm CRUD Test ${Date.now()}`;
    const updatedName = `ĐÃ UPDATE - ${Date.now()}`;

    // --- 1. CREATE ---
    cy.log('**--- STARTING CREATE TEST ---**');

    // "Lắng nghe" request tạo sản phẩm
    cy.intercept('POST', '/api/products').as('createProduct');

    ProductPage.fillProductForm({ name: initialName, price: '1000', quantity: '10' });

    // Đảm bảo nút submit có thể click được trước khi nhấn
    ProductPage.getSubmitButton().should('not.be.disabled').debug().click();

    // Chờ cho request tạo sản phẩm hoàn thành và kiểm tra status code
    cy.wait('@createProduct').its('response.statusCode').should('eq', 201);

    // --- 2. READ (Assert Create) ---
    cy.log('**--- STARTING READ ASSERT ---**');

    // Chờ cho đến khi tên sản phẩm mới xuất hiện trên giao diện
    ProductPage.findProductByName(initialName)
      .should('be.visible')
      .and('contain', '1000')
      .and('contain', '10');


    // --- 3. UPDATE ---
    cy.log('**--- STARTING UPDATE TEST ---**');

    // Tìm hàng chứa sản phẩm vừa tạo và lấy ra ID thật của nó
    ProductPage.findProductByName(initialName).invoke('attr', 'data-testid').then((testId) => {
      // testId sẽ có dạng "product-item-5"
      const productId = testId.split('-').pop();

      // "Lắng nghe" request cập nhật với đúng ID
      cy.intercept('PUT', `/api/products/${productId}`).as('updateProduct');

      // Nhấn nút Sửa trên đúng hàng đó
      cy.get(`[data-testid="btn-edit-${productId}"]`).click();

      // Điền thông tin mới và submit
      ProductPage.fillProductForm({ name: updatedName });
      ProductPage.getSubmitButton().should('not.be.disabled').click();

      // Chờ cho request cập nhật hoàn thành
      cy.wait('@updateProduct').its('response.statusCode').should('eq', 200);

      // --- 4. ASSERT UPDATE ---
      cy.log('**--- STARTING UPDATE ASSERT ---**');
      ProductPage.findProductByName(initialName).should('not.exist');
      ProductPage.findProductByName(updatedName).should('be.visible');

      // --- 5. DELETE ---
      cy.log('**--- STARTING DELETE TEST ---**');
      
      // "Lắng nghe" request xóa
      cy.intercept('DELETE', `/api/products/${productId}`).as('deleteProduct');

      // Nhấn nút Xóa trên hàng của sản phẩm đã được cập nhật
      ProductPage.findProductByName(updatedName).find(`[data-testid^="btn-delete-"]`).click();

      // Chờ cho request xóa hoàn thành
      cy.wait('@deleteProduct').its('response.statusCode').should('eq', 204);

      // --- 6. ASSERT DELETE ---
      cy.log('**--- STARTING DELETE ASSERT ---**');
      ProductPage.findProductByName(updatedName).should('not.exist');
    });
  });
});
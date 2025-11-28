import LoginPage from '../pages/LoginPage';
import ProductPage from '../pages/ProductPage';

describe('Product CRUD E2E Tests', () => {

  // Chạy một lần duy nhất trước tất cả các test trong file này
  before(() => {
    // Đăng nhập một lần và lưu session để tái sử dụng
    cy.visit('/login');
    LoginPage.login('testuser', 'Test123');
    cy.url().should('include', '/products');
    cy.saveLocalStorage(); // Một custom command (xem bên dưới)
  });

  beforeEach(() => {
    // Khôi phục session trước mỗi test
    cy.restoreLocalStorage();
    ProductPage.visit();
  });

  // Test Create và Read
  it('should allow a user to create and see a new product', () => {
    const productName = `Sản phẩm Test ${Date.now()}`;
    
    // Test Create product flow
    ProductPage.fillProductForm({ name: productName, price: '12345', quantity: '10' });
    ProductPage.submitForm();

    // Test Read/List products
    ProductPage.findProductByName(productName)
      .should('be.visible')
      .and('contain', '12345')
      .and('contain', '10');
  });

  it('should allow a user to update and delete a product', () => {
    const productName = `Sản phẩm Update ${Date.now()}`;
    const updatedName = `ĐÃ UPDATE ${Date.now()}`;

    // Setup: Tạo một sản phẩm để test
    ProductPage.fillProductForm({ name: productName, price: '5000', quantity: '5' });
    ProductPage.submitForm();
    ProductPage.findProductByName(productName).should('be.visible');

    // Test Update product
    ProductPage.findProductByName(productName).find('[data-testid^="btn-edit-"]').click();
    ProductPage.fillProductForm({ name: updatedName });
    ProductPage.submitForm();

    // Assert Update
    ProductPage.findProductByName(productName).should('not.exist');
    ProductPage.findProductByName(updatedName).should('be.visible');
    
    // Test Delete product
    ProductPage.findProductByName(updatedName).find('[data-testid^="btn-delete-"]').click();
    // Cypress tự động accept confirm dialog
    
    // Assert Delete
    ProductPage.findProductByName(updatedName).should('not.exist');
  });
  
  // Test Search/Filter (Giả sử có ô input tìm kiếm)
  // Bạn cần thêm <input data-testid="search-input" /> vào ProductPage.jsx
  it('should filter the product list based on search input', () => {
    const p1 = `Filter Test A ${Date.now()}`;
    const p2 = `Filter Test B ${Date.now()}`;

    // Setup: Tạo 2 sản phẩm
    ProductPage.fillProductForm({ name: p1, price: '1', quantity: '1' });
    ProductPage.submitForm();
    ProductPage.fillProductForm({ name: p2, price: '2', quantity: '2' });
    ProductPage.submitForm();

    ProductPage.findProductByName(p1).should('be.visible');
    ProductPage.findProductByName(p2).should('be.visible');

    // ACT: Tìm kiếm
    cy.get('[data-testid="search-input"]').type('Test A');

    // ASSERT
    ProductPage.findProductByName(p1).should('be.visible');
    ProductPage.findProductByName(p2).should('not.exist');
  });
});
// trong frontend/cypress/pages/ProductPage.js
class ProductPage {
  visit() {
    cy.visit('/products');
  }

  getNameInput() {
    return cy.get('[data-testid="product-name-input"]');
  }

  getPriceInput() {
    return cy.get('[data-testid="product-price-input"]');
  }

  getQuantityInput() {
    return cy.get('[data-testid="product-quantity-input"]');
  }

  getSubmitButton() {
    return cy.get('[data-testid="product-submit-button"]');
  }

  createProduct(name, price, quantity) {
    this.getNameInput().type(name);
    this.getPriceInput().type(price);
    this.getQuantityInput().type(quantity);
    this.getSubmitButton().click();
  }

  findProductInList(name) {
    return cy.contains('[data-testid="product-row"]', name);
  }
}
export default new ProductPage();
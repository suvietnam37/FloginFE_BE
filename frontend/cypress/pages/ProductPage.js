class ProductPage {
  // --- Navigation ---
  visit() {
    cy.visit('/products');
  }

  // --- Form Elements & Actions ---
  getNameInput() { return cy.get('[data-testid="product-name-input"]'); }
  getPriceInput() { return cy.get('[data-testid="product-price-input"]'); }
  getQuantityInput() { return cy.get('[data-testid="product-quantity-input"]'); }
  getSubmitButton() { return cy.get('[data-testid="product-submit-button"]'); }

  fillProductForm({ name, price, quantity }) {
    if (name) this.getNameInput().clear().type(name);
    if (price) this.getPriceInput().clear().type(price);
    if (quantity) this.getQuantityInput().clear().type(quantity);
  }
  
  submitForm() {
    this.getSubmitButton().click();
  }

  // --- List Elements & Actions ---
  getProductRow(productId) {
    return cy.get(`[data-testid="product-item-${productId}"]`);
  }
  
  findProductByName(name) {
      return cy.contains('[data-testid^="product-item-"]', name);
  }

  clickEditButtonOnRow(productId) {
    this.getProductRow(productId).find(`[data-testid="btn-edit-${productId}"]`).click();
  }

  clickDeleteButtonOnRow(productId) {
    this.getProductRow(productId).find(`[data-testid="btn-delete-${productId}"]`).click();
  }
}

export default new ProductPage();
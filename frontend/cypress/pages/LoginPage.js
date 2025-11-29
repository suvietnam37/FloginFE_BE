// frontend/cypress/pages/LoginPage.js
class LoginPage {
  
  visit() {
    cy.visit('/login');
  }

  getUsernameInput() {
    return cy.get('[data-testid="username-input"]');
  }

  getPasswordInput() {
    return cy.get('[data-testid="password-input"]');
  }

  getLoginButton() {
    return cy.get('[data-testid="login-button"]');
  }

  getApiErrorMessage() {
    return cy.get('[data-testid="login-message"]');
  }

  getValidationErrorMessage() {
    // Giả sử bạn có data-testid cho lỗi validation, ví dụ:
    return cy.get('[data-testid="username-error"]');
  }

  // Phương thức tổng hợp các hành động
  login(username, password) {
    if (username) this.getUsernameInput().clear().type(username);
    if (password) this.getPasswordInput().clear().type(password);
    this.getLoginButton().click();
  }
}

export default new LoginPage();
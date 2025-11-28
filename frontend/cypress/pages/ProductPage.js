// frontend/cypress/pages/LoginPage.js

class LoginPage {
  // Các phương thức để lấy element
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
    if (username) {
      this.getUsernameInput().type(username);
    }
    if (password) {
      this.getPasswordInput().type(password);
    }
    this.getLoginButton().click();
  }
}

export default new LoginPage();
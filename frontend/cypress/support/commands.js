// TRONG FILE: frontend/cypress/support/commands.js
Cypress.Commands.add("saveLocalStorage", () => {
    cy.getLocalStorage("token").then(token => {
        cy.writeFile('cypress/fixtures/token.json', { token });
    });
});

Cypress.Commands.add("restoreLocalStorage", () => {
    cy.readFile('cypress/fixtures/token.json').then(data => {
        cy.setLocalStorage("token", data.token);
    });
});
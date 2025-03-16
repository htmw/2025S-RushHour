describe("Login Page", () => {
  let baseUrl = Cypress.config("baseUrl"); // Get base URL dynamically
  console.log({ baseUrl });
  it("should load the login page", () => {
    cy.visit(`${baseUrl}/login`);
    cy.get("[data-cy=login-title]").should("be.visible");
  });

  it("should show error on invalid login", () => {
    cy.visit(`${baseUrl}/login`);
    cy.get("[data-cy=login-email]").type("invalid@example.com");
    cy.get("[data-cy=login-password]").type("wrongpassword");
    cy.get("[data-cy=login-button]").click();
    cy.get("[data-cy=login-error]").should("be.visible");
  });

  it("should login successfully with valid credentials", () => {
    cy.visit(`${baseUrl}/login`);
    cy.get("[data-cy=login-email]").type("test@example.com");
    cy.get("[data-cy=login-password]").type("correctpassword");
    cy.get("[data-cy=login-button]").click();
    cy.wait(500);
    // Ensure successful login and redirection
    cy.url().should("include", "/onBoarding");
    cy.get("[data-cy=Choose-Your-Role]").should("be.visible");
  });
});

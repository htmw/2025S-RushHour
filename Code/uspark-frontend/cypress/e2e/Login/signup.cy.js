describe("Signup Page", () => {
  let baseUrl = Cypress.config("baseUrl"); // Get base URL dynamically
  let testEmail = `newuser_${Date.now()}@example.com`; // Unique email for each run
  let testPassword = "ValidPassword123";

  it("should load the signup page", () => {
    cy.visit(`${baseUrl}/signup`);
    cy.get("[data-cy=signup-title]").should("be.visible");
  });

  it("should show error when passwords do not match", () => {
    cy.visit(`${baseUrl}/signup`);
    cy.get("[data-cy=signup-name]").type("New User");
    cy.get("[data-cy=signup-email]").type(testEmail);
    cy.get("[data-cy=signup-password]").type("password123");
    cy.get("[data-cy=signup-confirm-password]").type("password321");
    cy.get("[data-cy=signup-button]").click();
    cy.get("[data-cy=signup-error]")
      .should("be.visible")
      .and("contain", "Passwords do not match");
  });

  it("should register successfully with valid details", () => {
    cy.visit(`${baseUrl}/signup`);
    cy.get("[data-cy=signup-name]").type("New User");
    cy.get("[data-cy=signup-email]").type(testEmail);
    cy.get("[data-cy=signup-password]").type(testPassword);
    cy.get("[data-cy=signup-confirm-password]").type(testPassword);
    cy.get("[data-cy=signup-button]").click();
    cy.wait(500);
    // Ensure redirection to onboarding or dashboard
    cy.url().should("include", "/onBoarding");
  });

  it("should require all fields to be filled", () => {
    cy.visit(`${baseUrl}/signup`);
    cy.get("[data-cy=signup-button]").click();

    // Wait for UI updates
    cy.wait(500);

    // Ensure error message appears
    cy.get("[data-cy=signup-error]")
      .should("be.visible")
      .and("contain", "Name is required")
      .and("contain", "Email is required")
      .and("contain", "Password is required")
      .and("contain", "Confirm Password is required");
  });

  it("should initiate Google signup on button click", () => {
    cy.visit(`${baseUrl}/signup`);
    cy.contains("Sign up with Google").click();
    // Assuming redirection to Google OAuth - This might need mocking
  });

  it("should initiate Apple signup on button click", () => {
    cy.visit(`${baseUrl}/signup`);
    cy.contains("Sign up with Apple").click();
    // Assuming redirection to Apple OAuth - This might need mocking
  });
});

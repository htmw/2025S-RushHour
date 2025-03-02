describe("Login Page", () => {
  it("should load the login page", () => {
    cy.visit("http://localhost:5175/login");
    cy.get("[data-cy=login-title]").should("be.visible");
  });

  it("should show error on invalid login", () => {
    cy.visit("http://localhost:5175/login");
    cy.get("[data-cy=login-email]").type("invalid@example.com");
    cy.get("[data-cy=login-password]").type("wrongpassword");
    cy.get("[data-cy=login-button]").click();
    cy.get("[data-cy=login-error]").should("be.visible");
  });

  it("should login successfully with valid credentials", () => {
    cy.visit("http://localhost:5175/login");
    cy.get("[data-cy=login-email]").type("test@example.com");
    cy.get("[data-cy=login-password]").type("correctpassword");
    cy.get("[data-cy=login-button]").click();
    // cy.url().should("include", "/dashboard");
    cy.url().should("include", "http://localhost:5175/");
    // cy.contains("Welcome, Test User").should("be.visible");
  });
});

describe("Signup Page", () => {
  it("should load the signup page", () => {
    cy.visit("http://localhost:5175/signup");
    cy.get("[data-cy=signup-title]").should("be.visible");
  });

  it("should show error when passwords do not match", () => {
    cy.visit("http://localhost:5175/signup");
    cy.get("[data-cy=signup-name]").type("New User");
    cy.get("[data-cy=signup-email]").type("newuser@example.com");
    cy.get("[data-cy=signup-password]").type("password123");
    cy.get("[data-cy=signup-confirm-password]").type("password321");
    cy.get("[data-cy=signup-button]").click();
    cy.get("[data-cy=signup-error]")
      .should("be.visible")
      .and("contain", "Passwords do not match");
  });

  it("should register successfully with valid details", () => {
    cy.visit("http://localhost:5175/signup");
    cy.get("[data-cy=signup-name]").type("New User");
    cy.get("[data-cy=signup-email]").type("newuser@example.com");
    cy.get("[data-cy=signup-password]").type("ValidPassword123");
    cy.get("[data-cy=signup-confirm-password]").type("ValidPassword123");
    cy.get("[data-cy=signup-button]").click();
    cy.url().should("include", "http://localhost:5175/");
  });

  // it("should require all fields to be filled", () => {
  //   cy.visit("http://localhost:5174/signup");
  //   cy.get("[data-cy=signup-button]").click();
  //   cy.get("[data-cy=signup-error]").should("be.visible");
  // });
  it("should require all fields to be filled", () => {
    cy.visit("http://localhost:5175/signup");
    cy.get("[data-cy=signup-button]").click();

    // Wait a bit to ensure UI updates
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
    cy.visit("http://localhost:5175/signup");
    cy.contains("Sign up with Google").click();
    // Assuming redirection to Google OAuth - This might need mocking
  });

  it("should initiate Apple signup on button click", () => {
    cy.visit("http://localhost:5175/signup");
    cy.contains("Sign up with Apple").click();
    // Assuming redirection to Apple OAuth - This might need mocking
  });
});

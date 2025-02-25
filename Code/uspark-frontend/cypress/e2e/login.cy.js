describe("Login Page", () => {
  it("should load the login page", () => {
    cy.visit("/login");
    cy.contains("Login to Your Account").should("be.visible");
  });

  it("should show error on invalid login", () => {
    cy.visit("/login");

    cy.get("input[name='email']").type("invaliduser@example.com");
    cy.get("input[name='password']").type("wrongpassword");
    cy.get("button[type='submit']").click();
    cy.contains("Invalid email or password").should("be.visible");
  });

  it("should login successfully with valid credentials", () => {
    cy.visit("/login");

    cy.get("input[name='email']").type("testuser@example.com");
    cy.get("input[name='password']").type("correctpassword");
    cy.get("button[type='submit']").click();

    cy.url().should("include", "/dashboard");
    cy.contains("Welcome, Test User").should("be.visible");
  });
});

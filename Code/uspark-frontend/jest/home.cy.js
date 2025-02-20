describe("Home Page", () => {
  it("should load the homepage", () => {
    cy.visit("/");

    cy.contains("Welcome").should("be.visible");
  });

  it("should navigate to the login page", () => {
    cy.visit("/");

    cy.get("a[href='/login']").click();
    cy.url().should("include", "/login");
  });

  it("should perform login", () => {
    cy.visit("/login");

    cy.get("input[name='email']").type("testuser@example.com");
    cy.get("input[name='password']").type("password123");
    cy.get("button[type='submit']").click();

    cy.url().should("include", "/dashboard");
    cy.contains("Welcome, Test User").should("be.visible");
  });
});

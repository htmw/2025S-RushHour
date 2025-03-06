describe("Patient Onboarding Flow", () => {
  let baseUrl = Cypress.config("baseUrl"); // Get base URL dynamically
  let testEmail = `testuser_${Date.now()}@example.com`; // Unique email for each run
  let testPassword = "Test@1234";

  it("should signup a new user and should complete patient onBoarding", () => {
    cy.visit(`${baseUrl}/signup`);

    cy.get("[data-cy=signup-name]").type("Test User");
    cy.get("[data-cy=signup-email]").type(testEmail);
    cy.get("[data-cy=signup-password]").type(testPassword);
    cy.get("[data-cy=signup-confirm-password]").type(testPassword);
    cy.get("[data-cy=signup-button]").click();
    // Ensure we're redirected to the onBoarding screen
    cy.url().should("include", "/onBoarding");

    // Select patient role
    cy.get("[data-cy=role-select-patient]").click();
    cy.wait(1000);
    // Fill in patient details
    cy.get("[data-cy=onBoarding-name]").type("John Doe");
    cy.get("[data-cy=onBoarding-age]").type("25");
    cy.get("[data-cy=onBoarding-sex]").click(); // Open dropdown
    cy.get("li[data-value='male']").click(); // Select 'male'
    cy.get("[data-cy=onBoarding-height]").type("175");
    cy.get("[data-cy=onBoarding-weight]").type("70");
    cy.get("[data-cy=onBoarding-healthIssues]").type("No health issues");

    // Submit the onBoarding form
    cy.get("[data-cy=onBoarding-submit]").click();
    cy.wait(500);
    // Verify that the user is redirected to the dashboard
    cy.url().should("include", "/dashboard");
    cy.get("[data-cy=dashboard-welcome]").should("be.visible");
  });

  it("should redirect unauthenticated users to login when accessing onBoarding", () => {
    cy.visit(`${baseUrl}/onBoarding`);
    cy.url().should("include", "/login"); // Ensure redirect
  });

  it("should login an existing onboarded user and go directly to the dashboard", () => {
    cy.visit(`${baseUrl}/login`);

    cy.get("[data-cy=login-email]").type(testEmail);
    cy.get("[data-cy=login-password]").type(testPassword);
    cy.get("[data-cy=login-button]").click();
    cy.wait(500);
    // After login, if already onboarded, should go to dashboard
    cy.url().should("include", "/dashboard");
    cy.get("[data-cy=dashboard-welcome]").should("be.visible");
  });
});

describe("Patient Onboarding Flow", () => {
  let baseUrl = Cypress.config("baseUrl"); // Get base URL dynamically
  let testEmail = `testuser_${Date.now()}@example.com`; // Unique email for each run
  let testPassword = "Test@1234";

  it("should signup a new user and complete patient onboarding", () => {
    cy.visit(`${baseUrl}/signup`);

    // Fill signup form
    cy.get("[data-cy=signup-name]").type("Test User");
    cy.get("[data-cy=signup-email]").type(testEmail);
    cy.get("[data-cy=signup-password]").type(testPassword);
    cy.get("[data-cy=signup-confirm-password]").type(testPassword);
    cy.get("[data-cy=signup-button]").click();

    // Ensure we're redirected to the onboarding screen
    cy.url().should("include", "/onBoarding");

    // Select patient role
    cy.get("[data-cy=role-select-patient]").click();
    cy.wait(1000);

    // Fill in patient details
    cy.get("[data-cy=onBoarding-name]").type("John Doe");
    cy.get("[data-cy=onBoarding-age]").type("25");

    // Select gender
    cy.get("[data-cy=onBoarding-sex]").click();
    cy.get("li[data-value='male']").click();

    // Enter height & weight
    cy.get("[data-cy=onBoarding-height]").type("175");
    cy.get("[data-cy=onBoarding-weight]").type("70");

    // **Handle Autocomplete (Health Issues)**
    cy.get("[data-cy=onBoarding-healthIssues]").click().type("Diabetes");
    cy.wait(1000); // Ensure the dropdown appears
    cy.get("li").contains("Diabetes").click(); // Select "Diabetes"

    cy.get("[data-cy=onBoarding-healthIssues]").click().type("Hypertension");
    cy.wait(1000);
    cy.get("li").contains("Hypertension").click(); // Select "Hypertension"

    // **Check that selected issues appear inside Autocomplete as chips using unique data-cy**
    cy.get("[data-cy=onBoarding-healthIssues-Diabetes]").should("be.visible");
    cy.get("[data-cy=onBoarding-healthIssues-Hypertension]").should(
      "be.visible"
    );

    // Submit the onboarding form
    cy.get("[data-cy=onBoarding-submit]").click();

    // Verify that the user is redirected to the dashboard
    cy.url({ timeout: 10000 }).should("include", "/dashboard"); // Increased timeout for slow navigation
    cy.get("[data-cy=dashboard-welcome]").should("be.visible");
  });

  it("should redirect unauthenticated users to login when accessing onboarding", () => {
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
    cy.url({ timeout: 10000 }).should("include", "/dashboard");
    cy.get("[data-cy=dashboard-welcome]").should("be.visible");
  });
});

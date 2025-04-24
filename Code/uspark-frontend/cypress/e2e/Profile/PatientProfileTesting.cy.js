describe("Patient Profile Page Flow", () => {
  let baseUrl = Cypress.config("baseUrl");
  let testEmail = `testuser_${Date.now()}@example.com`;
  let testPassword = "Test@1234";

  it("should complete onboarding and visit profile to upload image and update data", () => {
    cy.visit(`${baseUrl}/signup`);

    // Signup
    cy.get("[data-cy=signup-name]").type("Test User");
    cy.get("[data-cy=signup-email]").type(testEmail);
    cy.get("[data-cy=signup-password]").type(testPassword);
    cy.get("[data-cy=signup-confirm-password]").type(testPassword);
    cy.get("[data-cy=signup-button]").click();

    // Select Role (Patient)
    cy.url().should("include", "/onBoarding");
    cy.get("[data-cy=role-select-patient]").click();
    cy.wait(1000);

    // Onboarding Details
    cy.get("[data-cy=onBoarding-name]").type("Test User");
    cy.get("[data-cy=onBoarding-age]").type("29");
    cy.get("[data-cy=onBoarding-sex]").click();
    cy.get("li[data-value='male']").click();
    cy.get("[data-cy=onBoarding-height]").type("175");
    cy.get("[data-cy=onBoarding-weight]").type("70");
    cy.get("[data-cy=onBoarding-healthIssues]").click().type("Diabetes");
    cy.wait(1000);
    cy.get("li").contains("Diabetes").click();

    // Submit Onboarding
    cy.get("[data-cy=onBoarding-submit]").click();

    // Redirected to Dashboard
    cy.url({ timeout: 10000 }).should("include", "/dashboard");

    // Go to Profile
    cy.visit(`${baseUrl}/profile`);

    // Upload Profile Image
    cy.get("[data-cy=edit-profile-image-button]").click();
    cy.get("[data-cy=profile-image-input]").selectFile(
      "cypress/fixtures/test-user.png",
      {
        force: true,
      }
    );
    cy.get("[data-cy=upload-image-button]").click();

    // Update Profile Info
    cy.get("[data-cy=patient-age]").clear().type("30");
    cy.get("[data-cy=patient-height]").clear().type("180");
    cy.get("[data-cy=patient-weight]").clear().type("75");

    cy.get("[data-cy=patient-save]").click();

    // Insurance Update
    cy.get("[data-cy=insurance-provider]").clear().type("Cigna");
    cy.get("[data-cy=insurance-start-date]").type("2024-01-01");
    cy.get("[data-cy=insurance-end-date]").type("2025-01-01");
    cy.get("[data-cy=insurance-holder]").clear().type("Test User");
    cy.get("[data-cy=save-insurance-button]").click();
  });
});

describe("Doctor Profile Page Flow", () => {
  const baseUrl = Cypress.config("baseUrl");
  const testEmail = `doctoruser_${Date.now()}@example.com`;
  const testPassword = "Test@1234";

  it("should signup, onboard as doctor, upload profile image, update details, and upload verification docs", () => {
    cy.visit(`${baseUrl}/signup`);

    // Signup
    cy.get("[data-cy=signup-name]").type("Dr. Test User");
    cy.get("[data-cy=signup-email]").type(testEmail);
    cy.get("[data-cy=signup-password]").type(testPassword);
    cy.get("[data-cy=signup-confirm-password]").type(testPassword);
    cy.get("[data-cy=signup-button]").click();

    // Select Role (Doctor)
    cy.url().should("include", "/onBoarding");
    cy.get("[data-cy=role-select-doctor]").click();

    // Fill onboarding fields
    cy.get("[data-cy=onBoarding-name]").type("Dr. Test User");
    cy.get("[data-cy=onBoarding-specialization]").type("Cardiology");
    cy.get("[data-cy=onBoarding-experience]").type("5");
    cy.get("[data-cy=onBoarding-certifications]").type("MD, PhD");
    cy.get("[data-cy=onBoarding-submit]").click();

    // Land on dashboard
    cy.url({ timeout: 10000 }).should("include", "/dashboard");

    // Go to profile
    cy.visit(`${baseUrl}/profile`);

    // Upload profile image
    cy.get("[data-cy=edit-profile-image-button]").click();
    cy.get("[data-cy=profile-image-input]").selectFile(
      "cypress/fixtures/test-user.png",
      {
        force: true,
      }
    );
    cy.get("[data-cy=upload-image-button]").click();

    // Update profile fields
    cy.get("[data-cy=doctor-fullName]").clear().type("Dr. Updated Name");
    cy.get("[data-cy=doctor-specialization]").clear().type("Neurology");
    cy.get("[data-cy=doctor-experience]").clear().type("7");
    cy.get("[data-cy=doctor-certifications]").clear().type("MBBS, MD");

    cy.get("[data-cy=doctor-save]").click();

    // Upload verification documents
    cy.get("[data-cy=doctor-verify-button]").click();
    cy.get("[data-cy=doctor-verification-file]").selectFile(
      "cypress/fixtures/test-verification.pdf",
      {
        force: true,
      }
    );
    cy.get("[data-cy=doctor-verification-upload]").click();
  });
});

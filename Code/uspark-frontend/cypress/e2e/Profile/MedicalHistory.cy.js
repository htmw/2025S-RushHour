describe("Medical History Page", () => {
  const baseUrl = Cypress.config("baseUrl");
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = "Test@1234";

  it("should allow patient to onboard, add, edit, and verify medical history with file upload", () => {
    cy.visit(`${baseUrl}/signup`);

    // Signup
    cy.get("[data-cy=signup-name]").type("Test User");
    cy.get("[data-cy=signup-email]").type(testEmail);
    cy.get("[data-cy=signup-password]").type(testPassword);
    cy.get("[data-cy=signup-confirm-password]").type(testPassword);
    cy.get("[data-cy=signup-button]").click();

    // Onboarding
    cy.url().should("include", "/onBoarding");
    cy.get("[data-cy=role-select-patient]").click();
    cy.get("[data-cy=onBoarding-name]").type("Test User");
    cy.get("[data-cy=onBoarding-age]").type("29");
    cy.get("[data-cy=onBoarding-sex]").click();
    cy.get("li[data-value='male']").click();
    cy.get("[data-cy=onBoarding-height]").type("175");
    cy.get("[data-cy=onBoarding-weight]").type("70");
    cy.get("[data-cy=onBoarding-healthIssues]").click().type("Cold");
    cy.contains("Cold").click();
    cy.get("[data-cy=onBoarding-submit]").click();

    cy.url({ timeout: 10000 }).should("include", "/dashboard");
    cy.get("[data-cy=header-Profile]").click();

    // Go to profile (or scroll to Medical History)
    cy.get("[data-cy=Medical-History]").scrollIntoView().should("be.visible");
    cy.get("[data-cy=Add-Medical-History]").click();

    // Fill the form
    cy.get("[data-cy=medical-healthIssue]").type("Headache");
    cy.get("[data-cy=medical-dateOfOccurrence]").type("2025-04-05");
    cy.get("[data-cy=medical-status]").first().click(); // clicks first one
    cy.contains("Resolved").click();

    cy.contains("Ongoing").click();
    cy.get("[data-cy=medical-treatmentGiven]").type("Paracetamol");

    // Upload file
    cy.get("[data-cy=medical-file-upload]").selectFile(
      "cypress/fixtures/test-verification.pdf",
      { force: true }
    );
    cy.wait(1500); // wait for upload

    // Save the entry
    cy.get("[data-cy=medical-save-button]").click();

    // ✅ Check if listed
    cy.contains("Headache").should("exist");
    cy.contains("Paracetamol").should("exist");
  });
});

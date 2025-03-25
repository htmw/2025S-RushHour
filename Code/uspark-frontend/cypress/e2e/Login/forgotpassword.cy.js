describe("Forgot Password & Reset Password Flow", () => {
  let baseUrl = Cypress.config("baseUrl"); // Get base URL dynamically
  let testEmail = "testuser@example.com";
  let newPassword = "NewPass@1234";

  it("should request a password reset link", () => {
    cy.visit(`${baseUrl}/forgot-password`);

    // Enter email and submit
    cy.get("[data-cy=forgotPassword-email]").type(testEmail);
    cy.intercept("POST", "**/api/auth/forgot-password").as(
      "forgotPasswordRequest"
    );
    cy.get("[data-cy=forgotPassword-submit]").click();

    // Wait for API response
    cy.wait("@forgotPasswordRequest")
      .its("response.statusCode")
      .should("eq", 200);

    // Verify UI feedback
    cy.contains("Check your email for a password reset link").should(
      "be.visible"
    );
  });

  it("should reset the password successfully", () => {
    cy.visit(`${baseUrl}/reset-password?token=mockResetToken`);

    // Enter new password and confirm password
    cy.get("[data-cy=resetPassword-new]").type(newPassword);
    cy.get("[data-cy=resetPassword-confirm]").type(newPassword);

    cy.intercept("POST", "**/api/auth/reset-password").as(
      "resetPasswordRequest"
    );
    cy.get("[data-cy=resetPassword-submit]").click();

    // Wait for API response
    cy.wait("@resetPasswordRequest")
      .its("response.statusCode")
      .should("eq", 200);

    // Verify UI redirection after reset
    cy.url().should("include", "/login");
    cy.contains("Password reset successful. Please log in.").should(
      "be.visible"
    );
  });
});

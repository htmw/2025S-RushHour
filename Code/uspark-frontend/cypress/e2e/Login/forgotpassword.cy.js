describe("Forgot Password & Reset Password Flow", () => {
  const baseUrl = Cypress.config("baseUrl");
  const testEmail = "testuser@example.com";
  const newPassword = "NewPass@1234";

  it("should request a password reset link", () => {
    cy.visit(`${baseUrl}/forgot-password`);

    cy.intercept("POST", "**/api/auth/forgot-password", {
      statusCode: 200,
      body: { message: "Password reset email sent" }, // ✅ Simulate API message
    }).as("forgotPasswordRequest");

    cy.get('input[name="email"]').type(testEmail);
    cy.get('button[type="submit"]')
      .contains(/send reset link/i)
      .click();

    cy.wait(3000);

    // ✅ Assert the message from API is displayed in green text
    cy.contains("Password reset email sent")
      .should("be.visible")
      .and("have.css", "color", "rgb(46, 125, 50)"); // optional exact match for green

    // ✅ Optional: Wait 31 seconds and verify the message disappears
    cy.wait(31000); // simulate passing of countdown
    cy.contains("Password reset email sent").should("not.exist");
  });

  it("should reset the password successfully", () => {
    const token = "mockResetToken";
    cy.visit(`${baseUrl}/reset-password?token=${token}&email=${testEmail}`);

    cy.get("[data-cy=resetPassword-new]").type(newPassword);
    cy.get("[data-cy=resetPassword-confirm]").type(newPassword);

    cy.intercept("POST", "**/api/auth/reset-password", {
      statusCode: 200,
      body: { message: "Password reset successful" },
    }).as("resetPasswordRequest");

    cy.get("[data-cy=resetPassword-submit]").click();
    cy.wait(3000);
    cy.url().should("include", "/forgot-password");
  });
});

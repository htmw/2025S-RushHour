describe("Doctor Onboarding Flow", () => {
    let baseUrl = Cypress.config("baseUrl");
    let doctorEmail = `doctor_${Date.now()}@example.com`;
    let doctorPassword = "Test@1234";

    it("should signup a new user and complete doctor onboarding", () => {
        cy.visit(`${baseUrl}/signup`);

        // Sign up
        cy.get("[data-cy=signup-name]").type("Dr. Who");
        cy.get("[data-cy=signup-email]").type(doctorEmail);
        cy.get("[data-cy=signup-password]").type(doctorPassword);
        cy.get("[data-cy=signup-confirm-password]").type(doctorPassword);
        cy.get("[data-cy=signup-button]").click();

        // Role selection
        cy.url().should("include", "/onBoarding");
        cy.get("[data-cy=role-select-doctor]").click();

        // Fill onboarding form
        cy.get("[name=name]").clear().type("Dr. Who");
        cy.get("[name=specialization]").type("Cardiology");
        cy.get("[name=experience]").type("12");
        cy.get("[name=certifications]").type("MBBS, MD");

        // Wait for hospitals to load and choose "Other"
        cy.wait(2000);
        cy.get("input[placeholder='Select or Search Hospital']").type("Other{enter}");
        cy.get("input").contains("Hospital/Clinic Address").parent().find("input").type("123 Test Lane");

        // Upload a verification document
        const filePath = "files/sample.pdf";
        cy.get("input[type='file']").selectFile(filePath, { force: true });

        // Submit the form
        cy.get("button").contains("Submit").click();

        // Wait for navigation to dashboard
        cy.url({ timeout: 10000 }).should("include", "/dashboard");

        // ✅ Updated assertion based on dashboard component
        cy.get("[data-cy=doctor-dashboard-name]").should("contain", "Dr. Who");
    });
});

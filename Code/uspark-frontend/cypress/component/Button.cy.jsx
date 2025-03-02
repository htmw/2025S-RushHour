import React from "react";
import { mount } from "cypress/react";
import Button from "../../src/components/Button"; // Adjust path as needed

describe("Button Component", () => {
  it("renders correctly", () => {
    mount(<Button>Click Me</Button>);
    cy.get("button").should("contain", "Click Me");
  });

  it("triggers click event", () => {
    const onClick = cy.stub();
    mount(<Button onClick={onClick}>Click Me</Button>);
    cy.get("button").click();
    cy.wrap(onClick).should("have.been.calledOnce");
  });
});

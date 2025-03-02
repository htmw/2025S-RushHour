import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from "./Components/Button";

describe("Button Component", () => {
  test("renders with provided text", () => {
    render(<Button label="Click Me" />);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  test("handles click event", () => {
    const handleClick = jest.fn();
    render(<Button label="Click Me" onClick={handleClick} />);

    fireEvent.click(screen.getByText("Click Me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

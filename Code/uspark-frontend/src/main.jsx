/**
 * @fileoverview Entry point for the React application.
 * Initializes and renders the root component inside the "root" DOM element.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

/**
 * Renders the main application inside the root element.
 * Uses React's StrictMode to highlight potential problems.
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

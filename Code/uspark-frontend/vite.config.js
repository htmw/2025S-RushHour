import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    outDir: mode === "staging" ? "staging" : "dist",
  },
  server: {
    historyApiFallback: true, // Ensures routes work after refresh
  },
  base: "/",
}));

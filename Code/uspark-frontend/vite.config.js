import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE");
  console.log(env);
  return {
    plugins: [react()],
    define: {
      "import.meta.env": JSON.stringify(env), // Expose only VITE_ variables
    },
    build: {
      outDir: mode === "staging" ? "staging" : "dist",
    },
    server: {
      historyApiFallback: true, // Ensures routes work after refresh
    },
    base: "/",
  };
});

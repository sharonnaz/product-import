import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue"; // Vue plugin for Vite

// Vite config for your Vue application
export default defineConfig({
  plugins: [vue()], // Vite plugin for Vue support
  resolve: {
    alias: {
      // Alias '@' to the 'src' directory for easier imports
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000", // Target Laravel backend
        changeOrigin: true, // For CORS issues with local server
        secure: false, // Disable SSL if running locally without SSL
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    },
  },
});

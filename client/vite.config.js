import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
/// <reference types="vitest" />
/// <reference types="vite/client" />

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5500,
  },
  esbuild: {
    jsxInject: "import React from 'react'",
  },
  test: {
    // 👋 line to add jsdom to vite
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/setup.js",
    css: true,
    // reporters: ["html"],
  },
});

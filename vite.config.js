import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import process from "node:process";

const DEFAULT_BASEURL = "https://open-api.delcom.org/api/v1";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Prefix "" => semua variabel di .env ikut dimuat (APP_PORT, DELCOM_BASEURL)
  const env = loadEnv(mode, process.cwd(), "");
  const port = Number(env.APP_PORT) || 3000;

  return {
    plugins: [react(), tailwindcss()],
    server: { port },
    preview: { port },
    define: {
      // Konstanta global yang dipakai di src/helpers/apiHelper.js
      DELCOM_BASEURL: JSON.stringify(env.DELCOM_BASEURL || DEFAULT_BASEURL),
    },
    build: {
      target: "esnext",
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.js",
      css: false,
      coverage: {
        provider: "v8",
        reporter: ["text", "html", "lcov"],
        include: ["src/**/*.{js,jsx}"],
        exclude: [
          "src/main.jsx",
          "src/setupTests.js",
          "src/test-utils.jsx",
          "src/**/*.test.{js,jsx}",
        ],
        thresholds: {
          statements: 90,
          branches: 85,
          functions: 90,
          lines: 90,
        },
      },
    },
  };
});
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import process from "node:process";
import zlib from "node:zlib";

const DEFAULT_BASEURL = "https://open-api.delcom.org/api/v1";

// Mengubah link CSS menjadi non-render-blocking dengan rel="preload" & media="print" onload="this.media='all'"
const nonBlockingCss = () => ({
  name: "non-blocking-css",
  apply: "build",
  enforce: "post",
  transformIndexHtml(html) {
    return html.replace(
      /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/g,
      '<link rel="preload" as="style" href="$1"><link rel="stylesheet" href="$1" media="print" onload="this.media=\'all\'"><noscript><link rel="stylesheet" href="$1"></noscript>'
    );
  },
});

// Menghasilkan versi terkompresi .gz dan .br untuk seluruh file static
const precompress = () => ({
  name: "precompress",
  apply: "build",
  enforce: "post",
  generateBundle(_, bundle) {
    for (const [name, chunk] of Object.entries(bundle)) {
      if (
        name.endsWith(".js") ||
        name.endsWith(".css") ||
        name.endsWith(".html") ||
        name.endsWith(".svg")
      ) {
        const content = chunk.type === "asset" ? chunk.source : chunk.code;
        if (!content) continue;
        const buffer = Buffer.from(content);
        this.emitFile({
          type: "asset",
          fileName: `${name}.gz`,
          source: zlib.gzipSync(buffer, { level: 9 }),
        });
        this.emitFile({
          type: "asset",
          fileName: `${name}.br`,
          source: zlib.brotliCompressSync(buffer),
        });
      }
    }
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const port = Number(env.APP_PORT) || 3000;

  return {
    plugins: [react(), tailwindcss(), nonBlockingCss(), precompress()],
    server: { port },
    preview: { port },
    define: {
      DELCOM_BASEURL: JSON.stringify(env.DELCOM_BASEURL || DEFAULT_BASEURL),
    },
    build: {
      target: "esnext",
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react-dom") || id.includes("/react/")) {
                return "vendor-react";
              }
              if (id.includes("react-router-dom") || id.includes("@remix-run")) {
                return "vendor-router";
              }
              if (id.includes("@reduxjs") || id.includes("react-redux")) {
                return "vendor-redux";
              }
              if (id.includes("@tabler")) {
                return "vendor-icons";
              }
            }
          },
        },
      },
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
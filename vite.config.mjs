import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // wrangler.jsonc serves ./build as the site's static assets.
  build: { outDir: "build" },
  server: { port: 3000 },
  test: { globals: true, environment: "node" },
});

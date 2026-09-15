import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
const file = (name) => fileURLToPath(new URL(name, import.meta.url));
export default defineConfig({
  plugins: [
    {
      name: "isolated-browser-test-services",
      enforce: "pre",
      resolveId(source) {
        if (
          /\/context\/AuthContext(?:\.jsx)?$/.test(source) ||
          /\/firebaseConfig(?:\.js)?$/.test(source)
        )
          return file("./mockAuth.jsx");
        if (/\/services\/resumeService(?:\.js)?$/.test(source))
          return file("./mockResumeService.js");
      },
    },
    react(),
  ],
  server: { host: "127.0.0.1", port: 5180, strictPort: true },
});

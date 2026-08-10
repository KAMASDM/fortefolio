import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    maxWorkers: 1,
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      reporter: ["text", "html"],
    },
  },
});

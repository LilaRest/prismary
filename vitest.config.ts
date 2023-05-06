import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: [
      "tests/utils/index.ts"
    ]
  },
});
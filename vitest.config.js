import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['script-utils.js', 'script.js', 'talk-detail.js'],
      exclude: ['tests/**', 'node_modules/**']
    }
  }
});

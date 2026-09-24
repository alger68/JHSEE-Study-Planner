import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Notes use node:test and run separately in the Pages workflow.
    // Keep all existing planner suites in this Vitest pass.
    include: ['tests/**/*.test.js'],
    environment: 'jsdom'
  }
});

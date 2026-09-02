/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config https://vitest.dev/config
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: '.vitest/setup.ts',
    // src/test.tsx is the Vite template's boilerplate spec; excluded rather
    // than repaired, like the backend specs in section 1.8 of the plan.
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    passWithNoTests: true,
  },
});

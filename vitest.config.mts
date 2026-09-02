import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

// Only the suites that currently pass. The rest reference code that moved in
// the 2024 monolith split - see section 1.8 of the revival plan.
export default defineConfig({
  plugins: [swc.vite({ module: { type: 'es6' } })],
  test: {
    globals: true,
    environment: 'node',
    root: '.',
    include: [
      'apps/backend/communication/src/app/app.controller.spec.ts',
      'apps/backend/communication/src/app/app.service.spec.ts',
      'apps/backend/communication/src/app/test/test.service.spec.ts',
      'apps/backend/entity-service/src/app/app.service.spec.ts',
      'apps/backend/entity-service/src/app/notification/test/notification.controller.spec.ts',
      'apps/backend/entity-service/src/app/notification/test/notification.service.spec.ts',
    ],
  },
  resolve: {
    alias: { 'tasktime-utils': new URL('./packages/utils/src', import.meta.url).pathname },
  },
});

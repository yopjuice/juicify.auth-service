import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';
import { resolve } from 'node:path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.e2e-spec.ts'], 
    setupFiles: [resolve(__dirname, '../vitest.setup.ts')],
  },
  plugins: [swc.vite()],
});

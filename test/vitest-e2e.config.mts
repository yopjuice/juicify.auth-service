import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.e2e-spec.ts'], 
    setupFiles: ['../vitest.setup.ts'],
  },
  plugins: [swc.vite()],
});

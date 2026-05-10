import { defineConfig } from 'vitest/config';
import * as path from 'path';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^~\/assets\/svg\/.*\.svg\?react$/,
        replacement: path.resolve(
          __dirname,
          './src/__tests__/mocks/svg-react.tsx'
        ),
      },
      {
        find: /^~\//,
        replacement: `${path.resolve(__dirname, './src')}/`,
      },
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/__tests__/**',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        '**/index.ts',
        '**/index.tsx',
        '**/*.d.ts',
        'src/mocks/**',
      ],
    },
  },
});

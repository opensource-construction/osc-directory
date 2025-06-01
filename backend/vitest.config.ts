import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      '@helpers': path.resolve(__dirname, './helpers'),
      '@scripts': path.resolve(__dirname, './scripts'),
      '@test': path.resolve(__dirname, './test'),
      '@utils': path.resolve(__dirname, './utils'),
      '@data': path.resolve(__dirname, './data'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
});
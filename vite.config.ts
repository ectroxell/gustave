import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    outDir: 'dist/client',
  },
  server: {
    port: 3030,
    proxy: {
      '/api': 'http://localhost:3031',
      '/api-docs': 'http://localhost:3031',
    },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'client',
          environment: 'happy-dom',
          include: ['src/client/**/*.test.{ts,tsx}'],
          setupFiles: ['src/client/test/setup.ts'],
          globals: true,
        },
      },
      {
        test: {
          name: 'server',
          environment: 'node',
          include: ['src/server/**/*.test.ts', 'src/db/**/*.test.ts'],
          setupFiles: ['src/server/test/setup.ts'],
          globals: true,
        },
      },
    ],
  },
});

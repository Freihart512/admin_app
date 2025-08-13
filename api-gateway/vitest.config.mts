import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    environment: 'node',
    coverage: {
      provider: 'v8', // o 'istanbul'
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.spec.ts',
        'src/**/*.e2e-spec.ts',
        'src/main.ts',
        'src/**/__tests__/**',
        'src/**/index.ts',
        'src/**/*.module.ts',
        'src/**/*.dto.ts',
        'src/**/*.port.ts',
        'src/**/*types.ts',
        'src/infrastructure/**',
      ],
    },
  },
  plugins: [
    // Este plugin integra los path aliases de tu tsconfig.json con Vitest
    tsconfigPaths(),
  ],
});

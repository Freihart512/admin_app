import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';
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
        'src/**/index.ts', // Excluir archivos index que solo exportan
        'src/**/*.module.ts', // Excluir archivos de módulo de NestJS si no contienen lógica de negocio
        'src/**/*.dto.ts', // Excluir DTOs si son solo estructuras de datos
        'src/infrastructure/**', // Excluir infraestructura si se prueba por separado o se considera externa al dominio
      ],
      // thresholds: { // Opcional: establecer umbrales de cobertura
      //   global: {
      //     branches: 80,
      //     functions: 80,
      //     lines: 80,
      //     statements: 80,
      //   },
      // },
    },
  },
  plugins: [
    // Este plugin maneja la compilación de TypeScript con SWC para mayor velocidad
    // Asegúrate de tener swc instalado: pnpm add -D @swc/core @swc/cli unplugin-swc
    swc.vite({
      module: { type: 'es6' },
    }),
    // Este plugin integra los path aliases de tu tsconfig.json con Vitest
    // Asegúrate de tener vite-tsconfig-paths instalado: pnpm add -D vite-tsconfig-paths
    tsconfigPaths(),
  ],
});
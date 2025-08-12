// eslint.config.mjs
// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import boundaries from 'eslint-plugin-boundaries';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  // Ignora el propio config
  { ignores: ['eslint.config.mjs'] },

  // Recomendados de ESLint y TS
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  // Recomendado de Prettier (opcional, si lo usas)
  prettierRecommended,

  // Config base
  {
    plugins: { boundaries },
    languageOptions: {
      // Usa ESM si exportas `export default` (recomendado).
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        // Necesario para las reglas type-checked de @typescript-eslint
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      // Define tus “capas” para eslint-plugin-boundaries
      'boundaries/elements': [
        { type: 'shared', pattern: 'src/@shared/**' },
        { type: 'domain', pattern: 'src/domain/**' },
        { type: 'application', pattern: 'src/application/**' },
        { type: 'infrastructure', pattern: 'src/infrastructure/**' },
        { type: 'tests', pattern: 'src/__tests__/**' },
      ],
    },
    rules: {
      // TS/estilo
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'off',
      'no-console': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

      // Boundaries
      'boundaries/allowed-imports': [
        'error',
        {
          rules: [
            // Importaciones dentro de @shared
            { from: 'src/@shared/*', to: 'src/@shared/*', allow: true },

            // Desde fuera de @shared sólo permitir index.ts y types.ts
            {
              from: 'src/*',
              to: 'src/@shared/*',
              except: ['src/@shared/index.ts', 'src/@shared/core/types.ts'],
              allow: false,
            },

            // Dominio sólo accedido por application (no al revés)
            { from: 'src/domain', to: 'src/application' },

            // Application puede importar infraestructura
            { from: 'src/application', to: 'src/infrastructure' },

            // Tests no importan otras capas (ajusta si quieres)
            { from: 'src/__tests__', to: 'src/application', allow: false },
            { from: 'src/__tests__', to: 'src/infrastructure', allow: false },
          ],
        },
      ],
      'boundaries/explicit-barriers': [
        'error',
        { enforce: 'within-boundaries', allowSameDirectory: true },
      ],
      'boundaries/no-dependency-cycle': 'error',
    },
  },

  // ✅ Overrides: VAN COMO OBJETOS SEPARADOS (no dentro de `rules`)
  {
    files: ['**/__tests__/**/*.ts', '**/*.spec.ts', '**/*.test.ts'],
    rules: {
      'boundaries/explicit-barriers': 'off',
    },
  },
  {
    files: ['src/infrastructure/**/*'],
    rules: {
      'boundaries/explicit-barriers': [
        'error',
        { enforce: 'within-boundaries', allowSameDirectory: false },
      ],
    },
  },
);

// eslint.config.mjs
// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import boundaries from 'eslint-plugin-boundaries';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  { ignores: ['eslint.config.mjs', 'dist', 'coverage', 'node_modules'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettierRecommended,
  {
    plugins: {
      boundaries,
    },
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'boundaries/elements': [
        {
          type: 'domain',
          pattern: 'src/domain',
        },
        {
          type: 'application',
          pattern: 'src/application',
        },
        {
          type: 'infrastructure',
          pattern: 'src/infrastructure',
        },
        {
          type: 'shared',
          pattern: 'src/@shared',
        },
        {
          type: 'main',
          pattern: ['src/main.ts', 'src/app.module.ts', 'src/modules'],
        },
      ],
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'off',
      'no-console': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // Hexagonal Architecture boundaries
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: ['domain'],
              disallow: ['application', 'infrastructure', 'main', 'shared'],
            },
            {
              from: ['application'],
              allow: ['domain', 'shared'],
            },
            {
              from: ['infrastructure'],
              allow: ['application', 'domain', 'shared'],
            },
            {
            from: ['main'],
              allow: ['application', 'domain', 'infrastructure', 'shared'],
            },
            {
              from: ['shared'],
              disallow: ['application', 'domain', 'infrastructure', 'main'],
            },
          ],
        },
      ],

      // Enforce index-only imports between modules
      'boundaries/entry-point': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              target: ['domain', 'application', 'infrastructure', 'shared', 'main'],
              allow: ['**/index.ts', '**/types.ts'],
            },
          ],
        },
      ],
      'boundaries/no-private': ['error'],
      'boundaries/no-ignored': 'error',
      'boundaries/no-unknown-files': 'off', // Disabled for now
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.test.ts', '**/__tests__/**'],
    rules: {
      'boundaries/element-types': 'off',
      'boundaries/entry-point': 'off',
      'boundaries/no-private': 'off',
      'boundaries/no-ignored': 'off',
    },
  },
);
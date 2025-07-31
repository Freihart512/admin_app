// api-gateway/eslint.config.js
import tseslint from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser,
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    ignores: ['dist/', 'node_modules/', 'coverage/', '*.js'],
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: eslintPluginPrettier,
    },
    rules: {
      'no-console': ['error', { allow: ['warn', 'error', 'info',] }],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^(?:.*)?Event(?:Map)?$',
          caughtErrors: 'none',
        },
      ],
      'prettier/prettier': 'error',
    },
  },
];

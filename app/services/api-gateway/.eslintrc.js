// .eslintrc.js
module.exports = {
    // Especifica el entorno donde se ejecuta tu código
    env: {
      node: true, // Para código de Node.js
      es2020: true, // Para características de ECMAScript 2020
      // Si estás en un entorno de navegador, añade: browser: true
    },
    // Extiende configuraciones recomendadas y de plugins
    extends: [
      'eslint:recommended', // Reglas recomendadas por ESLint
      'plugin:@typescript-eslint/recommended', // Reglas recomendadas para TypeScript por @typescript-eslint
      'plugin:prettier/recommended', // Integra Prettier: desactiva reglas de ESLint conflictivas y usa plugin-prettier
    ],
    // Especifica el parser a usar (para TypeScript)
    parser: '@typescript-eslint/parser',
    // Configuración del parser
    parserOptions: {
      ecmaVersion: 2020, // Permite parsing de características modernas de JS
      sourceType: 'module', // Permite usar import/export
      // Proyecto TypeScript: apunta a tu tsconfig.json
      project: './tsconfig.json',
      // Asegúrate de que la ruta sea correcta
    },
    // Plugins a usar
    plugins: [
      '@typescript-eslint', // Plugin para reglas de TypeScript
      'prettier', // Plugin para integrar Prettier
    ],
    // Reglas personalizadas (opcional)
    rules: {
      // Aquí puedes anular reglas o añadir reglas adicionales
      // Ejemplo: no requerir export default (si prefieres exportaciones nombradas)
      // 'import/prefer-default-export': 'off',
      // Ejemplo: permitir console.log en desarrollo (puedes ajustarlo)
      'no-console': 'error',
      // Ejemplo: forzar el uso de tipos explícitos (puedes ajustarlo)
      // '@typescript-eslint/explicit-function-return-type': 'warn',
  
      // Configuración específica para la regla no-unused-vars con TypeScript
      // La configuración 'plugin:@typescript-eslint/recommended' suele manejar esto,
      // pero si necesitas ajustarlo, puedes hacerlo aquí.
      'no-unused-vars': 'off', // Desactiva la regla base
      '@typescript-eslint/no-unused-vars': [
        'warn', // O 'error' si prefieres
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          // Configuración para ignorar variables que solo se usan para tipos
          argsIgnorePattern: '^_', // Ignora argumentos que empiezan con _
          varsIgnorePattern: '^(?:.*)?Event(?:Map)?$', // Intenta ignorar importaciones de eventos usadas solo en tipos (puedes ajustarla)
          caughtErrors: 'none', // No advertir sobre errores capturados en catch blocks
        },
      ],
  
      // Configuración para que Prettier se ejecute como regla
      'prettier/prettier': [
        'error',
        {
          // Opciones de Prettier aquí (opcional, puedes usar .prettierrc también)
          // semi: true,
          // singleQuote: true,
          // printWidth: 100,
        },
      ],
    },
    // Configuración para ignorar archivos (opcional)
    ignorePatterns: ['dist/', 'node_modules/', 'coverage/', '*.js'], // Ignora carpetas de build, dependencias, etc.
  };
  
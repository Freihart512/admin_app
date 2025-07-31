import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // Configuración general de las pruebas
    globals: true, // Hace que las funciones de testing (describe, it, expect) estén disponibles globalmente
    environment: 'node', // Especifica el entorno de ejecución (node para backend)
    include: ['src/**/*.spec.ts'], // Patrón para encontrar archivos de prueba (archivos que terminan en .spec.ts en la carpeta src)
    setupFiles: ['./src/testHelpers/setup.ts'], // Archivos de setup que se ejecutan antes de cada archivo de prueba (opcional)
    // reporters: 'verbose', // Opcional: Reporteador de resultados (verbose muestra más detalles)

    // Configuración de cobertura de código
    coverage: {
      provider: 'v8', // Usar el proveedor de cobertura v8
      reporter: ['text', 'json', 'html'], // Formatos del reporte de cobertura
      include: ['src/**/*.ts'], // Incluir todos los archivos .ts en el reporte de cobertura
      exclude: [
        // Excluir archivos específicos del reporte de cobertura
        'src/index.ts', // El punto de entrada principal no necesita cobertura
        'src/infrastructure/database/migrations/**/*.ts', // Las migraciones no necesitan cobertura
        'src/interfaces/graphql/generated/**/*.ts', // Los archivos generados no necesitan cobertura
        'src/**/errors/**/*.ts', // Los archivos de errores (clases simples) no necesitan cobertura de lógica
        'src/composition/**/*.ts', // El archivo de composición (solo cableado) no necesita cobertura de lógica
        'src/infrastructure/database/index.ts', // Archivo de conexión de DB
        'src/shared/events/**/*.ts', // Interfaces de eventos y dispatcher simple
        // Excluye cualquier otro archivo o folder que no contenga lógica de negocio que deba ser testeada unitariamente
      ],
      // all: true, // Opcional: Incluir archivos sin pruebas en el reporte de cobertura
    },
  },
  resolve: {
    alias: {
      // Configurar alias de ruta para que Vitest los reconozca en las importaciones
      '@domain': path.resolve(__dirname, './src/domain'),
      '@application': path.resolve(__dirname, './src/application'),
      '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@interfaces': path.resolve(__dirname, './src/interfaces'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
});

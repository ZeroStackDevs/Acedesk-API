import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  // Deshabilita el plugin de ESLint: knip intenta cargar eslint.config.mjs
  // en su propio contexto donde @eslint/js no está disponible.
  eslint: false,

  entry: [
    'src/main.ts', // Punto de entrada de la aplicación
    'src/**/*.module.ts', // Módulos NestJS (raíz del grafo de dependencias)
  ],

  project: ['src/**/*.ts'],

  ignore: [
    // Build & entornos
    'dist/**',
    'build/**',
    // Tests
    'test/**',
    'src/**/*.spec.ts',
    'src/**/*.e2e-spec.ts',
  ],

  ignoreDependencies: [
    // Source maps para stack traces en producción (no se importa directamente)
    'source-map-support',
    // Plugins de ESLint (resueltos por eslint.config.mjs, fuera del alcance de knip)
    '@eslint/js',
    'eslint-plugin-prettier',
    'eslint-plugin-simple-import-sort',
    'eslint-plugin-security',
    'eslint-plugin-import',
    'eslint-plugin-sonarjs',
    'eslint-config-prettier',
    'globals',
    'typescript-eslint',
    // Express types (requeridos por NestJS platform-express internamente)
    '@types/express',
    // Test utilities (usados en la carpeta test/, ignorada por knip)
    '@types/supertest',
    'supertest',
    '@nestjs/testing',
    'ts-node',
    'tsconfig-paths',
    // NestJS build tools
    '@nestjs/mau',
  ],

  ignoreBinaries: [],

  // Knip no entiende los patrones de inyección de dependencias de NestJS por
  // defecto; los providers, módulos y decoradores son consumidos vía metadata
  // de DI sin imports directos.
  ignoreExportsUsedInFile: true,
};

export default config;

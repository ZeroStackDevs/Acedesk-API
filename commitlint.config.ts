import type { UserConfig } from '@commitlint/types';

const commitlintConfiguration: UserConfig = {
  extends: [],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'chore']],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],

    'scope-enum': [
      2,
      'always',
      [
        // Dominios de Negocio y Estructura
        'core-saas', // Módulo B2B (Tenants, Facturación B2B)
        'iam', // Módulo de Identidad y Seguridad (Usuarios, Autenticación, Roles)
        'classtrack', // Módulo de interacción del alumno (Asistencia, Notas, Retención)
        'admindesk', // Módulo de operación del instituto (Estudiantes, Niveles, Finanzas)
        'shared', // Código Transversal (Decoradores, Filters, Guards globales)

        // Capas Técnicas y Clean Architecture
        'api', // Controladores, rutas, filtros globales
        'database', // Sequelize, DatabaseModule, migraciones, modelos
        'infra', // Configuraciones de NestJS, Docker, entornos

        // Mantenimiento transversal
        'deps', // Modificaciones en package.json, pnpm-lock.yaml
        'tools', // Configuraciones de eslint, prettier, tsconfig
        'docs', // README.md, documentación técnica
        'root', // Archivos en la raíz del proyecto
        'ci', // GitHub Actions, .husky
      ],
    ],
    'scope-case': [2, 'always', 'kebab-case'],
    'scope-empty': [1, 'never'],

    'subject-case': [0],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 120],
  },
};

export default commitlintConfiguration;

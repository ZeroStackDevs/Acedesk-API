import js from '@eslint/js';
import { enforceAbsoluteImports } from './eslint-rules/enforce-absolute-imports.mjs';
import { noCommentedCode } from './eslint-rules/no-commented-code.mjs';
import importPlugin from 'eslint-plugin-import';
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended';
import securityPlugin from 'eslint-plugin-security';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sonarjs from 'eslint-plugin-sonarjs';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';

const defineConfig = typescriptEslint.config;
const globalIgnores = (ignores) => ({ ignores });

export default defineConfig([
  prettierPluginRecommended,
  globalIgnores([
    'node_modules',
    '**/dist/**',
    'dist',
    'build',
    '.agents',
    '**/*.config.js',
    '**/*.config.mjs',
    '**/*.config.ts',
    '**/*.json',
  ]),
  js.configs.recommended,
  ...typescriptEslint.configs.recommended,
  sonarjs.configs.recommended,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      import: importPlugin,
    },
    files: ['**/*.ts'],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // B27. Se exigen llaves en todas las estructuras de control[cite: 1].
      curly: ['error', 'all'],

      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',

      // A15. Se prefiere el bucle for/of para iterar sobre colecciones[cite: 1].
      '@typescript-eslint/prefer-for-of': 'error',

      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*', './*', '..', '.'],
              message: 'Relative paths are forbidden. Use absolute paths starting with @/.',
            },
          ],
        },
      ],

      // Módulos seguros: Prohíbe exportar variables mutables (let, var). Solo se permite const.
      'import/no-mutable-exports': 'error',

      // B30. Todas las propiedades y metodos de clase deben indicar su alcance (public, private, protected)[cite: 1].
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
        },
      ],

      // A14. El uso del tipo any esta prohibido[cite: 1].
      '@typescript-eslint/no-explicit-any': 'error',

      // B31. No se permiten valores magicos en el codigo, a excepcion de valores comunes como -1, 0 y 1[cite: 1].
      '@typescript-eslint/no-magic-numbers': [
        'error',
        {
          ignoreEnums: true,
          ignoreReadonlyClassProperties: true,
          ignore: [-1, 0, 1],
        },
      ],

      // B15, B19, B21, B22. Convenciones de nombres para variables, clases, y prefijos para booleanos[cite: 1].
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: ['class', 'interface', 'typeAlias', 'typeParameter'],
          format: ['PascalCase'],
        },
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
        },
        {
          selector: 'variable',
          modifiers: ['global', 'const'],
          format: ['UPPER_CASE', 'camelCase', 'PascalCase'],
        },
        {
          selector: ['variable', 'function', 'classProperty', 'classMethod'],
          format: ['camelCase'],
        },
      ],

      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Core dependencies (NestJS and others)
            ['^@nestjs', '^@?\\w'],

            // Clean Architecture structure
            ['^@/domain/'],
            ['^@/application/'],
            ['^@/infrastructure/'],
            ['^@/presentation/'],
            ['^@/di/'],

            // Other local imports
            ['^@/'],
          ],
        },
      ],

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowTypedFunctionExpressions: true,
        },
      ],

      // Enums obligatorios con valores (No enums numéricos mágicos)
      '@typescript-eslint/prefer-enum-initializers': 'error',
    },
  },
  // --- REGLAS DE ARQUITECTURA LIMPIA ---
  {
    files: ['**/domain/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/application/**', '**/infrastructure/**', '**/presentation/**', '**/di/**', '@nestjs/**'],
              message: 'Domain must not depend on Application, Infrastructure, Presentation, DI, or framework code.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/application/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/infrastructure/**', '**/presentation/**', '**/di/**'],
              message: 'Application must only interact with Domain, not with Infrastructure or Presentation.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/infrastructure/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/application/**', '**/presentation/**', '**/di/**'],
              message: 'Infrastructure must not know about Application, Presentation, or DI.',
            },
          ],
        },
      ],
    },
  },

  // --- CALIDAD: NO DESHABILITAR ESLINT EN EL CÓDIGO FUENTE ---
  // Criterio: El código no debe contener comentarios eslint-disable.
  {
    files: ['**/*.ts'],
    linterOptions: {
      noInlineConfig: true,
    },
  },

  // --- CALIDAD: SIN BARRILES INDEX (re-exports masivos) ---
  // Criterio: No se permiten archivos index como barriles de exportación.
  {
    files: ['**/*.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportAllDeclaration',
          message: 'Barrel re-exports (export * from) are forbidden. Import directly from the source file.',
        },
        {
          selector: 'TSTypeAliasDeclaration > TSIndexedAccessType[objectType.type="TSTypeQuery"][indexType.type="TSTypeOperator"][indexType.operator="keyof"]',
          message: 'POJO enums (Option B) are forbidden in NestJS. Use native TypeScript String Enums (enum Name { KEY = "VALUE" }) instead.',
        }
      ],
    },
  },

  // --- CALIDAD: SIN CÓDIGO COMENTADO Y AUTO-FIX DE RUTAS RELATIVAS ---
  // Criterio: No deben existir bloques de código comentado en el fuente.
  // Criterio: Las rutas relativas deben ser convertidas a alias @/ automáticamente.
  {
    files: ['**/*.ts'],
    plugins: {
      local: {
        rules: {
          'no-commented-code': noCommentedCode,
          'enforce-absolute-imports': enforceAbsoluteImports,
        },
      },
    },
    rules: {
      'local/no-commented-code': 'error',
      'local/enforce-absolute-imports': 'error',
    },
  },

  // --- CALIDAD: SEGURIDAD ESTÁTICA ---
  // Criterio: Detectar patrones inseguros (RegEx maliciosas, eval, rutas no sanitizadas, etc.).
  {
    files: ['**/*.ts'],
    plugins: {
      security: securityPlugin,
    },
    rules: {
      ...securityPlugin.configs.recommended.rules,
    },
  },

  // --- TESTS ---
  {
    files: ['**/*.spec.ts', '**/*.e2e-spec.ts'],
    rules: {
      '@typescript-eslint/no-magic-numbers': 'off',
    },
  },
]);

<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# 👨‍💻 Acedesk Api

Aplicación web para la gestión de calificaciones escolares. Desarrollada con NestJS y TypeScript bajo Clean Architecture.

---

## Requisitos Previos

- Es **estrictamente necesario** tener instalado [pnpm](https://pnpm.io/) en tu sistema para la gestión de dependencias.

- **IMPORTANTE:** Para poder realizar contribuciones al proyecto, es **indispensable** leer el archivo [CONTRIBUTING.md](CONTRIBUTING.md) para conocer las convenciones del proyecto, tambien leer los [criterios de calidad de código](.docs/quality/quality-criteria-nest.md) y los [criterios de nomenclatura de archivos](.docs/quality/quality-criteria-nest-files.md).

## 🚀 Instalación y Ejecución

Para poder arrancar la aplicación, debes ejecutar el siguiente comando:

1. Instala las dependencias del proyecto:

   ```bash
   pnpm install
   ```

   **Nota sobre Git Hooks:** Dado que `pnpm` en algunos entornos puede omitir la instalación de los hooks de Husky, es **necesario** inicializarlos manualmente la primera vez ejecutando:

   > ```bash
   > pnpm run prepare
   > ```

2. Inicia los servidores de desarrollo:

   ```bash
   pnpm run start:dev
   ```

---

## 🛡️ Validaciones y Calidad de Código

Este proyecto asegura la calidad del código mediante **ESLint**, **Prettier** y **Husky** (hooks de Git integrados que validan tu código antes de permitir realizar commits o pushes).

Puedes auditar el proyecto de forma manual ejecutando los siguientes scripts con `pnpm`:

1. **Verificación de Tipos (TypeScript)**
   - `typecheck`: Compila y busca errores de tipado en todo el proyecto.
2. **Formateo, Análisis Estático y Estructura**
   - `format`: Ejecuta Prettier para formatear de manera automática el código.
   - `lint`: Ejecuta ESLint para reportar y reparar problemas de sintaxis o estilo de código.
   - `lint:files`: Verifica con `ls-lint` que los nombres de archivos y carpetas cumplan las convenciones establecidas (por defecto, kebab-case).
   - `lint:deps`: Valida con `dependency-cruiser` que se respeten estrictamente las reglas de dependencias de la Clean Architecture.
   - `knip`: Audita el proyecto detectando código muerto, archivos huérfanos o dependencias sin uso en toda la aplicación.

```bash
# Ejemplos de uso:
pnpm run typecheck
pnpm run lint:deps
pnpm run format
pnpm run knip
```

## ⚙️ Configuración de `.vscode`

El proyecto esta fuertemente ligado a la configuración de [ESLint](https://eslint.org/) y [Prettier](https://prettier.io/), por lo que es **altamente recomendable** crear de forma local el archivo `.vscode/settings.json` en la raíz del proyecto y agregarle la siguiente configuración. Esto permitirá que tu editor se integre perfectamente, formateando y reparando problemas de estilo de forma automática al guardar.

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": ["javascript", "typescript"],
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "javascript.preferences.importModuleSpecifier": "non-relative",
  "eslint.useFlatConfig": true,

  // --- Opcional: Agrupación de archivos para mantener el explorador limpio ---
  "explorer.fileNesting.enabled": true,
  "explorer.fileNesting.expand": false,
  "explorer.fileNesting.patterns": {
    "package.json": "pnpm-lock.yaml, .npmrc, nest-cli.json, tsconfig*.json",
    "README.md": "CONTRIBUTING.md, LICENSE, CHANGELOG.md",
    "eslint.config.mjs": ".prettier*, .ls-lint.yml, commitlint.config.ts, .dependency-cruiser.js, knip.config.ts, lint-staged.config.*, jest*.config.ts, .husky",
    ".env.template": ".env*",
    "Dockerfile": "docker*.yml, .dockerignore, Dockerfile.*",
    "*.ts": "${capture}.spec.ts, ${capture}.e2e-spec.ts"
  }
}
```

_(Nota: Las reglas de `explorer.fileNesting` son opcionales, pero altamente recomendadas para mantener la raíz de tu proyecto libre del desorden visual causado por los múltiples archivos de configuración)._

Para que esta configuración funcione correctamente, asegúrate de tener instaladas las siguientes extensiones oficiales en tu editor:

- **Prettier - Code formatter** (`esbenp.prettier-vscode`)
- **ESLint** (`dbaeumer.vscode-eslint`)

## Documentación

La documentación del proyecto se encuentra en la carpeta [.docs](.docs/).

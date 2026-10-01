# Nomenclatura y Estructura de Archivos 📁

Este documento define las reglas estrictas de nombrado de archivos y carpetas para nuestro proyecto NestJS basado en Clean Architecture. Estas reglas son validadas automáticamente por la herramienta `ls-lint` mediante el archivo `.ls-lint.yml`.

---

## 1. Regla General

- **Carpetas:** Todas las carpetas dentro de `src/` deben nombrarse en estricto `kebab-case` (letras minúsculas separadas por guiones).
- **Archivos:** Todos los archivos `.ts` deben estar en `kebab-case`.

**Ejemplos:**

- ✅ `user-profile` (Carpeta)
- ❌ `UserProfile` / `userProfile`
- ✅ `create-user.dto.ts` (Archivo)
- ❌ `createUser.dto.ts`

---

## 2. Sufijos por Tipo (Descriptores)

Para asegurar consistencia en todo el proyecto, cada archivo debe contener en su nombre un sufijo que indique claramente su propósito.

> [!NOTE]
> Las pruebas unitarias deben seguir el mismo patrón de nombre agregando `.spec` antes de la extensión `.ts`. Ej: `user.controller.spec.ts`.

A continuación, la distribución de los sufijos permitidos según la capa de arquitectura:

### Capa Domain (`src/**/domain/**`)

Lógica pura de negocio, independiente de cualquier tecnología externa o framework.

- **Entidades:** `[nombre].entity.ts`
- **Repositorios (Interfaces):** `[nombre].repository.ts`
- **Orígenes de Datos (Interfaces):** `[nombre].datasource.ts`
- **Value Objects:** `[nombre].value-object.ts`

### Capa Application (`src/**/application/**`)

Casos de uso de la aplicación, orquestan el dominio.

- **Casos de uso:** `[nombre].use-case.ts`
- **DTOs:** `[nombre].dto.ts`

### Capa Infrastructure (`src/**/infrastructure/**`)

Implementación técnica: bases de datos, APIs externas, adaptadores.

- **Mapeadores:** `[nombre].mapper.ts`
- **Esquemas (BD):** `[nombre].schema.ts`
- **Modelos (BD):** `[nombre].model.ts`
- **Seeders:** `[nombre].seeder.ts`
- **Migraciones:** Estructura basada en timestamp `[0-9]+-[nombre].ts` (Ej. `1700000-create-users.ts`)

### Capa Presentation (`src/**/presentation/**`)

Puntos de entrada a la aplicación (REST, GraphQL, gRPC).

- **Controladores:** `[nombre].controller.ts`
- **Guards:** `[nombre].guard.ts`
- **Interceptores:** `[nombre].interceptor.ts`
- **Middlewares:** `[nombre].middleware.ts`
- **Pipes:** `[nombre].pipe.ts`
- **Filtros:** `[nombre].filter.ts`

### Cross-Cutting y Compartidos (Generales)

Elementos de soporte, framework y tipos globales.

- **Módulos (NestJS):** `[nombre].module.ts`
- **Servicios:** `[nombre].service.ts`
- **Proveedores:** `[nombre].provider.ts`
- **Decoradores:** `[nombre].decorator.ts`
- **Validadores:** `[nombre].validator.ts`
- **Excepciones:** `[nombre].exception.ts`
- **Errores (Dominio):** `[nombre].error.ts`
- **Constantes:** `[nombre].constant.ts`
- **Tipos:** `[nombre].type.ts`
- **Interfaces:** `[nombre].interface.ts`
- **Enums:** `[nombre].enum.ts`
- **Helpers:** `[nombre].helper.ts`
- **Utilidades:** `[nombre].util.ts`
- **Configuraciones:** `[nombre].config.ts`

### Patrones de Diseño Genéricos

- **Estrategias:** `[nombre].strategy.ts`
- **Fábricas:** `[nombre].factory.ts`
- **Adaptadores:** `[nombre].adapter.ts`
- **Comandos:** `[nombre].command.ts`

---

## 3. Excepciones Ignoradas (Archivos fuera del linter)

El linter de archivos ignora explícitamente ciertas carpetas y archivos base del sistema, por lo que no es necesario forzar `kebab-case` en:

- Carpetas: `node_modules`, `dist`, `build`, `.git`, `.vscode`, `.husky`, carpetas de test como `__tests__`
- Archivos de Configuración Raíz: `*.json`, `*.config.js`, `*.config.mjs`, `*.config.ts`, `.env`, `pnpm-lock.yaml`

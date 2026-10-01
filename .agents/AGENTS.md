# Instrucciones para Agentes de IA (AGENTS.md) 🤖

Este documento contiene las directrices estrictas y el contexto del proyecto que todo Agente de IA (incluyéndome) debe seguir al escribir o modificar código en este repositorio. Estas reglas están respaldadas por las configuraciones locales (ESLint, Prettier, Dependency Cruiser, ls-lint, SonarJS) y el pipeline de CI.

## 1. Arquitectura y Estructura 🏗️

El proyecto es una API Backend construida con **NestJS** aplicando **Clean Architecture**.

### Reglas de Dependencia Estrictas (Dependency Cruiser)

- **Domain (`src/**/domain/`)**: Lógica pura de negocio. **PROHIBIDO** importar desde Application, Infrastructure, Presentation, DI o dependencias externas (como `@nestjs/\*`).
- **Application (`src/**/application/`)**: Casos de uso. Solo puede importar desde Domain. **PROHIBIDO\*\* importar desde Infrastructure, Presentation o DI.
- **Infrastructure (`src/**/infrastructure/`)\*\*: Implementaciones técnicas (Base de datos, APIs externas). No debe conocer nada sobre Application, Presentation o DI.
- **Presentation (`src/**/presentation/`)\*\*: Controladores REST/GraphQL.
- **DI (`src/**/di/` o inyección en general)\*\*: El único lugar donde se ensambla todo.

_(Nota: La estructura exacta de carpetas se definirá más adelante. Por ahora, respeta las reglas de dependencia entre las capas)._

## 2. Nomenclatura de Archivos (ls-lint) 📁

- **TODO** debe estar en estricto `kebab-case` (carpetas y archivos).
- Los archivos deben llevar el **sufijo de su tipo lógico**. Ejemplos:
  - `[nombre].controller.ts`
  - `[nombre].use-case.ts`
  - `[nombre].entity.ts`
  - `[nombre].repository.ts`
  - Pruebas: `[nombre].controller.spec.ts`

## 3. Convenciones de Código y Calidad (ESLint + SonarJS) 🛡️

### Tipado y Variables

- **Cero `any`**: El uso de `any` está estrictamente prohibido. Usa tipos específicos o `unknown`.
- **Enums Nativos**: Usa SOLO enums nativos de TypeScript con valores String (`enum Status { ACTIVE = 'ACTIVE' }`). **PROHIBIDOS** los enums numéricos implícitos o los POJO Enums (`const Status = {} as const`).
- **Nomenclatura**:
  - Clases, Interfaces, Tipos: `PascalCase`.
  - Variables, Funciones, Métodos: `camelCase`.
  - Constantes Globales: `UPPER_SNAKE_CASE`.
  - Booleanos: **DEBEN** tener un prefijo (ej. `isLogin`, `hasAccess`, `shouldUpdate`).
  - Arreglos: **DEBEN** estar en plural (ej. `users`, no `userList`).
- **Modificadores de Acceso**: Obligatorios en clases (`private`, `public`, `protected`).
- **Exportaciones Seguras**: **PROHIBIDO** exportar variables mutables (`let`, `var`). Usa siempre `const` para exportar datos.

### Lógica y Estructura

- **No Valores Mágicos**: Evita números mágicos en el código (se permiten -1, 0, 1). Define constantes.
- **Imports Absolutos**: Usa **SIEMPRE** rutas absolutas con el alias `@/` (ej. `@/domain/user.entity`). Los imports relativos (`../`, `./`) están prohibidos.
- **Sin Barriles**: Los archivos `index.ts` que hacen re-exportaciones masivas (`export * from ...`) están prohibidos. Importa directamente desde el archivo origen.
- **Complejidad Cognitiva (SonarJS)**:
  - Divide las funciones largas o complejas.
  - Evita los if/else innecesarios al retornar booleanos (usa `return condicion;`).
- **Estructuras de Control**: Las llaves `{}` son obligatorias en todos los `if`, `for`, `while`, incluso si son de una sola línea.
- **Sintaxis Moderna**: Prefiere `?.` (Optional Chaining) y `??` (Nullish Coalescing) sobre `&&` y `||`.
- **Limpieza**: El código comentado está prohibido en el repositorio final. No deshabilites reglas de ESLint en el código fuente.

## 4. Ecosistema y Dependencias 📦

- **Gestor de Paquetes**: Usa **ÚNICAMENTE** `pnpm` (`pnpm install`, `pnpm run`).
- **Versiones Fijas**: Cualquier dependencia nueva instalada debe tener versión fija (regla aplicada automáticamente vía `.npmrc`).
- **Formateo**: Prettier está configurado de manera estricta.

## 5. Control de Versiones 🌿

- **Semantic Commits**: Los commits deben seguir la estructura `type(scope): description`. Los scopes permitidos incluyen: `core`, `admindesk`, `classtrack`, `security`, `api`, `database`, `infra`, `deps`, `tools`, `docs`, `root`, `ci`.
- **Ramas**: Las ramas de trabajo deben incluir el ID del ticket al final (`tipo/modulo-descripcion-ticketId`).

---

**Instrucción Final para el Agente:** Antes de proponer código o crear archivos, revisa mentalmente este documento para asegurar que tu propuesta cumple al 100% con los estándares de calidad, arquitectura y nomenclatura del proyecto.

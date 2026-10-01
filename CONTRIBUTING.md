# Guía de Contribución 🚀

¡Gracias por contribuir a este proyecto! Este documento describe las convenciones, arquitectura y flujos de trabajo que seguimos para mantener un desarrollo organizado, ágil y de alta calidad técnica en nuestra migración a SaaS B2B.

Para ayudarnos a mantener el código impecable y altamente estandarizado, **te invitamos a leer detenidamente** nuestros dos documentos principales de estilo antes de escribir tu primera línea de código. ¡Son tu mejor guía para evitar rechazos en los PRs!
👉 [Criterios de Calidad de Código](.docs/quality/quality-criteria-nest.md)
👉 [Criterios de Nomenclatura de Archivos](.docs/quality/quality-criteria-nest-files.md)

---

## 📋 Requisitos Previos

Antes de comenzar a codificar, asegúrate de tener:

- **Git** instalado y configurado.
- **Node.js** (v22 o superior).
- **pnpm** (v9+) como gestor estricto de dependencias (`pnpm install`).
- **Husky y Commitlint** habilitados (se instalan automáticamente tras el primer `pnpm install`).

---

## 🌳 Estrategia de Ramas (Kanban + Fases)

Para evitar el "merge hell" durante la transición a NestJS y React, utilizamos **ramas de fase** como entornos de integración temporal.

```text
production
└── develop
    └── phase/<numero>-<nombre-fase>
        ├── feat/<modulo>-<funcionalidad>-<ticket>
        ├── fix/<modulo>-<bug>-<ticket>
        ├── refactor/<modulo>-<tarea>-<ticket>
        └── chore/<modulo>-<tarea>-<ticket>
```

### Ramas Principales

- **`production`**: Código 100% estable y desplegado. Solo recibe cambios desde `develop` mediante Pull Request aprobado.
- **`develop`**: Rama principal de integración continua. Recibe los Pull Requests de las ramas `phase/` una vez que la fase completa ha sido auditada y terminada.
- **`phase/<numero>-<nombre>`** _(Ej: `phase/01-core-database`)_: Nuestro entorno de desarrollo diario. Desde aquí nacen todas las ramas de trabajo individuales y hacia aquí se envían los PRs de las tareas.

### Ramas de Trabajo (Tickets)

El número del ticket al final de la rama es **OBLIGATORIO** para que GitHub Projects mueva las tarjetas en el tablero Kanban automáticamente.

**Formato:**

```text
<type>/<module>-<short-description>-<ticket_id>
```

**Ejemplos:**

- `feat/core-tenant-model-3`
- `fix/auth-jwt-claims-12`
- `chore/infra-toolchain-setup-1`

### Sub-ramas de Trabajo (Opcional)

Cuando una funcionalidad es demasiado grande para resolverse en un solo PR, se puede dividir en sub-ramas que hacen merge hacia la rama de trabajo principal. Estas sub-ramas no requieren el ID del ticket ya que se vinculan indirectamente a través de su rama padre.

```text
phase/01-core-database
└── feat/core-tenant-model-3
    ├── feat/core-tenant-entity
    └── feat/core-tenant-repository
```

### 🔒 Validaciones CI por Nivel de Rama

Al abrir un Pull Request, el pipeline de CI ejecuta validaciones progresivas según la rama destino. Mientras más cerca de `production`, más estricto es el control:

| Validación                  | `feat → feat` | `feat → phase` | `phase → develop` | `develop → production` |
| --------------------------- | :-----------: | :------------: | :---------------: | :--------------------: |
| Prettier (formato)          |      ✅       |       ✅       |        ✅         |           ✅           |
| ESLint (calidad)            |      ✅       |       ✅       |        ✅         |           ✅           |
| ls-lint (nomenclatura)      |      ✅       |       ✅       |        ✅         |           ✅           |
| TypeScript (tipado)         |      ✅       |       ✅       |        ✅         |           ✅           |
| Dep. Cruiser (arquitectura) |      ❌       |       ✅       |        ✅         |           ✅           |
| Build (compilación)         |      ❌       |       ❌       |        ✅         |           ✅           |
| Knip (código muerto)        |      ❌       |       ❌       |        ❌         |           ✅           |

> **¿Por qué esta progresión?**
> En ramas de trabajo (`feat/`) se prioriza la velocidad de iteración sin sacrificar la calidad base. `Knip` se omite en `phase/` y `develop` porque pueden existir funciones o dependencias preparadas para otra feature de la misma fase. Solo al llegar a `production` todo el código debe estar completamente justificado.

---

## 💬 Convención de Commits

Nuestro proyecto aplica Semantic Versioning automatizado mediante `commitlint`. Todo commit debe seguir este formato exacto:

```text
type(scope): imperative description
```

**Reglas del mensaje:**

- Todo en minúsculas.
- Sin punto final.
- El mensaje debe describir **qué hace** el commit (ej. `add user module`), no qué hiciste (ej. `added user module`).

### Tipos permitidos

- `feat`: Nueva funcionalidad
- `fix`: Corrección de errores
- `docs`: Documentación
- `style`: Formato de código (espacios, comas, etc.)
- `refactor`: Cambio de código que no corrige un bug ni añade una feature
- `chore`: Mantenimiento, configuración, dependencias

### Scopes permitidos

Identifican rápidamente el dominio afectado. Utiliza la lista correspondiente al repositorio donde te encuentres:

**⚙️ Backend (NestJS)**

- `core`: Lógica global SaaS y Super Admin.
- `admindesk`: Gestión del instituto (Estudiantes, Niveles, Pagos).
- `classtrack`: Asistencia y métricas de retención.
- `security`: Autenticación, JWT, Guards y RBAC.
- `api`: Controladores, rutas, filtros globales.
- `database`: Modelos Sequelize, migraciones, DatabaseModule.
- `infra`: Configuración del framework, variables de entorno.
- `deps`, `tools`, `docs`, `root`, `ci`: Mantenimiento y configuración transversal.

**🎨 Frontend (React)**

- `admin`: Vistas del panel de control (AdminDesk).
- `student`: Vistas del portal del estudiante.
- `components`: Componentes UI reutilizables (Botones, Tablas).
- `state`: Stores globales (Zustand).
- `services`: Interceptores, peticiones a la API (Axios/Fetch).
- `infra`, `deps`, `tools`, `docs`, `root`, `ci`: Mantenimiento transversal.

---

## 📏 Estándares de Código y Arquitectura

El ecosistema está protegido por linters estrictos. Tu código debe respetarlos para que los Pull Requests no sean bloqueados por el CI/CD:

1.  **Clean Architecture (Backend):** La capa de Dominio (Entities/Repositories) no puede depender de Controladores. Mantén la separación estricta por módulos de dominio.
2.  **Importaciones Absolutas:** Prohibido usar rutas relativas excesivas (`../../../`). Utiliza el alias `@/` que apunta a `src/`.
3.  **Código Muerto y Dependencias:** Usamos `knip` y `dependency-cruiser`. Si declaras una variable, función o instalas una librería que no se usa, el pipeline de GitHub Actions fallará.
4.  **Formato Automático:** Todo el código debe pasar por Prettier y ESLint (`bun run lint`).

---

## 📝 Convención de Pull Requests

- **Título:** Debe seguir el formato semantic commit (`feat(scope): descripción breve`).
- **Cuerpo:** Usa la plantilla por defecto. Es obligatorio enlazar el ticket en la sección "Resolves" (ej. `Resolves #5`) para automatizar el Kanban.
- **Destino:** Los PRs diarios deben apuntar a la rama `phase/` activa, no a `develop`.

---

## 🔀 Flujo de Trabajo (Ejemplo Práctico)

1. **Posiciónate en la fase actual y actualízala:**

   ```bash
   git checkout phase/01-core-database
   git pull origin phase/01-core-database
   ```

2. **Crea tu rama usando el ID del ticket Kanban (ej. Ticket #3):**

   ```bash
   git checkout -b feat/core-tenant-model-3
   ```

3. **Desarrolla la funcionalidad, formatea y sube los cambios:**

   ```bash
   pnpm run lint
   git add .
   git commit -m "feat(database): create tenant and saasplan models"
   git push origin feat/core-tenant-model-3
   ```

4. **Abre el Pull Request en GitHub dirigido hacia `phase/01-core-database`.**

---

## ✅ Checklist antes de solicitar un Code Review

- [ ] Entendí los Criterios de Aceptación del ticket Kanban.
- [ ] Ejecuté `pnpm run lint` y `pnpm exec prettier --check .` localmente.
- [ ] Ejecuté `pnpm run typecheck` (TypeScript) sin arrojar errores.
- [ ] El nombre de mi rama termina con el ID del ticket.
- [ ] Enlacé el número del ticket en el cuerpo del Pull Request.

# Transición SaaS B2B

Este documento define la ruta estratégica de implementación para migrar la arquitectura monolítica hacia un entorno Multi-Tenant en NestJS. El flujo de trabajo se gestionará mediante Kanban, priorizando la configuración base y la infraestructura de datos antes de desarrollar la lógica de negocio.

### Fase 0: Preparación y Configuración Base (Infraestructura)

- **Objetivo:** Establecer los repositorios, las reglas de calidad de código y la arquitectura de carpetas.
- **Tareas:**
  - Creación de repositorios independientes para Frontend (React/Vite) y Backend (NestJS).
  - Configuración del ecosistema de dependencias y scripts (usando pnpm y bun).
  - Implementación de herramientas de calidad de código: ESLint, Prettier y .editorconfig.
  - Configuración de Git Hooks para validación automática: Husky y Commitlint.
  - Definición de la estructura de carpetas en NestJS orientada a Clean Architecture (separación por dominios: controllers, services/use-cases, repositories, entities).

### Fase 1: Reestructuración de Base de Datos y Multi-Tenancy (Modelos)

- **Objetivo:** Crear y mapear absolutamente toda la estructura de la base de datos PostgreSQL mediante Sequelize en NestJS.
- **Tareas:**
  - Configurar el `DatabaseModule` centralizado en NestJS.
  - Crear los modelos fundacionales del SaaS: `Tenants`, `TenantSettings`, `SaaSPlans`, `TenantSubscriptions` y `TenantInvoices`.
  - Migrar y adaptar los modelos de Identidad: `Users` (añadiendo soporte para rol Super Admin y `tenant_id` nulo).
  - Migrar y adaptar los modelos de AdminDesk: `Students` (con `st_pin_hash`), `Levels` (reemplazando Modules), `StudentLevels`, `PaymentPlans` y `PaymentQuotas`.
  - Migrar los modelos de ClassTrack: `AttendanceSessions`, `LessonLogs`, `RetentionAlerts` y `AcademicObservations`.
  - Establecer todas las relaciones (Foreign Keys) garantizando la cascada del `tenant_id`.

### Fase 2: Identidad, Seguridad y Roles (Lógica Core)

- **Objetivo:** Blindar el sistema y establecer el control de acceso maestro.
- **Tareas:**
  - Implementar el sistema de autenticación (Login) emitiendo JWT con `tenant_id` inyectado.
  - Desarrollar los _Guards_ y decoradores en NestJS para el **Claims-Based RBAC** (Permisos Granulares).
  - Crear la lógica de sesión del Super Admin (acceso global sin aislamiento de tenant).

### Fase 3: AdminDesk (Lógica de Negocio y Controladores)

- **Objetivo:** Programar los casos de uso y endpoints de gestión académica.
- **Tareas:**
  - Crear los servicios para el catálogo académico agnóstico (gestión de `Levels`).
  - Implementar la lógica de Onboarding (matrículas de `Students` y generación de PIN de acceso).
  - Desarrollar el flujo de Upselling (`StudentLevels`) y la validación de progresión académica.
  - Programar los casos de uso financieros para calcular costos dinámicos y el saldo rodante (Rollover Debt) en cuotas.

### Fase 4: ClassTrack y Flexibilización (Lógica de Negocio y Controladores)

- **Objetivo:** Migrar los flujos de asistencia consumiendo las nuevas políticas dinámicas.
- **Tareas:**
  - Desarrollar los endpoints de Check-In/Check-Out manual (`AttendanceSessions`) y registro de avance (`LessonLogs`).
  - Inyectar las reglas de `TenantSettings` en los casos de uso (ej. validar el límite configurado de lecciones por día en lugar de un número fijo).
  - Implementar la lógica del Tablero de Inasistencias y creación de `RetentionAlerts` en base a los días de tolerancia del instituto.

### Fase 5: Expansión B2B (Nuevas Funcionalidades SaaS)

- **Objetivo:** Desarrollar las herramientas de valor agregado y baja fricción.
- **Tareas:**
  - **Asistencia Zero-Hardware:** Crear el endpoint generador de QR dinámico (JWT rotativo) y el endpoint de validación de escaneo para el Portal del Estudiante.
  - **Migración Estandarizada:** Construir el endpoint de Onboarding Masivo (procesamiento de archivo `.xlsx` vía `exceljs` y carga mediante `bulkCreate`).
  - **Gestión Comercial:** Desarrollar los endpoints del Super Admin para registrar pagos de suscripciones y gestionar bloqueos automáticos de institutos morosos.

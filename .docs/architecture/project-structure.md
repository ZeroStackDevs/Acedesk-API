# 🏗️ Arquitectura y Estructura del Proyecto

Este documento describe la organización de directorios y módulos de la aplicación. El proyecto sigue un enfoque de **Monolito Modular** aplicando **Clean Architecture** en el corazón de los módulos de negocio.

---

## 📂 Directorios Raíz

La carpeta principal `src/` se divide lógicamente en 3 grandes áreas: el código compartido, la persistencia centralizada y los módulos de negocio.

```text
src/
├── app.module.ts               # Punto de entrada de inyección global
├── main.ts                     # Bootstrap de la aplicación NestJS
├── shared/                     # 🛠️ Código Transversal (No atado a ningún dominio)
├── database/                   # 🗄️ Persistencia Centralizada (Infraestructura SQL)
└── modules/                    # 🏗️ Los 4 Macro-Dominios (Monolito Modular)
```

---

## 🛠️ Shared (Código Transversal)

Contiene elementos globales que dan soporte a toda la aplicación, pero que **no contienen reglas de negocio específicas**.

```text
src/shared/
├── decorators/                 # @RequireClaims(), @CurrentUser()
├── filters/                    # GlobalErrorHandler
├── guards/                     # JwtAuthGuard, ClaimsGuard
├── interceptors/               # TransformResponseInterceptor
└── helpers/                    # BcryptAdapter, HashUtils
```

---

## 🗄️ Database (Infraestructura de Datos)

Centraliza la persistencia, modelos ORM (Sequelize) y configuraciones de base de datos para facilitar las migraciones y las relaciones de las tablas.

```text
src/database/
├── config/                     # Configuración de conexión Sequelize
└── models/                     # Modelos de tablas con decoradores de Sequelize
    ├── core-saas/              # tenant.model.ts, saas-plan.model.ts, tenant-settings.model.ts
    ├── iam/                    # user.model.ts
    ├── admindesk/              # student.model.ts, level.model.ts, payment-plan.model.ts
    └── classtrack/             # attendance-session.model.ts, lesson-log.model.ts
```

---

## 🏗️ Módulos de Negocio (Macro-Dominios)

La aplicación se divide en 4 grandes bloques de negocio.

> Nota: **Sobre las capas internas (`[domain, application, infrastructure, presentation]`)**:
> Para no extender visualmente todos los árboles, se utiliza esta notación para indicar que esa carpeta es un **Submódulo Funcional** y contiene internamente las 4 capas estrictas de la Clean Architecture. El macro-dominio `AdminDesk` muestra un ejemplo extendido de cómo se ve esto por dentro.

### 1. 🏢 Core SaaS (El Motor del Negocio B2B)

Maneja toda la lógica multi-tenant, planes del sistema SaaS y facturación a las escuelas.

```text
src/modules/core-saas/
├── tenants/
│   ├── management/             # [domain/, application/, infrastructure/, presentation/]
│   ├── settings/               # [domain/, application/, infrastructure/, presentation/]
│   └── tenants.module.ts       # 📦 Ensambla [Management, Settings]
├── billing/
│   ├── plans/                  # [domain/, application/, infrastructure/, presentation/]
│   ├── subscriptions/          # [domain/, application/, infrastructure/, presentation/]
│   ├── invoices/               # [domain/, application/, infrastructure/, presentation/]
│   └── billing.module.ts       # 📦 Ensambla [Plans, Subscriptions, Invoices]
└── core-saas.module.ts         # 📦 Ensamblador Padre
```

### 2. 🛡️ IAM (Identidad y Seguridad)

Controla la autenticación, autorización y gestión del personal del sistema.

```text
src/modules/iam/
├── users/
│   ├── staff/                  # [domain/, application/, infrastructure/, presentation/]
│   └── users.module.ts         # 📦 Ensambla [Staff]
├── auth/
│   ├── credentials/            # [domain/, application/, infrastructure/, presentation/]
│   ├── magic-links/            # [domain/, application/, infrastructure/, presentation/]
│   ├── pin-access/             # [domain/, application/, infrastructure/, presentation/]
│   └── auth.module.ts          # 📦 Ensambla [Credentials, MagicLinks, PinAccess]
└── iam.module.ts               # 📦 Ensamblador Padre
```

### 3. 📱 ClassTrack (Interacción y Seguimiento)

Módulo encargado del comportamiento académico en el aula y métricas de riesgo/retención estudiantil.

```text
src/modules/classtrack/
├── attendance/
│   ├── qr-kiosk/               # [domain/, application/, infrastructure/, presentation/]
│   ├── sessions/               # [domain/, application/, infrastructure/, presentation/]
│   ├── manual-entries/         # [domain/, application/, infrastructure/, presentation/]
│   └── attendance.module.ts    # 📦 Ensambla [QrKiosk, Sessions, ManualEntries]
├── academics/
│   ├── lesson-logs/            # [domain/, application/, infrastructure/, presentation/]
│   ├── academic-obs/           # [domain/, application/, infrastructure/, presentation/]
│   └── academics.module.ts     # 📦 Ensambla [LessonLogs, AcademicObs]
├── retention/
│   ├── alerts/                 # [domain/, application/, infrastructure/, presentation/]
│   ├── dynamic-rules/          # [domain/, application/, infrastructure/, presentation/]
│   └── retention.module.ts     # 📦 Ensambla [Alerts, DynamicRules]
└── classtrack.module.ts        # 📦 Ensamblador Padre
```

### 4. 🏫 AdminDesk (Operación del Instituto)

Aquí se muestra el **ejemplo detallado** de cómo las 4 capas de la arquitectura limpia viven dentro de los submódulos de un macro-dominio.

```text
src/modules/admindesk/
├── levels/
│   ├── catalog/                # [domain/, application/, infrastructure/, presentation/]
│   ├── milestones/             # [domain/, application/, infrastructure/, presentation/]
│   └── levels.module.ts        # 📦 Ensambla [Catalog, Milestones]
├── financials/
│   ├── payment-plans/          # [domain/, application/, infrastructure/, presentation/]
│   ├── quotas/                 # [domain/, application/, infrastructure/, presentation/]
│   ├── rollover-debt/          # [domain/, application/, infrastructure/, presentation/]
│   └── financials.module.ts    # 📦 Ensambla [PaymentPlans, Quotas, RolloverDebt]
├── students/                   # 👥 Macro-Dominio Padre (Detalle interno)
│   ├── profile/                # 👤 Submódulo 1: Perfil 360 y Onboarding
│   │   ├── domain/             # entities/ (student.entity.ts), interfaces/
│   │   ├── application/        # dtos/, use-cases/ (register-student.use-case.ts)
│   │   ├── infrastructure/     # repositories/, mappers/
│   │   ├── presentation/       # controllers/
│   │   └── student-profile.module.ts # Ensambla solo el perfil
│   │
│   ├── enrollments/            # 📝 Submódulo 2: Matrículas
│   │   ├── domain/             # entities/ (enrollment.entity.ts), interfaces/
│   │   ├── application/        # dtos/, use-cases/ (create-enrollment.use-case.ts)
│   │   ├── infrastructure/     # repositories/, mappers/
│   │   ├── presentation/       # controllers/
│   │   └── enrollments.module.ts     # Ensambla solo las matrículas
│   │
│   ├── student-levels/         # 📈 Submódulo 3: Asignación de niveles
│   │   ├── domain/             # [entities/, interfaces/]
│   │   ├── application/        # [dtos/, use-cases/]
│   │   ├── infrastructure/     # [repositories/, mappers/]
│   │   ├── presentation/       # [controllers/]
│   │   └── student-levels.module.ts  # Ensambla solo las asignaciones
│   │
│   └── students.module.ts      # 📦 Módulo Padre (Agrupador)
└── admindesk.module.ts         # 📦 Ensamblador Padre
```

---

## 🌳 Árbol Completo del Proyecto

A continuación se muestra la estructura general y completa que se creará, integrando los diferentes dominios, submódulos e infraestructura:

```text
src/
├── app.module.ts               # Punto de entrada de inyección global
├── main.ts                     # Bootstrap de la aplicación NestJS
├── shared/                     # 🛠️ Código Transversal (No atado a ningún dominio)
│   ├── decorators/             # @RequireClaims(), @CurrentUser()
│   ├── filters/                # GlobalErrorHandler
│   ├── guards/                 # JwtAuthGuard, ClaimsGuard
│   ├── interceptors/           # TransformResponseInterceptor
│   └── helpers/                # BcryptAdapter, HashUtils
├── database/                   # 🗄️ Persistencia Centralizada (Infraestructura SQL)
│   ├── config/                 # Configuración de conexión Sequelize
│   └── models/                 # Modelos de tablas con decoradores de Sequelize
│       ├── core-saas/          # tenant.model.ts, saas-plan.model.ts, tenant-settings.model.ts
│       ├── iam/                # user.model.ts
│       ├── admindesk/          # student.model.ts, level.model.ts, payment-plan.model.ts
│       └── classtrack/         # attendance-session.model.ts, lesson-log.model.ts
└── modules/                    # 🏗️ Los 4 Macro-Dominios (Monolito Modular)
    │
    ├── core-saas/              # 🏢 El Motor del Negocio B2B
    │   ├── tenants/
    │   │   ├── management/           # [domain/, application/, infrastructure/, presentation/]
    │   │   ├── settings/             # [domain/, application/, infrastructure/, presentation/]
    │   │   └── tenants.module.ts     # 📦 Ensambla [Management, Settings]
    │   ├── billing/
    │   │   ├── plans/                # [domain/, application/, infrastructure/, presentation/]
    │   │   ├── subscriptions/        # [domain/, application/, infrastructure/, presentation/]
    │   │   ├── invoices/             # [domain/, application/, infrastructure/, presentation/]
    │   │   └── billing.module.ts     # 📦 Ensambla [Plans, Subscriptions, Invoices]
    │   └── core-saas.module.ts       # 📦 Ensamblador Padre
    │
    ├── iam/                    # 🛡️ Identidad y Seguridad Transversal
    │   ├── users/
    │   │   ├── staff/                # [domain/, application/, infrastructure/, presentation/]
    │   │   └── users.module.ts       # 📦 Ensambla [Staff]
    │   ├── auth/
    │   │   ├── credentials/          # [domain/, application/, infrastructure/, presentation/]
    │   │   ├── magic-links/          # [domain/, application/, infrastructure/, presentation/]
    │   │   ├── pin-access/           # [domain/, application/, infrastructure/, presentation/]
    │   │   └── auth.module.ts        # 📦 Ensambla [Credentials, MagicLinks, PinAccess]
    │   └── iam.module.ts             # 📦 Ensamblador Padre
    │
    ├── classtrack/             # 📱 Interacción y Seguimiento del Alumno
    │   ├── attendance/
    │   │   ├── qr-kiosk/             # [domain/, application/, infrastructure/, presentation/]
    │   │   ├── sessions/             # [domain/, application/, infrastructure/, presentation/]
    │   │   ├── manual-entries/       # [domain/, application/, infrastructure/, presentation/]
    │   │   └── attendance.module.ts  # 📦 Ensambla [QrKiosk, Sessions, ManualEntries]
    │   ├── academics/
    │   │   ├── lesson-logs/          # [domain/, application/, infrastructure/, presentation/]
    │   │   ├── academic-obs/         # [domain/, application/, infrastructure/, presentation/]
    │   │   └── academics.module.ts   # 📦 Ensambla [LessonLogs, AcademicObs]
    │   ├── retention/
    │   │   ├── alerts/               # [domain/, application/, infrastructure/, presentation/]
    │   │   ├── dynamic-rules/        # [domain/, application/, infrastructure/, presentation/]
    │   │   └── retention.module.ts   # 📦 Ensambla [Alerts, DynamicRules]
    │   └── classtrack.module.ts      # 📦 Ensamblador Padre
    │
    └── admindesk/              # 🏫 Operación del Instituto
        ├── levels/
        │   ├── catalog/              # [domain/, application/, infrastructure/, presentation/]
        │   ├── milestones/           # [domain/, application/, infrastructure/, presentation/]
        │   └── levels.module.ts      # 📦 Ensambla [Catalog, Milestones]
        ├── financials/
        │   ├── payment-plans/        # [domain/, application/, infrastructure/, presentation/]
        │   ├── quotas/               # [domain/, application/, infrastructure/, presentation/]
        │   ├── rollover-debt/        # [domain/, application/, infrastructure/, presentation/]
        │   └── financials.module.ts  # 📦 Ensambla [PaymentPlans, Quotas, RolloverDebt]
        ├── students/           # 👥 Macro-Dominio Padre (Detalle interno)
        │   ├── profile/              # 👤 Submódulo 1: Perfil 360 y Onboarding
        │   │   ├── domain/           # entities/ (student.entity.ts), interfaces/
        │   │   ├── application/      # dtos/, use-cases/ (register-student.use-case.ts)
        │   │   ├── infrastructure/   # repositories/, mappers/
        │   │   ├── presentation/     # controllers/
        │   │   └── student-profile.module.ts # Ensambla solo el perfil
        │   │
        │   ├── enrollments/          # 📝 Submódulo 2: Matrículas
        │   │   ├── domain/           # entities/ (enrollment.entity.ts), interfaces/
        │   │   ├── application/      # dtos/, use-cases/ (create-enrollment.use-case.ts)
        │   │   ├── infrastructure/   # repositories/, mappers/
        │   │   ├── presentation/     # controllers/
        │   │   └── enrollments.module.ts     # Ensambla solo las matrículas
        │   │
        │   ├── student-levels/       # 📈 Submódulo 3: Asignación de niveles
        │   │   ├── domain/
        │   │   ├── application/
        │   │   ├── infrastructure/
        │   │   ├── presentation/
        │   │   └── student-levels.module.ts  # Ensambla solo las asignaciones
        │   │
        │   └── students.module.ts    # 📦 Módulo Padre (Agrupador)
        └── admindesk.module.ts       # 📦 Ensamblador Padre
```

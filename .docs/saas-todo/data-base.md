# Estructura de Base de Datos SaaS (Multi-Tenant)

Este documento describe la arquitectura de persistencia del backend, detallando la configuración del motor de base de datos, el mapeo objeto-relacional (ORM) y el diccionario de datos para cada módulo del sistema SaaS.

**Tecnologías Utilizadas:**

- **Motor:** PostgreSQL 17
- **ORM:** Sequelize TypeScript (sequelize-typescript)

---

## 1. Módulo SaaS Core (Administración Global)

### Tabla: `Tenants` (Institutos)

Almacena la información central de cada academia, funcionando como el eje de aislamiento de datos y controlando el acceso basado en la suscripción del MVP.

| Columna                  | Tipo de Dato (Postgres) | Restricciones               | Descripción                                                                      |
| ------------------------ | ----------------------- | --------------------------- | -------------------------------------------------------------------------------- |
| `te_id`                  | UUID                    | PK, Unique, Not Null        | Identificador único del inquilino (instituto).                                   |
| `te_name`                | VARCHAR(255)            | Unique, Not Null            | Nombre comercial de la academia.                                                 |
| `te_contact_email`       | VARCHAR(255)            | Not Null                    | Correo del administrador principal o CEO.                                        |
| `te_phone_number`        | VARCHAR(255)            | Nullable                    | Teléfono de contacto institucional.                                              |
| `te_subscription_status` | ENUM                    | Not Null, Default: 'ACTIVE' | Estado actual del servicio (ACTIVE, SUSPENDED, CANCELLED).                       |
| `te_plan_expires_at`     | DATE                    | Not Null                    | Fecha de corte del plan contratado. Bloquea el acceso automáticamente si expira. |
| `te_created_at`          | TIMESTAMPTZ             | Not Null                    | Auditoría de creación.                                                           |

### Tabla: `TenantSettings` (Configuraciones del Instituto)

Relación 1:1 con `Tenants`. Elimina el _hardcoding_ del sistema actual, permitiendo que cada academia parametrice su propio flujo de trabajo.

| Columna                    | Tipo de Dato (Postgres) | Restricciones                          | Descripción                                                         |
| -------------------------- | ----------------------- | -------------------------------------- | ------------------------------------------------------------------- |
| `ts_id`                    | UUID                    | PK, Unique, Not Null                   | Identificador único de la configuración.                            |
| `ts_tenant_id`             | UUID                    | FK (Tenants), Unique, Not Null         | Referencia estricta 1:1 al instituto.                               |
| `ts_max_freezes_per_level` | INTEGER                 | Not Null, Default: 2                   | Número máximo de congelamientos de contrato permitidos.             |
| `ts_max_lessons_per_day`   | INTEGER                 | Nullable                               | Límite de lecciones por jornada. Si es nulo, no hay límite.         |
| `ts_absent_days_for_alert` | INTEGER                 | Not Null, Default: 3                   | Días continuos de ausencia antes de disparar alerta en el tablero.  |
| `ts_strict_checkout`       | BOOLEAN                 | Not Null, Default: true                | `true`: requiere validación docente. `false`: auto-registro por QR. |
| `ts_timezone`              | VARCHAR(50)             | Not Null, Default: 'America/Guayaquil' | Configuración de huso horario del instituto.                        |

### Tabla: `SaaSPlans` (Catálogo de Planes)

Define la oferta comercial de tu SaaS.

| Columna           | Tipo de Dato (Postgres) | Restricciones           | Descripción                                      |
| ----------------- | ----------------------- | ----------------------- | ------------------------------------------------ |
| `plan_id`         | UUID                    | PK, Unique, Not Null    | Identificador único del plan.                    |
| `plan_name`       | VARCHAR(255)            | Unique, Not Null        | Nombre del plan (ej. Básico 1 Mes, Pro 3 Meses). |
| `price`           | DECIMAL(10,2)           | Not Null                | Costo del plan.                                  |
| `duration_months` | INTEGER                 | Not Null                | Duración del plan en meses.                      |
| `is_active`       | BOOLEAN                 | Not Null, Default: true | Indica si el plan está disponible para la venta. |

### Tabla: `TenantSubscriptions` (Historial de Suscripciones)

Registro de los pagos y periodos de servicio adquiridos por los institutos.

| Columna       | Tipo de Dato (Postgres) | Restricciones            | Descripción                              |
| ------------- | ----------------------- | ------------------------ | ---------------------------------------- |
| `sub_id`      | UUID                    | PK, Unique, Not Null     | Identificador de la suscripción.         |
| `tenant_id`   | UUID                    | FK (Tenants), Not Null   | Academia que realiza el pago.            |
| `plan_id`     | UUID                    | FK (SaaSPlans), Nullable | Plan adquirido.                          |
| `amount_paid` | DECIMAL(10,2)           | Not Null                 | Monto exacto pagado en esta transacción. |
| `start_date`  | DATE                    | Not Null                 | Fecha de inicio del periodo.             |
| `end_date`    | DATE                    | Not Null                 | Fecha de fin del periodo.                |
| `status`      | ENUM                    | Not Null                 | Estado (ACTIVE, EXPIRED, CANCELLED).     |

### Tabla: `TenantInvoices` (Facturación)

Gestión de documentos tributarios y contables del SaaS.

| Columna               | Tipo de Dato (Postgres) | Restricciones            | Descripción                                       |
| --------------------- | ----------------------- | ------------------------ | ------------------------------------------------- |
| `inv_id`              | UUID                    | PK, Unique, Not Null     | Identificador de la factura.                      |
| `inv_tenant_id`       | UUID                    | FK (Tenants), Not Null   | Instituto al que se factura.                      |
| `inv_subscription_id` | UUID                    | FK (TenantSubscriptions) | Suscripción vinculada.                            |
| `inv_issue_date`      | DATE                    | Not Null                 | Fecha de emisión.                                 |
| `inv_due_date`        | DATE                    | Not Null                 | Fecha máxima de pago.                             |
| `inv_subtotal`        | DECIMAL(10,2)           | Not Null                 | Monto antes de impuestos.                         |
| `inv_tax_amount`      | DECIMAL(10,2)           | Not Null, Default: 0     | Impuestos aplicados.                              |
| `inv_total`           | DECIMAL(10,2)           | Not Null                 | Total final.                                      |
| `inv_status`          | ENUM                    | Not Null                 | Estado (DRAFT, ISSUED, PAID, OVERDUE, CANCELLED). |
| `inv_pdf_url`         | VARCHAR(255)            | Nullable                 | Enlace al documento PDF de la factura.            |

---

## 2. Módulo Shared (Identidad)

### Tabla: `Users`

Almacena la información de los usuarios del sistema, incluyendo personal administrativo del SaaS y docentes de los institutos[cite: 1].

| Columna            | Tipo de Dato (Postgres) | Restricciones                    | Descripción                                                             |
| ------------------ | ----------------------- | -------------------------------- | ----------------------------------------------------------------------- |
| `us_id`            | UUID                    | PK, Unique, Not Null[cite: 1]    | Identificador único del usuario[cite: 1].                               |
| `us_tenant_id`     | UUID                    | FK (Tenants), Nullable           | Instituto al que pertenece. (Nulo **solo** si es Super Admin).          |
| `us_full_name`     | VARCHAR(255)            | Unique, Not Null[cite: 1]        | Nombre completo[cite: 1].                                               |
| `us_email`         | VARCHAR(255)            | Unique, Not Null[cite: 1]        | Correo institucional[cite: 1].                                          |
| `us_password_hash` | VARCHAR(255)            | Not Null[cite: 1]                | Contraseña encriptada[cite: 1].                                         |
| `us_role`          | ENUM                    | Not Null[cite: 1]                | Rol (SUPER_ADMIN, ADMIN, TEACHER, ADVISOR, ACADEMIC_DIRECTOR)[cite: 1]. |
| `us_is_active`     | BOOLEAN                 | Not Null, Default: true[cite: 1] | Indica si el usuario puede acceder al sistema[cite: 1].                 |
| `us_created_at`    | TIMESTAMPTZ             | Not Null[cite: 1]                | Fecha de creación del registro[cite: 1].                                |
| `us_updated_at`    | TIMESTAMPTZ             | Not Null[cite: 1]                | Fecha de última actualización[cite: 1].                                 |

---

## 3. Módulo AdminDesk (Gestión Académica y Comercial)

### Tabla: `Students`

Contiene la información maestra de los estudiantes inscritos[cite: 1], aislados por instituto.

| Columna                  | Tipo de Dato (Postgres) | Restricciones                     | Descripción                                                 |
| ------------------------ | ----------------------- | --------------------------------- | ----------------------------------------------------------- |
| `st_id`                  | UUID                    | PK, Unique, Not Null[cite: 1]     | Identificador único del estudiante[cite: 1].                |
| `st_tenant_id`           | UUID                    | FK (Tenants), Not Null            | Instituto al que pertenece.                                 |
| `st_identification_card` | VARCHAR(255)            | Unique, Not Null[cite: 1]         | Cédula o DNI del estudiante[cite: 1].                       |
| `st_pin_hash`            | VARCHAR(255)            | Nullable                          | PIN de 4 dígitos encriptado para acceso al Portal Personal. |
| `st_full_name`           | VARCHAR(255)            | Not Null[cite: 1]                 | Nombre completo[cite: 1].                                   |
| `st_phone_number`        | VARCHAR(255)            | Not Null[cite: 1]                 | Teléfono de contacto[cite: 1].                              |
| `st_email`               | VARCHAR(255)            | Unique, Not Null[cite: 1]         | Correo electrónico personal[cite: 1].                       |
| `st_date_of_birth`       | DATE                    | Not Null[cite: 1]                 | Fecha de nacimiento[cite: 1].                               |
| `st_nationality`         | VARCHAR(255)            | Not Null[cite: 1]                 | País de origen[cite: 1].                                    |
| `st_certificate_type`    | ENUM                    | Not Null[cite: 1]                 | Tipo de certificación (ONE_TONNE, TOEFL, etc)[cite: 1].     |
| `st_start_date`          | DATE                    | Not Null[cite: 1]                 | Fecha de inicio del programa[cite: 1].                      |
| `st_is_graduated`        | BOOLEAN                 | Not Null, Default: false[cite: 1] | Indica si completó sus estudios[cite: 1].                   |
| `st_contract_status`     | ENUM                    | Not Null[cite: 1]                 | Estado del contrato[cite: 1].                               |
| `st_progress_category`   | ENUM                    | Not Null[cite: 1]                 | Categoría de avance[cite: 1].                               |

### Tabla: `Levels`

Catálogo de módulos académicos disponibles, personalizado por instituto.

| **Columna**      | **Tipo de Dato (Postgres)** | **Restricciones**      | **Descripción**                                                                         |
| ---------------- | --------------------------- | ---------------------- | --------------------------------------------------------------------------------------- |
| `lv_id`          | UUID                        | PK, Unique, Not Null   | Identificador del nivel.                                                                |
| `lv_tenant_id`   | UUID                        | FK (Tenants), Not Null | Instituto propietario del nivel.                                                        |
| `lv_name`        | VARCHAR(255)                | Not Null               | Nombre del nivel (ej. A1, Básico 1). (Unique compuesto con `lv_tenant_id`).             |
| `lv_description` | VARCHAR(255)                | Not Null               | Descripción breve del contenido.                                                        |
| `lv_order`       | INTEGER                     | Not Null               | Orden numérico del nivel en la malla curricular. (Unique compuesto con `lv_tenant_id`). |

### Tabla: `StudentLevels`

Tabla de rotura que vincula estudiantes con sus módulos adquiridos.

| **Columna**                | **Tipo de Dato (Postgres)** | **Restricciones**       | **Descripción**                            |
| -------------------------- | --------------------------- | ----------------------- | ------------------------------------------ |
| `st_lv_id`                 | UUID                        | PK, Unique, Not Null    | Identificador de la inscripción al nivel.  |
| `st_lv_student_id`         | UUID                        | FK (Students), Not Null | Referencia al estudiante.                  |
| `st_lv_level_id`           | UUID                        | FK (Levels), Not Null   | Referencia al nivel.                       |
| `st_lv_seller_id`          | UUID                        | FK (Users), Not Null    | Referencia al asesor que realizó la venta. |
| `st_lv_status`             | ENUM                        | Not Null                | Estado (ACTIVE, APPROVED, LOCKED).         |
| `st_lv_purchase_date`      | DATE                        | Not Null                | Fecha de adquisición.                      |
| `st_lv_freeze_count`       | INTEGER                     | Not Null, Default: 0    | Conteo de veces que se congeló el nivel.   |
| `st_lv_reactivation_count` | INTEGER                     | Not Null, Default: 0    | Conteo de veces que se reactivó.           |

### Tabla: `PaymentPlans`

Registra los acuerdos de pago de los estudiantes.

| Columna                | Tipo de Dato (Postgres) | Restricciones                    | Descripción                                      |
| ---------------------- | ----------------------- | -------------------------------- | ------------------------------------------------ |
| `pp_id`                | UUID                    | PK, Unique, Not Null[cite: 1]    | Identificador del plan[cite: 1].                 |
| `pp_student_id`        | UUID                    | FK (Students), Not Null[cite: 1] | Estudiante titular del plan[cite: 1].            |
| `pp_seller_id`         | UUID                    | FK (Users), Not Null[cite: 1]    | Asesor que generó el plan[cite: 1].              |
| `pp_enrollment_fee`    | DECIMAL(10,2)           | Not Null, Default: 0[cite: 1]    | Costo de matrícula[cite: 1].                     |
| `pp_total_amount`      | DECIMAL(10,2)           | Not Null[cite: 1]                | Monto total del plan[cite: 1].                   |
| `pp_is_single_payment` | BOOLEAN                 | Not Null[cite: 1]                | Indica si es pago de contado[cite: 1].           |
| `pp_status`            | ENUM                    | Not Null[cite: 1]                | Estado (PENDING, Completed, CANCELLED)[cite: 1]. |

### Tabla: `PaymentQuotas`

Detalle de las cuotas individuales de un plan de pago[cite: 1].

| Columna              | Tipo de Dato (Postgres) | Restricciones                        | Descripción                                        |
| -------------------- | ----------------------- | ------------------------------------ | -------------------------------------------------- |
| `pq_id`              | UUID                    | PK, Unique, Not Null[cite: 1]        | Identificador de la cuota[cite: 1].                |
| `pq_payment_plan_id` | UUID                    | FK (PaymentPlans), Not Null[cite: 1] | Referencia al plan de pago[cite: 1].               |
| `pq_quota_number`    | INTEGER                 | Not Null[cite: 1]                    | Número correlativo de cuota[cite: 1].              |
| `pq_payment_method`  | ENUM                    | Nullable[cite: 1]                    | Método de pago (CASH, TRANSFER, etc)[cite: 1].     |
| `pq_base_amount`     | DECIMAL(10,2)           | Not Null[cite: 1]                    | Monto base de la cuota[cite: 1].                   |
| `pq_rollover_debt`   | DECIMAL(10,2)           | Not Null, Default: 0[cite: 1]        | Deuda arrastrada de meses anteriores[cite: 1].     |
| `pq_total_expected`  | DECIMAL(10,2)           | Not Null[cite: 1]                    | Monto total a pagar en el mes[cite: 1].            |
| `pq_amount_paid`     | DECIMAL(10,2)           | Not Null, Default: 0[cite: 1]        | Monto efectivamente pagado[cite: 1].               |
| `pq_due_date`        | DATE                    | Not Null[cite: 1]                    | Fecha de vencimiento[cite: 1].                     |
| `pq_status`          | ENUM                    | Not Null[cite: 1]                    | Estado (PENDING, PARTIAL, PAID, OVERDUE)[cite: 1]. |

---

## 4. Módulo ClassTrack (Seguimiento de Clases)

### Tabla: `AttendanceSessions`

Registro de asistencia diaria de los estudiantes[cite: 1].

| Columna                 | Tipo de Dato (Postgres) | Restricciones                    | Descripción                                                                 |
| ----------------------- | ----------------------- | -------------------------------- | --------------------------------------------------------------------------- |
| `at_se_id`              | UUID                    | PK, Unique, Not Null[cite: 1]    | Identificador de la sesión[cite: 1].                                        |
| `at_se_student_id`      | UUID                    | FK (Students), Not Null[cite: 1] | Estudiante que asiste[cite: 1].                                             |
| `at_se_teacher_id`      | UUID                    | FK (Users), Nullable[cite: 1]    | Docente que supervisa[cite: 1]. Nulo si el check-out fue automático por QR. |
| `at_se_session_date`    | DATE                    | Not Null[cite: 1]                | Fecha de la sesión[cite: 1].                                                |
| `at_se_entry_time`      | TIMESTAMPTZ             | Not Null[cite: 1]                | Hora de entrada registrada[cite: 1].                                        |
| `at_se_exit_time`       | TIMESTAMPTZ             | Nullable[cite: 1]                | Hora de salida registrada[cite: 1].                                         |
| `at_se_total_minutes`   | INTEGER                 | Nullable[cite: 1]                | Tiempo total de permanencia[cite: 1].                                       |
| `at_se_check_in_method` | ENUM                    | Not Null                         | Método de ingreso (QR_SCAN, KIOSK_MANUAL, DASHBOARD_MANUAL).                |
| `at_se_status`          | ENUM                    | Not Null[cite: 1]                | Estado (IN_PROGRESS, PENDING_APPROVAL, APPROVED)[cite: 1].                  |

### Tabla: `LessonLogs`

Detalle pedagógico de lo avanzado en una sesión de asistencia[cite: 1].

| Columna                       | Tipo de Dato (Postgres) | Restricciones                              | Descripción                                       |
| ----------------------------- | ----------------------- | ------------------------------------------ | ------------------------------------------------- |
| `le_lo_id`                    | UUID                    | PK, Unique, Not Null[cite: 1]              | Identificador del log[cite: 1].                   |
| `le_lo_attendance_session_id` | UUID                    | FK (AttendanceSessions), Not Null[cite: 1] | Sesión vinculada[cite: 1].                        |
| `le_lo_lesson_number`         | INTEGER                 | Not Null[cite: 1]                          | Número absoluto de la lección impartida[cite: 1]. |
| `le_lo_oral_practice_score`   | DECIMAL(5,2)            | Nullable[cite: 1]                          | Puntuación de la práctica oral[cite: 1].          |
| `le_lo_is_completed`          | BOOLEAN                 | Not Null, Default: false[cite: 1]          | Indica si la lección fue completada[cite: 1].     |

### Tabla: `RetentionAlerts`

Gestión de alertas para estudiantes en riesgo de deserción[cite: 1].

| Columna                      | Tipo de Dato (Postgres) | Restricciones                     | Descripción                                                   |
| ---------------------------- | ----------------------- | --------------------------------- | ------------------------------------------------------------- |
| `re_al_id`                   | UUID                    | PK, Unique, Not Null[cite: 1]     | Identificador de la alerta[cite: 1].                          |
| `re_al_student_id`           | UUID                    | FK (Students), Not Null[cite: 1]  | Estudiante afectado[cite: 1].                                 |
| `re_al_user_id`              | UUID                    | FK (Users), Nullable[cite: 1]     | Asesor que gestiona la alerta[cite: 1].                       |
| `re_al_contact_date`         | DATE                    | Not Null[cite: 1]                 | Fecha de contacto[cite: 1].                                   |
| `re_al_has_responded`        | BOOLEAN                 | Not Null, Default: false[cite: 1] | Indica si el estudiante contestó[cite: 1].                    |
| `re_al_days_absent`          | INTEGER                 | Not Null, Default: 0[cite: 1]     | Días de ausencia acumulados[cite: 1].                         |
| `re_al_is_justified`         | BOOLEAN                 | Not Null, Default: false[cite: 1] | Indica si la falta es justificada[cite: 1].                   |
| `re_al_justification_reason` | TEXT                    | Nullable[cite: 1]                 | Razón de la justificación[cite: 1].                           |
| `re_al_return_deadline`      | DATE                    | Nullable[cite: 1]                 | Fecha pactada de retorno[cite: 1].                            |
| `re_al_observations`         | TEXT                    | Not Null[cite: 1]                 | Notas sobre la gestión de retención[cite: 1].                 |
| `re_al_status`               | ENUM                    | Not Null[cite: 1]                 | Estado (PENDING, IN_PROGRESS, RESOLVED, UNRESOLVED)[cite: 1]. |
| `re_al_resolution_date`      | DATE                    | Nullable[cite: 1]                 | Fecha de resolución de la alerta[cite: 1].                    |

### Tabla: `AcademicObservations`

Observaciones académicas del desempeño de un estudiante[cite: 1].

| Columna             | Tipo de Dato (Postgres) | Restricciones                    | Descripción                                     |
| ------------------- | ----------------------- | -------------------------------- | ----------------------------------------------- |
| `ac_ob_id`          | UUID                    | PK, Unique, Not Null[cite: 1]    | Identificador de la observación[cite: 1].       |
| `ac_ob_student_id`  | UUID                    | FK (Students), Not Null[cite: 1] | Estudiante afectado[cite: 1].                   |
| `ac_ob_teacher_id`  | UUID                    | FK (Users), Not Null[cite: 1]    | Profesor que realiza la observación[cite: 1].   |
| `ac_ob_observation` | TEXT                    | Not Null[cite: 1]                | Contenido de la observación académica[cite: 1]. |
| `ac_ob_deadline`    | TIMESTAMPTZ             | Nullable[cite: 1]                | Fecha límite para resolver[cite: 1].            |

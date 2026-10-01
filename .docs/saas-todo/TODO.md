# Proyecto: Gestión Académica API - Lista de Tareas (TODO)

Basado en la revisión de los requerimientos (`docs/requiremnts.md`) y el estado actual del código en la rama de desarrollo (MVP), a continuación se presenta un resumen de lo que se ha implementado y lo que aún falta por completar[cite: 3].

_Nota: El módulo de "Facturación y Cuotas (Payments)" se ha omitido intencionalmente de esta lista por no haber sido validado aún_[cite: 3].

## ✅ Implementado (Para migrar a NestJS intacto)

### AdminDesk (Gestión Administrativa)

- [x] **Gestión de Matrículas (Onboarding):** Implementado el registro de estudiantes y asignación de módulos iniciales (`/students`)[cite: 3].
- [x] **Ampliación del Perfil del Estudiante:** Modelo `Student` actualizado con los nuevos campos obligatorios: fecha de nacimiento, nacionalidad, correo electrónico y tipo de certificado[cite: 3].
- [x] **Control de Niveles y Accesos:** Lógica de progresión y bloqueo de estudiantes (`/student-levels`)[cite: 3].
- [x] **Catálogo de Módulos y Paquetes:** CRUD y gestión de módulos disponibles (`/modules`)[cite: 3].
- [x] **Actualización y Recompra de Módulos (Upselling):** Capacidad de añadir nuevos módulos a estudiantes existentes[cite: 3].
- [x] **Regla de Graduación:** Soporte para marcar estudiantes como graduados y la lógica base para excepciones[cite: 3].
- [x] **Gestión de Accesos (Claims-Based RBAC):** Implementación de middleware de autenticación y verificación de seguridad en base a claims[cite: 3].

### ClassTrack (Seguimiento Estudiantil)

- [x] **Sincronización de Datos:** Integración con AdminDesk para visualización de estudiantes (`/class-track/students`)[cite: 3].
- [x] **Control de Accesos (Check-In / Check-Out):** Sistema de control de asistencia de estudiantes (`/attendance`)[cite: 3].
- [x] **Autorización de Salida:** Funcionalidad para que el docente autorice el check-out de los alumnos[cite: 3].
- [x] **Tablero de Inasistencias y Retención:** Alertas tempranas y seguimiento de alumnos en riesgo (`/class-track/retention-alerts`)[cite: 3].
- [x] **Seguimiento de Rendimiento:** Detección de deficiencias cruzando tiempo de estancia con lecciones avanzadas (`/lesson-log`)[cite: 3].
- [x] **Dashboard:** Endpoints para el panel de control principal (`/dashboard`)[cite: 3].

---

## 🔄 A Modificar (Transición a SaaS B2B)

### Refactorización Arquitectónica

- [ ] **Migrar Backend a NestJS:** Trasladar la lógica de Express a NestJS manteniendo la Clean Architecture y consolidando Sequelize en un `DatabaseModule` centralizado.
- [ ] **Multi-Tenancy (Bases de Datos):** Añadir columna `tenant_id` obligatoria en las tablas `Users`, `Students` y `Levels` (anteriormente `Modules`).
- [ ] **Deshacer Reglas Rígidas:** Remover el límite "hardcodeado" de 3 lecciones por día y las restricciones de niveles fijos (B2/C2), delegando la validación a la nueva tabla `TenantSettings`.
- [ ] **Refactorizar Catálogo Académico:** Renombrar módulo de "Modules" a "Levels" y permitir nomenclaturas agnósticas.
- [ ] **Políticas de Salida Flexibles:** Adaptar la lógica de check-out para soportar autorización estricta o automática según la configuración del instituto.

---

## ⏳ Pendiente por Implementar (Nuevas Funciones SaaS)

### SaaS Core & Identidad

- [ ] **Rol Super Admin:** Implementar el acceso maestro sin `tenant_id` para fundadores del SaaS.
- [ ] **Módulo de Suscripciones (Billing MVP):** Implementar tablas `SaaSPlans`, `TenantSubscriptions` y `TenantInvoices`. Crear endpoints para registro manual de suscripciones.
- [ ] **Panel de Configuración de Negocio (`TenantSettings`):** Endpoints para que cada instituto modifique sus límites de retención, huso horario y reglas de lecciones.
- [ ] **Onboarding Estandarizado (Migración):** Crear endpoint genérico para importar estudiantes y niveles vía archivo `.xlsx` (sustituye al script one-time planeado originalmente).

### ClassTrack Evolución (Zero-Hardware)

- [ ] **Portal del Estudiante:** Desarrollar vistas frontend para acceso web (fuera de la red local).
- [ ] **Autenticación PIN / Magic Link:** Añadir hash de PIN (4 dígitos) al modelo de Estudiante y habilitar endpoints de acceso de baja fricción.
- [ ] **Control de Asistencia QR Dinámico:**
  - Endpoint en AdminDesk para generar JWT de corta duración (5 min).
  - Lector de código QR en el Portal del Estudiante (`html5-qrcode`).
  - Endpoint transaccional para validar el JWT y marcar asistencia física.
- [ ] **Check-in Manual (Recepción):** Desarrollar función de emergencia en el panel del asesor.

### Actualización de Requerimientos (23/04/2026) - Reportes de Estudiante

- [ ] **Observaciones:** Sistema para añadir observaciones con fecha (El directorio `observation` existe en la arquitectura pero **no está expuesto ni conectado** en el enrutador principal `router.ts`)[cite: 3].
- [ ] **Control de Congelamientos de Contrato:** Contabilizar el número de veces que se congela un contrato (máximo 2 veces por nivel)[cite: 3] _(Validar ahora contra `TenantSettings`)_.
- [ ] **Fechas Límites:** Visualización y control de las fechas límite para los módulos/niveles del estudiante[cite: 3].
- [ ] **Reactivaciones de Contrato:**
  - Registrar el número de reactivaciones realizadas tras cancelación de contrato[cite: 3].
  - Mostrar el número de la reactivación actual[cite: 3].
- [ ] **Permisos de Edición en Reportes:** Asegurar que todos los docentes puedan modificar esta sección de reportes[cite: 3].
- [ ] **Exportación PDF (Opcional):** Opción para descargar la información del reporte del estudiante en formato PDF[cite: 3] _(Renderizado en cliente al vuelo)_.

# Requerimientos SaaS (Multi-Tenant)

## 🏢 SaaS Core (Super Admin)

**Descripción General:** Capa de gestión global exclusiva para los fundadores del SaaS, aislada de la lógica de los institutos.

- **Gestión de Inquilinos:** Creación manual de nuevos institutos (`Tenants`) definiendo su huso horario (ej. `America/Guayaquil`) y parámetros iniciales.
- **Planes y Facturación B2B:** Registro de planes de suscripción (1 mes, 3 meses) y control del ciclo de vida del instituto. Si el plan expira, el instituto pierde acceso automáticamente.
- **Onboarding Estandarizado:** Provisión de una plantilla Excel (`.xlsx`) bloqueada a los nuevos clientes. El sistema la procesará usando `exceljs` para ejecutar un `bulkCreate` y migrar todos sus estudiantes e historial directamente a su `tenant_id`.

---

## 💼 AdminDesk (Gestión del Instituto)

**Descripción General:** Panel de administración exclusivo para cada academia, operando bajo estricto aislamiento de datos.

### 1. ⚙️ Configuraciones Dinámicas (`TenantSettings`)

- El CEO/Administrador del instituto puede parametrizar las reglas de su negocio:
  - Límite de lecciones por día (eliminando el límite fijo de 3).
  - Número máximo de congelamientos de contrato permitidos.
  - Modalidad de check-out (estricto por docente vs. auto-registro por QR).
  - Días de inasistencia para disparar alertas de retención.

### 2. 📦 Catálogo Académico Agnóstico (Niveles)

- **Creación Libre:** El instituto define sus propios niveles (ej. Básico 1, Avanzado, TOEFL Prep) con su propio orden y reglas.
- **Hitos Configurables:** El administrador marca qué niveles específicos otorgan el estado de "Graduado" (eliminando la regla fija de B2/C2), permitiéndoles usar instalaciones sin afectar métricas.

### 3. 🧑‍🎓 Gestión de Matrículas (Onboarding de Estudiantes)

- **Registro Base:** Cédula, Nombre, Teléfono, Email, Fecha de nacimiento, Nacionalidad y Tipo de certificado.
- **Autenticación Zero-Fricción:** Al matricularse, se genera un PIN de 4 dígitos (hasheado) o un Magic Link enviado por WhatsApp/Email para su posterior acceso al Portal del Estudiante.
- **Asignación de Niveles y Upselling:** Compra de módulos individuales o paquetes completos que se desbloquean secuencialmente.

### 4. 💳 Facturación y Cuotas (Student Payments)

- **Precios Dinámicos:** Costo total digitado por el asesor (incluyendo matrícula opcional).
- **Saldo Rodante (Rollover) Atómico:** Si hay un pago parcial, la deuda se transfiere a la cuota posterior automáticamente. Si ocurre en la última cuota, se genera una "Cuota Fantasma" extra. Sin saldos negativos a favor del cliente.

### 5. 🔐 Gestión de Accesos (Claims-Based RBAC por Tenant)

- Roles aislados por instituto: `ADMIN` (acceso total local), `ADVISOR` (solo ventas/matrículas), `ACADEMIC_DIRECTOR` (total en ClassTrack, vista en AdminDesk), `TEACHER` (estándar).

---

## 🎓 ClassTrack (Kiosco y Portal del Estudiante)

**Descripción General:** Sistema dual bifurcado para control de asistencia físico (Kiosco) y consumo de valor remoto (Portal).

### 1. 📲 Portal del Estudiante (Acceso Remoto)

- **Acceso:** Vía web desde su hogar usando Cédula + PIN de 4 dígitos.
- **Consumo de Valor:** Permite visualizar horarios de clases, acceder a enlaces/videos grabados y registrarse a actividades de campo/excursiones.
- **Bloqueo Geográfico/Lógico:** La interfaz remota _no permite_ marcar asistencia.

### 2. ⏱️ Control de Asistencia Zero-Hardware (Kiosco Físico)

- **El Kiosco:** La recepción proyecta un código QR dinámico (JWT rotativo cada 5 minutos) generado desde el AdminDesk.
- **Check-in/Check-out:** El alumno usa el escáner de su Portal del Estudiante (`html5-qrcode`) para leer el QR en recepción. El backend valida la vigencia del JWT y registra la hora en UTC (renderizada luego a hora local).
- **Válvula de Escape:** Opción para que el recepcionista haga check-in manual a alumnos sin dispositivo o batería.

### 3. 📈 Tablero de Retención y Rendimiento

- **Inasistencias:** Filtro dinámico de estudiantes en riesgo basado en los días de tolerancia definidos en sus `TenantSettings`.
- **Registro de Gestión:** Log de contactos (fecha, respuesta, justificaciones) por parte del asesor.
- **Rendimiento:** Cruce de horas de estancia vs. avance de lecciones para alertar sobre estancamiento académico, sin acoplar la asistencia al progreso.

### 4. 📝 Reportes de Estudiante (Perfil 360)

- Módulo modificable por cualquier docente para registrar observaciones con fecha, conteo de congelamientos (validado vs `TenantSettings`), fechas límite y reactivaciones con recargo.
- Generación de reportes PDF estructurados al vuelo en el frontend para no sobrecargar la RAM del servidor.

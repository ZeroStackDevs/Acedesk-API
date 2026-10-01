### 1. Lo que debemos QUITAR (Deshacer las reglas rígidas)

Estas son las reglas que resolvieron el problema inicial, pero que asfixiarán a otras academias si las dejamos obligatorias:

- **El límite duro de lecciones:** Eliminar la restricción global de "máximo 3 lecciones por día" en el registro de lecciones. Manteniendo siempre nuestra premisa de que el registro de lecciones sirve exclusivamente para indicar el avance académico al salir, sin mezclar responsabilidades con el tiempo de asistencia, este límite debe dejar de ser una constante inmutable.
- **Nomenclatura fija de módulos:** Quitar la dependencia de los nombres de niveles del Marco Común Europeo (A1, A2, B1, B2, C1, C2) como la única oferta educativa del sistema.
- **El anclaje de la graduación:** Eliminar la regla estricta que dictamina que un alumno solo es "Graduado" (y gana la excepción de asistencia) al finalizar específicamente el nivel B2 o C2.

### 2. Lo que debemos CAMBIAR (Generalización de Flujos)

Aquí transformamos procesos de un solo cliente en un abanico de opciones:

- **Catálogo Académico Agnóstico:** Evolucionar la creación de módulos para que el instituto pueda definir libremente sus jerarquías. Si quieren vender "Básico 1, Básico 2" o programas como "TOEFL Prep", el sistema debe soportar cualquier ordenamiento y empaquetamiento comercial.
- **Motor de Autorización de Salida:** Cambiar el flujo obligatorio de aprobación del docente por un sistema de políticas. El sistema debe permitir a la academia elegir su modalidad de check-out: validación estricta por un profesor, o autorización automática de confianza para los alumnos.
- **Hitos de Graduación Configurables:** Modificar la lógica de progresión para que los administradores sean quienes marquen dentro de su propio catálogo qué módulos específicos otorgan el hito de "Graduado" o beneficios post-estudio.
- **Enfoque y Alcance de ClassTrack:** Transformar ClassTrack de un simple kiosco de asistencia a un Portal Personal del Estudiante al que puedan acceder desde cualquier lugar (para consultar horarios, ver videos de clases e inscribirse a actividades de campo/excursiones). Al mismo tiempo, se debe bifurcar la lógica para que la marcación de asistencia esté bloqueada desde casa y restringida estrictamente a la validación física en el instituto.

### 3. Lo que debemos AÑADIR (El núcleo del SaaS)

Estas son las capacidades completamente nuevas que convierten la aplicación en un producto comercializable a nivel B2B:

- **Aislamiento de Institutos (Multi-Tenancy Lógico):** Capacidad de registrar múltiples academias de manera independiente. Toda la información (estudiantes, pagos, asistencias y métricas de la primera versión completa del subsistema AdminDesk y ClassTrack) de un instituto debe ser funcionalmente invisible e inaccesible para los demás.
- **Administración Centralizada del SaaS (Rol Super Admin):** Incorporación de un nivel jerárquico supremo, desvinculado de cualquier instituto (`tenant_id` nulo). Este rol exclusivo para los fundadores y colaboradores de confianza permite operar el SaaS desde un panel maestro independiente, eliminando cuellos de botella al delegar la creación de inquilinos y la gestión comercial.
- **Motor de Facturación y Planes Dinámicos:** Creación de un ecosistema de tablas maestras (`SaaSPlans`, `TenantSubscriptions`, `TenantInvoices`) para administrar la oferta comercial del SaaS. Esto permite cambiar precios, registrar el historial de pagos y emitir facturas desde el frontend, separando el control de acceso del documento contable.
- **Panel de Configuración de Negocio:** Un nuevo apartado administrativo donde cada academia define sus límites operativos. Aquí configurarán su número máximo de congelamientos permitidos, el límite personalizado de lecciones por jornada, y sus plazos para definir inasistencias críticas en el tablero de retención.
- **Gestión de Suscripción del Instituto:** Funcionalidad para gestionar el estado de la cuenta del propio instituto (tu cliente). Capacidad de suspender o reactivar el acceso de sus directores y profesores dependiendo de si tienen su pago de SaaS al día.
- **Sistema de Asistencia "Zero-Hardware" (QR Dinámico):** Generación de códigos QR temporales y firmados criptográficamente (vía JWT, con rotación automática cada ~5 minutos) que se proyectan en la pantalla de la recepción. Esto garantiza la presencia física del alumno y exime al instituto de tener que comprar tablets o hardware dedicado.
- **Portal del Estudiante con Autenticación de Baja Fricción:** Acceso seguro al portal web usando Cédula + PIN de 4 dígitos o Magic Links (vía correo/WhatsApp). Esto elimina la frustración de contraseñas olvidadas en niños y adultos mayores, e integra el escáner web (`html5-qrcode`) para leer el QR de recepción.
- **Check-in Manual (Válvula de Escape):** Una funcionalidad obligatoria en el panel del asesor/recepcionista para registrar de inmediato a estudiantes que lleguen sin celular, sin batería o sin internet, evitando cuellos de botella en la entrada.

### 4. Decisiones Estratégicas y Técnicas (MVP)

Reglas de arquitectura y negocio definidas para acelerar el desarrollo de la primera versión:

- **Planes de Suscripción y Operación (SaaS Billing):** Se ofrecerán inicialmente planes de 1 y 3 meses para reducir el pasivo y validar la retención. Para el MVP, no se programarán integraciones con pasarelas de pago automáticas. En su lugar, el equipo del SaaS operará desde su acceso "Super Admin", registrando las suscripciones y facturas manualmente en la nueva estructura de datos. El sistema bloqueará el acceso automáticamente a los institutos que no renueven a tiempo.
- **Zona Horaria (Timezones):** El MVP operará exclusivamente para Ecuador (`America/Guayaquil`, UTC-5). El backend (NestJS/Sequelize) guardará los timestamps estrictamente en `UTC`, y el frontend (Vite React) será el único responsable de renderizar la hora local.
- **Generación de PDFs al Vuelo:** Para evitar sobrecarga de RAM y costos de almacenamiento, los reportes en PDF no se guardarán en el servidor. NestJS enviará la data estructurada en JSON y el frontend generará el binario al vuelo utilizando librerías de React (`@react-pdf/renderer` o `pdfmake`).
- **Plantilla de Migración (Onboarding Estándar):** Se proveerá a los nuevos clientes un archivo Excel (`.xlsx`) estandarizado con celdas y validaciones bloqueadas. Se creará un único endpoint en NestJS que procese este archivo con `exceljs`, lo pase por los mappers y ejecute un `bulkCreate` en Sequelize, asociando a los alumnos directamente a su `tenant_id`.

### Redacción de los Épicos

Para mantener la pureza del desarrollo, aquí tienes un borrador de cómo se estructurarían los Épicos de esta transición, enfocados exclusivamente en metas funcionales sin especificar detalles de arquitectura ni de interfaz de usuario:

- **Épico 1: Autonomía de Catálogo Académico\***Objetivo:\* Permitir a los administradores del instituto definir, nombrar y jerarquizar sus propios módulos de estudio, para que el sistema soporte de forma nativa cualquier modelo de enseñanza, oferta comercial y reglas de finalización de programa.
- **Épico 2: Motor de Políticas de Asistencia y Check-Out\***Objetivo:\* Proveer a la academia la capacidad de establecer sus propias normativas operativas para la salida de estudiantes, permitiéndoles alternar entre flujos de validación estricta por parte del personal o procesos de auto-registro al finalizar la jornada.
- **Épico 3: Aislamiento Organizacional y Suscripciones\***Objetivo:\* Capacitar al sistema para albergar a múltiples instituciones de forma simultánea e independiente, garantizando la privacidad de los datos operativos de cada cliente y gestionando el ciclo de vida de su acceso a la plataforma.
- **Épico 4: Portal del Estudiante y Control de Asistencia Zero-Hardware\***Objetivo:\* Desplegar un portal personal de baja fricción donde el alumno consuma contenido de valor e implementar un sistema de check-in/check-out mediante el escaneo de códigos QR dinámicos en recepción, garantizando la presencia física sin depender de hardware adicional.
- **Épico 5: Panel Maestro (Super Admin) y Onboarding\***Objetivo:\* Desarrollar las herramientas operativas internas (`admin.tu-saas.com`) para la creación descentralizada de institutos, la gestión administrativa del catálogo de planes de suscripción, la emisión de facturas y la importación masiva de estudiantes mediante plantillas estandarizadas.

# 🏛️ Arquitectura del Proyecto

Este proyecto está construido como un **Monolito Modular**, aplicando los principios de la **Clean Architecture** (Arquitectura Limpia) en el diseño de cada uno de sus módulos.

## 🎯 Clean Architecture

El núcleo de nuestro diseño se basa en la separación estricta de responsabilidades en capas concéntricas. La regla fundamental es la **Regla de Dependencia**: el código fuente solo puede apuntar hacia adentro. Las capas internas no pueden saber absolutamente nada sobre las capas externas (frameworks, bases de datos, APIs de terceros, UI).

### Capas de la Arquitectura

1. **Domain (Dominio)**

   - **Propósito:** Contiene las reglas de negocio puras, la esencia del sistema.
   - **Elementos:** Entidades, Value Objects, Interfaces de Repositorios (Puertos de Infraestructura), Tipos de dominio, Custom Errors.
   - **Dependencias:** **Ninguna.** Es completamente agnóstico a tecnologías. No debe tener imports de `@nestjs/` ni de librerías externas.

2. **Application (Casos de Uso)**

   - **Propósito:** Orquesta la ejecución de tareas específicas del negocio. Representa lo que la aplicación _hace_.
   - **Elementos:** Casos de Uso (Use Cases), DTOs internos.
   - **Dependencias:** Solo puede importar desde la capa de `Domain`. Inyecta los puertos (interfaces) para comunicarse con el exterior sin conocer la implementación.

3. **Infrastructure (Infraestructura)**

   - **Propósito:** Implementación técnica de los detalles. Aquí es donde el software interactúa con el mundo real.
   - **Elementos:** Implementaciones de Repositorios, Adaptadores de APIs externas, Modelos ORM (Sequelize), Mappers, Servicios de correo/archivos.
   - **Dependencias:** Conoce `Domain` y `Application` para implementar sus interfaces y retornar sus tipos de datos.

4. **Presentation (Presentación)**
   - **Propósito:** Punto de entrada y salida de datos de cara al cliente (REST, GraphQL, gRPC).
   - **Elementos:** Controladores, Guards, Interceptors, Pipes, DTOs de Request/Response.
   - **Dependencias:** Conoce `Application` para invocar los Casos de Uso, y puede utilizar tipos de `Domain`.

## 🧩 Monolito Modular

En lugar de construir una aplicación gigante sin límites, agrupamos las funcionalidades en **Macro-Dominios** o Bounded Contexts (ej. `core-saas`, `iam`, `classtrack`, `admindesk`). Dentro de cada macro-dominio, existen sub-módulos autónomos que contienen su propia estructura de Clean Architecture.

El acoplamiento entre estos módulos debe mantenerse al mínimo. Si un módulo necesita comunicarse con otro, no debe acceder directamente a su infraestructura ni a su base de datos, sino consumir sus servicios de aplicación públicos o interactuar mediante eventos.

---

## 🛠️ Código Transversal (Shared)

El directorio `src/shared/` contiene código transversal de apoyo que es utilizado en toda la aplicación, pero que **no contiene reglas de negocio**.

### Reglas para Helpers y Utilidades

Es fundamental comprender la diferencia entre funciones utilitarias y servicios de infraestructura al crear herramientas en `shared/`:

✅ **Cuándo SÍ usar clases estáticas (o funciones puras exportadas):**
Son ideales para operaciones que solo transforman datos en memoria **sin efectos secundarios**. Ejemplos perfectos son formateadores de fechas, sanitización de strings o cálculos matemáticos simples.
_(Nota: en TypeScript, a menudo es más idiomático exportar funciones simples directamente en lugar de agruparlas artificialmente en una clase estática como se haría en lenguajes como C#)._

❌ **Cuándo NO usar clases estáticas:**
Nunca las uses para operaciones que dependan de infraestructura externa, librerías de terceros complejas o generen efectos secundarios.
Por ejemplo, si haces que tu `BcryptAdapter` o tu `HashUtils` sean estáticos, estarás acoplando rígidamente tus Casos de Uso a esa librería de encriptación específica. Esto rompe el Principio de Inversión de Dependencias (la letra 'D' de SOLID) y vuelve tu código extremadamente difícil de falsear (mockear) durante las pruebas unitarias.

**Solución:** Define una interfaz en tu Dominio (ej. `IHashService`), crea la implementación en Infraestructura (o en Shared si es global), e inyéctala mediante el contenedor de Inyección de Dependencias (DI) de NestJS.

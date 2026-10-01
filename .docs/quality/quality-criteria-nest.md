# Criterios de Calidad de Código para NestJS 🟩

## Base

### Objetivos Principales

- **Sin errores no controlados:** Durante la ejecución o carga de datos, la aplicación no debe romperse.
- **Compatibilidad:** El código debe funcionar correctamente en la versión LTS del entorno del servidor (NodeJS) y no causar errores en diferentes sistemas operativos.

### Nomenclatura

- **camelCase:** Los nombres de variables, parámetros, propiedades y métodos comienzan con minúscula y usan notación `camelCase`.
- **Inglés:** Se utilizan sustantivos en inglés para variables y propiedades. Las abreviaturas están prohibidas salvo que sean de uso muy común (como `err`, `i`, etc.). No se permite transliteración en ningún formato.
- **Sin tipo de dato:** Los nombres de variables no deben incluir su tipo de dato (ej. usar `cat` en lugar de `catObject`).
- **Plurales para colecciones:** Los arrays deben nombrarse con sustantivos en plural (ej. `users` en lugar de `user`).
- **Booleanos:** Las variables booleanas deben comenzar con un prefijo que pueda responderse con "sí" o "no" (ej. `isLogin`, `hasFriends`).
- **Funciones:** Deben comenzar con un verbo (ej. `getRandomNumber` en lugar de `randomNumber`).
- **Clases:** Se nombran con sustantivos en inglés utilizando `PascalCase`. Si incluyen acrónimos, solo la primera letra del acrónimo va en mayúscula (ej. `XMLHttpRequest`).
- **Constantes:** Se escriben en mayúsculas separadas por guiones bajos (`UPPER_SNAKE_CASE`).
- **Enums:** En este proyecto se deben utilizar **Enums nativos de TypeScript** siempre asignando valores String explícitos (`enum Name { KEY = 'KEY' }`).
  - _Razón:_ Los Enums nativos se integran perfectamente con `@IsEnum` de `class-validator` y la autogeneración de Swagger/GraphQL en NestJS.
  - _Prohibido:_ Está prohibido crear enums basados en POJOs (`const Enum = {} as const`) o enums numéricos implícitos.
- **Archivos y Carpetas:** Se utiliza `kebab-case` (letras minúsculas separadas por guiones) para evitar conflictos entre sistemas operativos.

**Ejemplos de Nomenclatura:**

```typescript
// ❌ Mal
const catObject = { name: 'Tom' }; // Tipo de dato en nombre
const user = []; // Array en singular
const login = true; // Booleano sin prefijo
function randomNumber() {} // Función sin verbo
class xml_http_request {} // Clase sin PascalCase

// ✅ Bien
const cat = { name: 'Tom' };
const users = [];
const isLogin = true;
function getRandomNumber() {}
class XmlHttpRequest {}

enum UserRole {
  ADMIN = 'ADMIN',
  GUEST = 'GUEST',
}

// ❌ Mal (POJO Enum prohibido)
const Status = {
  ACTIVE: 'ACTIVE',
} as const;
type Status = (typeof Status)[keyof typeof Status];
```

### Formato y Estructura

- **Linters:** El código debe coincidir con el estilo del proyecto, sin errores al revisar con linters (ESLint, Prettier). No se deben deshabilitar reglas en el código fuente.
- **Llaves obligatorias:** En cualquier construcción de bloque (`if`, `for`, `switch`), las llaves son requeridas, incluso si la declaración es de una sola línea.
- **Agrupación de constantes:** Los conjuntos de constantes del mismo tipo deben agruparse en Enums. Constantes de diferentes contextos deben ir en Enums separados.
- **Modificadores de acceso:** Todas las propiedades y métodos de las clases deben marcarse explícitamente (`private`, `public` o `protected`).
- **Sin valores mágicos:** No se deben utilizar "valores mágicos"; cada uno debe tener una variable separada nombrada como constante.

**Ejemplos de Estructura:**

```typescript
// ❌ Mal
if (isValid) return true; // Sin llaves
const maxRetries = 3; // Valor mágico directo en código

class UserService {
  users = []; // Sin modificador de acceso
}

// ✅ Bien
if (isValid) {
  return true;
}

const MAX_RETRIES = 3;
const maxRetries = MAX_RETRIES;

class UserService {
  private users = [];
}
```

### Limpieza de Código (Rubbish)

- **Versiones fijas:** Las versiones de las dependencias deben fijarse exactamente en el `package.json` (no se permite el uso de `^`, `*` o `~`).
- **Sin dependencias muertas:** No deben existir dependencias sin uso en el proyecto.
- **Código muerto:** No deben existir archivos, módulos, ni partes de código que no se usen, incluyendo bloques de código comentado.

### Corrección de Ejecución

- **Inmutabilidad de constantes:** Las constantes y enums no deben ser redefinidas en ninguna parte.
- **Operaciones correctas:** No deben existir operaciones potencialmente incorrectas o uso indebido de las APIs nativas (ej. sumar valores de distintos tipos sin parsearlos primero).
- **Módulos seguros:** Los módulos no deben exportar variables mutables. Solo exportar variables cuyo valor no cambiará.
- **Nombres de archivos:** El nombre del módulo debe corresponder exactamente a su contenido lógico.
- **Archivos index:** No se permiten archivos `index` como barriles de exportación, salvo como punto de entrada de la aplicación.

### Base de Datos y Seguridad

- **Métodos HTTP:** Está prohibido usar métodos GET para escribir o mutar datos.
- **Inyecciones SQL:** Todas las consultas a la base de datos deben estar protegidas contra inyecciones SQL.
- **Contraseñas:** Las contraseñas siempre deben almacenarse hasheadas.
- **Migraciones:** Las migraciones deben poder ejecutarse en ambas direcciones (up y down) sin errores, preservando la consistencia de los datos.

---

## Avanzado

### Sintaxis y Modernidad

- **Sintaxis moderna:** Se prefiere el uso de sintaxis reciente de JS/TS, como Optional Chaining (`?.`) y Nullish Coalescing (`??`), en lugar de los operadores lógicos antiguos (`&&`, `||`).

**Ejemplos de Sintaxis:**

```typescript
// ❌ Mal
const city = user && user.address && user.address.city;
const limit = options.limit !== null && options.limit !== undefined ? options.limit : 10;

// ✅ Bien
const city = user?.address?.city;
const limit = options.limit ?? 10;
```

### Nomenclatura y Arquitectura

- **Abstracciones:** Las clases abstractas o interfaces deben tener nombres genéricos y no contener detalles de implementación.
- **Redundancia de nombres:** Los nombres de propiedades o métodos no deben repetir el nombre del objeto o módulo (ej. en el objeto `user`, la propiedad debe ser `name` en lugar de `userName`).

### Uniformidad

- **Uso de interfaces:** Las interfaces se utilizan exclusivamente para implementar (`implements`) clases.
- **Estilo de variables:** Se debe mantener un estilo uniforme en todos los módulos para nombrar variables similares.
- **Uso de API:** Si hay varias formas de resolver un mismo problema mediante distintas APIs, se debe estandarizar y usar una sola a lo largo de todo el proyecto.

### Redundancia y Modularidad

- **Operador ternario:** Cuando sea posible y no se aniden, se debe usar el operador ternario en lugar de un `if` para asignar valores.
- **Condicionales simples:** Las funciones que retornan booleanos no deben usar bloques `if/else` innecesarios; deben retornar la evaluación directamente.
- **Extracción de módulos:** Si el mismo código se repite en varios módulos, se debe extraer a un módulo o utilidad independiente.

**Ejemplos de Redundancia:**

```typescript
// ❌ Mal (If/else innecesario)
function isAdult(age: number): boolean {
  if (age >= 18) {
    return true;
  } else {
    return false;
  }
}

// ✅ Bien (Retorno directo)
function isAdult(age: number): boolean {
  return age >= 18;
}

// ❌ Mal (If para asignar)
let role = '';
if (isAdmin) {
  role = 'admin';
} else {
  role = 'user';
}

// ✅ Bien (Ternario)
const role = isAdmin ? 'admin' : 'user';
```

### Optimalidad y Complejidad

- **Uso de any:** El tipo `any` está estrictamente prohibido. Si no se conoce el tipo, se debe preferir `unknown`.
- **Iteración de bucles:** Utilice el bucle `for/of` en lugar de `for` clásico para iterar sobre colecciones donde no se requiere índice.
- **División de funciones:** Las funciones o métodos muy largos deben dividirse en partes más pequeñas.
- **Iteradores funcionales:** Para operar sobre colecciones se debe preferir el uso de iteradores de arrays (`forEach`, `map`, `filter`).

---

## 📚 Referencias

Este documento ha sido adaptado y basado originalmente en los **Criterios de Calidad para JavaScript/TypeScript** elaborados por la **Binary Studio Academy**.
Puedes consultar el material de origen en el siguiente enlace:
🔗 [Binary Studio Academy - JavaScript Quality Criteria](https://github.com/BinaryStudioAcademy/quality-criteria/blob/production/src/javascript.md)

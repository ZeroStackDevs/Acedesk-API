/** @type {import('eslint').Rule.RuleModule} */
const preferStaticClass = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Exige usar clases estáticas en lugar de objetos literales para agrupar funciones/métodos.',
      recommended: true,
    },
    messages: {
      useClass:
        'Usa una `class` con métodos `static` en lugar de un objeto literal para agrupar funciones (ej. `export class Helper { static method() {} }`).',
    },
  },
  create(context) {
    return {
      VariableDeclarator(node) {
        if (!node.init || node.init.type !== 'ObjectExpression') {
          return;
        }

        const objectNode = node.init;

        // Si el objeto está vacío, lo ignoramos
        if (objectNode.properties.length === 0) {
          return;
        }

        let allFunctions = true;
        for (const prop of objectNode.properties) {
          // Ignoramos el SpreadElement (...)
          if (prop.type !== 'Property') {
            allFunctions = false;
            break;
          }

          // Verificamos si el valor de la propiedad es una función (método o arrow function)
          const isFunction = prop.value.type === 'FunctionExpression' || prop.value.type === 'ArrowFunctionExpression';

          if (!isFunction) {
            allFunctions = false;
            break;
          }
        }

        // Si TODAS las propiedades son funciones, sugerimos usar una clase estática
        if (allFunctions) {
          context.report({
            node: node.id,
            messageId: 'useClass',
          });
        }
      },
    };
  },
};

export { preferStaticClass };

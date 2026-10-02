import path from 'node:path';

/** @type {import('eslint').Rule.RuleModule} */
const enforceAbsoluteImports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce absolute imports using @/ alias and autofix relative imports',
      recommended: true,
    },
    fixable: 'code',
    messages: {
      useAbsolute: 'Usa una ruta absoluta (@/...) en lugar de una ruta relativa.',
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        // Solo analizamos rutas relativas (que empiezan con '.' o '..')
        if (importPath.startsWith('.')) {
          const filename = context.filename || context.getFilename();
          const currentDir = path.dirname(filename);
          const cwd = context.cwd;
          const srcDir = path.join(cwd, 'src') + path.sep;

          // Resolvemos la ruta absoluta en el sistema de archivos
          const resolvedImportPath = path.resolve(currentDir, importPath);

          // Verificamos si lo que se importa está dentro de la carpeta 'src'
          if (resolvedImportPath.startsWith(srcDir)) {
            let relativeToSrc = resolvedImportPath.substring(srcDir.length);
            // Por si acaso estamos en Windows, normalizamos los slashes
            relativeToSrc = relativeToSrc.split(path.sep).join('/');

            const newImportPath = `@/${relativeToSrc}`;

            // Verificamos comillas. Preferimos comillas simples por Prettier.
            const quote = node.source.raw.charAt(0);
            const replacementQuote = quote === '"' || quote === "'" || quote === '`' ? quote : "'";

            context.report({
              node: node.source,
              messageId: 'useAbsolute',
              fix(fixer) {
                return fixer.replaceText(node.source, `${replacementQuote}${newImportPath}${replacementQuote}`);
              },
            });
          }
        }
      },
    };
  },
};

export { enforceAbsoluteImports };

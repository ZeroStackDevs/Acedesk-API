/**
 * Regla ESLint personalizada: no-commented-code
 *
 * Detecta bloques de código comentado en archivos TypeScript.
 * Usa la API moderna de ESLint (sourceCode) compatible con ESLint 10+.
 *
 * Criterio de calidad: No deben existir archivos, módulos ni partes
 * de código que no se usen, incluyendo bloques de código comentado.
 */

/** @type {import('eslint').Rule.RuleModule} */
const noCommentedCode = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow commented-out code blocks',
      recommended: true,
    },
    schema: [],
    messages: {
      commentedCode: 'Commented-out code detected. Remove it or restore it.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;

    // Patrones que indican código comentado (no documentación)
    const CODE_PATTERNS = [
      /^\s*(const|let|var|function|class|import|export|return|if|for|while|switch|throw|try|catch)\b/,
      /^\s*\w[\w.]*\s*[=(]/, // asignaciones o llamadas: foo = , foo(
      /^\s*\/\//, // comentarios doble barra anidados
      /=>/, // arrow functions
    ];

    const IGNORE_PATTERNS = [
      /^\s*eslint-/i, // directivas eslint
      /^\s*@/, // anotaciones JSDoc / decoradores
      /^\s*TODO/i,
      /^\s*FIXME/i,
      /^\s*NOTE/i,
      /^\s*HACK/i,
      /^\s*\*/, // líneas de bloque JSDoc
    ];

    function looksLikeCode(text) {
      const lines = text
        .split('\n')
        .map((l) => l.replace(/^[\s/*]+/, '').trim())
        .filter(Boolean);
      if (lines.length === 0) return false;
      return lines.some((line) => !IGNORE_PATTERNS.some((p) => p.test(line)) && CODE_PATTERNS.some((p) => p.test(line)));
    }

    return {
      Program() {
        const comments = sourceCode.getAllComments();
        for (const comment of comments) {
          const text = comment.value;
          if (looksLikeCode(text)) {
            context.report({ node: comment, messageId: 'commentedCode' });
          }
        }
      },
    };
  },
};

export { noCommentedCode };

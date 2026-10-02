module.exports = {
  // 1. Código fuente: Aplica formato, linter y reglas de arquitectura
  'src/**/*.ts': ['prettier --write', 'eslint --fix', 'depcruise --config .dependency-cruiser.js'],
  // 2. Pruebas: Solo aplica formato y linter (sin reglas de arquitectura)
  'test/**/*.ts': ['prettier --write', 'eslint --fix'],
  // 3. Archivos TypeScript en la raíz (ej. configuraciones como jest.config.ts)
  '*.ts': ['prettier --write', 'eslint --fix'],
  // 4. Documentación y otras Configuraciones: Solo formato
  '**/*.{js,json,md,yaml,yml}': ['prettier --write'],
};

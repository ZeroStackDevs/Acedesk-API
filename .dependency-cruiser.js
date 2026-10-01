/** @type {import('dependency-cruiser').IConfiguration} */
const dependencyCruiserConfiguration = {
  forbidden: [
    /* RULE 1: Pureza del Dominio */
    {
      name: 'domainMustBePure',
      severity: 'error',
      comment: 'El Domain no debe depender de ninguna capa externa, excepto los dtos de application.',
      from: { path: '(/|^)domain(/|$)' },
      to: {
        path: '(/|^)(application|infrastructure|presentation|di)(/|$)',
        pathNot: '(/|^)application/.*/dtos(/|$)',
      },
    },

    /* RULE 2: Aislamiento de la Aplicación */
    {
      name: 'applicationCannotDependOnInfrastructure',
      severity: 'error',
      comment: 'Application (Casos de uso) solo debe interactuar con el Domain.',
      from: { path: '(/|^)application(/|$)' },
      to: { path: '(/|^)(infrastructure|presentation|di)(/|$)' },
    },

    /* RULE 3: Aislamiento de la Infraestructura */
    {
      name: 'infrastructureCannotDependOnApplication',
      severity: 'error',
      comment: 'Infrastructure no debe conocer los casos de uso ni la UI, excepto los dtos de application.',
      from: { path: '(/|^)infrastructure(/|$)' },
      to: {
        path: '(/|^)(application|presentation|di)(/|$)',
        pathNot: '(/|^)application/.*/dtos(/|$)',
      },
    },

    /* RULE 4: Agnosticismo del Dominio */
    {
      name: 'domainCannotDependOnExternalModules',
      severity: 'warn',
      comment: 'El Domain debe ser agnóstico a librerías de terceros.',
      from: { path: '(/|^)domain(/|$)' },
      to: { path: '(/|^)node_modules(/|$)' },
    },
  ],
  options: {
    doNotFollow: {
      path: '(node_modules|android|dist|build)',
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.json',
    },
  },
};

export default dependencyCruiserConfiguration;

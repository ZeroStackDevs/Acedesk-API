import type { UserConfig } from "@commitlint/types";

const commitlintConfiguration: UserConfig = {
    extends: [],
    rules: {
        "type-enum": [2, "always", ["feat", "fix", "docs", "style", "refactor", "chore"]],
        "type-case": [2, "always", "lower-case"],
        "type-empty": [2, "never"],

        "scope-enum": [
            2,
            "always",
            [
                // Dominios de Negocio
                "core",       // Módulo principal SaaS (Super Admin, Facturación B2B)
                "admindesk",  // Módulo de gestión del instituto (Estudiantes, Niveles, Pagos)
                "classtrack", // Módulo de control de asistencia y rendimiento (Kiosco, Retención)
                "security",   // Módulo Auth, Guards, JWT y Claims-Based RBAC
                
                // Capas Técnicas y Clean Architecture
                "api",        // Controladores, rutas, filtros globales
                "database",   // Sequelize, DatabaseModule, migraciones, modelos
                "infra",      // Configuraciones de NestJS, Docker, entornos
                
                // Mantenimiento transversal
                "deps",       // Modificaciones en package.json, pnpm-lock.yaml
                "tools",      // Configuraciones de eslint, prettier, tsconfig
                "docs",       // README.md, documentación técnica
                "root",       // Archivos en la raíz del proyecto
                "ci",         // GitHub Actions, .husky
            ],
        ],
        "scope-case": [2, "always", "kebab-case"],
        "scope-empty": [1, "never"],

        "subject-case": [0],
        "subject-empty": [2, "never"],
        "subject-full-stop": [2, "never", "."],
        "header-max-length": [2, "always", 120],
    },
};

export default commitlintConfiguration;
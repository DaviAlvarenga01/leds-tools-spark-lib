/**
 * Modules Generator Module
 * 
 * This module generates feature modules based on the project's entities.
 * Each module is a self-contained feature with its own API integration,
 * views, routes, and type definitions.
 * 
 * Module Structure:
 * module/
 * ├── api/          - API integration
 * ├── controllers/  - Business logic
 * ├── routes/       - Module routing
 * ├── types/        - Type definitions
 * └── views/        - Module-specific views
 */

import { createPath } from "../../../../util/generator-utils.js";
import { generate as generateAPI} from "./api/generate.js"
import { generate as generateControllers} from "./controllers/generate.js"
import { generate as generateRoutes} from "./routes/generate.js"
import { generate as generateTypes} from "./types/generate.js"
import { generate as generateViews } from "./views/generate.js"
import fs from "fs"
import { expandToString } from "../../../../util/template-string.js";
import path from "path"
import SEON from "seon-lib-implementation";

/**
 * Main modules generator function
 * 
 * Creates module directories and files for each entity in the project.
 * 
 * @param project_abstraction - Project structure with entity definitions
 * @param target_folder - Base directory for module generation
 * 
 * Generated per Module:
 * - API integration layer
 * - Business logic controllers
 * - Route definitions
 * - Type declarations
 * - CRUD views
 */
export function generate(project_abstraction: SEON.ProjectAbstraction, target_folder: string) : void {
    const classList : SEON.ClassAbstraction[] = []

    for (const pkg of project_abstraction.getCoresPackages()) {
        for (const clazz of pkg.getPackageLevelClasses()){
            classList.push(clazz)
        }
    }

    fs.writeFileSync(path.join(target_folder, 'index.ts'), generateModulesIndex(classList));

    for (const cls of classList) {
        const folder = createPath(target_folder, `${cls.getName()}`)
        fs.mkdirSync(folder, {recursive:true})
        generateModule(project_abstraction, cls, folder)
    }
}

/**
 * Generates the main module index file
 * 
 * Creates an index.ts that exports all module routes and serves as the
 * entry point for module functionality.
 * 
 * @param clsList - List of entity classes to generate modules for
 * @returns Module index file content
 * 
 * Features:
 * - Route aggregation
 * - Type-safe exports
 * - Dynamic module loading
 */
function generateModulesIndex(clsList : SEON.ClassAbstraction[]) : string {
    return expandToString`
import { type RouteRecordRaw } from 'vue-router'

${generateImportClass(clsList)}

export const routes: RouteRecordRaw[] = [
${generateExportClass(clsList)}
]
`
}

/**
 * Generates import statements for module routes
 * 
 * Creates import statements for each entity module's routes.
 * 
 * @param clsList - List of entity classes to import routes from
 * @returns Import statements string
 * 
 * Example output:
 * ```typescript
 * import { routes as userRoute } from './User'
 * import { routes as productRoute } from './Product'
 * ```
 */
function generateImportClass(clsList: SEON.ClassAbstraction[]) : string {
    let str = ""

    for (const cls of clsList) {
        str = str.concat(`import { routes as ${cls.getName().toLowerCase()}Route } from './${cls.getName()}'\n`)
    }

    return str
}

function generateExportClass(clsList: SEON.ClassAbstraction[]) : string {
    let str = ""

    for (const cls of clsList) {
        str = str.concat(`  ...${cls.getName().toLowerCase()}Route,\n`)
    }

    return str
}

function generateModule(project_abstraction: SEON.ProjectAbstraction, cls: SEON.ClassAbstraction, target_folder: string) : void {
    fs.writeFileSync(path.join(target_folder, 'index.ts'), generateModIndex(cls))

    const api_folder = createPath(target_folder, "api")
    const controllers_folder = createPath(target_folder, "controllers")
    const routes_folder = createPath(target_folder, "routes")
    const types_folder = createPath(target_folder, "types")
    const views_folder = createPath(target_folder, "views")

    fs.mkdirSync(api_folder, {recursive:true})
    fs.mkdirSync(controllers_folder, {recursive:true})
    fs.mkdirSync(routes_folder, {recursive:true})
    fs.mkdirSync(types_folder, {recursive:true})
    fs.mkdirSync(views_folder, {recursive:true})

    generateAPI(project_abstraction, cls, api_folder)
    generateControllers(project_abstraction, cls, controllers_folder)
    generateRoutes(project_abstraction, cls, routes_folder)
    generateTypes(project_abstraction, cls, types_folder)
    generateViews(project_abstraction, cls, views_folder)
}

function generateModIndex(cls: SEON.ClassAbstraction) : string {
    return expandToString`
import { type RouteRecordRaw } from 'vue-router'
import { routes as _routes } from './routes'

export const routes: RouteRecordRaw[] = [
  {
    path: '/${cls.getName()}',
    children: _routes,
    meta: {
      requiresAuth: true
    }
  }
]
`
}
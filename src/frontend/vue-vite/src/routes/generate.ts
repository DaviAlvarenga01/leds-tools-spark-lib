/**
 * Routes Generator Module
 * 
 * This module generates Vue Router configuration files that define the application's
 * routing structure. It sets up route definitions, navigation guards, and route-level
 * component mappings to create a complete routing system.
 * 
 * Key Features:
 * - Authentication-aware routing
 * - Dynamic route generation based on project classes
 * - Default route configuration
 * - Navigation guard implementation
 * 
 * Generated Files:
 * - index.ts: Main router configuration with route definitions
 */

import fs from "fs"
import { expandToString } from "../../../../util/template-string.js";
import path from "path"
import SEON from "seon-lib-implementation";

/**
 * Main route generator function
 * 
 * Creates the Vue Router configuration file that defines all application
 * routes. The routes are generated based on the project's class structure
 * and include authentication checks and navigation guards.
 * 
 * @param project_abstraction - Project metadata for generating class-based routes
 * @param target_folder - Directory where the router config will be saved
 * 
 * Generated Structure:
 * routes/
 * └── index.ts    - Main router configuration with route definitions
 */
export function generate(project_abstraction: SEON.ProjectAbstraction, target_folder: string) : void {
    fs.writeFileSync(path.join(target_folder, 'index.ts'), generateIndex(project_abstraction, target_folder))
}

/**
 * Generates the main router configuration
 * 
 * Creates the Vue Router configuration file that includes route definitions,
 * authentication checks, and dynamic routes based on project classes.
 * The generated configuration includes:
 * - Default login route with authentication check
 * - Dynamic routes for each class in the project
 * - Navigation guards for protected routes
 * 
 * Route Structure:
 * - / (login) - Default route with authentication redirect
 * - /{class}-home - List view for each class
 * - /{class}-criar - Creation view for each class
 * 
 * @param project_abstraction - Project metadata for generating class-based routes
 * @param target_folder - Directory where the router config will be saved
 * @returns {string} Vue Router configuration content
 */
function generateIndex(project_abstraction: SEON.ProjectAbstraction, target_folder: string): string {
    const classList : SEON.ClassAbstraction[] = []

    for (const pkg of project_abstraction.getCoresPackages()) {
        for (const clazz of pkg.getPackageLevelClasses()){
            classList.push(clazz)
        }
    }

    return expandToString`
import { type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Login from '@/views/Login.vue'



export const routes: RouteRecordRaw[] = [
  {
    name: 'login',
    path: '/',
    // impedindo que o usuario navege para a pagina de login
    // se estiver logado
    beforeEnter: () => {
      const auth = useAuthStore()
      if (auth.estaLogado()) {
        return { name: '${classList[0].getName().toLowerCase()}-home' }
      }
      return true

    },
    component: Login
  }
]
`
}
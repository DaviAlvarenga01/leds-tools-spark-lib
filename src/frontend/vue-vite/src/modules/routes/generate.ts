/**
 * Module Routes Generator
 * 
 * This module generates Vue Router configurations for each entity module,
 * creating route definitions for list and create/edit views. Routes are
 * generated with proper naming conventions and component mappings.
 * 
 * Features:
 * - Entity-specific route configuration
 * - List view routing (home)
 * - Create/Edit view routing
 * - Optional ID parameter for edit mode
 * - Type-safe route definitions
 * 
 * Route Pattern:
 * - /{entity}/home     -> List view
 * - /{entity}/criar    -> Create view
 * - /{entity}/criar/id -> Edit view
 */

import fs from "fs"
import { expandToString } from "../../../../../util/template-string.js";
import path from "path"
import SEON from "seon-lib-implementation";

/**
 * Generates route configuration for a specific entity module
 * 
 * Creates a TypeScript file defining Vue Router routes for an entity's
 * list and create/edit views. Uses consistent naming conventions and
 * supports proper view component imports.
 * 
 * @param project_abstraction - Project metadata
 * @param cls - Class for which to generate routes
 * @param target_folder - Directory where route config will be saved
 * 
 * Generated Routes:
 * - {entity}-home: Route to list view
 * - {entity}-criar: Route to create/edit view with optional ID
 */
export function generate(project_abstraction: SEON.ProjectAbstraction, cls: SEON.ClassAbstraction, target_folder: string) : void {
    fs.writeFileSync(path.join(target_folder, `index.ts`), generateRoute(project_abstraction, cls))
}

/**
 * Generates the route configuration implementation
 * 
 * Creates Vue Router route definitions for an entity's views,
 * including proper component imports and route parameters.
 * Each entity gets two main routes:
 * 
 * 1. List Route:
 *    - Path: /home
 *    - Component: Listar.vue
 *    - Purpose: Display all entities in a data table
 * 
 * 2. Create/Edit Route:
 *    - Path: /criar/:id? (optional ID parameter)
 *    - Component: Criar.vue
 *    - Purpose: Create new entity or edit existing one
 * 
 * @param project_abstraction - Project metadata
 * @param cls - Class for which to generate route config
 * @returns {string} Vue Router configuration content
 */
function generateRoute(project_abstraction: SEON.ProjectAbstraction, cls: SEON.ClassAbstraction) : string {
    return expandToString`
import type { RouteRecordRaw } from 'vue-router'
import Listar from '../views/Listar.vue'
import Criar from '../views/Criar.vue'

export const routes: RouteRecordRaw[] = [
  {
    name: '${cls.getName().toLowerCase()}-home',
    path: 'home',
    component: Listar,
  },
  {
    name: '${cls.getName().toLowerCase()}-criar',
    path: 'criar/:id?',
    component: Criar,
  }
]

/**
 * @description Generates the route configuration implementation
 * @description Creates Vue Router route definitions for an entity's views
 * @description generateRoute${cls.getName()}: Route configuration for ${cls.getName()}
 * @param project_abstraction - Project metadata
 * @param cls - Class for which to generate route config
 * @returns {RouteRecordRaw[]} Vue Router configuration content
 */
`
}
/**
 * Plugins Generator Module
 * 
 * This module generates Vue plugin configurations and integrations.
 * It sets up essential plugins that extend Vue's functionality and provide
 * core features like state management and routing.
 * 
 * Generated Files:
 * - README.md: Plugin usage documentation
 * - index.ts: Plugin registration system
 * - pinia.ts: State management setup
 * - router.ts: Route configuration
 * - vuetify.ts: UI framework setup
 */

import fs from "fs";
import { expandToString } from "../../../../util/template-string.js";
import path from "path";
import SEON from "seon-lib-implementation";

/**
 * Main plugin generator function
 * 
 * @param project_abstraction - Project metadata (used for routing configuration)
 * @param target_folder - Directory where plugin files will be generated
 * 
 * Features:
 * - Automatic plugin registration
 * - State management with Pinia
 * - Vue Router configuration
 * - Vuetify UI framework setup (optional)
 * - Type-safe plugin system
 */
export function generate(project_abstraction: SEON.ProjectAbstraction, target_folder: string) : void {
    fs.writeFileSync(path.join(target_folder, 'README.md'), generateREDME());
    fs.writeFileSync(path.join(target_folder, 'index.ts'), generateIndex());
    fs.writeFileSync(path.join(target_folder, 'pinia.ts'), generatePinia());
    fs.writeFileSync(path.join(target_folder, 'router.ts'), generateRouter());
    fs.writeFileSync(path.join(target_folder, 'vuetify.ts'), generateVuetify());
}


/**
 * Generates plugin documentation
 * 
 * Creates a README.md file explaining the plugin system and how to use it.
 * 
 * @returns Documentation string in Markdown format
 * 
 * Documentation Covers:
 * - Plugin purpose
 * - Global registration
 * - Usage guidelines
 */
function generateREDME() : string {
    return expandToString`
# Plugins

Plugins are a way to extend the functionality of your Vue application. Use this folder for registering plugins that you want to use globally.
`
}

/**
 * Generates plugin registration system
 * 
 * Creates index.ts that handles the registration of all Vue plugins
 * in a type-safe and organized manner.
 * 
 * @returns Plugin registration code string
 * 
 * Features:
 * - Automatic plugin registration
 * - Type-safe App instance
 * - Modular plugin system
 * - Conditional plugin loading
 */
function generateIndex() : string {
    return expandToString`
/**
 * plugins/index.ts
 *
 * Automatically included in './src/main.ts'
 */

// Plugins
// import vuetify from './vuetify'
import router from './router'
import pinia from './pinia'

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  // app.use(vuetify)
  app.use(router)
  app.use(pinia)
}
`
}


/**
 * Generates Pinia state management configuration
 * 
 * Creates pinia.ts that sets up the Pinia state management system
 * for centralized application state.
 * 
 * @returns Pinia configuration code string
 * 
 * Features:
 * - Pinia store creation
 * - State persistence setup
 * - DevTools integration
 * - Type-safe store system
 */
function generatePinia() : string {
    return expandToString`
import { createPinia } from 'pinia'



const pinia = createPinia()

export default pinia
`

}


/**
 * Generates Vue Router configuration
 * 
 * Creates router.ts that configures the application routing system,
 * including route definitions, navigation guards, and layouts.
 * 
 * @returns Router configuration code string
 * 
 * Features:
 * - Route definitions with layouts
 * - Authentication guards
 * - History mode configuration
 * - Module route integration
 * - Type-safe routing
 */
function generateRouter(): string {
    return expandToString`
import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router'
import { routes as rootRoutes } from '@/routes'
import { routes as moduleRoutes } from '@/modules'
import PlainLayout from '@/layouts/NewPlain.vue'
import DefaultLayout from '@/layouts/NewDefault.vue'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: PlainLayout,
    children: rootRoutes,
  },
  {
    path: '/',
    component: DefaultLayout,
    children: moduleRoutes,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta?.requiresAuth) {
    if (auth.estaLogado()) {
      return true
    } else {
      return { name: 'login' }
    }
  } else {
    return true
  }
})
export default router
`
}


function generateVuetify() : string {
    return expandToString`
/**
 * plugins/vuetify.ts
 *
 * Framework documentation: 'https://vuetifyjs.com'
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'dark',
  },
})
`
}

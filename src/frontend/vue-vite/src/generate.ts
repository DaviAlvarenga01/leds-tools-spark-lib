/**
 * Vue Application Source Generator Module
 * 
 * This module orchestrates the generation of a complete Vue.js application
 * structure, creating all necessary directories and files following a
 * modular architecture pattern.
 * 
 * Application Structure:
 * src/
 * ├── api/          - API client and configurations
 * ├── assets/       - Static assets and styles
 * ├── components/   - Reusable Vue components
 * │   ├── icons/    - Icon components
 * │   └── sidenav/  - Navigation components
 * ├── layouts/      - Page layout templates
 * ├── modules/      - Feature modules (per entity)
 * ├── plugins/      - Vue plugins and integrations
 * ├── routes/       - Router configuration
 * ├── stores/       - State management (Pinia)
 * ├── types/        - TypeScript declarations
 * ├── utils/        - Utility functions
 * ├── views/        - Page components
 * ├── App.vue       - Root component
 * └── main.ts       - Application entry point
 */

import fs from "fs";
import { createPath } from "../../../util/generator-utils.js";
import { expandToString } from "../../../util/template-string.js";
import path from "path";

import { generate as generateAPI } from "./api/generate.js";
import { generate as generateAssets } from "./assets/generate.js";
import { generate as generateComponents} from "./components/generate.js"
import { generate as generateIcons} from "./components/icons/generate.js"
import { generate as generateSidenav} from "./components/sidenav/generate.js"
import { generate as generateLayouts} from "./layouts/generate.js"
import { generate as generateModules} from "./modules/generate.js"
import { generate as generatePlugins} from "./plugins/generate.js"
import { generate as generateRoutes} from "./routes/generate.js"
import { generate as generateStores} from "./stores/generate.js"
import { generate as generateTypes } from "./types/generate.js";
import { generate as generateViews} from "./views/generate.js"
import { generate as generateUtils} from "./utils/generate.js"
import SEON from "seon-lib-implementation";

export function generate(project_abstraction: SEON.ProjectAbstraction, target_folder: string) : void {

    const src_folder = createPath(target_folder, "src")
    const api_folder = createPath(src_folder, "api")
    const assets_folder = createPath(src_folder, "assets")
    const components_folder = createPath(src_folder, "components")
    const icons_folder = createPath(components_folder, "icons")
    const sidenav_folder = createPath(components_folder, "sidenav")
    const layouts_folder = createPath(src_folder, "layouts")
    const modules_folder = createPath(src_folder, "modules")
    const plugins_folder = createPath(src_folder, "plugins")
    const routes_folder = createPath(src_folder, "routes")
    const stores_folder = createPath(src_folder, "stores")
    const types_folder = createPath(src_folder, "types")
    const views_folder = createPath(src_folder, "views")
    const util_folder = createPath(src_folder, "utils")


    fs.mkdirSync(src_folder, {recursive:true})

    fs.mkdirSync(api_folder, {recursive:true})
    fs.mkdirSync(assets_folder, {recursive:true})
    fs.mkdirSync(components_folder, {recursive:true})
    fs.mkdirSync(icons_folder, {recursive:true})
    fs.mkdirSync(sidenav_folder, {recursive:true})
    fs.mkdirSync(layouts_folder, {recursive:true})
    fs.mkdirSync(modules_folder, {recursive:true})
    fs.mkdirSync(plugins_folder, {recursive:true})
    fs.mkdirSync(routes_folder, {recursive:true})
    fs.mkdirSync(stores_folder, {recursive:true})
    fs.mkdirSync(types_folder, {recursive:true})
    fs.mkdirSync(views_folder, {recursive:true})
    fs.mkdirSync(util_folder, {recursive:true})

    fs.writeFileSync(path.join(src_folder, 'App.vue'), generateApp());
    fs.writeFileSync(path.join(src_folder, 'main.ts'), generateMain());

    
    // Estrutura dos Geradores do FrontEnd
    // |- api
    // |- assets
    // |- components
    // | |- icons
    // | |- sidenav
    // |- layouts
    // |- modules
    // | |- [classe] (OBS: Uma pasta por classe no project_abstractiono)
    // | | |- api
    // | | |- controllers
    // | | |- routes
    // | | |- types
    // | | |- views
    // |- plugins
    // |- routes
    // |- stores
    // |- types
    // |- utils
    // |- views

    generateAPI(project_abstraction, api_folder)
    generateAssets(project_abstraction, assets_folder)
    generateComponents(project_abstraction, components_folder)
    generateIcons(project_abstraction, icons_folder)
    generateSidenav(project_abstraction, sidenav_folder)
    generateLayouts(project_abstraction, layouts_folder)
    generateModules(project_abstraction, modules_folder)
    generatePlugins(project_abstraction, plugins_folder)
    generateRoutes(project_abstraction, routes_folder)
    generateStores(project_abstraction, stores_folder)
    generateTypes(project_abstraction, types_folder)
    generateViews(project_abstraction, views_folder)
    generateUtils(project_abstraction, util_folder)

}  

function generateApp(): string {
    return expandToString`
<template>
  <RouterView />
</template>
`
}

function generateMain(): string {
    return expandToString`
/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
`
}
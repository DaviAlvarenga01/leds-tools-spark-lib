/**
 * Helper Files Generator Module
 * 
 * This module generates all configuration and helper files needed for the Vue.js frontend.
 * These files include project configuration, TypeScript settings, environment variables,
 * and other necessary setup files.
 * 
 * Generated Files:
 * - .browserslistrc: Browser compatibility settings
 * - .editorconfig: Editor formatting rules
 * - .env.dev: Development environment variables
 * - .gitignore: Git ignore patterns
 * - components.d.ts: Component type declarations
 * - env.d.ts: Environment variable types
 * - package.json: Project dependencies and scripts
 * - tsconfig files: TypeScript configuration
 * - vite.config.mts: Vite bundler configuration
 * - index.html: Application entry point
 */

import fs from "fs";
import { expandToString } from "../../util/template-string.js";
import path from "path";
import { generate as generatePackageLock} from "./packagelock-generator.js"
import SEON from "seon-lib-implementation";

/**
 * Main helper files generator function
 * 
 * Creates all necessary configuration and setup files for the Vue.js application.
 * 
 * @param project_abstraction - Project metadata and configuration
 * @param target_folder - Directory where helper files will be generated
 * 
 * Configuration Categories:
 * - Development tools (browserslist, editor config)
 * - TypeScript setup (tsconfig files)
 * - Build configuration (Vite config)
 * - Project metadata (package.json)
 * - Type declarations (*.d.ts files)
 * - Environment settings (.env files)
 */
export function generate(project_abstraction: SEON.ProjectAbstraction, target_folder: string) : void {

    fs.writeFileSync(path.join(target_folder, '.browserslistrc'),generateBrowsersList());
    fs.writeFileSync(path.join(target_folder, '.editorconfig'), generateEditorConfig());
    fs.writeFileSync(path.join(target_folder, '.env.dev'), generateEnvDev());
    fs.writeFileSync(path.join(target_folder, '.gitignore'), generateGitIgnore());
    fs.writeFileSync(path.join(target_folder, 'components.d.ts'), generateComponentsD());
    fs.writeFileSync(path.join(target_folder, 'env.d.ts'), generateEnvD());
    fs.writeFileSync(path.join(target_folder, 'package-lock.json'), generatePackageLock(project_abstraction));
    fs.writeFileSync(path.join(target_folder, 'package.json'), generatePackage());
    fs.writeFileSync(path.join(target_folder, 'tsconfig.app.json'), generateTsConfigApp());
    fs.writeFileSync(path.join(target_folder, 'tsconfig.json'), generateTsConfig());
    fs.writeFileSync(path.join(target_folder, 'tsconfig.node.json'), generateTsConfigNode());
    fs.writeFileSync(path.join(target_folder, 'vite.config.mts'), generateViteConfig());
    fs.writeFileSync(path.join(target_folder, 'index.html'), generateIndex(project_abstraction));

}  

/**
 * Generates browserslist configuration
 * 
 * Creates .browserslistrc file that defines browser compatibility targets.
 * These settings are used by build tools to determine polyfills and
 * CSS vendor prefixes.
 * 
 * @returns Configuration string for browser compatibility
 * 
 * Rules:
 * - >1%: Browsers with more than 1% usage
 * - last 2 versions: Latest 2 versions of each browser
 * - not dead: Currently maintained browsers
 * - not ie 11: Excludes Internet Explorer 11
 */
function generateBrowsersList(): string {
  return expandToString`
> 1%
last 2 versions
not dead
not ie 11
`
}

/**
 * Generates editor configuration
 * 
 * Creates .editorconfig file that ensures consistent coding styles
 * across different editors and IDEs.
 * 
 * @returns Editor configuration string
 * 
 * Settings:
 * - charset: UTF-8 encoding
 * - indent_size: 2 spaces
 * - indent_style: Space-based indentation
 * - insert_final_newline: Ensures files end with newline
 * - trim_trailing_whitespace: Removes trailing spaces
 */
function generateEditorConfig(): string {
  return expandToString`
[*.{js,jsx,mjs,cjs,ts,tsx,mts,cts,vue}]
charset = utf-8
indent_size = 2
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true
`
}

/**
 * Generates development environment variables
 * 
 * Creates .env.dev file containing environment-specific configuration
 * for development mode.
 * 
 * @returns Environment variables configuration string
 * 
 * Variables:
 * - VITE_BACKEND_ADMIN_BASE_URL: API base URL
 * - VITE_BACKEND_ADMIN_AUTH_TOKEN: Authentication token
 * 
 * Note: Variables can be overridden by .env.local file
 */
function generateEnvDev(): string {
  return expandToString`
# note que se voce possui um arquivo .env.local, e necessario
# redefinir as variaveis deste arquivo nele.
VITE_BACKEND_ADMIN_BASE_URL="https://localhost:3000/api/"
VITE_BACKEND_ADMIN_AUTH_TOKEN=
`
}

function generateGitIgnore(): string {
  return expandToString`
.DS_Store
node_modules
/dist

# local env files
.env.local
.env.*.local

# Log files
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Editor directories and files
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
`
}

/**
 * Generates Vue components type declarations
 * 
 * Creates components.d.ts file that provides TypeScript type definitions
 * for all Vue components in the project. This enables type checking and
 * autocompletion for components.
 * 
 * @returns Type declaration string for Vue components
 * 
 * Features:
 * - Global component type declarations
 * - Auto-generated by unplugin-vue-components
 * - Type definitions for custom components
 * - Vue Router component types
 * - Improves IDE support and type safety
 */
function generateComponentsD(): string {
  return expandToString`
/* eslint-disable */
// @ts-nocheck
// Generated by unplugin-vue-components
// Read more: https://github.com/vuejs/core/pull/3399
export {}

/* prettier-ignore */
declare module 'vue' {
  export interface GlobalComponents {
    Card: typeof import('./src/components/Card.vue')['default']
    DataTable: typeof import('./src/components/DataTable.vue')['default']
    GenericTextInput: typeof import('./src/components/GenericTextInput.vue')['default']
    IconNav: typeof import('./src/components/icons/IconNav.vue')['default']
    NavGroup: typeof import('./src/components/sidenav/NavGroup.vue')['default']
    NavItem: typeof import('./src/components/sidenav/NavItem.vue')['default']
    NavMenu: typeof import('./src/components/sidenav/NavMenu.vue')['default']
    PButton: typeof import('./src/components/PButton.vue')['default']
    RouterLink: typeof import('vue-router')['RouterLink']
    RouterView: typeof import('vue-router')['RouterView']
    TextInput: typeof import('./src/components/TextInput.vue')['default']
  }
}
`
}

/**
 * Generates environment type declarations
 * 
 * Creates env.d.ts file that provides TypeScript type definitions for
 * environment variables and Vite-specific types.
 * 
 * @returns Type declaration string for environment variables
 * 
 * Features:
 * - Vite client type references
 * - Environment variable type safety
 * - IDE support for .env files
 */
function generateEnvD(): string {
  return expandToString`
/// <reference types="vite/client" />
`
}

/**
 * Generates package.json configuration
 * 
 * Creates package.json file that defines project metadata, dependencies,
 * and scripts for the Vue.js application.
 * 
 * @returns Package configuration string
 * 
 * Configuration:
 * - Project metadata (name, version)
 * - Dependencies
 * - Development scripts
 * - Type module setting for ES modules
 */
function generatePackage(): string {
  return expandToString`
{
  "name": "modularch",
  "private": true,
  "type": "module",
  "version": "0.0.0",
  "scripts": {
    "dev": "vite --port 5173",
    "build": "run-p type-check \"build-only {@}\" --",
    "preview": "vite preview",
    "build-only": "vite build",
    "type-check": "vue-tsc --build --force"
  },
  "dependencies": {
    "@vueuse/integrations": "^13.1.0",
    "axios": "^1.8.4",
    "pinia": "^3.0.2",
    "roboto-fontface": "*",
    "universal-cookie": "^7.2.2",
    "vue": "^3.4.31",
    "vue-router": "^4.5.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.4",
    "@tsconfig/node22": "^22.0.0",
    "@types/node": "^22.9.0",
    "@vitejs/plugin-vue": "^5.1.4",
    "@vue/eslint-config-typescript": "^14.1.3",
    "@vue/tsconfig": "^0.5.1",
    "npm-run-all2": "^7.0.1",
    "tailwindcss": "^4.1.4",
    "typescript": "~5.6.3",
    "unplugin-vue-components": "^0.27.2",
    "vite": "^5.4.10",
    "vue-tsc": "^2.1.10"
  }
}
`
}

/**
 * Generates TypeScript configuration for the Vue application
 * 
 * Creates tsconfig.app.json that configures TypeScript specifically
 * for the Vue application source code.
 * 
 * @returns TypeScript configuration string for app
 * 
 * Configuration:
 * - Extends Vue's DOM-specific tsconfig
 * - Includes source files and Vue components
 * - Path aliases for simplified imports
 * - Modern ECMAScript and DOM libraries
 * - Build optimization settings
 */
function generateTsConfigApp(): string {
  return expandToString`
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "include": ["env.d.ts", "src/**/*", "src/**/*.vue"],
  "exclude": ["src/**/__tests__/*"],
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",

    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "lib": ["ES2021", "DOM"],
  }
}

`
}

/**
 * Generates base TypeScript configuration
 * 
 * Creates the root tsconfig.json that serves as the base TypeScript
 * configuration for the entire project.
 * 
 * @returns Base TypeScript configuration string
 * 
 * Configuration:
 * - References to other TypeScript configs
 * - Base compiler options
 * - Module resolution settings
 * - Source map configuration
 * - Project-wide TypeScript settings
 */
function generateTsConfig(): string {
  return expandToString`
{
  "files": [],
  "references": [
    {
      "path": "./tsconfig.node.json"
    },
    {
      "path": "./tsconfig.app.json"
    }
  ]
}
`
}

/**
 * Generates Node-specific TypeScript configuration
 * 
 * Creates tsconfig.node.json that configures TypeScript for Node.js
 * specific files like the Vite configuration.
 * 
 * @returns Node-specific TypeScript configuration string
 * 
 * Configuration:
 * - Extends Node.js tsconfig
 * - Build tool configuration files
 * - Node.js specific settings
 * - Module resolution for Node environment
 */
function generateTsConfigNode(): string {
  return expandToString`
{
  "extends": "@tsconfig/node22/tsconfig.json",
  "include": [
    "vite.config.*",
    "vitest.config.*",
    "cypress.config.*",
    "nightwatch.conf.*",
    "playwright.config.*"
  ],
  "compilerOptions": {
    "composite": true,
    "noEmit": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",

    "module": "ESNext",
    "moduleResolution": "Bundler",
    "types": ["node"]
  }
}
`
}

/**
 * Generates Vite bundler configuration
 * 
 * Creates vite.config.mts that configures the Vite build tool and its plugins
 * for optimal Vue.js development and production builds.
 * 
 * @returns Vite configuration string
 * 
 * Configuration:
 * - Vue plugin setup
 * - Component auto-importing
 * - TailwindCSS integration
 * - Build optimization settings
 * - Development server options
 * - Path aliases
 * - Module resolution
 */
function generateViteConfig(): string {
  return expandToString`
// Plugins
import Components from 'unplugin-vue-components/vite'
import Vue from '@vitejs/plugin-vue'
// import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
// import ViteFonts from 'unplugin-fonts/vite'
import tailwindcss from '@tailwindcss/vite'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    Vue({
      // template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    // Vuetify(),
    Components(),
    /* ViteFonts({
      google: {
        families: [{
          name: 'Roboto',
          styles: 'wght@100;300;400;500;700;900',
        }],
      },
    }), */
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
  },
  /* css: {
    preprocessorOptions: {
      sass: {
        api: 'modern-compiler',
      },
    },
  }, */
})
`
}

function generateIndex(project_abstraction: SEON.ProjectAbstraction): string {
    return expandToString`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <link rel="icon" href="/favicon.ico">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/src/assets/style.css">
    <title>${project_abstraction.getProjectName()}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`
}
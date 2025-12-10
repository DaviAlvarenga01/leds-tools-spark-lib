/**
 * Frontend Generator Module
 * 
 * Module responsible for generating the complete Vue.js frontend structure from a .spark file.
 * It orchestrates the generation of all frontend components, creating a fully functional
 * Vue 3 application with TypeScript support.
 * 
 * Structure:
 * frontend/
 * ├── public/        - Public static assets
 * ├── src/          - Source code
 * └── config files  - Project configuration files
 */

import SEON from "seon-lib-implementation";
import fs from "fs";
import path from "path";
import { generate as helpersGenerator } from "./helpers-generator.js";
import { generate as publicGenerator } from "./public/generate.js";
import { generate as srcGenerator } from "./src/generate.js";

/**
 * Main frontend generator function
 * 
 * Creates a complete Vue.js frontend application based on the provided SEON project abstraction (SEON = "Translator").
 * 
 * @param project_abstraction - Contains the project structure and metadata
 *                             Extracted from the .spark file, includes:
 *                             - Entity definitions
 *                             - Attributes and types
 *                             - Relationships
 *                             - Project settings
 * 
 * @param target_folder - Base directory where the frontend will be generated
 * 
 * Generated Structure:
 * - Helper files (configuration, TypeScript settings)
 * - Public assets (favicon, static files)
 * - Source code (components, views, stores, etc.)
 */
export function generate(project_abstraction: SEON.ProjectAbstraction, target_folder: string) : void {
    const frontend_folder = path.join(target_folder, "frontend");
    fs.mkdirSync(frontend_folder, { recursive: true });
    helpersGenerator(project_abstraction, frontend_folder)
    publicGenerator(project_abstraction, frontend_folder)
    srcGenerator(project_abstraction, frontend_folder)

}

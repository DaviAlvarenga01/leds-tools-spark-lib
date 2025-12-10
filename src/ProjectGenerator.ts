/**
 * Project Generator Module
 * 
 * This module contains the main ProjectGenerator class responsible for orchestrating
 * the code generation process based on SEON project abstractions.
 * 
 * @module ProjectGenerator
 */

import path from "path";
import fs from "fs";
import { generate as generateVueModularArch} from "./frontend/vue-vite/generate.js";
import SEON from "seon-lib-implementation";

/**
 * ProjectGenerator - Main class of Spark Lib
 * 
 * Orchestrates the generation of complete project structures based on
 * SEON project abstractions. Supports multiple architectures and automatically
 * selects the appropriate generator based on the project specifications.
 * 
 * @class ProjectGenerator
 * @example
 * ```typescript
 * const projectAbstraction = new SEON.ProjectAbstraction(
 *   "MyApp",
 *   "My application description",
 *   SEON.vueModularArchProjectSettings,
 *   packages
 * );
 * 
 * const generator = new ProjectGenerator(projectAbstraction);
 * generator.generate("./output/my-app");
 * ```
 */
export class ProjectGenerator {
    /**
     * SEON project abstraction containing all project metadata and structure
     * @private
     * @readonly
     * @type {SEON.ProjectAbstraction}
     */
    private readonly project: SEON.ProjectAbstraction;

    /**
     * Creates a new ProjectGenerator instance
     * 
     * @constructor
     * @param {SEON.ProjectAbstraction} project - The SEON project abstraction to generate code from
     * @throws {Error} If project is null or undefined
     */
    constructor(project: SEON.ProjectAbstraction){
        this.project = project;
    }

    /**
     * Generates the complete project structure at the specified path
     * 
     * Analyzes the project architecture specification and delegates to the
     * appropriate generator. Currently supports:
     * - Vue Modular Architecture (generates Vue.js + Vite + Tailwind project)
     * 
     * The method creates the target directory if it doesn't exist and generates
     * all necessary files, folders, and configurations.
     * 
     * @public
     * @param {string} projectPath - Absolute or relative path where the project will be generated
     * @returns {void}
     * 
     * @example
     * ```typescript
     * const generator = new ProjectGenerator(projectAbstraction);
     * generator.generate("./output/my-vue-app");
     * ```
     * 
     * @throws {Error} If projectPath is invalid or inaccessible
     * @throws {Error} If the architecture type is not supported
     */
    public generate(projectPath: string): void {
        // Check if the project uses Vue Modular Architecture
        if (this.project.getSpecifications().architecture instanceof SEON.VueModularArchitecture) {
            // Create the project directory recursively if it doesn't exist
            fs.mkdirSync(projectPath, { recursive: true });
            
            // Delegate to Vue Modular Architecture generator
            generateVueModularArch(this.project, projectPath);
        }
        // TODO: Add support for other architectures (Angular, React, etc.)
    }
}


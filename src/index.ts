/**
 * Spark Lib - Main Entry Point
 * 
 * This is the main entry module for the Spark code generation library.
 * It exports all public APIs for frontend and backend code generation,
 * providing a unified interface for generating complete project structures.
 * 
 * @module spark-lib
 * @version 1.0.0
 * 
 * @example
 * ```typescript
 * // Import frontend generators
 * import { frontend, generateFrontend } from 'spark-lib';
 * 
 * // Import backend generators
 * import { backend } from 'spark-lib';
 * 
 * // Generate a frontend project
 * generateFrontend(model, './output');
 * ```
 */

/**
 * Frontend code generation modules
 * 
 * Contains all utilities and generators for creating frontend applications,
 * including Vue.js projects with modular architecture.
 * 
 * @namespace frontend
 * @see {@link module:frontend/index}
 */
export * as frontend from "./frontend/index.js";

/**
 * Backend code generation modules
 * 
 * Contains all utilities and generators for creating backend applications,
 * supporting multiple languages and architectures:
 * - C# (Clean Architecture, Minimal API)
 * - Java (Spring Boot)
 * - Python (Django)
 * 
 */
export * as backend from "./backend/index.js";

/**
 * Generate Frontend Project (Main Generator)
 * 
 * Main function for generating complete frontend projects.
 * Translates a domain model into SEON abstraction and generates
 * the entire project structure with all necessary files.
 * 
 * This is a convenience export that wraps the generation process,
 * handling model translation and project generation in a single call.
 * 
 *
 */
export { generate as generateFrontend } from "./generate.js"

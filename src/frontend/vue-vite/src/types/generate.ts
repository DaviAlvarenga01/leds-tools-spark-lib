/**
 * Types Generator Module
 * 
 * This module generates TypeScript type definitions and interfaces used
 * throughout the application. It provides type safety and better
 * development experience through proper type declarations.
 * 
 * Generated Types:
 * - UI component types
 * - Store state types
 * - API response types
 * - Utility types
 */

import fs from "fs"
import { expandToString } from "../../../../util/template-string.js";
import path from "path"
import SEON from "seon-lib-implementation";

/**
 * Main types generator function
 * 
 * Creates TypeScript type definition files for various parts of the application.
 * 
 * @param project_abstraction - Project metadata for type generation
 * @param target_folder - Directory where type files will be generated
 * 
 * Generated Files:
 * - ui.ts: UI-related types and injection keys
 * 
 * Type Features:
 * - Vue dependency injection types
 * - Reactive state types
 * - Component prop types
 * - Event handler types
 */
export function generate(project_abstraction: SEON.ProjectAbstraction, target_folder: string) : void {
    fs.writeFileSync(path.join(target_folder, 'ui.ts'), generateUi(project_abstraction, target_folder))
}

/**
 * Generates UI-related type definitions
 * 
 * Creates type definitions for UI components and features, focusing on
 * modal system types and injection keys.
 * 
 * @param project_abstraction - Project metadata (not directly used in UI types)
 * @param target_folder - Output directory for type files
 * @returns UI types definition string
 * 
 * Generated Types:
 * - Modal injection key type
 * - Modal state and methods
 * - Readonly reactive types
 */
function generateUi(project_abstraction: SEON.ProjectAbstraction, target_folder: string) : string {
    return expandToString`
import type { InjectionKey, Ref } from "vue";



export const chaveModal = Symbol() as InjectionKey<{
  estaAberto: Readonly<Ref<boolean, boolean>>;
  abrirModal: (novoTexto?: string) => void;
  fecharModal: () => void;
}>
`
}
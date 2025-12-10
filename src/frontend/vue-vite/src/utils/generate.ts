/**
 * Utilities Generator Module
 * 
 * This module generates utility functions and helpers used throughout
 * the application. It provides common functionality like form validation,
 * data formatting, and other shared utilities.
 * 
 * Generated Utilities:
 * - Form validation rules
 * - Type definitions for validation
 * - Reusable helper functions
 */

import fs from "fs"
import { expandToString } from "../../../../util/template-string.js";
import path from "path"
import SEON from "seon-lib-implementation";

/**
 * Main utilities generator function
 * 
 * Creates utility files with helper functions and validation rules.
 * 
 * @param project_abstraction - Project metadata (not directly used in utils)
 * @param target_folder - Directory where utility files will be generated
 * 
 * Generated Files:
 * - regras.ts: Validation rules and types
 * 
 * Features:
 * - Type-safe validation functions
 * - Reusable validation rules
 * - Custom validation messages
 */
export function generate(project_abstraction: SEON.ProjectAbstraction, target_folder: string) : void {
    fs.writeFileSync(path.join(target_folder, 'regras.ts'), generateRegras(project_abstraction, target_folder))
}

/**
 * Generates validation rules and types
 * 
 * Creates a module with form validation rules and their associated
 * type definitions.
 * 
 * @param project_abstraction - Project metadata (not used in rules generation)
 * @param target_folder - Output directory for rules file
 * @returns Validation rules code string
 * 
 * Generated Content:
 * - ValidationResult type: Success (true) or error message (string)
 * - ValidationResultFunction type: Function signature for validators
 * - Required field validation
 * - Minimum length validation
 * - Special characters validation
 * 
 * Usage Example:
 * ```typescript
 * const isValid = campoNecessario(value);
 * if (isValid !== true) {
 *   console.log(isValid); // Error message
 * }
 * ```
 */
function generateRegras(project_abstraction: SEON.ProjectAbstraction, target_folder: string) : string {
    return expandToString`
export type ValidationResult = string | boolean;
export type ValidationResultFunction = (value: any) => ValidationResult
// type ValidationResultFunction = (value: any) => ValidationResult


export const campoNecessario: ValidationResultFunction = (campo) => {
  if (!!campo) {
    return true
  }
  return 'Este campo é necessário.'
}

export const minimo3caracteres: ValidationResultFunction = (texto) => {
  if (texto.length >= 3) {
    return true
  }
  return 'Este campo deve possuir pelo menos 3 caracteres.'
}
// Note que cada regra é responsável por um tipo de validação, sem interseção.
export const caracteresEspeciais: ValidationResultFunction = (senha) => {
  if (/[!@#\\$%\\^]/.test(senha)) {
    return true
  }
  return 'A senha deve possuir caracteres especiais como: ! @ # $ % ^'
}`
}
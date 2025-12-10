/**
 * View Attributes Generator Module
 * 
 * This module provides utility functions for generating various
 * attribute-based code snippets used in view components. It handles
 * the transformation of entity attributes into different formats
 * needed for forms, tables, and data handling.
 * 
 * Common Use Cases:
 * - Form parameter generation
 * - Default value initialization
 * - Data binding expressions
 * - Table header definitions
 * 
 * All functions handle proper formatting for:
 * - Case sensitivity
 * - Comma placement
 * - Value references
 * - Type safety
 */

import SEON from "seon-lib-implementation";

// Nome: nome.value, 
// Descricao: descricao.value
/**
 * Generates attribute parameter assignments for form submission
 * 
 * Creates a string of attribute assignments in the format:
 * AttributeName: attributeName.value
 * Used when constructing parameter objects for API calls.
 * 
 * Example Output:
 * ```typescript
 * Nome: nome.value,
 * Descricao: descricao.value
 * ```
 * 
 * @param cls - Class whose attributes to transform
 * @returns {string} Formatted parameter assignments
 */
export function generateAttributesAsParameters(cls: SEON.ClassAbstraction) : string {
    let str = ""
    for (const attr of cls.getAttributes()) {
        if (cls.getAttributes().indexOf(attr) + 1 == cls.getAttributes().length) {
            str = str.concat(`    ${attr.getName()}: ${attr.getName().toLowerCase()}.value\n`)
        }
        else {
            str = str.concat(`    ${attr.getName()}: ${attr.getName().toLowerCase()}.value,\n`)
        }
    }
    return str
}

//  nome.value = ''
//  descricao.value = ''
/**
 * Generates attribute value reset statements
 * 
 * Creates a string of statements that reset all attribute values
 * to empty strings. Used for form clearing and initialization.
 * 
 * Example Output:
 * ```typescript
 * nome.value = ''
 * descricao.value = ''
 * ```
 * 
 * @param cls - Class whose attributes to reset
 * @returns {string} Formatted reset statements
 */
export function generateAttributesValue(cls: SEON.ClassAbstraction): string {
    let str = ""
    for (const attr of cls.getAttributes()) {
        str = str.concat(`    ${attr.getName().toLowerCase()}.value = ''\n`)
    }
    return str
}


//  nome.value = class.Nome
//  descricao.value = class.Descricao

/**
 * Generates attribute value assignments from entity
 * 
 * Creates a string of statements that assign values from an
 * entity instance to form reactive references. Used when
 * loading existing data into edit forms.
 * 
 * Example Output:
 * ```typescript
 * nome.value = cls.Nome
 * descricao.value = cls.Descricao
 * ```
 * 
 * @param cls - Class whose attributes to assign
 * @returns {string} Formatted assignment statements
 */
export function generateValuesEqualsAttributes(cls: SEON.ClassAbstraction): string {
    let str = ""
    for (const attr of cls.getAttributes()) {
        str = str.concat(`    ${attr.getName().toLowerCase()}.value = cls.${attr.getName()}\n`)
    }
    return str
}


//{ value: 'Nome', title: 'Nome' },
//{ value: 'Descricao', title: 'Descrição' }

/**
 * Generates data table header configurations
 * 
 * Creates a string of header definitions for data tables,
 * using attribute names for both value and display text.
 * Used to configure column headers in list views.
 * 
 * Example Output:
 * ```typescript
 * { value: 'Nome', title: 'Nome' },
 * { value: 'Descricao', title: 'Descrição' }
 * ```
 * 
 * Features:
 * - Consistent formatting for all attributes
 * - Proper comma handling for arrays
 * - Value/title pairs for each column
 * 
 * @param cls - Class whose attributes to transform into headers
 * @returns {string} Formatted header configurations
 */
export function generateAttributesAsHeader(cls: SEON.ClassAbstraction): string {
    let str = ""
    for (const attr of cls.getAttributes()) {
        if (cls.getAttributes().indexOf(attr) + 1 == cls.getAttributes().length) {
            str = str.concat(`    { value: '${attr.getName()}', title: '${attr.getName()}' }\n`)
        }
        else {
            str = str.concat(`    { value: '${attr.getName()}', title: '${attr.getName()}' },\n`)
        }
    }
    return str
}
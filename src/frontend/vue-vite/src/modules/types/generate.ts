/**
 * Module Types Generator
 * 
 * This module generates TypeScript type definitions for each entity,
 * including base types, request/response types, and utility types.
 * Provides complete type safety for API interactions and data handling.
 * 
 * Features:
 * - Entity type definitions
 * - API request/response types
 * - OData response types
 * - CRUD operation types
 * - Utility type helpers
 */

import fs from "fs"
import { expandToString } from "../../../../../util/template-string.js";
import path from "path"
import SEON from "seon-lib-implementation";

/**
 * Generates type definition file for a specific class
 * 
 * Creates a TypeScript declaration file (.d.ts) containing
 * all type definitions needed for the entity's operations.
 * 
 * @param project_abstraction - Project metadata
 * @param cls - Class for which to generate types
 * @param target_folder - Directory where type file will be saved
 * 
 * Generated Types:
 * - Base entity type
 * - Create request type
 * - List response type
 * - CRUD response types
 */
export function generate(project_abstraction: SEON.ProjectAbstraction, cls: SEON.ClassAbstraction, target_folder: string) : void {
    fs.writeFileSync(path.join(target_folder, `${cls.getName().toLowerCase()}.d.ts`), generateType(project_abstraction, cls))
  }

/**
 * Generates the type definitions implementation
 * 
 * Creates all necessary TypeScript types for an entity, including
 * the base type and all API-related types. Uses utility types
 * for creating derived types like create requests.
 * 
 * Generated Types:
 * - {Class}: Base entity type with all attributes
 * - {Class}CreateReq: Type for create operation
 * - {Class}ListRes: OData response for list operation
 * - {Class}CreateRes: Response for create operation
 * - {Class}GetRes: Response for get operation
 * - {Class}UpdateRes: Response for update operation
 * - {Class}DeleteRes: Response for delete operation
 * 
 * @param project_abstraction - Project metadata
 * @param cls - Class for which to generate types
 * @returns {string} Complete type definitions
 */
function generateType(project_abstraction: SEON.ProjectAbstraction, cls: SEON.ClassAbstraction) : string {
    return expandToString`
export type ${cls.getName()} = {
  ${generateAttributes(project_abstraction, cls)}
}

export type ${cls.getName()}CreateReq = Pick<${cls.getName()}, ${generateAttributesToPick(project_abstraction, cls)}>

/**
 * @description ${cls.getName()}CreateReq: Type for create operation
 * @param {${cls.getName()}} - Base entity type
 * @returns {Pick<${cls.getName()}, ${generateAttributesToPick(project_abstraction, cls)}>}
 */  

export type ${cls.getName()}ListRes = {
  "@odata.context": string
  value: ${cls.getName()}[]
}

/**
 * @description ${cls.getName()}ListRes: OData response for list operation
 * @param {string} @odata.context - OData context URL
 * @param {${cls.getName()}[]} value - Array of ${cls.getName()} entities
 * @param {number} statusCode - HTTP status code
 * @returns {${cls.getName()}[]}
 */  

export type ${cls.getName()}CreateRes = {
  statusCode: number
  uri: string
  message: string
}

/**
 * @description ${cls.getName()}CreateRes: Response for create operation
 * @param {number} statusCode - HTTP status code
 * @param {string} uri - URI of the created entity
 * @param {string} message - Success message
 */  

export type ${cls.getName()}GetRes = ${cls.getName()}ListRes

/**
 * @description ${cls.getName()}GetRes: Response for get operation
 * @returns {${cls.getName()}[]} Array of ${cls.getName()} entities
 */  

export type ${cls.getName()}UpdateRes = {
  statusCode: number
  message: string
}
/**
 * @description ${cls.getName()}UpdateRes: Response for update operation
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 */  

export type ${cls.getName()}DeleteRes = ${cls.getName()}UpdateRes
/**
 * @description ${cls.getName()}DeleteRes: Response for delete operation
 * @returns {number} statusCode - HTTP status code  
 */  
`
}

/**
 * Generates entity attributes as TypeScript type properties
 * 
 * Creates the type definition for an entity's attributes,
 * converting class properties to TypeScript type properties.
 * Automatically adds an Id field to all entities.
 * 
 * @param project_abstraction - Project metadata
 * @param cls - Class whose attributes to generate
 * @returns {string} TypeScript type properties definition
 */
function generateAttributes(project_abstraction: SEON.ProjectAbstraction, cls: SEON.ClassAbstraction) : string{
    let str = ""

    for (const attr of cls.getAttributes()) {
        str = str.concat(`${attr.getName()} : ${attr.getType().getName()}\n`)
    }

    str = str.concat(`Id : string\n`)

    return str
}


function generateAttributesToPick(project_abstraction: SEON.ProjectAbstraction, cls: SEON.ClassAbstraction) : string {
    let str = ""
    for (const attr of cls.getAttributes()) {
        if (cls.getAttributes().indexOf(attr) + 1 == cls.getAttributes().length) {
            str = str.concat(`"${attr.getName()}"`)
        }
        else {
            str = str.concat(`"${attr.getName()}" | `)
        }
    }
    return str
}
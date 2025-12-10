/**
 * Module API Generator
 * 
 * This module generates API integration files for each entity in the project.
 * It creates a complete set of CRUD operations with proper TypeScript types
 * and Axios-based HTTP client integration.
 * 
 * Features:
 * - Full CRUD operation coverage
 * - Type-safe API responses
 * - Base URL configuration
 * - Error handling setup
 * - Admin API integration
 */

import fs from "fs"
import { expandToString } from "../../../../../util/template-string.js";
import path from "path"
import SEON from "seon-lib-implementation";

/**
 * Generates API integration file for a specific class
 * 
 * Creates a TypeScript file containing all CRUD operations
 * for interacting with the backend API for this entity.
 * 
 * @param project_abstraction - Project metadata
 * @param cls - Class for which to generate API functions
 * @param target_folder - Directory where API file will be saved
 * 
 * Generated Operations:
 * - List entities (GET /)
 * - Create entity (POST /)
 * - Get single entity (GET /{id})
 * - Update entity (PUT /{id})
 * - Delete entity (DELETE /{id})
 */
export function generate(project_abstraction: SEON.ProjectAbstraction, cls: SEON.ClassAbstraction, target_folder: string) : void {
    fs.writeFileSync(path.join(target_folder, `${cls.getName().toLowerCase()}.ts`), generateApi(project_abstraction, cls))
}

/**
 * Generates the API integration code
 * 
 * Creates the actual implementation of API functions for a specific entity,
 * including all necessary imports, type definitions, and CRUD operations.
 * 
 * Features:
 * - TypeScript interface imports
 * - Base URL configuration
 * - Async/await API functions
 * - Type-safe response handling
 * - Consistent error handling
 * 
 * Generated Functions:
 * - listar{Class}: List all entities
 * - criar{Class}: Create new entity
 * - obter{Class}: Get single entity by ID
 * - atualizar{Class}: Update existing entity
 * - excluir{Class}: Delete entity by ID
 * 
 * @param project_abstraction - Project metadata
 * @param cls - Class for which to generate API code
 * @returns {string} Complete API integration code
 */
function generateApi(project_abstraction: SEON.ProjectAbstraction, cls: SEON.ClassAbstraction) : string {
    return expandToString`
/**
 * @description arquivo de api trata da parte de requisicao e suas configuracoes
 * @description Features:
 * @description - Full CRUD operation coverage
 * @description - Type-safe API responses
 * @description - Base URL configuration
 * @description - Admin API integration
 */

import adminApi, { adminApiConfig } from '@/api/admin'
import type {
  ${cls.getName()},
  ${cls.getName()}CreateReq,
  ${cls.getName()}ListRes,
  ${cls.getName()}CreateRes,
  ${cls.getName()}GetRes,
  ${cls.getName()}UpdateRes,
  ${cls.getName()}DeleteRes,
} from '../types/${cls.getName().toLowerCase()}.d.ts'

const ${cls.getName().toLowerCase()}ReqConf = {
  baseURL: adminApiConfig.baseURL + '${cls.getName().toLowerCase()}',
}

export const listar${cls.getName()} = async () => {
  return await adminApi.get<${cls.getName()}ListRes>('/', ${cls.getName().toLowerCase()}ReqConf)
}

export const criar${cls.getName()} = async (${cls.getName().toLowerCase()}: ${cls.getName()}CreateReq) => {
  return await adminApi.post<${cls.getName()}CreateRes>('/', ${cls.getName().toLowerCase()}, ${cls.getName().toLowerCase()}ReqConf)
}

export const obter${cls.getName()} = async (id: string) => {
  const { data } = await adminApi.get<${cls.getName()}GetRes>('/' + id, ${cls.getName().toLowerCase()}ReqConf)
  return data.value[0]
}

export const atualizar${cls.getName()} = async (${cls.getName().toLowerCase()}: ${cls.getName()}) => {
  return await adminApi.put<${cls.getName()}UpdateRes>('/' + ${cls.getName().toLowerCase()}.Id, ${cls.getName().toLowerCase()}, ${cls.getName().toLowerCase()}ReqConf)
}

export const excluir${cls.getName()} = async (id: string) => {
  return await adminApi.delete<${cls.getName()}DeleteRes>('/' + id, ${cls.getName().toLowerCase()}ReqConf)
}    
`
}
/**
 * Module Controllers Generator
 * 
 * This module generates controller files that handle business logic,
 * error handling, and user interface interactions for each entity.
 * Controllers act as an intermediary layer between the API and views.
 * 
 * Features:
 * - Error handling and user feedback
 * - API integration wrapping
 * - UI store integration
 * - Type-safe operations
 * - Consistent error messages
 */

import fs from "fs"
import { expandToString } from "../../../../../util/template-string.js";
import path from "path"
import SEON from "seon-lib-implementation";

/**
 * Generates controller file for a specific class
 * 
 * Creates a TypeScript file containing all controller functions
 * that wrap API calls with error handling and UI feedback.
 * 
 * @param project_abstraction - Project metadata
 * @param cls - Class for which to generate controller
 * @param target_folder - Directory where controller file will be saved
 * 
 * Generated Features:
 * - CRUD operation wrappers
 * - Error handling with Axios
 * - UI alerts integration
 * - Type-safe data handling
 */
export function generate(project_abstraction: SEON.ProjectAbstraction, cls: SEON.ClassAbstraction, target_folder: string) : void {
    fs.writeFileSync(path.join(target_folder, `${cls.getName().toLowerCase()}.ts`), generateController(project_abstraction, cls))
}

/**
 * Generates the controller implementation
 * 
 * Creates controller functions that wrap API calls with error handling
 * and user interface feedback. Each function handles a specific CRUD
 * operation with proper error management and success notifications.
 * 
 * Features:
 * - API function imports and renaming
 * - UI store integration for alerts
 * - Axios error handling
 * - Success message display
 * - Type-safe parameters and returns
 * 
 * Generated Functions:
 * - listar{Class}: List with error handling
 * - {Promise<{Class}[]>} List of entities
 * - criar{Class}: Create with success notification
 * - {Promise<boolean>} Success status
 * - obter{Class}: Get with error handling
 * - atualizar{Class}: Update with feedback
 * - excluir{Class}: Delete with confirmation
 * 
 * @param project_abstraction - Project metadata
 * @param cls - Class for which to generate controller code
 * @returns {string} Complete controller implementation
 */
function generateController(project_abstraction: SEON.ProjectAbstraction, cls: SEON.ClassAbstraction) : string {
    return expandToString`
/**
 * arquivo controller trata da parte de erros e interface de usuario
 */

import {
  criar${cls.getName()} as _criar${cls.getName()},
  listar${cls.getName()} as _listar${cls.getName()},
  obter${cls.getName()} as _obter${cls.getName()},
  atualizar${cls.getName()} as _atualizar${cls.getName()},
  excluir${cls.getName()} as _excluir${cls.getName()},
} from '../api/${cls.getName().toLowerCase()}'
import type { ${cls.getName()}, ${cls.getName()}CreateReq } from '../types/${cls.getName().toLowerCase()}'
import { useUiStore } from '@/stores/ui'
import { AxiosError } from 'axios'

export const listar${cls.getName()} = async () => {
  try {
    const { data } = await _listar${cls.getName()}()
    return data.value
  } catch (error) {
    throw error
  }
}
/**
*  @description listar${cls.getName()}: List with error handling
* @returns {Promise<{Class}[]>} List of entities
* 
*/

export const criar${cls.getName()} = async (${cls.getName().toLowerCase()}: ${cls.getName()}CreateReq) => {
  const ui = useUiStore()

  try {
    const { data } = await _criar${cls.getName()}(${cls.getName().toLowerCase()})

    ui.exibirAlerta({
      text: data.message,
      color: 'success'
    })

    return true

  } catch (error) {
    if (
      error instanceof AxiosError &&
      error.response?.status === 400 &&
      error.response.data.errors
    ) {
      ui.exibirAlertas(
        error.response.data.errors
          .map((err: { mensagem: string }) => ({ text: err.mensagem, color: 'error' }))
      )

      return false

    } else {
      throw error
    }
  }
}

/**
 * @description criar${cls.getName()}: Create with success notification
 * @returns {Promise<boolean>} Success status
 **/


export const obter${cls.getName()} = async (id: string) => {
  try {
    const data = await _obter${cls.getName()}(id)
    return data
  } catch (error) {
    throw error
  }
}

/**
 * @description obter${cls.getName()}: Get with error handling
 * @returns {Promise<{Class}>} Retrieved entity
 */


export const atualizar${cls.getName()} = async (${cls.getName().toLowerCase()}: ${cls.getName()}) => {
  try {
    const { data } = await _atualizar${cls.getName()}(${cls.getName().toLowerCase()})
    return true
  } catch (error) {
    throw error
  }
}

/**
 * @description atualizar${cls.getName()}: Update with feedback
 * @returns {Promise<boolean>} Success status
 */

export const excluir${cls.getName()} = async (id: string) => {
  try {
    const { data } = await _excluir${cls.getName()}(id)
    return true
  } catch (error) {
    throw error
  }
}

/**
 * @description excluir${cls.getName()}: Delete with confirmation
 * @returns {Promise<boolean>} Success status
 */

export const excluir${cls.getName()}s = async (ids: string[]) => {
  try {
    for (const id of ids) {
      const sucesso = await excluir${cls.getName()}(id)
    }
    return true
  } catch (error) {
    throw error
  }
}  
    
/**
 * @description excluir${cls.getName()}: Delete with confirmation
 * @returns {Promise<boolean>} Success status
 */

`

}

/** 
 * @description Teste de documentação
 * @param 
 * 
 * 
 * 
 * */    
function teste (x: number): number {
    return x * 2
}
/**
 * API Integration Generator Module
 * 
 * This module generates API integration layers that handle communication
 * between the frontend and backend services. It creates type-safe API
 * clients with proper authentication and error handling.
 * 
 * Features:
 * - Axios instance configuration
 * - Authentication header management
 * - Request/response interceptors
 * - Loading state integration
 * - Error handling
 */

import { expandToString } from "../../../../util/template-string.js";
import fs from "fs";
import path from "path";
import SEON from "seon-lib-implementation";

/**
 * Main API generator function
 * 
 * Creates API client configurations and integrations for backend communication.
 * 
 * @param project_abstraction - Project metadata (not directly used in API generation)
 * @param target_folder - Directory where API files will be generated
 * 
 * Generated Files:
 * - admin.ts: Admin API client with authentication
 * 
 * Integration Features:
 * - Environment-based configuration
 * - Bearer token authentication
 * - Global loading state management
 * - Error interception and handling
 */
export function generate(project_abstraction: SEON.ProjectAbstraction, target_folder: string) : void {
    fs.writeFileSync(path.join(target_folder, 'admin.ts'), generateAdminApi());
}

/**
 * Generates Bearer token template string
 * 
 * Creates a template literal for the Bearer token authorization header
 * using environment variables.
 * 
 * @returns Bearer token template string
 * 
 * Example output:
 * ```typescript
 * `Bearer ${import.meta.env.VITE_BACKEND_ADMIN_AUTH_TOKEN}`
 * ```
 */
function generateBearer() : string {
    const str = "`" + "Bearer ${import.meta.env.VITE_BACKEND_ADMIN_AUTH_TOKEN}" + "`"
    return str
}

/**
 * Generates admin API client configuration
 * 
 * Creates an Axios instance configured for admin API communication
 * with proper authentication and interceptors.
 * 
 * @returns Admin API configuration code string
 * 
 * Features:
 * - Base URL configuration
 * - Authentication headers
 * - Request interceptors for loading state
 * - Response interceptors for error handling
 * - UI store integration
 */
function generateAdminApi() : string {
    return expandToString`
import axios from 'axios'
import { useUiStore } from '@/stores/ui'


// api para backend-admin, por isso adminApi.
export const adminApiConfig = {
  baseURL: import.meta.env.VITE_BACKEND_ADMIN_BASE_URL,
  headers: {
    'Authorization': ${generateBearer()}
  }
}

const adminApi = axios.create(adminApiConfig)

adminApi.interceptors.request.use((config) => {
  const ui = useUiStore()
  ui.carregando = true
  return config
}, (error) => {
  const ui = useUiStore()
  ui.carregando = false
  throw error
})

adminApi.interceptors.response.use((config) => {
  const ui = useUiStore()
  ui.carregando = false
  return config
}, (error) => {
  const ui = useUiStore()
  ui.carregando = false
  throw error
})

export default adminApi
`
}
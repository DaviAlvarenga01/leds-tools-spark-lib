/**
 * Stores Generator Module
 * 
 * This module generates Pinia store modules that manage application state
 * across components. It creates stores for authentication, UI state, and
 * other global application data management needs.
 * 
 * Key Features:
 * - Authentication state management (auth.ts)
 * - UI state management (ui.ts)
 * - Cookie-based session handling
 * - Reactive state using Vue's composition API
 * 
 * Generated Files:
 * - auth.ts: Authentication and session management store
 * - ui.ts: UI state and interaction management store
 */

import fs from "fs"
import { expandToString } from "../../../../util/template-string.js";
import path from "path"
import SEON from "seon-lib-implementation";

/**
 * Main store generator function
 * 
 * Creates Pinia store modules for managing application state.
 * Each store module handles a specific aspect of the application's
 * global state management needs.
 * 
 * @param project_abstraction - Project metadata for customizing stores
 * @param target_folder - Directory where store files will be saved
 * 
 * Generated Structure:
 * stores/
 * ├── auth.ts    - Authentication and session store
 * └── ui.ts      - UI state management store
 */
export function generate(project_abstraction: SEON.ProjectAbstraction, target_folder: string) : void {
    fs.writeFileSync(path.join(target_folder, 'auth.ts'), generateAuth(project_abstraction, target_folder))
    fs.writeFileSync(path.join(target_folder, 'ui.ts'), generateUi(project_abstraction, target_folder))
}

/**
 * Generates the authentication store module
 * 
 * Creates a Pinia store that handles user authentication state and session
 * management. The store uses Vue's composition API and cookie-based session
 * storage for persistent authentication.
 * 
 * Features:
 * - User session management
 * - Token-based authentication
 * - Cookie storage for persistence
 * - Login/logout functionality
 * - Session timeout handling
 * 
 * @param project_abstraction - Project metadata for auth customization
 * @param target_folder - Directory where the auth store will be saved
 * @returns {string} Authentication store module content
 */

function generateAuth(project_abstraction: SEON.ProjectAbstraction, target_folder: string): string {
    const classList : SEON.ClassAbstraction[] = []

    for (const pkg of project_abstraction.getCoresPackages()) {
        for (const clazz of pkg.getPackageLevelClasses()){
            classList.push(clazz)
        }
    }

    return expandToString`
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'

/**
 * @description AuthStore: Authentication Store This store manages user authentication state and session handling.
 * @params {string} usuario - Current logged-in user.
 * @returns Store with authentication state and methods.
 */

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  const usuario = ref('')

  const cookies = useCookies(['token'])
  const getSessionToken = () => {
    return cookies.get('token')
  }
  const setSessionToken = (newToken: boolean) => {
    return cookies.set('token', newToken,
      {
        path: '/',
        // 10 minutos, para que seja possivel ver a expiracao de sessao
        // em funcionamento
        maxAge:  600
      })
  }
})

/**
 * @function Async login - Logs in a user and sets session token.
 * @params {string} novoUsuario - Username for login.
 * @params {string} senha - Password for login.
 * @returns Redirects to home page after login.
*/

  const login = async (novoUsuario: string, senha: string) => {
    // requisicao a api vai aqui
    // talvez validar de novo?
    usuario.value = novoUsuario
    setSessionToken(true)
    return await router.push({ name: '${classList[0].getName().toLowerCase()}-home' })
  }

/**
 * @function Async logout - Logs out the user and clears session token.
 * @params none
 * @returns Redirects to login page after logout.

  const logout = async () => {
    usuario.value = ''
    setSessionToken(false)
    return await router.push({ name: 'login' })
  }

/**
 * @function estaLogado - Checks if a user is currently logged in.
 * @returns {boolean} True if user is logged in, false otherwise.
 */ 

  const estaLogado = () => {
    return getSessionToken()
  }

  return {
    usuario,
    login,
    logout,
    estaLogado,
  }
})


`
}

/**
 * Generates the UI state management store module
 * 
 * Creates a Pinia store that manages global UI state such as alerts,
 * sidebar visibility, and other UI-related state. Implements a split
 * store pattern with private and public state management.
 * 
 * Features:
 * - Alert message queue management
 * - Sidebar visibility state
 * - Private state implementation
 * - Type-safe interfaces
 * - Vuetify integration
 * 
 * Implementation Notes:
 * - Uses a private store pattern for internal state
 * - Handles Vuetify snackbar integration
 * - Provides public API for UI state management
 * 
 * @param project_abstraction - Project metadata for UI customization
 * @param target_folder - Directory where the UI store will be saved
 * @returns {string} UI store module content
 */
function generateUi(project_abstraction: SEON.ProjectAbstraction, target_folder: string): string {
    return expandToString`
import { defineStore } from 'pinia'
import { computed, ref, type ComputedRef, type Ref } from 'vue'



// tipo ruim. esperar vuetify implementar e expor o tipo
type Snackbar = Record<string, any>

interface PrivateUIStore {
  mensagensAlerta: Ref<Snackbar[]>
}
// pinia reclama quando usa uma store dentro da outra, por algum motivo
interface PrivateUIStore_ {
  mensagensAlerta: Snackbar[]
}
// https://masteringpinia.com/blog/how-to-create-private-state-in-stores
const usePrivateState = defineStore('ui-private', () => {
  const mensagensAlerta = ref<Snackbar>([])
  return {
    mensagensAlerta,
  } as PrivateUIStore
})

/**
 * @description UiStore: UI State Store This store manages global UI state such as alerts, sidebar visibility, and other UI-related state.
 * @params {ComputedRef<Snackbar[]>} mensagensAlerta - Queue of alert messages.
 * @returns {object} Store with UI state and methods.
 */ 

interface UIStore {
  mensagensAlerta: ComputedRef<Snackbar[]>
  exibirAlertas: (novaMsgAlerta: Snackbar) => boolean
  exibirAlerta: (novaMsgAlerta: Snackbar) => boolean
  fecharAlerta: (mensagensRestantes: Snackbar[]) => boolean
  carregando: Ref<boolean>
  mostrarBarraLateral: Ref<boolean>
  
}

/** 
 * @description useUiStore - Pinia store for managing UI state including alerts and sidebar visibility.
 * @return {UIStore} Store with UI state and methods.
 */

export const useUiStore = defineStore('ui', () => {
  const privado = usePrivateState() as unknown as PrivateUIStore_

  const mensagensAlerta = computed(() => privado.mensagensAlerta)

/**
 * @description exibirAlertas - Displays multiple alert messages in the UI.
 * @param {Snackbar[]} novasMensagens - Array of new alert messages to display.
 * @returns {boolean} True if alerts were added successfully.
 */

  const exibirAlertas = (
    novasMensagens: Snackbar[]
  ) => {
    privado.mensagensAlerta.splice(0, 0, ...novasMensagens)
    return true
  }
  const exibirAlerta = (
    novaMsgAlerta: Snackbar
  ) => {
    return exibirAlertas([novaMsgAlerta])
  }

  /**
   * @description fecharAlerta - Closes alert messages and updates the alert queue.
   * @param {Snackbar[]} mensagensRestantes - Remaining alert messages after closing.
   * @returns {boolean} True if alerts were updated successfully.
   */

  const fecharAlerta = (mensagensRestantes: Snackbar[]) => {
    privado.mensagensAlerta = mensagensRestantes
    return true
  }

  const carregando = ref(false)

  /**
   * @description mostrarBarraLateral - Reactive state for sidebar visibility.
   */

  const mostrarBarraLateral = ref(true)

  return {
    mensagensAlerta,
    exibirAlertas,
    exibirAlerta,
    fecharAlerta,
    carregando,
    mostrarBarraLateral
  } as UIStore
})




`
}
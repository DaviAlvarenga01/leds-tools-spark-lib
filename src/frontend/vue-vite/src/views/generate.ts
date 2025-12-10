/**
 * Views Generator Module
 * 
 * This module is responsible for generating Vue view components that represent
 * different pages and screens in the application. It creates views with proper
 * routing integration, state management, and UI interactions.
 * 
 * Generated Views:
 * - Login: Authentication view with form validation
 * - Entity views (generated per module)
 */

import fs from "fs"
import { expandToString } from "../../../../util/template-string.js";
import path from "path"
import SEON from "seon-lib-implementation";

/**
 * Main views generator function
 * 
 * @param project_abstraction - Project metadata and structure information
 * @param target_folder - Directory where view components will be generated
 * 
 * Generated Features:
 * - Form validation
 * - State management integration
 * - Modal system integration
 * - Route handling
 * - Authentication flows
 */
export function generate(project_abstraction: SEON.ProjectAbstraction, target_folder: string) : void {
    fs.writeFileSync(path.join(target_folder, 'Login.vue'), generateLogin(project_abstraction, target_folder))
}

function generateLogin(project_abstraction: SEON.ProjectAbstraction, target_folder: string) : string {
    return expandToString`
<script setup lang="ts">
import { ref, inject, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { chaveModal } from '@/types/ui'
import {
  campoNecessario,
  minimo3caracteres,
  caracteresEspeciais
} from '@/utils/regras'


const modal = inject(chaveModal)
const esqueciSenha = () => {
  modal?.abrirModal("Não implementado.")
}


const usuario = ref('')
const regrasUsuario = [campoNecessario, minimo3caracteres]
const usuarioValido = ref(false)
const updateUsuarioValido = (novoValor: boolean) => {
  usuarioValido.value = novoValor
}

const senha = ref('')
const regrasSenha = [campoNecessario, minimo3caracteres, caracteresEspeciais]
const senhaValida = ref(false)
const updateSenhaValida = (novoValor: boolean) => {
  senhaValida.value = novoValor
}


const podeEntrar = computed(() => {
  return usuarioValido.value && senhaValida.value
})

const entrar = async () => {
  if (podeEntrar.value) {
    const auth = useAuthStore()
    return await auth.login(usuario.value, senha.value)
  }
}
</script>

<template>
  <card class="w-md">
    <text-input
      class="w-full"
      placeholder="exemplo123"
      v-model="usuario"
      :rules="regrasUsuario"
      @validationUpdate="updateUsuarioValido"
      @keyup-enter="entrar"
    >
      Nome de Usuário
    </text-input>

    <text-input
      class="w-full"
      v-model="senha"
      :rules="regrasSenha"
      @validationUpdate="updateSenhaValida"
      @keyup-enter="entrar"
      type="password"
    >
      Senha
    </text-input>

    <div class="flex justify-end">
      <p-button @click="entrar">
        Entrar
      </p-button>
    </div>
  </card>
</template>`
}
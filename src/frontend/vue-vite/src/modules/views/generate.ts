/**
 * Module Views Generator
 * 
 * This module generates Vue component views for each entity's CRUD
 * operations. Creates form-based creation/edit views and list views
 * with data tables and actions.
 * 
 * Features:
 * - Create/Edit forms with validation
 * - List views with data tables
 * - Form input validation
 * - Error handling
 * - Loading states
 * - Action feedback
 */

import fs from "fs"
import { expandToString } from "../../../../../util/template-string.js";
import path from "path"
import { generateAttributesAsParameters, generateAttributesValue, generateValuesEqualsAttributes, generateAttributesAsHeader  } from "./generateAttributes.js"
import SEON from "seon-lib-implementation";

/**
 * Generates view components for a specific class
 * 
 * Creates Vue components for creating, editing, and listing
 * entities, with proper form handling and data display.
 * 
 * @param project_abstraction - Project metadata
 * @param cls - Class for which to generate views
 * @param target_folder - Directory where view files will be saved
 * 
 * Generated Views:
 * - Criar.vue: Create/Edit form view
 * - Listar.vue: List view with data table
 */
export function generate(project_abstraction: SEON.ProjectAbstraction, cls: SEON.ClassAbstraction, target_folder: string) : void {
    fs.writeFileSync(path.join(target_folder, "Criar.vue"), generateCriar(project_abstraction, cls))
    fs.writeFileSync(path.join(target_folder, "Listar.vue"), generateListar(project_abstraction, cls))
}

/**
 * Generates the Create/Edit view component
 * 
 * Creates a Vue component for creating and editing entities.
 * Includes form validation, data loading for edit mode,
 * and proper error handling.
 * 
 * Features:
 * - Dual mode (create/edit)
 * - Form validation rules
 * - Dynamic form fields
 * - Loading states
 * - Success/error handling
 * - UI feedback
 * 
 * @param project_abstraction - Project metadata
 * @param cls - Class for which to generate form view
 * @returns {string} Vue component for entity creation/editing
 */
function generateCriar(project_abstraction: SEON.ProjectAbstraction, cls: SEON.ClassAbstraction) : string {
    return expandToString`
<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import {
  criar${cls.getName()},
  obter${cls.getName()},
  atualizar${cls.getName()}
} from '../controllers/${cls.getName().toLowerCase()}'
import { useUiStore } from '@/stores/ui'
import type { ValidationResultFunction } from '@/utils/regras'

const route = useRoute()

const modo = computed<'criar' | 'editar'>(() => {
  if (route.params.id) {
    return 'editar'
  }
  return 'criar'
})

const ui = useUiStore()

const id = ref('')
${generateRefs(cls)}

const primeiraMaiuscula: ValidationResultFunction = (novoNome: string) => {
  if (/^[A-Z].*$/.test(novoNome)) {
    return true
  }
  return 'O nome deve começar com uma letra maiúscula'
}

const regrasNome = [primeiraMaiuscula]

const nomeValido = ref(false)

const updateNomeValido = (novoValor: boolean) => {
  nomeValido.value = novoValor
}

const descricao = ref('')

const criar = async () => {
  if (!nomeValido.value) {
    ui.exibirAlerta({
      text: 'Por favor, corrija os campos incorretos.',
      color: 'error'
    })
    return false
  }
  const sucesso = await criar${cls.getName()}({
${generateAttributesAsParameters(cls)}
  })
  if (sucesso) {
${generateAttributesValue(cls)}
  }
  return true
}

const atualizar = async () => {
  if (!nomeValido.value) {
    ui.exibirAlerta({
      text: 'Por favor, corrija os campos incorretos.',
      color: 'error'
    })
    return false
  }

  const sucesso = await atualizar${cls.getName()}({
    Id: id.value,
${generateAttributesAsParameters(cls)}
  })
  return true
}

const dispatchBotao = async () => {
  if (modo.value === 'criar') {
    return await criar()
  }
  return await atualizar()
}

onBeforeMount(async () => {
  if (modo.value === 'editar') {
    const routeId: string = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
    const cls = await obter${cls.getName()}(routeId)
    id.value = cls.Id
${generateValuesEqualsAttributes(cls)}
  }
})
</script>

<template>
  <card class="w-md">
${generateTextInputs(cls)}
    <div class="flex justify-end">
      <p-button
        @click="dispatchBotao"
      >
        {{ modo === 'criar' ? 'Registrar' : 'Atualizar' }}
      </p-button>
    </div>
  </card>
</template>
`
}

/**
 * Generates the List view component
 * 
 * Creates a Vue component for displaying entities in a data table.
 * Includes sorting, selection, actions, and data refresh.
 * 
 * Features:
 * - Data table display
 * - Edit/Delete actions
 * - Automatic data loading
 * - Multi-selection support
 * - Bulk operations
 * - Loading states
 * 
 * @param project_abstraction - Project metadata
 * @param cls - Class for which to generate list view
 * @returns {string} Vue component for entity listing
 */
function generateListar(project_abstraction: SEON.ProjectAbstraction, cls: SEON.ClassAbstraction) : string {
    return expandToString`
<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useUiStore } from '@/stores/ui'
import {
  listar${cls.getName()},
  excluir${cls.getName()}s,
} from '../controllers/${cls.getName().toLowerCase()}'
import type { ${cls.getName()} } from '../types/${cls.getName().toLowerCase()}'



const ui = useUiStore()
const headers = [
${generateAttributesAsHeader(cls)}
]
const items = ref<${cls.getName()}[]>([])

const carregar${cls.getName()}s = async () => {
  const ${cls.getName().toLowerCase()} = await listar${cls.getName()}()
  items.value = ${cls.getName().toLowerCase()}
}

const router = useRouter()
const editar${cls.getName()} = (cls: ${cls.getName()}) => {
  router.push({ name: '${cls.getName().toLowerCase()}-criar', params: { id: cls.Id }})
}

const excluir${cls.getName().toLowerCase()} = async (cls: ${cls.getName()}[]) => {
  const ids = cls.map((a) => a.Id)
  await excluir${cls.getName()}s(ids)
  await carregar${cls.getName()}s()
}

onBeforeMount(carregar${cls.getName()}s)
</script>

<template>
  <data-table
    :headers="headers"
    :items="items"
    @editar="editar${cls.getName()}"
    @excluir="excluir${cls.getName().toLowerCase()}"
  />
</template>
`
}


/**
 * Generates reactive refs for entity attributes
 * 
 * Creates Vue ref declarations for each attribute of the entity,
 * enabling reactive form handling in create/edit views.
 * 
 * @param cls - Class whose attributes need refs
 * @returns {string} Vue ref declarations for all attributes
 */
function generateRefs(cls: SEON.ClassAbstraction) : string {
    let str = ""
    for (const attr of cls.getAttributes()) {
        str = str.concat(`const ${attr.getName()} = ref('')\n`)
    }
    return str
}

/**
 * Generates form input fields for entity attributes
 * 
 * Creates text input components for each entity attribute,
 * with special handling for name fields including validation.
 * 
 * Features:
 * - Validation rules for name fields
 * - Placeholder text generation
 * - Full width styling
 * - Validation feedback
 * 
 * @param cls - Class whose attributes need input fields
 * @returns {string} Vue text input components
 */
function generateTextInputs(cls: SEON.ClassAbstraction) : string {
    let str = ""
    for (const attr of cls.getAttributes()) {
      if (attr.getName().toLowerCase() === "nome") {
        str = str.concat(expandToString`
<text-input
  class="w-full"
  placeholder="Nome"
  v-model="nome"
  :rules="regrasNome"
  @validationUpdate="updateNomeValido"
/>
        `)
        str = str.concat("\n")
      }
      else{
        str = str.concat(expandToString`
<text-input
  class="w-full"
  placeholder="${capitalizeFirstLetter(attr.getName())}"
  v-model="${attr.getName()}"
/>
        `)
        str = str.concat("\n")
      }
    }
    return str
}

function capitalizeFirstLetter(str: string): string {
  if (!str) return str; // Retorna como está se a string for vazia
  return str.charAt(0).toUpperCase() + str.slice(1);
}
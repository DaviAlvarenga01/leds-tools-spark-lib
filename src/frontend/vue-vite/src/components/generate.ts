import fs from "fs";
import { expandToString } from "../../../../util/template-string.js";
import path from "path";
import SEON from "seon-lib-implementation";

export function generate(project_abstraction: SEON.ProjectAbstraction, target_folder: string) : void {
    // Cria pasta de docs
    const docsFolder = path.join(target_folder, 'docs');
    fs.mkdirSync(docsFolder, { recursive: true });
    
    // Gera os componentes
    fs.writeFileSync(path.join(target_folder, 'DataTable.vue'), generateDataTable());
    fs.writeFileSync(path.join(target_folder, 'Card.vue'), generateCard());
    fs.writeFileSync(path.join(target_folder, 'GenericTextInput.vue'), generateGenericTextInpput());
    fs.writeFileSync(path.join(target_folder, 'PButton.vue'), generatePButton());
    fs.writeFileSync(path.join(target_folder, 'TextInput.vue'), generateNoGenericTextInpput());
    
    // Copia a documentação
    fs.writeFileSync(path.join(docsFolder, 'README.md'), fs.readFileSync(path.join(__dirname, 'docs', 'README.md')));
    fs.writeFileSync(path.join(target_folder, 'README.md'), generateREADME());
}

function generateDataTable() : string {
    return expandToString`
<script setup lang="ts">
/**
 * Componente de tabela de dados
 * @description Exibe dados em formato tabular com suporte a seleção, ordenação e ações
 * 
 * @prop {DataTableItem[]} items - Array de itens para exibir na tabela
 * @prop {DataTableHeader[]} [headers] - Configuração das colunas (opcional)
 * 
 * @emits {(item: DataTableItem) => void} editar - Quando o botão editar é clicado
 * @emits {(items: DataTableItem[]) => void} excluir - Quando o botão excluir é clicado
 */
import { computed, reactive, ref } from 'vue'
...
`
}


function generateCard() : string {
    return expandToString`
<script setup lang="ts">
/**
 * Container estilizado
 * @description Container com borda e sombra para envolver conteúdo
 * 
 * @slot default - Conteúdo do card
 */
</script>

<template>
...
`
}


function generateGenericTextInpput() : string {
    return expandToString`
<script setup lang="ts">
/**
 * Campo de entrada de texto
 * @description Componente de input com suporte a validação e diferentes variantes
 * 
 * @prop {'text' | 'password'} [type='text'] - Tipo do input
 * @prop {string} [placeholder] - Texto de placeholder
 * @prop {'error' | 'default'} [variant='default'] - Variante visual do input
 * 
 * @emits {() => void} keyupEnter - Quando Enter é pressionado
 */
import { computed } from 'vue'
...
`
}


function generatePButton(): string {
    return expandToString`
<!-- P de 'pretty', para ser curto e n conflitar com button nativo-->
<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  variant?: 'default' | 'error'
}>(), {
  variant: 'default'
})


const className = computed(() => {
  if (props.variant === 'default') {
    return 'py-1 px-3 rounded-md text-white cursor-pointer disabled:cursor-default bg-blue-800 disabled:bg-blue-800/50'
  } else {
    return 'py-1 px-3 rounded-md text-white cursor-pointer disabled:cursor-default bg-red-800 disabled:bg-red-800/50'
  }
})
</script>

<template>
  <button
    :class="className"
  >
    <slot />
  </button>
</template>
` 
}


function generateNoGenericTextInpput(): string { 
    return expandToString`
<script lang="ts">
import { computed, watch } from 'vue'
import type { GenericTextInputProps } from './GenericTextInput.vue'
import type { ValidationResult, ValidationResultFunction } from '@/utils/regras'

export interface TextInputProps extends Omit<GenericTextInputProps, 'variant'> {
  rules?: ValidationResultFunction[];
}
</script>

<script setup lang="ts">

const value = defineModel()

const {
  type,
  placeholder,
  rules,
} = defineProps<TextInputProps>()

const hasRules = computed(() => {
  return rules !== undefined && rules.length > 0
})

const validationMessages = computed<ValidationResult[]>(() => {
  if (!hasRules.value) {
    return []
  }
  return (rules as ((value: any) => ValidationResult)[]).map((validarRegra) => {
    return validarRegra(value.value)
  })
})

const validationMessage = computed<string>(() => {
  return validationMessages.value.find((message) => {
    return typeof message === 'string'
  }) || ''
})

const isValid = computed<boolean>(() => {
  return validationMessages.value.every((valid) => {
    return valid === true
  })
})

const variant = computed(() => {
  if (isValid.value) {
    return 'default'
  } else {
    return 'error'
  }
})

const emit = defineEmits<{
  validationUpdate: [valid: boolean];
  keyupEnter: [];
}>()

const emitEnter = () => {
  emit('keyupEnter')
}

// pode ser feito tbm como v-model, expose
watch(isValid, (newValue) => {
  emit('validationUpdate', newValue)
})
</script>

<template>
  <div class="w-[280px]">
    <div class="h-[19px] mb-[16px]">
      <label class="">
        <slot />
      </label>
    </div>
    <generic-text-input
      class="mb-[8px]"
      v-model="value"
      :type="type"
      :placeholder="placeholder"
      :variant="variant"
      @keyup-enter="emitEnter"
    />

    <div class="h-(--text-2xl) overflow-auto text-red-400">
      {{ validationMessage }}
    </div>
  </div>
</template>
`
}


function generateREADME(): string {
    return expandToString`
# Components

Vue template files in this folder are automatically imported.

## 🚀 Usage

Importing is handled by [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components). This plugin automatically imports ".vue" files created in the "src/components" directory, and registers them as global components. This means that you can use any component in your application without having to manually import it.

The following example assumes a component located at "src/components/MyComponent.vue":

vue
<template>
  <div>
    <MyComponent />
  </div>
</template>

<script lang="ts" setup>
  //
</script>


When your template is rendered, the component's import will automatically be inlined, which renders to this:

vue
<template>
  <div>
    <MyComponent />
  </div>
</template>

<script lang="ts" setup>
  import MyComponent from '@/components/MyComponent.vue'
</script>
`;
}

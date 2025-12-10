import path from "path";
import { srcSidenavComponentsPath, srcIconsComponentsPath, srcComponentsPath } from "../foldersDatas";
import { expandToString } from "../../../src/util/template-string";


const navGroup: string = path.join(srcSidenavComponentsPath, 'NavGroup.vue');
const navItem: string = path.join(srcSidenavComponentsPath, 'NavItem.vue');
const navMenu: string = path.join(srcSidenavComponentsPath, 'NavMenu.vue');
const card: string = path.join(srcComponentsPath, 'Card.vue');
const dataTable: string = path.join(srcComponentsPath, 'DataTable.vue');
const genericTextInput: string = path.join(srcComponentsPath, 'GenericTextInput.vue');
const pButton: string = path.join(srcComponentsPath, 'PButton.vue');
const readMe: string = path.join(srcComponentsPath, 'README.md');
const textInput: string = path.join(srcComponentsPath, 'TextInput.vue');


export const srcComponentsFiles: { [key: string]:   string  } = {};


srcComponentsFiles[navGroup] = expandToString`
<script lang="ts" setup>
import { ref } from 'vue'
import IconNav from '../icons/IconNav.vue';

/**
 * @description NavGroup: Navigation Group Component This component represents a collapsible group of navigation items within a sidebar or navigation menu. 
 * @description It displays a label and can expand or collapse to show or hide its child navigation items. 
 * @description The open state is managed internally, allowing users to toggle the visibility of the contained items.
 * @component 
 * @example <NavGroup label="Group Label"> ... </NavGroup>
 * @prop {string} label - The label for the navigation group.
 */


defineProps<{
  label: string
}>()

const open = ref(false)
</script>

<template>
  <div class="bg-white/5 rounded">
    <button
      class="flex items-center justify-between w-full px-3 py-2 gap-2 text-left transition hover:bg-white/10"
      @click="open = !open"
    >
      <span>{{ label }}</span>
      <IconNav :open="open" />
    </button>

    <div
      v-if="open"
      class="mt-2 p1-3 space-y-1"
    >
      <slot />
    </div>
  </div>
</template>`;

srcComponentsFiles[navItem] = expandToString`
<script lang="ts" setup>
defineProps<{
  label: string
}>()

/**
 * @description NavItem Link Component This component represents a single navigation item within a sidebar or navigation menu.
 * 
 * @component 
 * @example <NavItem :to="{ name: 'route-name' }" label="Item Label" />
 * @prop {string} label - The label for the navigation item.
 */ 

</script>

<template>
  <router-link
    class="block px-3 py-2 rounded hover:bg-gray-0/10 transition-colors"
    active-class="bg-white/20 font-semibold"
  >
    {{ label }}
  </router-link>
</template>`;

srcComponentsFiles[card] = expandToString`
<template>
  <div class="p-3 border-2 rounded-md border-zinc-500 shadow-md">
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * @description GenerateCard Simple Card Component This component represents a simple card layout with padding, border, rounded corners, and shadow.
 * 
 * @component 
 * @example <Card></Card>Card Content</Card>
 */ 

</script>`; 

srcComponentsFiles[genericTextInput] = expandToString`
<script setup lang="ts">
import { computed } from 'vue'

export interface GenericTextInputProps {
  type?: 'text' | 'password';
  placeholder?: string;
  variant?: 'error' | 'default';
}

const {
  type = 'text',
  placeholder,
  variant = 'default'
} = defineProps<GenericTextInputProps>()

const value = defineModel()

const baseClass = 'w-full py-2 px-3 border-2 border-gray-600 rounded-sm placeholder:text-gray-400 '
const inputClass = computed(() => {
  if (variant === 'error') {
    return baseClass + 'border-red-400'
  }
  return baseClass
})

const emit = defineEmits<{
  keyupEnter: []
}>()

const emitEnter = () => {
  emit('keyupEnter')
}

/**
 * @description GenericTextInput Reusable Text Input Component This component represents a generic text input field with customizable type, placeholder, and variant for styling.
 * 
 * @component 
 * @example <GenericTextInput v-model="inputValue" type="text" placeholder="Enter text" variant="default" @keyup-enter="handleEnter" />
 * @prop {'text' | 'password'} type of the input field. 
 * @prop {string} placeholder text for the input field.
 * @prop {'error' | 'default'} variant for styling the input field.
 */ 
</script>


<template>
  <input
    v-model="value"
    :class="inputClass"
    :type="type"
    :placeholder="placeholder"
    @keyup.enter="emitEnter"
  />
</template>`;

srcComponentsFiles[pButton] = expandToString`
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

/**
 * @description PButton Reusable Button Component This component represents a customizable button with different variants for styling.
 * 
 * @component 
 * @example <PButton variant="default">Click Me</PButton>
 * @prop {'default' | 'error'} variant for styling the input field.
 */ 

</script>

<template>
  <button
    :class="className"
  >
    <slot />
  </button>
</template>`;

srcComponentsFiles[textInput] = expandToString`
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

/**
 * @description GenerateNoGenericTextInput Text Input Component with Validation This component represents a text input field with built-in validation capabilities.
 * 
 * @component 
 * @example <TextInput v-model="inputValue" :rules="[rule1, rule2]" type="text" placeholder="Enter text" @validationUpdate="handleValidation" @keyup-enter="handleEnter" />
 * @prop {ValidationResultFunction[]} rules - Array of validation functions to validate the input value.
 * @prop {'text' | 'password'} type of the input field. 
 * @prop {string} placeholder text for the input field.
 * 
 */ 
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
</template>`;

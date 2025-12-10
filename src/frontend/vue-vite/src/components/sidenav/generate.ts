import fs from "fs";
import { expandToString } from "../../../../../util/template-string.js";
import path from "path";
import SEON from "seon-lib-implementation";



export function generate(project_abstraction: SEON.ProjectAbstraction, target_folder: string) : void {
    fs.writeFileSync(path.join(target_folder, 'NavGroup.vue'), generateNavGroup());
    fs.writeFileSync(path.join(target_folder, 'NavItem.vue'), generateNavItem());
    fs.writeFileSync(path.join(target_folder, 'NavMenu.vue'), generateNavMenu(project_abstraction));
}


function generateNavGroup(): string {
    return expandToString`
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
</template>
`
}


function generateNavItem(): string {
    return expandToString`
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
</template>
`
}

function generateNavMenu(project_abstraction: SEON.ProjectAbstraction): string {
    const classList : SEON.ClassAbstraction[] = []

    for (const pkg of project_abstraction.getCoresPackages()) {
        for (const clazz of pkg.getPackageLevelClasses()) {
          classList.push(clazz)
        }
    }

    return expandToString`
<script lang="ts" setup>
import NavGroup from './NavGroup.vue'
import NavItem from './NavItem.vue'

/**
 * @description NavMenu: Navigation Menu Component This component represents the main navigation menu, it's the sidebar properly.
 * 
 * @component 
 * @example <NavMenu />
 */ 


</script>

<template>
  <aside class="flex flex-col h-full px-4 py-6 text-white lg:px-2">
    <section class="flex flex-col grow items-center w-full h-14 px-5 space-x-2 bg-gray-0 z-30 lg:static lg:flex-col lg:justify-start lg:px-0 lg:space-x-0 lg:space-y-2 lg:bg-transparent">
      <!-- <NavItem to="/" label="Página inicial" /> -->

${generateNav(classList)}

    </section>
  </aside>
</template>
`
}

function generateNav(clsList: SEON.ClassAbstraction[]): string {
    let str = ""

    for (const cls of clsList) {
        str = str.concat(expandToString`
      <NavGroup label="${cls.getName()}">
        <NavItem :to="{ name: '${cls.getName().toLowerCase()}-home' }" label="Listar" />
        <NavItem :to="{ name: '${cls.getName().toLowerCase()}-criar' }" label="Criar" />
      </NavGroup>
`)
    }

    return str
}
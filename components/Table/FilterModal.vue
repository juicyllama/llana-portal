<script lang="ts" setup> 
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Operator, type Filter } from '~/types/llana';

defineProps<{
    schema: any;
    show: boolean;
}>();

const emits = defineEmits<{
    (e: 'close'): void;
    (e: 'addFilter', filter: any): void;
}>();

const newFilter = ref<Filter>({ field: '', operator: Operator.equals, value: '' })

function addFilterField(field: string) {
    newFilter.value.field = field
}

function addFilterOperator(operator: Operator) {
    newFilter.value.operator = operator
}

function friendlyOperator(operator: Operator) {
    return operators.find(o => o.operator === operator)?.friendly
}

</script>

<template>
<div v-if="show" class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div
                    class="sm:w-200 relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:p-6">
                    <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                        <button @click="emits('close')" type="button"
                            class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
                            <span class="sr-only">Close</span>
                            <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                aria-hidden="true" data-slot="icon">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div class="sm:flex sm:items-start">
                        <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <h3 class="text-base font-semibold text-gray-900 pb-4" id="modal-title">Filter Records</h3>

                            <!-- Column Selector -->

                            <Menu as="div" class="w-full sm:w-56 relative inline-block text-left mb-2 ">
                                <MenuButton
                                    class="w-full inline-flex gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                    {{ newFilter.field || 'Select Column' }}
                                    <Icon name="ph:caret-down-duotone" class="size-5 text-gray-400"
                                        aria-hidden="true" />
                                </MenuButton>

                                <transition enter-active-class="transition ease-out duration-100"
                                    enter-from-class="transform opacity-0 scale-95"
                                    enter-to-class="transform opacity-100 scale-100"
                                    leave-active-class="transition ease-in duration-75"
                                    leave-from-class="transform opacity-100 scale-100"
                                    leave-to-class="transform opacity-0 scale-95">
                                    <MenuItems
                                        class="w-full sticky right-0 z-10 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                                        <div class="py-1">

                                            <MenuItem v-for="column in schema.columns">
                                            <a href="#" @click="addFilterField(column.field)"
                                                :class="[newFilter.field === column.field ? 'bg-gray-100 text-gray-900 outline-none' : 'text-gray-700', 'group flex items-center px-4 py-2 text-sm']">
                                                <ColumnIcon :column="column"
                                                    class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                                                {{ column.field }}
                                            </a>
                                            </MenuItem>
                                        </div>
                                    </MenuItems>
                                </transition>
                            </Menu>

                            <!-- operator -->

                            <Menu as="div" class="w-full sm:w-56 relative inline-block text-left sm:pl-4 mb-2 ">
                                <MenuButton
                                    class="inline-flex w-full gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                    {{ friendlyOperator(newFilter.operator) || 'Select Operator' }}
                                    <Icon name="ph:caret-down-duotone" class="size-5 text-gray-400"
                                        aria-hidden="true" />
                                </MenuButton>

                                <transition enter-active-class="transition ease-out duration-100"
                                    enter-from-class="transform opacity-0 scale-95"
                                    enter-to-class="transform opacity-100 scale-100"
                                    leave-active-class="transition ease-in duration-75"
                                    leave-from-class="transform opacity-100 scale-100"
                                    leave-to-class="transform opacity-0 scale-95">
                                    <MenuItems
                                        class="sticky right-0 z-10 mt-2 w-full origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                                        <div class="py-1">

                                            <MenuItem v-for="operator in operators">
                                            <a href="#" @click="addFilterOperator(operator.operator)"
                                                :class="[newFilter.operator === operator.operator ? 'bg-gray-100 text-gray-900 outline-none' : 'text-gray-700', 'group flex items-center px-4 py-2 text-sm']">
                                                <Icon :name="operator.icon"
                                                    class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                                                {{ operator.friendly }}
                                            </a>
                                            </MenuItem>
                                        </div>
                                    </MenuItems>
                                </transition>
                            </Menu>

                            <!-- Value -->
                            <div class="w-full sm:w-56 relative inline-block text-left sm:pl-4">
                                <input type="text" name="search" id="search" v-model="newFilter.value"
                                    class="w-full rounded-md bg-white pl-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-600 sm:text-sm/6"
                                    placeholder="Value" />
                            </div>

                        </div>
                    </div>

                    <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button :disabled="!newFilter.operator || !newFilter.value || !newFilter.field"
                            @click="emits('addFilter', newFilter)" type="button"
                            class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto">Add
                            Filter</button>
                        <button @click="emits('close')" type="button"
                            class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup> 
const props = defineProps<{
    schema: any;
    hideColumns?: string[]
    skipColumns?: string[];
    show: boolean;
}>();

const emits = defineEmits<{
    (e: 'close'): void;
    (e: 'toggled', column: string): void;
}>();

const columns = computed(() => {
    return props.schema?.columns?.filter((col: any) => {
        return !props.skipColumns?.includes(col.field);
    }) || [];
});

function visibleColumn(column: string) {
    return !props.hideColumns?.includes(column);
}

</script>

<template>
<div v-if="show" class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div
                    class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
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
                            <h3 class="text-base font-semibold text-gray-900 pb-4" id="modal-title">Columns</h3>

                            <p class="text-sm text-gray-500">Select which columns you want to display in the table.</p>
                            <!-- Column Selector -->

                            <!-- loop over the columns and show the eye icon if visable or the eye-slash icon if hidden -->
                          
                            <div class="mt-4">
                                <ul class="space-y-2">
                                    <li v-for="column in columns" :key="column.field" class="flex items-center justify-between">
                                        <span class="text-sm text-gray-700">{{ column.field }}</span>
                                        <button 
                                            @click="emits('toggled', column.field)" 
                                            class="text-gray-500 hover:text-gray-700 focus:outline-none"
                                        >
                                          
                                             <Icon v-if="visibleColumn(column.field)" name="ph:eye" size="22" />

                                            <Icon v-else name="ph:eye-slash" size="22" />
                                          
                                        </button>
                                    </li>
                                </ul>   
                            </div>


                        </div>
                    </div>
                            
                    <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button 
                            @click="emits('close')" 
                            type="button"
                            class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

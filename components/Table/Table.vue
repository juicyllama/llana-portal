<script lang="ts" setup>
import FilterModal from '~/components/Table/FilterModal.vue';
import ColumnsModal from '~/components/Table/ColumnsModal.vue';
import AddEditModal from '~/components/Table/AddEditModal.vue';

import { get, set } from '~/store/tablePref';
import { type Filter, type Schema } from '~/types/llana';
import type { ToastNotification } from '~/components/Toast.vue';

const props = withDefaults(defineProps<{
    schema: Schema
    limit?: number
    orderBy?: string
    orderDirection?: 'asc' | 'desc'
    skipColumns?: string[]
    hideColumns?: string[]
    title?: string
    options?: {
        filter: boolean
        columns: boolean
            create: boolean
            update: boolean
        delete: boolean
    },
    queryProps?: {
        [key: string]: any
    },
    cacheKeyOverride?: string
}>(), {
    limit: 10,
    orderDirection: 'asc',
    options: {
        filter: true,
        columns: true,
        create: true,
        update: true,
        delete: true
    },
})

const tablePreferences = get(props.cacheKeyOverride ?? props.schema.table)

const config = useRuntimeConfig()
const toast = inject('toast') as Ref<ToastNotification>
const data = ref({})
const loading = ref(true)
const offset = ref(tablePreferences?.offset ?? 0)
const filters = <Filter[]>ref(tablePreferences?.filters || [])
const filterModal = ref(false)
const columnsModal = ref(false)
const addEditModal = ref(false)
const selectedRecord = ref({})

const orderBy = ref(tablePreferences?.orderBy ?? props.schema.primary_key)
const orderDirection = ref(tablePreferences?.orderDirection ?? props.orderDirection)

if(props.hideColumns?.length && !tablePreferences?.hideColumns?.length) {
    for(const column of props.hideColumns) {
        addTablePreferences('hideColumns', [...(tablePreferences?.hideColumns || []), column])
    }
}

function getColumns() {

    const columns = props.schema.columns.filter(column => {
        if (props.skipColumns && props.skipColumns.includes(column.field)) {
            return false
        }
        if (tablePreferences?.hideColumns && tablePreferences.hideColumns.includes(column.field)) {
            return false
        }
        return true
    })

    return columns
}

function getColumnFields(){
    return getColumns().map(column => column.field)    
}

async function getData() {

    let fields = getColumnFields().join(',')
    if(props.queryProps && Object.keys(props.queryProps).length){
        fields += ',' + Object.keys(props.queryProps).join(',')
    }

    if(!fields.split(',').includes(props.schema.primary_key)) {
        fields += ',' + props.schema.primary_key
    }

    try{

        loading.value = true


        const queryString = {
            sort: orderBy.value + '.' + orderDirection.value,
            offset: offset.value,
            limit: props.limit,
            ...props.queryProps,
            fields
        }

        let endpoint = `/${props.schema.table}/?` + new URLSearchParams(queryString)

        if (filters.value.length > 0) {
            endpoint += '&' + filters.value.map(f => f.field + '[' + f.operator + ']=' + f.value).join('&')
        }

        data.value = await $fetch({
            endpoint: endpoint,
            method: 'GET'
        })

        if (data.value.data) {
            loading.value = false
        }

    } catch (error) {
        console.error('Error fetching data:', error)
    } finally {
        loading.value = false
    }

}

function showDate(date: string | null) {
    if (!date) return ''
    return new Date(date).toISOString().split('T')[0]
}

function showTime(date: string | null) {
    if (!date) return ''
    return new Date(date).toISOString().split('T')[1].split('.')[0]
}


async function sort(column: string) {
    if (orderBy.value === column) {
        orderDirection.value = orderDirection.value === 'asc' ? 'desc' : 'asc' 
    } else {
        orderBy.value = column
        orderDirection.value = 'asc'
    }

    addTablePreferences('orderBy', orderBy.value)
    addTablePreferences('orderDirection', orderDirection.value)

    await getData()
}

async function getNext() {
    offset.value = data.value.offset + data.value.pagination?.total
    addTablePreferences('offset', offset.value)
    await getData()
}

async function getPrevious() {
    offset.value = data.value.offset - data.value.pagination?.total
    addTablePreferences('offset', offset.value)
    await getData()
}

async function getPage(page: number) {
    offset.value = (page - 1) * data.value.pagination?.total
    addTablePreferences('offset', offset.value)
    await getData()
}

async function addFilter(filter: Filter) {
    filters.value.push(filter)
    filterModal.value = false
    offset.value = 0
    addTablePreferences('filters', filters.value)
    await getData()
}

async function removefilter(filter: Filter) {
    filters.value = filters.value.filter(f => f !== filter)
    offset.value = 0
    addTablePreferences('filters', filters.value)
    await getData()
}

async function toggleColumn(column: string) {
    if (tablePreferences?.hideColumns.includes(column)) {
        tablePreferences.hideColumns = tablePreferences.hideColumns.filter(c => c !== column)
        addTablePreferences('hideColumns', tablePreferences.hideColumns)
    }else {
        tablePreferences.hideColumns.push(column)
        addTablePreferences('hideColumns', tablePreferences.hideColumns)
    }

    await getData()
}

function filterButton(filter: Filter) {
    let op = operators.find(o => o.operator === filter.operator)
    return filter.field + ' ' + op.symbol + ' ' + filter.value
}

function deleteRecord(record: any) {
    if (confirm(`Are you sure you want to delete this record?`)) {
        $fetch({
            endpoint: `/${props.schema.table}/${record[props.schema.primary_key]}`,
            method: 'DELETE'
        }).then(() => {

            toast.value = {
                show: true,
                title: 'Delete successful',
                message: 'You have successfully deleted the record.',
                type: 'success',
                timeout: 5,
            };

            getData()
        }).catch(error => {
            console.error('Error deleting record:', error)
            toast.value = {
                show: true,
                title: 'Error deleting record',
                message: error.message || 'An error occurred while deleting the record.',
                type: 'error',
                timeout: 20,
            };
        })
    }
}

function addTablePreferences(key: string, value: any) {
    tablePreferences[key] = value
    set(props.cacheKeyOverride ?? props.schema.table, tablePreferences)
}

async function editRecord(record: any) {
    selectedRecord.value = await $fetch({
        endpoint: `/${props.schema.table}/${record[props.schema.primary_key]}`,
        method: 'GET'
    })
    addEditModal.value = true
}

function addEditClose() {
    addEditModal.value = false
    selectedRecord.value = props.queryProps || {}
}

async function addEditRefresh() {
    addEditModal.value = false
    selectedRecord.value = props.queryProps || {}
    await getData()
}

onMounted(async () => {
    await getData()
})

</script>

<template>

    <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
            <h1 class="text-3xl font-semibold text-gray-900">{{ title ?? props.schema.table }}</h1>

            <p class="mt-2 text-sm text-gray-700">
                <Skeleton v-if="loading" width="w-64" />
                
                <span v-else-if="data?.data && data?.data.length">Showing {{ data.offset + 1 }}-{{ data.offset + data.pagination?.total }} of {{ data?.total }}
                    records</span>
                <span v-else>Showing 0 records</span>
            </p>
        </div>
        <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <div class="mt-2 flex flex-row gap-2">
                <button v-for="filter in filters" type="button"
                    class="mr-2 inline-flex items-center gap-x-1.5 rounded-md bg-white hover:bg-gray-50 px-2.5 py-1.5 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600 border-solid border-2">
                    {{ filterButton(filter) }}
                    <Icon name="ph:x" class="cursor-pointer" @click="removefilter(filter)" />
                </button>
                <button v-if="data.total > 1 && options.filter" @click="filterModal = true" type="button"
                    class="inline-flex items-center gap-x-1.5 rounded-md bg-yellow-500 px-2.5 py-1.5 text-sm text-black shadow-sm hover:bg-yellow-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600">
                    <Icon name="ph:magnifying-glass"
                        class="pointer-events-none col-start-1 row-start-1 size-5 self-center justify-self-end text-white-400 sm:size-4"
                        aria-hidden="true" />
                     <span class="font-semibold">Filter Records</span> <span v-if="filters.length" class="text-white-400">({{ filters.length }})</span>
                </button>
                 <button v-if="data.total > 0 && options.columns" @click="columnsModal = true" type="button"
                    class="inline-flex items-center gap-x-1.5 rounded-md bg-yellow-500 px-2.5 py-1.5 text-sm text-black shadow-sm hover:bg-yellow-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600">
                    <Icon name="ph:columns"
                        class="pointer-events-none col-start-1 row-start-1 size-5 self-center justify-self-end text-white-400 sm:size-4"
                        aria-hidden="true" />
                    <span class="font-semibold">Columns</span> <span v-if="tablePreferences?.hideColumns?.length" class="text-white-400"><Icon name="ph:eye-slash" size="20" class="iconFix" /> {{ tablePreferences.hideColumns.length }}</span>
                </button>
                <button v-if="options.create" @click="addEditModal = true" type="button"
                    class="inline-flex items-center gap-x-1.5 rounded-md bg-green-600 px-2.5 py-1.5 text-sm text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
                    <Icon name="ph:plus"
                        class="pointer-events-none col-start-1 row-start-1 size-5 self-center justify-self-end text-white-400 sm:size-4"
                        aria-hidden="true" />
                    <span class="font-semibold">Add Record</span> 
                </button>
            </div>
        </div>
    </div>


    <div class="mt-8 flow-root">

        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div v-if="data?.data && data?.data.length">
                    <table class="min-w-full divide-y divide-gray-300">
                        <thead>
                            <tr>
                                <th v-for="column in getColumns()" scope="col"
                                    class="py-3.5 pr-12 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                                    @click="sort(column.field)">
                                    <div class="flex items-center">
                                        {{ column.field }}
                                        <span v-if="column.required">*</span>
                                        <span v-if="column.primary_key">
                                            <Icon name="ph:key-duotone" class="iconFix" />
                                        </span>
                                        <span v-if="orderBy === column.field">
                                            <Icon v-if="orderDirection === 'asc'" name="ph:arrow-up-duotone"
                                                class="iconFix" />
                                            <Icon v-else name="ph:arrow-down-duotone" class="iconFix" />
                                        </span>
                                    </div>
                                </th>
                                <th v-if="options?.create || options?.update || options?.delete" scope="col"
                                    class="py-3.5 text-right text-sm font-semibold text-gray-900">
                                    Options
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white">
                            <tr v-if="loading">
                                <td v-for="column in getColumns()" scope="col"
                                    class="pr-12 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    <Skeleton width="w-32" />
                                </td>

                            </tr>
                            <tr v-else v-for="(record, index) in data?.data" class="even:bg-gray-50 cursor-pointer"
                                :key="index">
                                <td v-for="column in getColumns()" scope="col"
                                    class="pr-12 py-3.5 text-left text-sm text-gray-900">
                                    <!--Date-->
                                    <div v-if="column.type === 'date'" class="flex flex-col">
                                        <span class="text-md">{{ showDate(record[column.field]) }}</span>
                                        <span class="text-xs text-gray-500">{{ showTime(record[column.field]) }}</span>
                                    </div>
                                    <span v-else class="align-middle">
                                        {{ record[column.field] }}
                                    </span>
                                </td>

                                <td v-if="options?.create || options?.update || options?.delete"
                                    class="py-3.5 text-right text-sm text-gray-900">
                                    <div class="flex flex-row justify-end gap-3 whitespace-nowrap ">

                                        <div v-if="options?.update">

                                            <button @click.stop="editRecord(record)" class="text-yellow-600 hover:text-yellow-900">
                                                <div class='has-tooltip'>
                                                    <span class='tooltip rounded shadow-lg text-sm p-1 bg-yellow-600 text-black -mt-8 -ml-28'>
                                                        Edit Record
                                                    </span>
                                                    <Icon name="ph:note-pencil" size="22" />
                                                </div>
                                            </button>

                                        </div>  
                                         <div v-if="options?.delete">
                                           
                                            <button @click.stop="deleteRecord(record)" class="text-yellow-600 hover:text-yellow-900">
                                                <div class='has-tooltip'>
                                                    <span class='tooltip rounded shadow-lg text-sm p-1 bg-yellow-600 text-black -mt-8 -ml-28'>
                                                        Delete Record
                                                    </span>
                                                    <Icon name="ph:trash" size="22" />
                                                </div>
                                            </button>


                                        </div>
                                    </div>
                                </td>

                            </tr>
                        </tbody>
                    </table>

                    <Pagination :list="data" @pagination:next="getNext" @pagination:previous="getPrevious"
                        @pagination:page="getPage" v-if="data?.total > limit" />

                </div>

                <div v-else class="text-center text-gray-500">
                    <p>No records found.</p>
                </div>

            </div>
        </div>


    </div>

    <FilterModal 
        :show="filterModal"
        :schema="schema"
        @close="filterModal = false"
        @addFilter="addFilter"
    />

    <ColumnsModal 
        :show="columnsModal"
        :schema="schema"
        :skipColumns="skipColumns"
        :hideColumns="tablePreferences?.hideColumns || []"
        @close="columnsModal = false"
        @toggled="toggleColumn"
    />

    <AddEditModal
        :show="addEditModal"
        :schema="schema"
        :skipColumns="skipColumns"
        :hideColumns="tablePreferences?.hideColumns || []"
        :queryProps="queryProps"
        :record="selectedRecord"
        :domain="config.public.DOMAIN"
        @close="addEditClose"
        @refresh="addEditRefresh"
    />

</template>
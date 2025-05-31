<script lang="ts" setup> 
import { ColumnType, type Schema } from '~/types/llana'
import { formatDate } from '~/utils/dates'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, useField } from 'vee-validate'
import * as zod from 'zod'
import Field from '~/components/Fields/Field.vue'
import type { ToastNotification } from '~/components/Toast.vue'

const props = defineProps<{
    schema: Schema;
    domain: string;
    show: boolean;
    record?: any
    skipColumns?: string[]
}>();

const emits = defineEmits<{
    (e: 'close'): void;
    (e: 'refresh'): void;
}>();

const toast = inject('toast') as Ref<ToastNotification>
const validationSchema = buildValidation(props.schema)
const fields = ref<Record<string, ReturnType<typeof useField>>>({})

const { handleSubmit, errors, setValues } = useForm({
    validationSchema
})

// Set up fields with useField
function setupFields(record?: any) {

    const initialValues =  buildRecord(props.schema, record ?? props.record)

    props.schema.columns.forEach(column => {
        if(column.primary_key && column.extra === 'auto_increment') return;
        if(props.skipColumns?.includes(column.field)) return;
        
        // Use the field name to connect with the validation schema
        fields.value[column.field] = useField(column.field, {
            initialValue: initialValues[column.field] ?? undefined,
        });
    });
}

function postCleanup(values: any) {

    for(const column of props.schema.columns){
        switch(column.type){
            case ColumnType.date:
                if(values[column.field].includes('NaN') || values[column.field] === '1970-01-01T1:00:00'){
                    values[column.field] = undefined
                }else{
                    // convert html input dateformat-local (2025-05-23T0:18:48) date to javascript date in ISO format
                    let date = values[column.field]
                    date = date.replace('T', ' ')
                    values[column.field] = new Date(date).toISOString()
                }
                break
        }
    }

    return values
}

const onSubmit = handleSubmit(async (values) => {
   
    const newRecord = postCleanup(values)
   
    if(props.record?.[props.schema.primary_key]){
        // Edit mode
        try{

            await $update({
                table: props.schema.table,
                id: props.record[props.schema.primary_key],
                data: newRecord,
            })

            toast.value = {
                show: true,
                title: 'Update successful',
                message: 'You have successfully updating the record.',
                type: 'success',
                timeout: 5,
            }

            emits('refresh')

        }catch(error: any) {
            console.error('Error updating record:', error)
            toast.value = {
                show: true,
                title: 'Error updating record',
                message: error.message ?? 'There was an error updating the record.',
                type: 'error',
                timeout: 20,
            }
        }
    } else {
        // Add mode
        try{

            await $create({
                table: props.schema.table,
                data: newRecord,
            })

            toast.value = {
                show: true,
                title: 'Added successfully',
                message: 'You have successfully added the new record.',
                type: 'success',
                timeout: 5,
            }

            emits('refresh')

        }catch(error: any) {
            console.error('Error creating record:', error)
            toast.value = {
                show: true,
                title: 'Error creating record',
                message: error.message ?? 'There was an error creating the record.',
                type: 'error',
                timeout: 20,
            }
        }
    }
    
    
})

function buildValidation(schema: Schema){
    const validation: any = {}

    for(const column of schema.columns){
        if(column.primary_key && column.extra === 'auto_increment'){
            continue
        }

        switch(column.type){
            case 'boolean':
                if(column.nullable){
                    validation[`${column.field}`] = zod.boolean().optional().nullable()
                }else{
                    validation[`${column.field}`] = zod.boolean()
                }
                break

            case 'date':
                if(column.nullable){
                    validation[`${column.field}`] = zod.string().nullable().optional()
                }else{
                    validation[`${column.field}`] = zod.string()
                        .refine(value => !isNaN(Date.parse(value)), {
                            message: `${column.field} must be a valid date`
                        })
                }
                break

            case 'number':
                if(column.nullable){
                    validation[`${column.field}`] = zod.number().nullable().optional()
                }else{
                    validation[`${column.field}`] = zod.number()
                }
                break

            case 'enum':
            case 'string':
            default:
                if(column.nullable){
                    validation[`${column.field}`] = zod.string().nullable().optional()
                }else{
                    validation[`${column.field}`] = zod.string().min(1, `${column.field} is required`)
                }
                break
        }
    }

    return toTypedSchema(zod.object(validation))
}

function buildRecord(schema: Schema, record?: any){
    const loc: any = {}

    for(const column of schema.columns){
        if(column.primary_key && column.extra === 'auto_increment'){
            loc[`${column.field}`] = undefined
            continue
        }

        if(record?.[column.field] !== undefined || record?.[column.field] !== null || record?.[column.field] !== ''){
            switch(column.type){
                case ColumnType.date:
                    loc[`${column.field}`] = formatDate(new Date(record[column.field]))
                    continue

                case ColumnType.boolean:
                    loc[`${column.field}`] = Boolean(record[column.field])
                    continue
                    
                case ColumnType.number:
                    loc[`${column.field}`] = Number(record[column.field])
                    continue
                    
                case ColumnType.enum:
                case ColumnType.string:
                    loc[`${column.field}`] = record[column.field]
                    continue
            }
        }

        if(column.default !== undefined && column.default !== null){
            switch(column.type){
                case ColumnType.boolean:
                    loc[`${column.field}`] = (column.default === '1' || column.default.toLowerCase() === 'true')
                    continue

                case ColumnType.date:    
                    switch(column.default){
                        case 'CURRENT_TIMESTAMP':
                            loc[`${column.field}`] = formatDate(new Date())
                        default:
                            loc[`${column.field}`] = ''
                    }
                    continue
                        
                case ColumnType.number:
                    loc[`${column.field}`] = Number(column.default)
                    continue
                    
                case ColumnType.enum:
                case ColumnType.string:
                default:
                    loc[`${column.field}`] = column.default
                    continue
            }
        }

        if(column.nullable){
            loc[`${column.field}`] = null
        }else{
            loc[`${column.field}`] = undefined
        }           
    }
    return loc
}

watch(() => props.record, (newRecord) => {
    if(!newRecord) return;
    const record = buildRecord(props.schema, newRecord)
    setValues(record)
}, { immediate: true })

setupFields()

</script>

<template>
<div v-if="show" class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

         <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex items-end justify-center p-4 text-center sm:p-0">
                <div
                    class="relative sm:min-w-[500px] transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:p-6">
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
                    
                    <form class="space-y-4" @submit.prevent="onSubmit">

                        <div class="sm:flex">
                            <div class="mt-3 w-full text-left">
                                <h3 class="text-base font-semibold text-gray-900 pb-4" id="modal-title">
                                    <span v-if="record?.[schema.primary_key]">Edit Record #{{record?.[schema.primary_key]}}</span>
                                    <span v-else>Add Record</span>
                                </h3>

                                 <div 
                                    v-for="column in schema.columns"
                                    class="w-full"
                                    >

                                    <Field
                                        v-if="!props.skipColumns?.includes(column.field) && !(column.primary_key && column.extra === 'auto_increment')"
                                        :key="column.field"
                                        :column="column"
                                        v-model="fields[column.field].value"
                                        :error="errors[column.field]"
                                    />

                                </div>
                            </div>
                        </div>

                        <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">

                            <button
                                v-if="record?.[schema.primary_key]"
                                type="submit"
                                class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto">Edit Record</button>
                        
                            <button
                                v-else
                                type="submit"
                                class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto">Add Record</button>
                        

                            <button @click="emits('close')" type="button"
                                class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Close</button>
                            
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

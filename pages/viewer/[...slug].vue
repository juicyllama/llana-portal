<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Operator } from '~/types/llana'
const config = useRuntimeConfig()

const route = useRoute()
const table = route.path.split('/').pop()

//TODO localStorage for request data
const data = ref({})
const loadingSchema = ref(true)
const loadingData = ref(true)
const showSchema = ref(false)
const orderBy = ref('')
const orderDirection = ref('asc')
const offset = ref(0)
const filters = <Filter[]>ref([])
const filterModal = ref(false)
const newFilter = ref<Filter>({field: '', operator: Operator.equals, value: ''})

const operators = [{
    operator: Operator.equals,
    friendly: 'Equals',
    icon: 'ph:equals-duotone',
    symbol: '='
},{
    operator: Operator.not_equals,
    friendly: 'Not Equals',
    icon: 'ph:not-equals-duotone',
     symbol: '!='
},{
    operator: Operator.gt,
    friendly: 'Greater Than',
    icon: 'ph:greater-than-duotone',
     symbol: '>'
},{
    operator: Operator.gte,
    friendly: 'Greater Than or Equals',
    icon: 'ph:greater-than-or-equal-duotone',
    symbol: '>='
},{
    operator: Operator.lt,
    friendly: 'Less Than',
    icon: 'ph:less-than-duotone',
    symbol: '<'
},{
    operator: Operator.lte,
    friendly: 'Less Than or Equals',
    icon: 'ph:less-than-or-equal-duotone',
    symbol: '<='
},{
    operator: Operator.like,
    friendly: 'Like',
    icon: 'ph:approximate-equals-duotone',
    symbol: '%'
},{
    operator: Operator.not_like,
    friendly: 'Not Like',
    icon: 'ph:exclamation-mark-duotone',
    symbol: '!%'
},{
    operator: Operator.in,
    friendly: 'In',
    icon: 'ph:selection-background-duotone',
    symbol: '[]'
},{
    operator: Operator.not_in,
    friendly: 'Not In',
    icon: 'ph:selection-foreground-duotone',
    symbol: '![]'
},{
    operator: Operator.null,
    friendly: 'Is Null',
    icon: 'ph:square-duotone',
    symbol: '!'
},{
    operator: Operator.not_null,
    friendly: 'Is Not Null',
    icon: 'ph:check-square-duotone',
    symbol: '!!'
},{
    operator: Operator.search,
    friendly: 'Search',
    icon: 'ph:magnifying-glass-plus-duotone',
    symbol: '??'
}]

const schema = await $fetch({
  endpoint: `/${table}/schema`,
  method: 'GET'
})

loadingSchema.value = false

orderBy.value = schema.primary_key

await getData()

async function getData() {
  loadingData.value = true

  const queryString = {
    sort: orderBy.value+'.'+orderDirection.value,
    offset: offset.value,
    limit: 10
  }

  let endpoint = `/${table}/?`+new URLSearchParams(queryString)

  if(filters.value.length > 0) {
    endpoint += '&'+filters.value.map(f => f.field+'['+f.operator+']='+f.value).join('&')
  }

  data.value = await $fetch({
    endpoint: endpoint,
    method: 'GET'
  })

  if(data.value.data) {
    loadingData.value = false
    offset.value = data.value.offset
  }

}

async function sort(column: string) {
  if(orderBy.value === column) {
    orderDirection.value = orderDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    orderBy.value = column
    orderDirection.value = 'asc'
  }

  await getData()
}

async function getNext() {
  offset.value = data.value.offset + data.value.pagination.total
  await getData()
}

async function getPrevious() {
  offset.value = data.value.offset - data.value.pagination.total
  await getData()
}

async function getPage(page: number) {
  offset.value = (page - 1) * data.value.pagination.total
  await getData()
}

function showDate(date: string) {
  return new Date(date).toISOString().split('T')[0]
}

function showTime(date: string) {
  return new Date(date).toISOString().split('T')[1].split('.')[0]
}

function addFilterField(field: string) {
  newFilter.value.field = field

}

function addFilterOperator(operator: Operator) {
  newFilter.value.operator = operator
}

function friendlyOperator(operator: Operator) {
  return operators.find(o => o.operator === operator)?.friendly
}

async function addFilter() {
  filters.value.push(newFilter.value)
  newFilter.value = {field: '', operator: Operator.equals, value: ''}
  filterModal.value = false
  offset.value = 0
  await getData()
}

async function removefilter(filter: Filter) {
  filters.value = filters.value.filter(f => f !== filter)
  offset.value = 0
  await getData()
}

function filterButton(filter: Filter) {

  let op = operators.find(o => o.operator === filter.operator)

  return filter.field +' '+op.symbol+' '+filter.value
}

</script>

<template>



  <main v-if="loadingSchema">
    <div class="flex justify-center text-center">
        <svg aria-hidden="true" class="w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span class="sr-only">Loading...</span>
    </div>

  </main>
      <main v-else>
        <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
              <h1 class="text-base font-semibold text-gray-900">{{table}} <Icon name="ph:code-block-duotone" class="iconFix ml-2 cursor-pointer" @click="showSchema = !showSchema"/></h1>

              <pre v-if="showSchema">
Endpoint: {{config.public.DOMAIN}}/{{ table }}/schema

{{ schema }}</pre>

              <p class="mt-2 text-sm text-gray-700">
                <Skeleton v-if="loadingData" width="w-64" />
                <span v-else>Showing {{ data.offset+1 }}-{{ data.offset+data.pagination.total}} of {{ data.total }} records</span>
              </p>
            </div>
            <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <div class="mt-2 flex flex-row">
                <button 
                v-for="filter in filters"
                type="button" class="mr-2 inline-flex items-center gap-x-1.5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600 border-solid border-2">
                {{ filterButton(filter) }} <Icon name="ph:x" class="cursor-pointer" @click="removefilter(filter)" />
                </button>
                <button @click="filterModal = true" type="button" class="inline-flex items-center gap-x-1.5 rounded-md bg-yellow-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600">
                  <Icon name="ph:magnifying-glass-duotone" class="pointer-events-none col-start-1 row-start-1 size-5 self-center justify-self-end text-white-400 sm:size-4" aria-hidden="true" />
                  Filter Records
                </button>
             </div>
            </div>
          </div>

    
          <div class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th 
                v-for="column in schema.columns"
                  scope="col" 
                  class="py-3.5 pr-12 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                  @click="sort(column.field)"
                  >
                  <div class="flex items-center">
                    {{column.field}}
                    <span v-if="column.required">*</span>
                    <span v-if="column.primary_key"><Icon name="ph:key-duotone" class="iconFix" /></span>
                    <span v-if="orderBy === column.field">
                      <Icon v-if="orderDirection === 'asc'" name="ph:arrow-up-duotone" class="iconFix" />
                      <Icon v-else name="ph:arrow-down-duotone" class="iconFix" />
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr v-if="loadingData">
                <td 
                v-for="column in schema.columns"
                  scope="col" 
                  class="pr-12 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                  <Skeleton width="w-32" />
                </td>
    
              </tr>
              <tr v-else v-for="(record, index) in data.data" class="even:bg-gray-50 cursor-pointer">
              <td 
                v-for="column in schema.columns"
                  scope="col" 
                  class="pr-12 py-3.5 text-left text-sm text-gray-900"
                  >
                  <!--Date-->
                  <div v-if="column.type ==='date'" class="flex flex-col">
                    <span class="text-md">{{ showDate(record[column.field]) }}</span>
                    <span class="text-xs text-gray-500">{{ showTime(record[column.field]) }}</span>
                  </div>
                  <span v-else class="align-middle">
                    {{ record[column.field] }}
                </span>
                </td>

              </tr>
            </tbody>
          </table>
        </div>
        </div>
   
      <Pagination :list="data" @pagination:next="getNext" @pagination:previous="getPrevious" @pagination:page="getPage" />
   
   
    </div>







          
        </div>
 </main>


 <div 
 v-if="filterModal"
 
 class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <!--
    Background backdrop, show/hide based on modal state.

    Entering: "ease-out duration-300"
      From: "opacity-0"
      To: "opacity-100"
    Leaving: "ease-in duration-200"
      From: "opacity-100"
      To: "opacity-0"
  -->
  <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

  <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <!--
        Modal panel, show/hide based on modal state.

        Entering: "ease-out duration-300"
          From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          To: "opacity-100 translate-y-0 sm:scale-100"
        Leaving: "ease-in duration-200"
          From: "opacity-100 translate-y-0 sm:scale-100"
          To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      -->
      <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
        <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
          <button @click="filterModal = false" type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
            <span class="sr-only">Close</span>
            <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="sm:flex sm:items-start">
          <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <h3 class="text-base font-semibold text-gray-900 pb-4" id="modal-title">Filter Records</h3>
          
                  <!-- Column Selector -->

        <Menu as="div" class="relative inline-block text-left">
            <MenuButton class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              {{newFilter.field || 'Select Column'}}
              <Icon name="ph:caret-down-duotone" class="size-5 text-gray-400" aria-hidden="true" />
            </MenuButton>

            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="sticky right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                <div class="py-1">

                  <MenuItem
                    v-for="column in schema.columns"
                  >
                    <a href="#" @click="addFilterField(column.field)" :class="[newFilter.field === column.field ? 'bg-gray-100 text-gray-900 outline-none' : 'text-gray-700', 'group flex items-center px-4 py-2 text-sm']">
                      <ColumnIcon :column="column" class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                      {{ column.field }}
                    </a>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
        </Menu>

           <!-- operator -->

        <Menu as="div" class="relative inline-block text-left pl-4">
            <MenuButton class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              {{ friendlyOperator(newFilter.operator) || 'Select Operator'}}
              <Icon name="ph:caret-down-duotone" class="size-5 text-gray-400" aria-hidden="true" />
            </MenuButton>

            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="sticky right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                <div class="py-1">

                  <MenuItem v-for="operator in operators" >
                    <a href="#" @click="addFilterOperator(operator.operator)" :class="[newFilter.operator === operator.operator ? 'bg-gray-100 text-gray-900 outline-none' : 'text-gray-700', 'group flex items-center px-4 py-2 text-sm']">
                     <Icon :name="operator.icon" class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                     {{ operator.friendly }}
                    </a>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
        </Menu>

          <!-- operator -->
           <div class="relative inline-block text-left pl-4">
            <input
                type="text"
                name="search" 
                id="search" 
                v-model="newFilter.value"
                class="rounded-md bg-white pl-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-600 sm:text-sm/6" 
                placeholder="Value" 
              />
           </div>  
          
          </div>
        </div>

        <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button :disabled="!newFilter.operator || !newFilter.value || !newFilter.field" @click="addFilter" type="button" class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto">Add Filter</button>
          <button @click="filterModal = false"  type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</div>


	
</template>

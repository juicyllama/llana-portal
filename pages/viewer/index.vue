<script setup lang="ts">
const tables = ref([])

const result = await $fetch({
  endpoint: '/tables',
  method: 'GET'
})

tables.value = result.tables

const searchText = ref("")

const filteredTables = computed(() =>
  tables.value && tables.value.filter(
        (p) => p.includes(searchText.value)
    ) || []
)

</script>

<template>
	<header>
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold tracking-tight text-gray-900">Viewer</h1>
        </div>
      </header>
      <main>
        <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
         
          <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
              <h1 class="text-base font-semibold text-gray-900">Tables</h1>
              <p class="mt-2 text-sm text-gray-700">A list of all the tables from your datasource.</p>
            </div>
            <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <div class="mt-2 grid grid-cols-1">
              <input
                type="text"
                name="search" 
                id="search" 
                v-model="searchText"
                class="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pl-3 pr-10 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-600 sm:pr-9 sm:text-sm/6" 
                placeholder="Search" 
              />
              <Icon name="ph:magnifying-glass-duotone" class="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-gray-400 sm:size-4" aria-hidden="true" />
            </div>
            </div>
          </div>

    
          <div class="mt-8 gap-4 flex flex-wrap" v-if="tables.length">
             
            <div class="flex-initial w-64" v-for="table in filteredTables" :key="table" >
              <RouterLink :to="`/viewer/${table}`" class="text-yellow-600 hover:text-yellow-900 text-sm">{{ table }}</RouterLink>
            </div>

                   
                   
          </div>
          
        </div>
      </main>
</template>
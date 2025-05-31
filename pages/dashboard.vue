<script setup lang="ts">
const tables = inject('schema') as string[]

const searchText = ref("")

const filteredTables = computed(() =>
  tables && tables.filter(
        (p) => p.includes(searchText.value)
    ) || []
)

</script>

<template>
	<header>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<h1 class="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
		</div>
	</header>
	<main>
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

         
          <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
             <h2 class="text-2xl font-bold tracking-tight text-gray-900">Tables</h2>
              <p class="mt-2 text-gray-700">A list of all the tables from your datasource.</p>
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

    
          	<div class="my-8 gap-4 flex flex-wrap" v-if="tables.length">

				<table class="min-w-full divide-y divide-gray-300">
					<tbody class="bg-white">
						<tr v-for="table in filteredTables" :key="table" class="even:bg-gray-50 cursor-pointer">
							<td class="px-4 py-2 whitespace-nowrap">
								<RouterLink :to="`/tables/${table}`" class="text-yellow-600 hover:text-yellow-900">{{ table }}</RouterLink>
							</td> 	
							<td class="px-4 py-2 whitespace-nowrap text-right flex flex-row justify-end gap-3">
								<RouterLink :to="`/tables/${table}`" class="text-yellow-600 hover:text-yellow-900"><div class='has-tooltip'><span class='tooltip rounded shadow-lg text-sm p-1 bg-yellow-600 text-black -mt-8 -ml-10'>Table Viewer</span><Icon name="ph:magnifying-glass" size="22" /></div></RouterLink>
								<RouterLink :to="`/tables/${table}/caching`" class="text-yellow-600 hover:text-yellow-900"><div class='has-tooltip'><span class='tooltip rounded shadow-lg text-sm p-1 bg-yellow-600 text-black -mt-8 -ml-10'>Data Caching</span><Icon name="ph:floppy-disk" size="22" /></div></RouterLink>
								<RouterLink :to="`/tables/${table}/public`" class="text-yellow-600 hover:text-yellow-900"><div class='has-tooltip'><span class='tooltip rounded shadow-lg text-sm p-1 bg-yellow-600 text-black -mt-8 -ml-10'>Public Access</span><Icon name="ph:lock-open" size="22" /></div></RouterLink>
								<RouterLink :to="`/tables/${table}/roles`" class="text-yellow-600 hover:text-yellow-900"><div class='has-tooltip'><span class='tooltip rounded shadow-lg text-sm p-1 bg-yellow-600 text-black -mt-8 -ml-12'>Role Permissions</span><Icon name="ph:key" size="22" /></div></RouterLink>
								<RouterLink :to="`/tables/${table}/webhooks`" class="text-yellow-600 hover:text-yellow-900"><div class='has-tooltip'><span class='tooltip rounded shadow-lg text-sm p-1 bg-yellow-600 text-black -mt-8 -ml-6'>Webhooks</span><Icon name="ph:webhooks-logo" size="22" /></div></RouterLink>
							</td> 
							
						</tr>
					</tbody>
				</table>

		  
			</div>


			<h2 class="text-2xl font-bold tracking-tight text-gray-900">Useful Resources</h2>
			<ul class="mt-4 ml-2 space-y-2">
				<li class="text-yellow-600 hover:text-yellow-900"><Icon name="ph:file-code" size="22" class="iconFix" /> <a href="https://llana.io/configuration" target="_blank">Llana Documentation</a></li>
				<li class="text-yellow-600 hover:text-yellow-900"><Icon name="ph:cloud" size="22" class="iconFix"  /> <a href="https://cloud.llana.io" target="_blank">Llana Cloud</a></li>
				<li class="text-yellow-600 hover:text-yellow-900"><Icon name="ph:rocket" size="22" class="iconFix"  /> <a href="https://juicyllama.com/" target="_blank">Development Support</a></li>
			</ul>

		</div>
	</main>
</template>
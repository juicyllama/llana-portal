<script setup lang="ts">

const tab = ref('Config')

const tabs = [
  { name: 'Config', current: tab.value === 'Config' },
  { name: 'Authentication', current: tab.value === 'Authentication' },
  { name: 'Roles', current: tab.value === 'Roles' },
  { name: 'Relations', current: tab.value === 'Relations' },
]

function setTab(name: string) {
  tab.value = name
  tabs.forEach(t => {
    t.current = t.name === name
  })
}

</script>

<template>
	<header>
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
        </div>
      </header>
      <main>
        <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

            <div class="grid grid-cols-1 sm:hidden">
              <select
                @change="setTab($event.target.value)"
               aria-label="Select a tab" class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-600">
                <option v-for="tab in tabs" :key="tab.name" :selected="tab.current">{{ tab.name }}</option>
              </select>
              <Icon name="ph:address-book-tabs-duotone" class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500" aria-hidden="true" />
            </div>
            <div class="hidden sm:block">
              <nav class="flex space-x-4 cursor-pointer" aria-label="Tabs">
                <span v-for="t in tabs" :key="t.name" @click="setTab(t.name)" :class="[t.current ? 'bg-yellow-100 text-yellow-800' : 'text-gray-500 hover:text-gray-700', 'rounded-md px-3 py-2 text-sm font-medium ']" :aria-current="t.current ? 'page' : undefined">{{ t.name }}</span>
              </nav>
            </div>



            <div v-if="tab === 'Config'">
              <h2 class="mt-10 text-2xl/9 font-bold tracking-tight text-gray-900">Config</h2>
                <Alert type="error">TODO: <a href="https://github.com/juicyllama/llana-portal/issues/2" target="_blank" class="underline">https://github.com/juicyllama/llana-portal/issues/2</a></Alert>
            </div>


            <div v-if="tab === 'Authentication'">
              <h2 class="mt-10 text-2xl/9 font-bold tracking-tight text-gray-900">Authentication</h2>
              <Alert type="error">TODO: <a href="https://github.com/juicyllama/llana-portal/issues/3" target="_blank" class="underline">https://github.com/juicyllama/llana-portal/issues/3</a></Alert>
           
            </div>


            <div v-if="tab === 'Roles'">
              <h2 class="mt-10 text-2xl/9 font-bold tracking-tight text-gray-900">Roles</h2>
              <Alert type="error">TODO: <a href="https://github.com/juicyllama/llana-portal/issues/4" target="_blank" class="underline">https://github.com/juicyllama/llana-portal/issues/4</a></Alert>
           
            </div>

            <div v-if="tab === 'Relations'">
              <h2 class="mt-10 text-2xl/9 font-bold tracking-tight text-gray-900">Relations</h2>
              <Alert type="error">TODO: <a href="https://github.com/juicyllama/llana-portal/issues/5" target="_blank" class="underline">https://github.com/juicyllama/llana-portal/issues/5</a></Alert>
           
            </div>

        </div>
      </main>
</template>
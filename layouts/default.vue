<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

useHead({
  title: 'Llana Portal :: Dashboard',
})

const authenticated = await $Authenticate()

if(!authenticated) {
  $logout()
}

const router = useRouter()
const path = router.currentRoute.value.path

const navigation = [
  { name: 'Dashboard', href: '/dashboard', current: path === '/dashboard' },
  { name: 'Viewer', href: '/viewer', current: path.includes('/viewer') },
  { name: 'Webhooks', href: '/webhooks', current: path === '/webhooks' },
  { name: 'Settings', href: '/settings', current: path === '/settings' },
]

async function logout(){
  await $logout()
}

</script> 

<template>
     <div class="min-h-full">
    <Disclosure as="nav" class="border-b border-gray-200 bg-white" v-slot="{ open }">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between">
          <div class="flex">
            <div class="flex shrink-0 items-center">
              <a href="https://llana.io" target="_blank"><img class="block h-8 w-auto" src="/images/llana-32x32.png" alt="Dashboard" /></a>
            </div>
            <div class="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <a v-for="item in navigation" :key="item.name" :href="item.href" :class="[item.current ? 'border-yellow-600 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium']" :aria-current="item.current ? 'page' : undefined">{{ item.name }}</a>
            </div>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <button type="button" class="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
              <span class="absolute -inset-1.5" />
              <span class="sr-only">View notifications</span>
              <Icon name="ph:bell-ringing-duotone" class="block size-6 shake bell" aria-hidden="true" />
            </button>

          <span class="text-xs cursor-pointer pl-4" @click="logout">Logout</span>
          </div>
          <div class="-mr-2 flex items-center sm:hidden">
            <!-- Mobile menu button -->
            <button type="button" class="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
              <span class="absolute -inset-1.5" />
              <span class="sr-only">View notifications</span>
              <Icon name="ph:bell-ringing-duotone" class="block size-6 shake bell" aria-hidden="true" />
            </button>
            <DisclosureButton class="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
              <span class="absolute -inset-0.5" />
              <span class="sr-only">Open main menu</span>
              <Icon name="ph:dots-three-outline-vertical-duotone" v-if="!open" class="block size-6" aria-hidden="true" />
              <Icon name="ph:x" v-else class="block size-6" aria-hidden="true" />
            </DisclosureButton>
          </div>
        </div>
      </div>

      <DisclosurePanel class="sm:hidden">
        <div class="space-y-1 pb-3 pt-2">
          <DisclosureButton v-for="item in navigation" :key="item.name" as="a" :href="item.href" :class="[item.current ? 'border-yellow-500 bg-yellow-50 text-yellow-700' : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800', 'block border-l-4 py-2 pl-3 pr-4 text-base font-medium']" :aria-current="item.current ? 'page' : undefined">{{ item.name }}</DisclosureButton>
        </div>
        <div class="border-t border-gray-200 pb-3 pt-4">
            <DisclosureButton :key="logout" @click="logout" class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800">Logout</DisclosureButton>
        </div>
      </DisclosurePanel>
    </Disclosure>

        <div class="py-10">
          <slot /> 
        </div>
    </div>
  </template>

<style scoped>
.bell:hover {
  animation: shake 1s infinite;
}
.bell:focus {
  animation: shake 1s infinite;
}
</style>
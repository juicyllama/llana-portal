<script setup lang="ts">
import Toast, { type ToastNotification } from '~/components/Toast.vue'

useHead({
  title: 'Llana Portal :: Login',
}) 

const $router = useRouter()

const authenticated = await $Authenticate()

if(authenticated) {
  $router.push('/dashboard')
}

const toast = ref<ToastNotification>({
	show: false,
})
provide('toast', toast)

</script>

<template>
    <div>
       <Toast v-if="toast.show" :toast="toast" />
      <slot />
    </div>
  </template>
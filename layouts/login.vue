<script setup lang="ts">
useHead({
  title: 'Llana Portal :: Login',
}) 

const $router = useRouter()

const authenticated = await $Authenticate()

if(authenticated) {
  $router.push('/dashboard')
}

</script>

<template>
    <div>
      <slot />
    </div>
  </template>
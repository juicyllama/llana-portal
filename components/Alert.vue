<script setup>
const props = defineProps(['type'])
const cssClassesMap = {
  info: 'my-2 bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-2 text-sm',
  warning: 'my-2 bg-orange-100 border-l-4 border-orange-500 text-orange-700 px-4 py-2 text-sm',
  error: 'my-2 border border-red-700 text-red-700 px-4 py-2 rounded relative text-sm',
}
const cssClass = computed(() => cssClassesMap[props.type])
</script>
<template>
  <div :class="[cssClass, `alert-${props.type}`]" class="alert-component">
	<slot />
  </div>
</template>

<script setup lang="ts">

interface Props {
	width?: string
	height?: string
}

const props = withDefaults(defineProps<Props>(), {
    width: 'w-100',
	height: 'h-4'
})

</script>

<template>
    <div class="animate-pulse flex space-x-4">
        <div class="flex-1 space-y-6 py-1">
            <div :class="`${height} ${width} bg-slate-200 rounded`"></div>
        </div>
  </div>
</template>
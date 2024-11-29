<script setup lang="ts">

interface Props {
	column: Column
}

const props = defineProps<Props>()

let icon = ''

if(props.column.primary_key){
    icon = 'ph:key-duotone'
}else if(props.column.type === 'date'){
    icon = 'ph:calendar-duotone'
}else if(props.column.type === 'number'){
    icon = 'ph:hash-duotone'
}else if(props.column.type === 'boolean'){
    icon = 'ph:check-circle-duotone'
}else{
    icon = 'ph:cursor-text-duotone'
}

</script>

<template>
   <Icon :name="icon" class="h-6 w-6 text-gray-400"/>
</template>
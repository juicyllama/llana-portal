<script setup lang="ts">

interface Props {
	column: Column
}

const props = defineProps<Props>()

let icon = ''

if(props.column.primary_key){
    icon = 'ph:key'
}else if(props.column.type === 'date'){
    icon = 'ph:calendar'
}else if(props.column.type === 'number'){
    icon = 'ph:hash'
}else if(props.column.type === 'boolean'){
    icon = 'ph:check-circle'
}else{
    icon = 'ph:cursor-text'
}

</script>

<template>
   <Icon :name="icon" class="h-6 w-6 text-gray-400"/>
</template>
<script setup lang="ts">
import { type Column } from '~/types/llana';

const model = defineModel()

defineProps<{
	column: Column;
	rows?: number
	error?: string
}>()

</script>

<template>
		<label class="text-gray-500">{{ column.field }}</label>
		<textarea
			:id="column.field"
			:name="column.field"
			v-model="model"
			:rows="rows ?? 3"
			:class="[
                `w-full mb-2 py-4 px-4 bg-gray-100 rounded-lg prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none`,
                error ? 'border-red-500 border-2' : 'border-gray-300'
                ]"
			/>
</template>


<script setup lang="ts">
import { type Column } from '~/types/llana';

const model = defineModel<string>()

defineProps<{
	 column: Column;
     error?: string;
}>()

</script>

<template>
		<label class="text-gray-500">{{ column.field }}</label>
		<input
			:id="column.field"
			v-model="model"
			:name="column.field"
			:type="column.type"
            :class="[
                `w-full mb-2 py-4 px-4 bg-gray-100 rounded-lg prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none`,
                error ? 'border-red-500 border-2' : 'border-gray-300'
                ]"
		/>
</template>

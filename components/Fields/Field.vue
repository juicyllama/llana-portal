<script lang="ts" setup>
import { type Column, ColumnType } from '~/types/llana';
import Input from '~/components/Fields/Input.vue';
import Select from '~/components/Fields/Select.vue'
import Checkbox from '~/components/Fields/Checkbox.vue'
import DateTime from '~/components/Fields/DateTime.vue'

defineProps<{
    column: Column;
    error?: string;
}>();

const model = defineModel()

</script>
<template>

    <Input
        v-if="column.type === ColumnType.string || column.type === ColumnType.number"
        :column="column"
        v-model="model"
        :error="error"
    />

    <Select
        v-else-if="column.type === ColumnType.enum"
        :column="column"
        v-model="model"
        :error="error"
    />

    <Checkbox
        v-else-if="column.type === ColumnType.boolean"
        :column="column"
        v-model="model"
    />

     <DateTime
        v-else-if="column.type === ColumnType.date"
        :column="column"
        v-model="model"
    />

	<div v-if="error" class="text-red-600 text-sm mb-1">
		{{ error }}
	</div>

</template>
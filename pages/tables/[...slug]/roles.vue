<script setup lang="ts">
import Table from '~/components/Table/Table.vue'
import Loading from '~/components/Loading.vue'

const route = useRoute()
const path = route.path.split('/')
const table = path[path.length - 2] // Get the last segment of the path

const loadingSchema = ref(true)
const schema = ref(null)

const llana_table = '_llana_role'

try {
	schema.value =  await $fetch({
		endpoint: `/${llana_table}/schema`,
		method: 'GET'
	})
} catch (error) {
	console.error('Error fetching schema:', error)
	schema.value = null
} finally {
	loadingSchema.value = false
}

</script>

<template>
	<main v-if="loadingSchema">
		<div class="flex justify-center text-center">
			<Loading />
		</div>

	</main>
	<main v-else>
		<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<Table
					:schema="schema"
					:title="`${table} Role Permissions`"
					:skip-columns="['id', 'table']"
					:skip-schema="true"
					:queryProps="{
						table: table
					}"
					:cacheKeyOverride="`${table}::roles`"
				/>
		</div>
	</main>

</template>

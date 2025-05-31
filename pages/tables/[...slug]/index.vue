<script setup lang="ts">
import Table from '~/components/Table/Table.vue'
import Loading from '~/components/Loading.vue'

const route = useRoute()
const table = route.path.split('/').pop()
const loadingSchema = ref(true)
const schema = ref(null)

try {
	schema.value = await $fetch({
		endpoint: `/${table}/schema`,
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


			<Table :schema="schema" />


		</div>
	</main>




</template>

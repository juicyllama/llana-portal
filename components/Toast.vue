<script setup lang="ts">
export interface ToastNotification {
	show: boolean
	timeout?: number //seconds
	title?: string
	message?: string
	type?: 'success' | 'error' | 'warning' | 'info'
}

interface Props {
	toast?: ToastNotification
}

const props = withDefaults(defineProps<Props>(), {
	toast: {
		show: false,
		timeout: undefined,
	},
})

if (props.toast.timeout) {
	setTimeout(() => {
		props.toast.show = false
	}, props.toast.timeout * 1000)
}

watch(
	() => props.toast.timeout,
	timeout => {
		if (timeout) {
			setTimeout(() => {
				props.toast.show = false
			}, timeout * 1000)
		}
	},
)
</script>

<template>
	<div class="toast flex w-full flex-col items-center space-y-4 sm:items-end z-10 top-10 md:top-12">
		<!-- Notification panel, dynamically insert this into the live region when it needs to be displayed -->
		<transition
			enter-active-class="transform ease-out duration-300 transition"
			enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
			enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
			leave-active-class="transition ease-in duration-100"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0">
			<div
				v-if="toast.show"
				class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5">
				<div class="p-4">
					<div class="flex items-start">
						<div class="shrink-0">
							<Icon
								v-if="toast.type === 'success'"
								name="ph:check-circle-duotone"
								class="size-6 text-green-400"
								aria-hidden="true" />
							<Icon
								v-else-if="toast.type === 'error'"
								name="ph:x-circle-duotone"
								class="size-6 text-red-400"
								aria-hidden="true" />
							<Icon
								v-else-if="toast.type === 'warning'"
								name="ph:warning-circle-duotone"
								class="size-6 text-yellow-400"
								aria-hidden="true" />
						</div>
						<div class="ml-3 w-0 flex-1 pt-0.5">
							<p class="text-sm font-medium text-gray-900">{{ toast.title }}</p>
							<span class="mt-1 text-sm text-gray-500" v-html="toast.message"></span>
						</div>
						<div class="ml-4 flex shrink-0">
							<Icon name="ph:x" class="size-4" aria-hidden="true" @click="toast.show = false" />
						</div>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<style scoped>
.toast {
	position: fixed;
	padding: 1rem;
	max-width: -webkit-fill-available;
}
</style>

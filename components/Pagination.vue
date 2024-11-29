<script setup lang="ts">

interface Props {
	list: ListResponse
}

const props = defineProps<Props>()

const emit = defineEmits(['pagination:next', 'pagination:previous', 'pagination:page'])

const pages = computed(() => {
    return Math.ceil(props.list.total / props.list.limit)
})

const currentPage = computed(() => {
    return Math.ceil(props.list.offset / props.list.limit) + 1
})

const pageRange = computed(() => {
    const page = Math.ceil(props.list.offset / props.list.limit) + 1
    const total = Math.ceil(props.list.total / props.list.limit)
    return [page - 2, page - 1, page, page + 1, page + 2].filter(p => p > 0 && p <= total)
})

</script>

<template>
    <nav class="flex items-center justify-between">
        <!-- Previous -->
        <div class="-mt-px flex w-0 flex-1">
            <a v-if="list.offset > 0" @click="emit('pagination:previous')" href="#" class="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                <Icon name="ph:caret-double-left-duotone" class="pr-6"/>
            Previous
            </a>
            <span v-else class="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-300">
                <Icon name="ph:caret-double-left-duotone" class="pr-6"/>
            Previous  
            </span>
        </div>

  <!-- Pages -->

  <div class="hidden md:-mt-px md:flex">

    <span v-if="pageRange[0] > 1" class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">...</span>

    <a 
        @click="emit('pagination:page', page)"
        href="#" v-for="page in pageRange" 
        class="text-gray-500 hover:border-gray-300 hover:text-gray-700"
        :class="[page === currentPage ? 'border-yellow-500 text-yellow-600' : 'text-gray-500 hover:border-gray-300 hover:text-gray-700', 'inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium']"
        >{{ page }}</a>
    

        <span v-if="pageRange[pageRange.length-1] < pages" class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">...</span>



  </div>
 

   <!-- Next -->


  <div class="-mt-px flex w-0 flex-1 justify-end">
    <a v-if="list.total > (list.offset + list.pagination.total)" @click="emit('pagination:next')" href="#" class="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:text-gray-700">
            Next
            <Icon name="ph:caret-double-right-duotone" class="pl-6"/>
            </a>
            <span v-else class="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-300">
               
                Next  
                <Icon name="ph:caret-double-right-duotone" class="pl-6"/>
            </span>
  </div>
</nav>
</template>
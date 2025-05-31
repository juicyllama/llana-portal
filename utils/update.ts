import { $fetch } from "./fetch"

export async function $update(options: {
    table: string
	id: string
	data: any
}): Promise<boolean> {

	try{
		await $fetch({
			endpoint: `/${options.table}/${options.id}`,
			method: 'PUT',
			body: JSON.stringify(options.data)
		})

		return true

	}catch(e){
		console.error('Error creating item:', e)
		return false
	}
}
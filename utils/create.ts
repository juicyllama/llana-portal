import { $fetch } from "./fetch"

export async function $create(options: {
    table: string
	data: any
}): Promise<boolean> {

	try{
		await $fetch({
			endpoint: `/${options.table}/`,
			method: 'POST',
			body: JSON.stringify(options.data)
		})

		return true

	}catch(e){
		console.error('Error creating item:', e)
		return false
	}
}
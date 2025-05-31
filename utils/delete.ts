import { $fetch } from "./fetch"

export async function $delete(options: {
    table: string
	id: string
}): Promise<boolean> {

	try{
		$fetch({
			endpoint: `/${options.table}/${options.id}`,
			method: 'DELETE'
		})

		return true

	}catch(e){
		console.error('Error deleting item:', e)
		return false
	}
}
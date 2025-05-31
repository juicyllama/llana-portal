import { AuthType } from "~/types/auth"

export function getHeaders(){

	const auth_type = <AuthType><unknown>useCookie('auth_type').value
    const auth_value = <string>useCookie('auth_value').value

	switch(auth_type){
		case AuthType.JWT:

			return {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + auth_value
			}
			
		case AuthType.API_KEY:

			return {
				'Content-Type': 'application/json',
				'x-api-Key': auth_value
			}
			

		case AuthType.HOST:
		default:
			return {
				'Content-Type': 'application/json'
			}
	}
}


export async function $fetch(options: {
    endpoint: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	body?: string
}): Promise<boolean> {

	const auth_type = <AuthType><unknown>useCookie('auth_type').value
    const auth_value = <string>useCookie('auth_value').value

	if(!auth_type){
		await $logout()
	}

	if(!auth_value && auth_type !== AuthType.HOST){
		await $logout()
	}

	let fetchOptions = {
		method: options.method,
		headers: getHeaders(),
		body: options.body || undefined
	}

	const runtimeConfig = useRuntimeConfig()

	try{

		console.debug(`[🦙 $fetch][${options.method}] ${runtimeConfig.public.DOMAIN+options.endpoint}`)

		const res = await fetch(runtimeConfig.public.DOMAIN+options.endpoint, fetchOptions)

        if(res.status === 401){
            await $logout()
        }

		if(res.status !== 200 && res.status !== 201 && res.status !== 204){
			return false
		}

        return await res.json()

	}catch(e){
		return false
	}
}
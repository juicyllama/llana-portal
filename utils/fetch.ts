import { AuthType } from "~/types/auth"

export async function $fetch(options: {
    endpoint: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
}): Promise<boolean> {

	const auth_type = <AuthType><unknown>useCookie('auth_type').value
    const auth_value = <string>useCookie('auth_value').value

	if(!auth_type){
		await $logout()
	}

	let fetchOptions = {
		method: options.method,
		headers: {}
	}

	switch(auth_type){
		case AuthType.JWT:

			if(!auth_value){
				await $logout()
			}

			fetchOptions.headers = {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + auth_value
			}
			break
		case AuthType.API_KEY:

			if(!auth_value){
				await $logout()
			}

			fetchOptions.headers = {
				'Content-Type': 'application/json',
				'x-api-Key': auth_value
			}
			break

		case AuthType.HOST:
		default:
			fetchOptions.headers = {
				'Content-Type': 'application/json'
			}
			break
	}

	const runtimeConfig = useRuntimeConfig()

	try{
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
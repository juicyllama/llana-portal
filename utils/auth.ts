import { AuthType, type AuthCredentials } from "~/types/auth"

export async function $login(auth_type = AuthType.HOST, auth?: AuthCredentials): Promise<{
	authenticated: boolean,
	error?: string
}>
{
	useCookie('auth_type', {
		secure: true,
		sameSite: 'strict',
	}).value = auth_type
	
	switch(auth_type){
			case AuthType.HOST:
				if(await $Authenticate()){
					window.location.href = '/dashboard'
					return {
						authenticated: true
					}
				}
				break

			case AuthType.API_KEY:

				if(!auth?.api_key){
					return {
						authenticated: false,
						error: 'Missing API Key'	
					}
				}

				useCookie('auth_value', {
					secure: true,
					sameSite: 'strict',
				}).value = auth?.api_key

				if(await $Authenticate(AuthType.API_KEY, auth?.api_key)){
					window.location.href = '/dashboard'
					return {
						authenticated: true
					}
				}
				break

			case AuthType.JWT:
				const runtimeConfig = useRuntimeConfig()

				if(!auth?.username || !auth?.password){
					return {
						authenticated: false,
						error: 'Missing email or password'
					}
				}

				if(auth.username !== runtimeConfig.public.ADMIN_EMAIL){
					console.log(runtimeConfig.public.ADMIN_EMAIL)
					console.error('runtimeConfig.public', runtimeConfig.public)
					console.error('auth', auth)
					return {
						authenticated: false,
						error: 'Email incorrect, only admin email is allowed'
					}
				}

				try{
					const res = await fetch(runtimeConfig.public.DOMAIN+'/auth/login', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(auth)
					})

					if(res.status !== 200){
						return {
							authenticated: false,
							error: 'Invalid credentials'
						}
					}

					const data = await res.json()
					useCookie('auth_value', {
						secure: true,
						sameSite: 'strict',
					}).value = data?.access_token

					if(await $Authenticate(AuthType.JWT, data.access_token)){
						window.location.href = '/dashboard'
						return {
							authenticated: true
						}
					}

				}catch(e: any){
					return {
						authenticated: false,
						error: e.message
					}
				}
				break
	}
	
	return {
		authenticated: false,
		error: 'Invalid credentials'
	}


}

export async function $logout(){
	useCookie('auth_type').value = null
	useCookie('auth_value').value = null
	window.location.href = '/'
}

export async function $Authenticate(auth_type?: AuthType, auth_value?: string): Promise<boolean> {

	if(!auth_type){
		auth_type = <AuthType><unknown>useCookie('auth_type').value
	}

	if(!auth_type){
		return false
	}

	let fetchOptions = {
		method: 'GET',
		headers: {}
	}

	if(!auth_value){
		auth_value = <string>useCookie('auth_value').value
	}

	switch(auth_type){
		case AuthType.JWT:

			if(!auth_value){
				return false
			}

			fetchOptions.headers = {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + auth_value
			}
			break
		case AuthType.API_KEY:

			if(!auth_value){
				return false
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
		const res = await fetch(runtimeConfig.public.DOMAIN+'/tables', fetchOptions)

		if(res.status !== 200){
			return false
		}
	}catch(e){
		return false
	}

	return true
}
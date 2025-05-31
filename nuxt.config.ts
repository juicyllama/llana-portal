// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	ssr: false,
	modules: [
		'@nuxtjs/tailwindcss', 
		'@nuxt/icon'
	],
	devServer: {
		port: 55262
	},
	runtimeConfig: {
		public: {
			DOMAIN: <string>process.env.DOMAIN,
			ADMIN_EMAIL: <string>process.env.ADMIN_EMAIL,
		}
	},
	css: [
		'~/assets/css/main.css',
		'~/assets/css/animations.css'
	],
	
})
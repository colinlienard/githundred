import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
	alias: {
		heroicons: '@heroicons/vue/24/outline',
	},
	devtools: { enabled: true },
	css: ['~/assets/css/main.css'],
	modules: ['@nuxt/eslint', '@pinia/nuxt'],
	routeRules: {
		'/**': { isr: 60 * 60 * 24 },
		'/api/**': { cors: true },
	},
	runtimeConfig: {
		githubToken: '',
	},
	vite: {
		plugins: [tailwindcss()],
	},
	compatibilityDate: '2025-02-22',
});

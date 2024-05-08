export default defineNuxtConfig({
	alias: {
		heroicons: '@heroicons/vue/24/outline',
	},
	devtools: { enabled: true },
	css: ['~/assets/css/main.css'],
	modules: ['@nuxt/eslint'],
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	routeRules: {
		'/**': { isr: 60 * 60 * 24 },
		'/api/**': { cors: true },
	},
	runtimeConfig: {
		githubToken: '',
	},
});

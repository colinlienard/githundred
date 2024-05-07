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
	runtimeConfig: {
		githubToken: '',
	},
});

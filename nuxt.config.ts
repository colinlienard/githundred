export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: ['@nuxt/eslint'],
	css: ['~/assets/css/main.css'],
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {}
		}
	}
});

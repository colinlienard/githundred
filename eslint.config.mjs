import withNuxt from './.nuxt/eslint.config.mjs';
import eslintConfigPrettier from 'eslint-config-prettier';

export default withNuxt([
	eslintConfigPrettier,
	{
		rules: {
			'no-console': 'warn',
			'vue/multi-word-component-names': 'off'
		}
	}
]);

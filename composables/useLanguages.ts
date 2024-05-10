export const useLanguages = defineStore('languages', () => {
	const value = ref<string[]>([]);
	return { value };
});

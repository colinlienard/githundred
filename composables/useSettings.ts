export const useSettings = defineStore('settings', () => {
	return reactive({
		search: '',
		languages: [] as string[],
		showOwners: false,
		showFullDescription: false,
	});
});

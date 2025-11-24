export const useFlippedCards = defineStore('flippedCards', () => {
	const value = ref<string[]>([]);

	onUnmounted(() => {
		value.value = [];
	});

	return { value };
});

export const usePointer = defineStore('pointer', () => {
	const x = ref(0);
	const y = ref(0);

	function move(event: MouseEvent) {
		x.value = event.clientX;
		y.value = event.clientY;
	}

	return { x, y, move };
});

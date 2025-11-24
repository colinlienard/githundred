export const usePointer = defineStore('pointer', () => {
	const x = ref(0);
	const y = ref(0);
	const type = ref<'mousemove' | 'deviceorientation'>('mousemove');

	let baseX = 0;
	let baseY = 0;

	function mousemove(event: MouseEvent) {
		type.value = 'mousemove';
		x.value = event.clientX;
		y.value = event.clientY;
	}

	function deviceorientation(event: DeviceOrientationEvent) {
		const gamma = event.gamma ?? 0;
		const beta = event.beta ?? 0;
		if (baseX === 0 && baseY === 0) {
			baseX = gamma;
			baseY = beta;
		}
		type.value = 'deviceorientation';
		x.value = (gamma - baseX) / 2;
		y.value = (beta - baseY) / 2;
	}

	return { x, y, type, mousemove, deviceorientation };
});

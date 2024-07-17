import { confetti } from '@tsparticles/confetti';

export function useConfetti() {
	let interval: NodeJS.Timeout;

	onUnmounted(() => {
		clearInterval(interval);
	});

	return () => {
		let count = 0;

		interval = setInterval(() => {
			confetti({
				particleCount: 100,
				spread: 360,
				origin: { x: Math.random(), y: Math.random() * 0.8 },
			});

			count++;
			if (count === 5) {
				clearInterval(interval);
			}
		}, 500);
	};
}

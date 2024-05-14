<script setup lang="ts">
import { confetti } from '@tsparticles/confetti';

let interval: NodeJS.Timeout;

onMounted(() => {
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
});

onUnmounted(() => {
	clearInterval(interval);
});
</script>

<template>
	{{ null }}
</template>

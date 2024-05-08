<script setup lang="ts">
const pixels = ref<Array<{ id: string; x: number; y: number; color: string }>>([]);
let intervalId: ReturnType<typeof setInterval>;

const colors = ['#cbd5e1', '#cbd5e1', '#99f6e4', '#2dd4bf'];

function randomPixel() {
	const id = crypto.randomUUID();
	const x = Math.floor((Math.random() * window.innerWidth) / 8) * 8;
	const y = Math.floor((Math.random() * window.innerHeight) / 8 / 3) * 8;
	const color = colors[Math.floor(Math.random() * colors.length)];
	return { id, x, y, color };
}

onMounted(() => {
	pixels.value = Array.from({ length: 32 }, randomPixel);

	intervalId = setInterval(() => {
		pixels.value.shift();
		pixels.value.push(randomPixel());
	}, 100);
});

onUnmounted(() => {
	pixels.value = [];

	clearInterval(intervalId);
});
</script>

<template>
	<div class="absolute inset-[4px] h-[50vh] overflow-hidden">
		<div class="tiles absolute inset-0 opacity-50" />
		<TransitionGroup name="pixels">
			<div
				v-for="{ id, x, y, color } in pixels"
				:key="id"
				class="absolute h-1 w-1"
				:style="{ top: `${y}px`, left: `${x}px`, backgroundColor: color }"
			/>
		</TransitionGroup>
		<div class="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50" />
	</div>
</template>

<style scoped>
.tiles {
	--bg: #f8fafc;
	--color: #e2e8f0;
	--space: 0.25rem;
	background: repeating-linear-gradient(
			transparent,
			transparent var(--space),
			var(--bg) var(--space),
			var(--bg) calc(var(--space) * 2)
		),
		repeating-linear-gradient(
			90deg,
			var(--color),
			var(--color) var(--space),
			var(--bg) var(--space),
			var(--bg) calc(var(--space) * 2)
		);
}

.pixels-enter-active,
.pixels-leave-active {
	transition: opacity 2s ease-in-out;
}
.pixels-enter-from,
.pixels-leave-to {
	opacity: 0;
}
</style>

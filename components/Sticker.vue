<script setup lang="ts">
const { url } = defineProps<{ url: string }>();
const maskUrl = `url(${url})`;

const easing = 0.05;
const max = 15;

const element = ref<HTMLElement>();

const pointer = usePointer();

const rotateY = computedWithPrev<number>((prev) => {
	if (!element.value) return 0;
	const rect = element.value.getBoundingClientRect();
	const center = rect.left + rect.width / 2;
	const result = -(center - pointer.x);
	const capped = Math.min(Math.max(result, -max), max);
	return prev + (capped - prev) * easing;
});
const rotateX = computedWithPrev<number>((prev) => {
	if (!element.value) return 0;
	const rect = element.value.getBoundingClientRect();
	const center = rect.top + rect.height / 2;
	const result = center - pointer.y;
	const capped = Math.min(Math.max(result, -max), max);
	return prev + (capped - prev) * easing;
});
</script>

<template>
	<div ref="element" class="sticker relative" :style="{ '--x': rotateX, '--y': rotateY }">
		<img class="drop-shadow-lg" :src="url" alt="" />
		<div class="shine absolute inset-0" />
	</div>
</template>

<style scoped>
.sticker {
	transform: perspective(300px) rotateX(calc(var(--x) * 1deg)) rotateY(calc(var(--y) * 1deg));
}

.shine {
	mask-image: v-bind(maskUrl);
	background-image: repeating-linear-gradient(-45deg, black, white 5%, black 10%),
		repeating-linear-gradient(
			0deg,
			hsla(283, 49%, 60%, 0.75) calc(5% * 1),
			hsla(2, 74%, 59%, 0.75) calc(5% * 2),
			hsla(53, 67%, 53%, 0.75) calc(5% * 3),
			hsla(93, 56%, 52%, 0.75) calc(5% * 4),
			hsla(176, 38%, 50%, 0.75) calc(5% * 5),
			hsla(228, 100%, 77%, 0.75) calc(5% * 6),
			hsla(283, 49%, 61%, 0.75) calc(5% * 7)
		);
	background-size: 400%, 100%;
	background-position:
		calc(var(--y) * 1px) calc(var(--x) * 1px),
		calc(var(--x) * 1px) calc(var(--y) * 1px);
	background-blend-mode: color-burn;
	mix-blend-mode: plus-lighter;
	filter: brightness(calc((0.5 * 0.3) + 0.5)) contrast(2.3) saturate(1);
}
</style>

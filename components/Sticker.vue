<script setup lang="ts">
const { url, rotate } = defineProps<{ url: string; rotate?: string }>();

const maskUrl = `url(${url})`;
const element = ref<HTMLElement>();
const center = ref<{ x: number; y: number }>();
const pointer = usePointer();

const y = computedWithPrev<number>((prev) => {
	if (!center.value) return 0;
	return ease(-(center.value.x - pointer.x), prev);
});

const x = computedWithPrev<number>((prev) => {
	if (!center.value) return 0;
	return ease(center.value.y - pointer.y, prev);
});

const fromCenter = computed(() => {
	if (!center.value) return 0;
	const distance = Math.hypot(center.value.x - pointer.x, center.value.y - pointer.y);
	return Math.max(distance / 200, 2) / 4;
});

function ease(result: number, prev: number, max = 15, easing = 0.05) {
	const capped = Math.min(Math.max(result, -max), max);
	return prev + (capped - prev) * easing;
}

onMounted(() => {
	const { width, height, top, left } = element.value!.getBoundingClientRect();
	center.value = { x: left + width / 2, y: top + height / 2 };
});
</script>

<template>
	<div>
		<div
			ref="element"
			class="sticker relative"
			:style="{ '--x': x, '--y': y, '--from-center': fromCenter, '--rotate': rotate }"
		>
			<img class="drop-shadow-lg" :src="url" alt="" />
			<div class="shine absolute inset-0" />
		</div>
	</div>
</template>

<style scoped>
.sticker {
	transform: perspective(300px) rotateX(calc(var(--x) * 1deg)) rotateY(calc(var(--y) * 1deg));

	* {
		transform: rotate(var(--rotate));
	}
}

.shine {
	mask-image: v-bind(maskUrl);
	mask-size: calc(100% - 2px);
	mask-position: 1px;
	mask-repeat: no-repeat;

	background-image: url(/images/noise.png),
		repeating-linear-gradient(-45deg, black, white 5%, black 10%),
		repeating-linear-gradient(purple, red, yellow, green, cyan, purple);
	background-size:
		50% 50%,
		400% 400%,
		400% 400%;
	background-position:
		center center,
		calc(var(--y) * 1% - 100%) calc(var(--x) * 1% - 100%),
		calc(var(--x) * 5%) calc(var(--y) * 5%);

	background-blend-mode: overlay, color-burn;
	mix-blend-mode: plus-lighter;
	filter: brightness(var(--from-center)) contrast(3);
}
</style>

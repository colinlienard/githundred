<script setup lang="ts">
const { url, rotate = undefined } = defineProps<{ url: string; rotate?: string }>();

const maskUrl = `url(${url})`;
const element = ref<HTMLElement>();
const center = ref<{ x: number; y: number }>();
const pointer = usePointer();

const y = computedWithPrev<number>((prev) => {
	if (pointer.type === 'deviceorientation') return cap(pointer.x);
	if (!center.value) return -4;
	return ease(-(center.value.x - pointer.x), prev);
});

const x = computedWithPrev<number>((prev) => {
	if (pointer.type === 'deviceorientation') return cap(pointer.y);
	if (!center.value) return -12;
	return ease(center.value.y - pointer.y, prev);
});

const fromCenter = computed(() => {
	if (!center.value) return 0;
	const distance = Math.hypot(center.value.x - pointer.x, center.value.y - pointer.y);
	return cap(distance / 400, 0.5, 0.8);
});

function ease(result: number, prev: number, easing = 0.05) {
	const capped = cap(result);
	return prev + (capped - prev) * easing;
}

function cap(result: number, min = -15, max = 15) {
	return Math.min(Math.max(result, min), max);
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

	background-image:
		url(/images/noise.png), repeating-linear-gradient(-45deg, black, white 5%, black 10%),
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

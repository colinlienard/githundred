<script setup lang="ts">
export type Card = {
	title: string;
	repo: string;
	value: string;
	unit: string | null;
};

const { card, index } = defineProps<{ card: Card; index: number }>();

const flippedCards = useFlippedCards();
const flipped = computed(() => flippedCards.value.includes(card.title));

const [translateX, translateY, rotate] = (() => {
	switch (index) {
		case 0:
			return ['-1rem', '1rem', '-4deg'];
		case 1:
			return ['0rem', '2rem', '2deg'];
		case 2:
			return ['0rem', '0rem', '-2deg'];
		case 3:
			return ['1rem', '-2rem', '1deg'];
		case 4:
			return ['2rem', '2rem', '4deg'];
		case 5:
		default:
			return ['1rem', '-2rem', '-6deg'];
	}
})();
</script>

<template>
	<li
		class="[perspective:1000px] hover:z-10"
		:style="{ transform: `translateX(${translateX}) translateY(${translateY}) rotate(${rotate})` }"
		@click="!flipped && flippedCards.value.push(card.title)"
	>
		<div
			:class="`card ${flipped && 'flipped'} relative h-96 w-64 cursor-pointer rounded-lg border border-solid border-slate-200 bg-slate-50 text-center shadow-lg transition-all [transform-style:preserve-3d] *:absolute *:flex *:h-full *:w-full *:flex-col *:items-center *:justify-center *:gap-2 *:p-10 *:[backface-visibility:hidden]`"
			@click="!flipped && flippedCards.value.push(card.title)"
		>
			<div>
				<h4 class="text-balance">{{ card.title }}...</h4>
			</div>
			<div class="relative overflow-hidden [transform:rotateY(180deg)]">
				<h4 class="text-balance text-sm text-slate-500">{{ card.title }}</h4>
				<p class="text-lg font-semibold leading-tight">{{ card.repo }}</p>
				<p class="text-sm text-slate-500">with</p>
				<span class="text-lg font-semibold leading-tight">{{ card.value }} {{ card.unit }}</span>
				<div v-if="flipped" class="shine" />
			</div>
		</div>
	</li>
</template>

<style scoped>
.card:hover {
	transform: scale(1.05);
}

.card.flipped {
	transform: rotateY(180deg);
	animation: flip 1s cubic-bezier(0.6, 0, 0.8, 1);
	cursor: default;
}

.card.flipped:hover {
	transform: scale(1.05) rotateY(180deg);
}

.shine {
	position: absolute;
	width: 6rem;
	height: 32rem;
	background-color: white;
	transform: rotate(45deg);
	top: 200%;
	animation: shine 0.75s 0.25s linear;
}

@keyframes flip {
	0% {
		transform: scale(1) rotateY(0deg);
	}
	20% {
		transform: scale(1.2) rotateY(140deg);
	}
	80% {
		transform: scale(1.3) rotateY(170deg);
	}
	95% {
		transform: scale(0.9) rotateY(180deg);
	}
	100% {
		transform: scale(1) rotateY(180deg);
	}
}

@keyframes shine {
	0% {
		top: -110%;
	}
	100% {
		top: 110%;
	}
}
</style>

<script setup lang="ts">
import type { Card } from '~/components/HighlightCard.vue';
import '@tsparticles/confetti';

const { data } = await useFetch('/api/highlights');
const flippedCards = useFlippedCards();
const confetti = useConfetti();

type Entries<T> = {
	[K in keyof T]: [K, T[K]];
}[keyof T][];

const cards = computed<Card[]>(() => {
	if (!data.value) return [];
	return (Object.entries(data.value) as Entries<typeof data.value>).map(
		([key, { name, value }]) => {
			const [title, unit] = getTexts(key);
			return { title, repo: name, value: getFormattedValue(key, value), unit };
		},
	);
});

function getTexts(key: keyof NonNullable<typeof data.value>): [string, string | null] {
	switch (key) {
		case 'mostCommits':
			return ['The one with the most commits is', 'commits'];
		case 'mostContributors':
			return ['The one with the most contributors is', 'contributors'];
		case 'mostForked':
			return ['The most forked is', 'forks'];
		case 'mostRecent':
			return ['The most recent is', null];
		case 'mostUsedLanguage':
			return ['The most used language is', 'occurrences'];
		case 'oldest':
			return ['The oldest is', null];
	}
}

function getFormattedValue(
	key: keyof NonNullable<typeof data.value>,
	value: string | number,
): string {
	switch (key) {
		case 'mostCommits':
		case 'mostContributors':
		case 'mostForked':
		case 'mostUsedLanguage':
			return value.toLocaleString();
		case 'mostRecent':
		case 'oldest': {
			const allMonths = (value as number) / 30 / 24 / 60 / 60 / 1000;
			const years = Math.floor(allMonths / 12);
			const months = Math.floor(allMonths % 12);
			let result = years > 0 ? `${years} year${years > 1 ? 's' : ''}` : '';
			if (months > 0) {
				result += `${result.length > 0 ? ' and ' : ''}${months} month${months > 1 ? 's' : ''}`;
			}
			return result;
		}
	}
}

watch(flippedCards, (newVal) => {
	if (newVal.value.length === 6) {
		confetti();
	}
});
</script>

<template>
	<div class="flex flex-col items-center gap-6">
		<h3 class="text-xl font-semibold">Across all these repositories...</h3>
		<ul class="flex w-fit grid-cols-3 flex-col gap-8 md:grid md:gap-0">
			<highlightCard v-for="(card, index) of cards" :key="card.title" :card="card" :index="index" />
		</ul>
	</div>
</template>

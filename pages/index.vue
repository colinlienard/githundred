<script setup lang="ts">
import { StarIcon } from 'heroicons';

const { data: repositories } = await useFetch('/api/repositories');

const durationFormatter = new Intl.RelativeTimeFormat('en', { style: 'long' });

function formatDuration(age: number) {
	const years = Math.floor(age / 12 / 30 / 24 / 60 / 60 / 1000);
	const formatted = durationFormatter.format(years, 'year');
	return `${formatted.replace('in ', '')} old`;
}
</script>

<template>
	<section class="table">
		<div class="table-header-group">
			<div class="table-row text-slate-400 *:table-cell *:px-4 *:py-6">
				<div>Rank</div>
				<div>Name</div>
				<div>Stars</div>
				<div>Description</div>
				<div>Language</div>
				<div>Age</div>
			</div>
		</div>
		<div class="table-row-group">
			<NuxtLink
				v-for="(repo, index) in repositories"
				:key="repo.name"
				:to="repo.url"
				target="_blank"
				class="after:content-[' '] relative table-row *:table-cell *:px-4 *:py-6 *:align-top after:absolute after:inset-0 after:h-[1px] after:bg-slate-300"
			>
				<div>
					<div
						class="flex h-8 w-8 -translate-y-1 items-center justify-center rounded-full border border-solid border-slate-300"
					>
						{{ index + 1 }}
					</div>
				</div>
				<div>
					<div class="flex items-center gap-2 text-nowrap">
						<img :src="repo.image" :alt="`GitHub ${repo.ownerName} avatar`" class="h-6 rounded" />
						<h3 class="font-semibold">{{ repo.name }}</h3>
					</div>
				</div>
				<div>
					<div class="flex items-center gap-1">
						<StarIcon class="h-4" />
						<span>{{ repo.starsNumber.toLocaleString() }}</span>
					</div>
				</div>
				<div class="text-slate-400">{{ repo.description }}</div>
				<div>
					<div v-if="repo.language" class="flex items-center gap-1">
						<div class="h-2 w-2 rounded-full" :style="{ backgroundColor: repo.language.color }" />
						{{ repo.language?.name }}
					</div>
				</div>
				<div class="text-nowrap">{{ formatDuration(repo.age) }}</div>
			</NuxtLink>
		</div>
	</section>
</template>

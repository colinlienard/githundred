<script setup lang="ts">
import { StarIcon } from 'heroicons';

const { data: repositories } = await useFetch('/api/repositories');

const hoverEffect = ref({ height: 0, top: 0, opacity: 0 });

function formatDuration(age: number) {
	const years = Math.floor(age / 12 / 30 / 24 / 60 / 60 / 1000);
	return `${years} years old`;
}

function onHoverEffectMouseEnter(event: MouseEvent) {
	const target = event.target as HTMLElement;
	const { height } = target.getBoundingClientRect();
	hoverEffect.value = { top: target.offsetTop, height, opacity: 1 };
}
</script>

<template>
	<section class="table">
		<div
			class="after:content-[' '] sticky top-0 z-10 table-header-group bg-slate-50 after:absolute after:inset-x-0 after:-bottom-[1px] after:h-[1px] after:bg-slate-300"
		>
			<div class="table-row text-slate-400 *:table-cell *:px-4 *:py-6">
				<div>Rank</div>
				<div>Name</div>
				<div>Stars</div>
				<div>Description</div>
				<div>Language</div>
				<div>Age</div>
			</div>
		</div>
		<div class="relative table-row-group" @mouseleave="hoverEffect.opacity = 0">
			<div
				class="absolute h-10 w-full bg-white transition-all"
				:style="{
					height: `${hoverEffect.height}px`,
					top: `${hoverEffect.top}px`,
					opacity: hoverEffect.opacity,
				}"
			/>
			<NuxtLink
				v-for="(repo, index) in repositories"
				:key="repo.name"
				:to="repo.url"
				target="_blank"
				class="after:content-[' '] relative table-row *:table-cell *:px-4 *:py-6 *:align-top after:absolute after:inset-0 after:h-[1px] after:bg-slate-300"
				@mouseenter="onHoverEffectMouseEnter"
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

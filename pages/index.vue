<script setup lang="ts">
import { StarIcon } from 'heroicons';

const { data } = await useFetch('/api/repositories');

const settings = useSettings();

const repositories = computed(() => {
	if (!settings.search) return data.value;
	return data.value?.filter((repo) =>
		repo.name.toLowerCase().includes(settings.search.toLowerCase()),
	);
});
const hoverEffect = ref({ height: 0, top: 0, opacity: 0 });

function formatDuration(age: number) {
	const years = Math.floor(age / 12 / 30 / 24 / 60 / 60 / 1000);
	return `${years} y.o.`;
}

function onHoverEffectMouseEnter(event: MouseEvent) {
	const target = event.target as HTMLElement;
	const { height } = target.getBoundingClientRect();
	hoverEffect.value = { top: target.offsetTop, height, opacity: 1 };
}
</script>

<template>
	<section class="table w-[64rem] table-fixed">
		<div
			class="after:content-[' '] sticky top-0 z-10 table-header-group bg-slate-50 after:absolute after:inset-x-0 after:-bottom-[1px] after:h-[1px] after:bg-slate-300"
		>
			<div class="table-row text-slate-400 *:table-cell *:px-4 *:py-6">
				<div class="w-[8%]">Rank</div>
				<div class="w-[30%]">Name</div>
				<div class="w-[12%]">Stars</div>
				<div class="w-[30%]">Description</div>
				<div class="w-[12%]">Language</div>
				<div class="w-[8%]">Age</div>
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
				class="after:content-[' '] relative table-row cursor-alias *:table-cell *:px-4 *:py-6 *:align-top after:absolute after:inset-0 after:h-[1px] after:bg-slate-300"
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
					<div class="flex items-center gap-2">
						<img :src="repo.image" :alt="`GitHub ${repo.ownerName} avatar`" class="h-6 rounded" />
						<h3>
							<span v-if="settings.showOwners" class="text-slate-500">{{ repo.ownerName }}/</span>
							{{ repo.name }}
						</h3>
					</div>
				</div>
				<div>
					<div class="flex items-center gap-1">
						<StarIcon class="h-4" />
						<span>{{ repo.starsNumber.toLocaleString() }}</span>
					</div>
				</div>
				<div class="text-slate-500">
					<p v-if="settings.showFullDescription">{{ repo.description }}</p>
					<p v-else class="overflow-hidden text-ellipsis whitespace-nowrap">
						{{ repo.description }}
					</p>
				</div>
				<div>
					<div v-if="repo.language" class="flex items-center gap-1">
						<div class="h-2 w-2 rounded-full" :style="{ backgroundColor: repo.language.color }" />
						{{ repo.language?.name }}
					</div>
				</div>
				<div>{{ formatDuration(repo.age) }}</div>
			</NuxtLink>
		</div>
	</section>
</template>

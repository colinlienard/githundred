<script setup lang="ts">
import { ArrowUpIcon, StarIcon, CheckIcon, MagnifyingGlassIcon, XMarkIcon } from 'heroicons';

const { data } = await useFetch('/api/repositories');

const settings = reactive({
	search: '',
	languages: [] as string[],
	showOwners: false,
	showFullDescription: false,
});
const languages = ref<string[]>([]);
const topOfTableRef = ref<HTMLElement>();
const hasScrolled = ref(false);

function calculateMatchScore(repoName: string, searchTerm: string) {
	let score = 0;
	let index = 0;
	for (const char of searchTerm.toLowerCase()) {
		index = repoName.toLowerCase().indexOf(char, index);
		if (index === -1) break;
		score++;
		index++;
	}
	return score;
}

const repositories = computed(() => {
	if (!settings.search && !settings.languages.length) return data.value;

	const searchTerm = settings.search.toLowerCase();

	return data.value
		?.filter((repo) => {
			const isLanguage = settings.languages.length
				? settings.languages.includes(repo.language?.name ?? '')
				: true;
			const isSearch = calculateMatchScore(repo.name, searchTerm) >= searchTerm.length;
			return isLanguage && isSearch;
		})
		.sort((a, b) => {
			const scoreA = calculateMatchScore(a.name, searchTerm);
			const scoreB = calculateMatchScore(b.name, searchTerm);

			return scoreB - scoreA;
		});
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

function onClickScrollUp() {
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

watchEffect(() => {
	if (!data.value) return;
	languages.value = data.value
		.reduce<string[]>((previous, { language }) => {
			if (language && !previous.includes(language.name)) {
				previous.push(language.name);
			}
			return previous;
		}, [])
		.sort();
});

let observer: IntersectionObserver | undefined;

watchEffect(() => {
	if (!topOfTableRef.value) return;
	if (!observer) {
		observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				hasScrolled.value = !entry.isIntersecting;
			});
		});
	}
	observer?.observe(topOfTableRef.value);
});

onUnmounted(() => {
	observer?.disconnect();
});
</script>

<template>
	<section class="flex w-full flex-col *:max-md:px-6">
		<div
			class="grid w-full grid-cols-[1fr_1fr] gap-2 py-8 [grid-template-areas:'a_a''b_b''c_d'] md:flex"
		>
			<Input v-model="settings.search" placeholder="Search by name" class="w-full [grid-area:a]">
				<MagnifyingGlassIcon />
			</Input>
			<Select
				v-model="settings.languages"
				:options="languages"
				placeholder="Languages"
				class="w-full [grid-area:b]"
			/>
			<Button class="[grid-area:c]" @click="settings.showOwners = !settings.showOwners">
				<CheckIcon v-if="settings.showOwners" />
				<XMarkIcon v-else />
				Show owners
			</Button>
			<Button
				class="[grid-area:d]"
				@click="settings.showFullDescription = !settings.showFullDescription"
			>
				<CheckIcon v-if="settings.showFullDescription" />
				<XMarkIcon v-else />
				Show full description
			</Button>
		</div>

		<div class="max-md:overflow-auto">
			<div class="table w-[64rem] table-fixed">
				<div
					:class="`sticky top-0 z-10 table-header-group border-solid after:absolute after:inset-0 after:border-b after:border-slate-300 after:transition-shadow after:content-[''] ${hasScrolled && 'after:shadow-[0_1rem_1rem_-1.5rem_#94a3b8]'}`"
				>
					<div class="relative table-row bg-slate-50 text-slate-500 *:table-cell *:px-4 *:py-6">
						<div class="w-[8%]">Rank</div>
						<div class="w-[30%]">Name</div>
						<div class="w-[12%]">Stars</div>
						<div class="w-[30%]">Description</div>
						<div class="w-[12%]">Language</div>
						<div class="w-[8%]">Age</div>
					</div>
				</div>
				<div
					v-if="repositories?.length"
					class="relative table-row-group"
					@mouseleave="hoverEffect.opacity = 0"
				>
					<div ref="topOfTableRef" class="w-[1200%]" />
					<div
						class="absolute h-10 w-full bg-white transition-all"
						:style="{
							height: `${hoverEffect.height}px`,
							top: `${hoverEffect.top}px`,
							opacity: hoverEffect.opacity,
						}"
					/>
					<NuxtLink
						v-for="repo in repositories"
						:key="repo.name"
						:to="repo.url"
						target="_blank"
						class="relative table-row cursor-alias *:table-cell *:px-4 *:py-6 *:align-top after:absolute after:inset-0 after:h-[1px] after:content-[''] [&:not(:first-of-type):after]:bg-slate-300"
						@mouseenter="onHoverEffectMouseEnter"
					>
						<div>
							<div
								class="relative w-8 text-center after:absolute after:inset-1/2 after:h-8 after:w-8 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:border after:border-solid after:border-slate-300 after:content-['']"
							>
								{{ repo.rank }}
							</div>
						</div>
						<div>
							<div class="flex items-center gap-2">
								<img
									:src="repo.image"
									:alt="`GitHub ${repo.ownerName} avatar`"
									class="h-6 rounded"
								/>
								<h3>
									<span v-if="settings.showOwners" class="text-slate-500">
										{{ repo.ownerName }}/
									</span>
									<span>{{ repo.name }}</span>
								</h3>
							</div>
						</div>
						<div>
							<div class="flex items-center gap-1">
								<StarIcon class="h-4" />
								<span>{{ repo.stargazerCount.toLocaleString() }}</span>
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
								<div
									class="h-2 w-2 rounded-full"
									:style="{ backgroundColor: repo.language.color }"
								/>
								{{ repo.language?.name }}
							</div>
							<span v-else>-</span>
						</div>
						<div>{{ formatDuration(repo.age) }}</div>
					</NuxtLink>
				</div>
				<div v-else class="text-nowrap px-4 pt-8 text-slate-500">No results for this search.</div>
				<Teleport to="body">
					<Transition>
						<button
							v-if="hasScrolled"
							class="fixed bottom-4 right-4 z-50 rounded-full bg-slate-50 p-4"
							@click="onClickScrollUp"
						>
							<ArrowUpIcon class="h-4" />
						</button>
					</Transition>
				</Teleport>
			</div>
		</div>
	</section>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
	transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>

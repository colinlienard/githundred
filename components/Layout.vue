<script setup lang="ts">
import { ArrowPathIcon, CheckIcon, MagnifyingGlassIcon, XMarkIcon } from 'heroicons';

const buildTime = useState(() => Date.now());
const duration = Date.now() - buildTime.value;
const hours = Math.floor(duration / 60 / 60 / 1000);
const lastUpdated = hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : 'less than an hour';

const pointer = usePointer();
const settings = useSettings();
const languages = useLanguages();

onMounted(() => {
	window.addEventListener('mousemove', pointer.move);
});

onUnmounted(() => {
	window.removeEventListener('mousemove', pointer.move);
});
</script>

<template>
	<div class="flex min-h-screen justify-center bg-slate-50">
		<PixelsBackground />
		<div class="z-0 flex w-full max-w-5xl flex-col items-center gap-24 pt-8">
			<header class="flex w-full items-center justify-between">
				<h1 class="font-serif text-lg font-semibold">githundred</h1>
				<NuxtLink
					to="https://github.com/colinlienard/githundred"
					target="_blank"
					class="flex items-center gap-1 transition-colors hover:text-slate-500"
					tabindex="-1"
				>
					<GitHubIcon class="h-5" />
					GitHub
				</NuxtLink>
			</header>
			<main class="flex w-full flex-col items-center">
				<div class="relative flex w-full flex-col items-center gap-6">
					<h2 class="max-w-2xl text-center font-serif text-6xl font-semibold">
						Top
						<span class="text-transparent">100</span>
						most
						<span class="italic">starred</span>
						GitHub repositories
					</h2>
					<Sticker url="/svgs/100-sticker.svg" class="!absolute -top-6 -translate-x-[6.75rem]" />
					<Sticker
						url="/svgs/star-sticker.svg"
						rotate="90deg"
						class="!absolute top-1 translate-x-[19.5rem]"
					/>
					<Sticker
						url="/svgs/github-sticker.svg"
						rotate="-15deg"
						class="!absolute -bottom-1 -translate-x-[17rem]"
					/>
					<div class="flex items-center gap-2 text-slate-400">
						<ArrowPathIcon class="h-4" />
						<p class="text-sm">Last updated {{ lastUpdated }} ago</p>
					</div>
				</div>
				<div class="mt-16 flex w-full gap-2 py-8">
					<Input v-model="settings.search" placeholder="Search by name" class="w-full">
						<MagnifyingGlassIcon />
					</Input>
					<Select
						v-model="settings.languages"
						:options="languages.value"
						placeholder="Languages"
						class="w-full"
					/>
					<Button @click="settings.showOwners = !settings.showOwners">
						<CheckIcon v-if="settings.showOwners" />
						<XMarkIcon v-else />
						Show owners
					</Button>
					<Button @click="settings.showFullDescription = !settings.showFullDescription">
						<CheckIcon v-if="settings.showFullDescription" />
						<XMarkIcon v-else />
						Show full description
					</Button>
				</div>
				<slot />
			</main>
		</div>
	</div>
</template>

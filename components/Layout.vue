<script setup lang="ts">
import { ArrowPathIcon } from 'heroicons';

const buildTime = useState(() => Date.now());
const duration = Date.now() - buildTime.value;
const hours = Math.floor(duration / 60 / 60 / 1000);
const lastUpdated = hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : 'less than an hour';

const pointer = usePointer();

onMounted(() => {
	window.addEventListener('mousemove', pointer.mousemove);
	window.addEventListener('deviceorientation', pointer.deviceorientation);
});

onUnmounted(() => {
	window.removeEventListener('mousemove', pointer.mousemove);
	window.removeEventListener('deviceorientation', pointer.deviceorientation);
});
</script>

<template>
	<div class="flex min-h-screen justify-center">
		<PixelsBackground />
		<div
			class="z-0 flex w-full max-w-5xl flex-col items-center gap-16 px-0 py-8 max-md:overflow-hidden md:gap-24"
		>
			<header class="flex w-full items-center justify-between max-md:px-6">
				<h1 class="font-serif font-semibold md:text-lg">
					<NuxtLink to="/" tabindex="-1"><strong>githundred</strong></NuxtLink>
				</h1>
				<GitHubLink />
			</header>
			<main class="flex w-full flex-col items-center gap-12 *:max-md:px-6 md:gap-16">
				<div class="relative flex w-full flex-col items-center gap-6">
					<h2
						class="max-w-96 text-center font-serif text-5xl font-semibold md:max-w-2xl md:text-6xl"
					>
						<strong>
							Top
							<span class="text-transparent">100</span>
							most
							<span class="italic">starred</span>
							GitHub repositories
						</strong>
					</h2>
					<Sticker
						url="/svgs/100-sticker.svg"
						class="!absolute -top-8 -translate-x-3 max-md:scale-[70%] md:-translate-x-[6.75rem]"
					/>
					<Sticker
						url="/svgs/star-sticker.svg"
						rotate="90deg"
						class="!absolute bottom-6 -translate-x-52 max-md:scale-[70%] md:top-1 md:translate-x-[19.5rem]"
					/>
					<Sticker
						url="/svgs/github-sticker.svg"
						rotate="-15deg"
						class="!absolute bottom-4 translate-x-44 max-md:scale-75 md:-bottom-1 md:-translate-x-[17rem]"
					/>
					<div class="flex items-center gap-2 text-slate-500">
						<ArrowPathIcon class="h-4" />
						<p class="text-sm">Last updated {{ lastUpdated }} ago</p>
					</div>
				</div>
				<Navigation />
				<div class="w-full max-md:overflow-auto">
					<slot />
				</div>
			</main>
			<footer class="mt-auto">
				<span class="text-slate-500">Made by{{ ' ' }}</span>
				<NuxtLink to="https://colin-lienard.fr" target="_blank">Colin Lienard</NuxtLink>
			</footer>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ArrowPathIcon } from 'heroicons';

const config = useRuntimeConfig();
const duration = new Date().getTime() - new Date(config.public.timestamp).getTime();
const hours = Math.floor(duration / 60 / 60 / 1000);
const lastUpdated = hours > 0 ? `${hours} hours` : 'less than an hour';
</script>

<template>
	<div class="flex min-h-screen justify-center bg-slate-50 font-sans font-medium text-slate-800">
		<div class="tiles absolute inset-[4px] h-[50vh] opacity-50" />
		<div class="z-0 flex w-full max-w-5xl flex-col items-center gap-24 pt-8">
			<header class="flex w-full items-center justify-between">
				<h1 class="font-serif text-lg font-semibold">githundred</h1>
				<NuxtLink
					to="https://github.com/colinlienard/githundred"
					target="_blank"
					class="flex items-center gap-1 transition-colors hover:text-slate-500"
				>
					<GitHubIcon class="h-5" />
					GitHub
				</NuxtLink>
			</header>
			<main class="flex w-full flex-col items-center gap-16">
				<div class="flex w-full flex-col items-center gap-6">
					<h2 class="max-w-2xl text-center font-serif text-6xl font-semibold">
						Top 100 most
						<span class="italic">starred</span>
						GitHub repositories
					</h2>
					<div class="flex items-center gap-2 text-slate-400">
						<ArrowPathIcon class="h-4" />
						<p class="text-sm">Last updated {{ lastUpdated }} ago</p>
					</div>
				</div>
				<slot />
			</main>
		</div>
	</div>
</template>

<style scoped>
.tiles {
	--bg: #f8fafc;
	--color: #e2e8f0;
	--space: 4px;
	background: linear-gradient(transparent, var(--bg)),
		repeating-linear-gradient(
			transparent,
			transparent var(--space),
			var(--bg) var(--space),
			var(--bg) calc(var(--space) * 2)
		),
		repeating-linear-gradient(
			90deg,
			var(--color),
			var(--color) var(--space),
			var(--bg) var(--space),
			var(--bg) calc(var(--space) * 2)
		);
}
</style>

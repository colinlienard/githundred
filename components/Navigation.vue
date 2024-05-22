<script setup lang="ts">
import { LightBulbIcon, ListBulletIcon } from 'heroicons';

const route = useRoute();
const isHome = computed(() => route.path === '/');
</script>

<template>
	<nav
		class="relative flex rounded-full border-8 border-solid border-slate-100 bg-slate-200 *:z-10 *:flex *:w-32 *:items-center *:justify-center *:gap-1 *:p-2 *:text-center *:transition-all"
	>
		<NuxtLink to="/" :style="{ color: isHome ? 'white' : '' }">
			<ListBulletIcon class="h-4" />
			List
		</NuxtLink>
		<NuxtLink to="/highlights" :style="{ color: isHome ? '' : 'white' }">
			<LightBulbIcon class="h-4" />
			Highlights
		</NuxtLink>
		<div
			class="absolute !z-0 h-full w-32 rounded-full bg-slate-800 transition-all"
			:style="{ left: isHome ? '0' : '50%' }"
		/>
	</nav>
</template>

<template>
	<div class="wrapper relative">
		<NuxtLink
			to="https://github.com/colinlienard/githundred"
			target="_blank"
			class="after: relative z-10 flex items-center gap-1"
			tabindex="-1"
		>
			<GitHubIcon class="h-5" />
			GitHub
		</NuxtLink>
		<div
			class="absolute -inset-x-3 -inset-y-2 z-0 rounded-full bg-[url(/images/github-background.png)]"
		/>
	</div>
</template>

<style scoped>
.wrapper div {
	scale: 0.8;
	opacity: 0;
}

.wrapper:hover {
	color: white;
}

.wrapper:hover div {
	scale: 1;
	opacity: 1;
	transition: 0.2s scale cubic-bezier(0, 0.6, 0.6, 2);
}
</style>

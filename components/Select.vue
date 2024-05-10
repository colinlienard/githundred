<script setup lang="ts">
import { ChevronDownIcon } from 'heroicons';

const { placeholder } = defineProps<{ placeholder: string }>();
</script>

<template>
	<div class="box input justify-between">
		<p class="text-slate-400">{{ placeholder }}</p>
		<ChevronDownIcon />
	</div>
</template>

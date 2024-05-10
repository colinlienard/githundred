<script setup lang="ts">
const model = defineModel<string>();
const { placeholder } = defineProps<{ placeholder: string }>();
</script>

<template>
	<label class="box input cursor-text hover:border-slate-400">
		<slot />
		<input
			v-model="model"
			class="bg-transparent outline-none placeholder:text-slate-400"
			type="text"
			:placeholder="placeholder"
		/>
	</label>
</template>

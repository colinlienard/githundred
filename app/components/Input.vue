<script setup lang="ts">
const model = defineModel<string>();
const { placeholder } = defineProps<{ placeholder: string }>();
const emit = defineEmits(['keydown']);

const inputRef = ref<HTMLInputElement>();
defineExpose({ focus: () => inputRef.value?.focus() });
</script>

<template>
	<label class="box input cursor-text hover:border-slate-400">
		<slot />
		<input
			ref="inputRef"
			v-model="model"
			class="bg-transparent outline-hidden placeholder:text-slate-400"
			type="text"
			:placeholder="placeholder"
			@keydown="emit('keydown', $event)"
		/>
	</label>
</template>

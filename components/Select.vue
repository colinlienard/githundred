<script setup lang="ts">
import { CheckIcon, ChevronDownIcon } from 'heroicons';

const model = defineModel<string[]>();
const { options, placeholder } = defineProps<{ options: string[]; placeholder: string }>();

const element = ref<HTMLElement>();
const isOpen = ref(false);
const position = ref({ x: 0, y: 0, width: 0 });
const search = ref('');
const searchInputRef = ref<HTMLInputElement>();

watch(isOpen, () => {
	if (!isOpen.value) return;
	const { offsetTop, offsetLeft: x, offsetWidth: width, offsetHeight } = element.value!;
	const y = offsetTop + offsetHeight + 8;
	position.value = { x, y, width };
	search.value = '';
});

watchEffect(() => {
	searchInputRef.value?.focus();
});

const filteredOptions = computed(() => {
	if (!search.value) return options;
	return options.filter((option) => option.toLowerCase().includes(search.value.toLowerCase()));
});

function onClickOutside(event: MouseEvent) {
	if (!isOpen.value) return;
	if (!(event.target as HTMLElement).closest('[data-select]')) {
		isOpen.value = false;
	}
}

function onKeydown(event: KeyboardEvent) {
	switch (event.key) {
		case 'Escape':
			isOpen.value = false;
			break;
		case 'Enter': {
			if (document.activeElement === element.value) {
				isOpen.value = !isOpen.value;
			}
			break;
		}
		case 'ArrowUp':
		case 'ArrowDown': {
			if (!isOpen.value) break;
			event.preventDefault();
			if (document.activeElement?.getAttribute('data-select-option')) {
				const element =
					event.key === 'ArrowDown'
						? document.activeElement.nextElementSibling
						: document.activeElement.previousElementSibling;
				(element as HTMLElement)?.focus();
			} else {
				(document.querySelector('[data-select-option]') as HTMLElement | undefined)?.focus();
			}
			break;
		}
	}
}

function onClickItem(option: string) {
	const index = model.value?.findIndex((item) => item === option) ?? -1;
	if (index === -1) {
		model.value?.push(option);
	} else {
		model.value?.splice(index, 1);
	}
}

function onSearchKeydown(event: KeyboardEvent) {
	if (event.key === 'Enter' && filteredOptions.value.length === 1) {
		onClickItem(filteredOptions.value[0]);
	}
}

onMounted(() => {
	window.addEventListener('click', onClickOutside);
	window.addEventListener('keydown', onKeydown);
});

onUnmounted(() => {
	window.removeEventListener('click', onClickOutside);
	window.removeEventListener('keydown', onKeydown);
});
</script>

<template>
	<div
		ref="element"
		class="box input z-1 relative cursor-pointer justify-between overflow-hidden hover:border-slate-400"
		tabindex="0"
		data-select
		@click="isOpen = !isOpen"
	>
		<span v-if="model?.length" class="overflow-hidden text-ellipsis whitespace-nowrap">
			{{ model?.join(', ') }}
		</span>
		<span v-else class="text-slate-400">{{ placeholder }}</span>
		<ChevronDownIcon
			class="flex-shrink-0 transition-all"
			:style="{ transform: isOpen ? 'rotate(-180deg)' : 'rotate(0)' }"
		/>

		<Teleport to="body">
			<Transition>
				<div
					v-if="isOpen"
					data-select
					class="absolute left-0 right-0 top-full z-50 flex max-h-56 flex-col overflow-auto rounded-lg border border-solid border-slate-300 bg-slate-50 shadow-sm"
					:style="{ top: `${position.y}px`, left: `${position.x}px`, width: `${position.width}px` }"
				>
					<Input
						ref="searchInputRef"
						v-model="search"
						placeholder="Search a language"
						class="m-2"
						@keydown="onSearchKeydown"
					/>
					<button
						v-for="option in filteredOptions"
						:key="option"
						class="box group border-none !-outline-offset-4"
						:data-select-option="option"
						@click="onClickItem(option)"
					>
						<CheckIcon
							class="group-hover:!opacity-25 group-focus:!opacity-25"
							:style="{ opacity: model?.includes(option) ? '1 !important' : 0 }"
						/>
						{{ option }}
					</button>
					<span v-if="filteredOptions.length === 0" class="px-3 py-2 text-slate-500">
						No results.
					</span>
				</div>
			</Transition>
		</Teleport>
	</div>
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

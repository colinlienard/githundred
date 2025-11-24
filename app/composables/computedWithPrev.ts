export function computedWithPrev<T>(cb: (cb: T) => T) {
	let previous: T;
	return computed(() => (previous = cb(previous)));
}

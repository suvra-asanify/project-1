import { computed } from 'vue';

export function useForwardSlots(slots, exclude = []) {
  return computed(() => Object.keys(slots).filter((name) => !exclude.includes(name)));
}

<script setup lang="ts">
import { computed } from 'vue';

type TagVariant = 'default' | 'blue' | 'gold' | 'green' | 'red';

type Props = {
  variant?: TagVariant;
};

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
});

const variantClasses = computed(() => {
  const map: Record<TagVariant, string> = {
    default: 'bg-text-primary/10 text-text-primary/70 border-text-primary/15',
    blue: 'bg-accent-blue/15 text-accent-blue border-accent-blue/25',
    gold: 'bg-accent-gold/15 text-accent-gold border-accent-gold/25',
    green: 'bg-accent-green/15 text-accent-green border-accent-green/25',
    red: 'bg-accent-red/15 text-accent-red border-accent-red/25',
  };
  return map[props.variant];
});
</script>

<template>
  <span
    :class="[
      'inline-flex items-center px-3 py-1 rounded-full',
      'font-display text-xs font-semibold uppercase tracking-wider',
      'border',
      variantClasses,
    ]"
  >
    <slot />
  </span>
</template>

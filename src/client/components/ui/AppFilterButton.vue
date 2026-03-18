<script setup lang="ts">
type Props = {
  active?: boolean;
};

withDefaults(defineProps<Props>(), {
  active: false,
});
</script>

<template>
  <button
    type="button"
    :class="[
      'px-4 py-1.5 rounded-full font-display text-xs font-semibold uppercase tracking-wider cursor-pointer',
      'border transition-colors duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
      active
        ? 'bg-accent-green/15 text-accent-green border-accent-green/40'
        : 'bg-transparent text-text-primary/50 border-white/10 hover:text-text-primary hover:border-white/20',
    ]"
    :aria-pressed="active"
  >
    <slot />
  </button>
</template>

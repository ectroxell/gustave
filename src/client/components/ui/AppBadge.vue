<script setup lang="ts">
import { computed } from 'vue';

type BadgeVariant = 'pending' | 'partial' | 'received' | 'info' | 'warning' | 'danger';

type Props = {
  variant?: BadgeVariant;
};

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
});

const variantClasses = computed(() => {
  const map: Record<BadgeVariant, string> = {
    pending: 'bg-accent-blue/15 text-accent-blue border-accent-blue/25',
    info: 'bg-accent-blue/15 text-accent-blue border-accent-blue/25',
    partial: 'bg-accent-gold/15 text-accent-gold border-accent-gold/25',
    warning: 'bg-accent-gold/15 text-accent-gold border-accent-gold/25',
    received: 'bg-accent-green/15 text-accent-green border-accent-green/25',
    danger: 'bg-accent-red/15 text-accent-red border-accent-red/25',
  };
  return map[props.variant];
});

const dotClasses = computed(() => {
  const map: Record<BadgeVariant, string> = {
    pending: 'bg-accent-blue',
    info: 'bg-accent-blue',
    partial: 'bg-accent-gold',
    warning: 'bg-accent-gold',
    received: 'bg-accent-green',
    danger: 'bg-accent-red',
  };
  return map[props.variant];
});

const shouldPulse = computed(() => {
  return ['pending', 'partial', 'info', 'warning'].includes(props.variant);
});
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full',
      'font-display text-xs font-semibold uppercase tracking-wider',
      'border',
      variantClasses,
    ]"
  >
    <span
      :class="['w-1.5 h-1.5 rounded-full', dotClasses, { 'dot-pulse': shouldPulse }]"
    />
    <slot />
  </span>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .dot-pulse {
    animation: dot-pulse 2s ease-in-out infinite;
  }
}

@keyframes dot-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
</style>

<script setup lang="ts">
import { computed } from 'vue';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type Props = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
});

const variantClasses = computed(() => {
  const map: Record<ButtonVariant, string> = {
    primary: 'bg-accent-green text-bg-primary hover:bg-accent-green/85 active:bg-accent-green/70 focus-visible:ring-accent-green',
    secondary: 'bg-bg-elevated text-text-primary border border-border hover:bg-bg-elevated/80 active:bg-bg-elevated/60 focus-visible:ring-accent-blue',
    danger: 'bg-accent-red text-white hover:bg-accent-red/85 active:bg-accent-red/70 focus-visible:ring-accent-red',
    ghost: 'bg-transparent text-text-primary/60 hover:text-text-primary active:text-text-primary/80 focus-visible:ring-accent-green',
  };
  return map[props.variant];
});

const sizeClasses = computed(() => {
  const map: Record<ButtonSize, string> = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-5 text-sm',
    lg: 'h-14 px-6 text-base',
  };
  return map[props.size];
});
</script>

<template>
  <button
    :class="[
      'inline-flex items-center justify-center rounded-lg font-display font-bold uppercase tracking-widest cursor-pointer',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
      'transition-all duration-200',
      'disabled:opacity-50 disabled:pointer-events-none',
      variantClasses,
      sizeClasses,
    ]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

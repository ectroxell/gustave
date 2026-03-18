<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>

<template>
  <div
    class="rounded-lg border border-border bg-bg-surface overflow-hidden"
    style="box-shadow: inset 0 1px 0 rgba(224,217,176,0.05), 0 0 12px rgba(93,187,99,0.04), 0 1px 3px rgba(0,0,0,0.3)"
  >
    <div
      v-if="title || $slots.header"
      class="px-5 py-4 border-b border-border"
    >
      <slot name="header">
        <h3 class="font-display text-lg font-bold text-text-heading">
          {{ title }}
        </h3>
      </slot>
    </div>

    <div class="px-5 py-4">
      <slot />
    </div>

    <div
      v-if="$slots.footer"
      class="px-5 py-3 border-t border-border bg-bg-surface/50"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

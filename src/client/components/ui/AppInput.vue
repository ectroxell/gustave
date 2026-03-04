<script setup lang="ts">
import { computed, useId } from 'vue';

type Props = {
  label: string;
  modelValue?: string;
  type?: string;
  placeholder?: string;
  error?: string;
};

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  error: '',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const inputId = useId();

const errorId = computed(() => props.error ? `${inputId}-error` : undefined);
</script>

<template>
  <div>
    <label
      :for="inputId"
      class="block font-display text-xs font-semibold uppercase tracking-wider text-text-primary/60 mb-2"
    >
      {{ label }}
    </label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :aria-invalid="error ? true : undefined"
      :aria-describedby="errorId"
      :class="[
        'w-full h-12 px-4 rounded-lg border',
        'bg-bg-elevated text-text-primary font-data text-base tracking-wide',
        'placeholder:text-text-primary/30',
        'focus:outline-none focus:ring-1 transition-colors duration-200',
        error
          ? 'border-accent-red focus:border-accent-red focus:ring-accent-red'
          : 'border-border focus:border-accent-green focus:ring-accent-green',
      ]"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
    <p
      v-if="error"
      :id="errorId"
      class="mt-1.5 text-sm text-accent-red font-display"
    >
      {{ error }}
    </p>
  </div>
</template>

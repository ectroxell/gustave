<script setup lang="ts">
import { computed, useId, useSlots } from 'vue';

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

const slots = useSlots();
const hasIcon = computed(() => !!slots.icon);

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
    <div class="relative">
      <div
        v-if="hasIcon"
        class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-primary/40"
      >
        <slot name="icon" />
      </div>
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="errorId"
        :class="[
          'w-full h-12 rounded-lg border',
          hasIcon ? 'pl-10 pr-4' : 'px-4',
          'bg-bg-elevated text-text-primary font-data text-base tracking-wide',
          'placeholder:text-text-primary/30',
          'focus:outline-none focus:ring-1 transition-colors duration-200',
          error
            ? 'border-accent-red focus:border-accent-red focus:ring-accent-red'
            : 'border-border focus:border-accent-green focus:ring-accent-green',
        ]"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      >
    </div>
    <p
      v-if="error"
      :id="errorId"
      class="mt-1.5 text-sm text-accent-red font-display"
    >
      {{ error }}
    </p>
  </div>
</template>

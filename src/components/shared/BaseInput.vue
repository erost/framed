<!--
  BaseInput Component
  Reusable number input component with label, unit display, and validation
-->
<template>
  <div
    class="flex flex-col gap-1"
    :data-testid="testId"
  >
    <label
      v-if="label"
      :for="inputId"
      class="text-sm font-medium text-gray-300"
    >
      {{ label }}
      <span
        v-if="required"
        class="text-red-500"
        aria-label="required"
      >*</span>
    </label>

    <div class="relative">
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :min="min"
        :max="max"
        :step="step"
        :disabled="disabled"
        :required="required"
        :placeholder="placeholder"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${inputId}-error` : undefined"
        class="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-800
               text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500
               disabled:opacity-50 disabled:cursor-not-allowed"
        :class="[
          { 'border-red-400': error },
          { 'pr-10': unit }
        ]"
        data-testid="number-input"
        @input="handleInput"
        @blur="handleBlur"
      >

      <span
        v-if="unit"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400"
        aria-hidden="true"
      >
        {{ unit }}
      </span>
    </div>

    <span
      v-if="error"
      :id="`${inputId}-error`"
      class="text-sm text-red-400"
      role="alert"
      data-testid="input-error"
    >
      {{ error }}
    </span>

    <span
      v-if="hint && !error"
      class="text-sm text-gray-400"
      data-testid="input-hint"
    >
      {{ hint }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

/**
 * BaseInput component
 * Reusable number input with label, validation, unit display, and min/max constraints
 */

const props = defineProps({
  /**
   * v-model value
   */
  modelValue: {
    type: [Number, String],
    default: 0,
  },

  /**
   * Input type
   */
  type: {
    type: String,
    default: 'number',
    validator: (value) => ['number', 'text'].includes(value),
  },

  /**
   * Label text
   */
  label: {
    type: String,
    default: '',
  },

  /**
   * Placeholder text
   */
  placeholder: {
    type: String,
    default: '',
  },

  /**
   * Unit to display (e.g., 'px', '%', 'em')
   */
  unit: {
    type: String,
    default: '',
  },

  /**
   * Minimum value
   */
  min: {
    type: Number,
    default: undefined,
  },

  /**
   * Maximum value
   */
  max: {
    type: Number,
    default: undefined,
  },

  /**
   * Step value
   */
  step: {
    type: Number,
    default: 1,
  },

  /**
   * Disabled state
   */
  disabled: {
    type: Boolean,
    default: false,
  },

  /**
   * Required field
   */
  required: {
    type: Boolean,
    default: false,
  },

  /**
   * Error message
   */
  error: {
    type: String,
    default: '',
  },

  /**
   * Hint message
   */
  hint: {
    type: String,
    default: '',
  },

  /**
   * Test ID for testing
   */
  testId: {
    type: String,
    default: 'base-input',
  },
});

const emit = defineEmits(['update:modelValue', 'blur']);

/**
 * Generate unique ID for the input
 */
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`);

/**
 * Handle input event
 */
const handleInput = (event) => {
  let value = event.target.value;

  if (props.type === 'number') {
    value = value === '' ? 0 : Number(value);
  }

  emit('update:modelValue', value);
};

/**
 * Handle blur event
 */
const handleBlur = (event) => {
  emit('blur', event);
};
</script>

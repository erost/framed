<!--
  QualityInput Component
  Desidered output quality
-->
<template>
  <div
    class="flex flex-col gap-1"
    :data-testid="testId"
  >
    <label
      for="quality"
      class="text-sm font-medium text-gray-300"
    >
      Quality
    </label>
    <div class="relative py-1">
      <input
        id="quality"
        v-model="quality"
        type="range"
        name="quality"
        min="1"
        max="100"
        class="range-input-with-value"
        data-testid="quality-range-input"
        @input="handleQualityChange"
      >
      <div
        class="range-value-label"
        :style="{ left: `calc(${(quality - 1) / 99 * 100}% - 16px)` }"
        data-testid="quality-value-label"
      >
        {{ quality }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCanvasRenderer } from '@/composables/useCanvasRenderer';

defineProps({
  /**
   * Test ID for testing
   */
  testId: {
    type: String,
    default: 'quality-input',
  },
});

const { quality, updateQuality} = useCanvasRenderer();

const handleQualityChange = (event) => {
  const value = event.target.value;
  updateQuality(value);
};

</script>

<style scoped>
@import "tailwindcss" reference;

.range-input {
  @apply w-full appearance-none cursor-pointer bg-transparent;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
  @apply transition-colors;
}

/* Range input thumb (slider handle) */
.range-input::-webkit-slider-thumb {
  @apply appearance-none w-4 h-4 rounded-full;
  @apply bg-blue-600 dark:bg-blue-500;
  @apply hover:bg-blue-700 dark:hover:bg-blue-600;
  @apply cursor-pointer;
  @apply transition-colors;
  margin-top: -4px; /* Centers 16px thumb on 8px track: (16-8)/2 = 4px */
}

.range-input::-moz-range-thumb {
  @apply w-4 h-4 rounded-full border-0;
  @apply bg-blue-600 dark:bg-blue-500;
  @apply hover:bg-blue-700 dark:hover:bg-blue-600;
  @apply cursor-pointer;
  @apply transition-colors;
}

/* Range input track */
.range-input::-webkit-slider-runnable-track {
  @apply w-full h-2 rounded-lg;
  @apply bg-gray-200 dark:bg-gray-600;
}

.range-input::-moz-range-track {
  @apply w-full h-2 rounded-lg;
  @apply bg-gray-200 dark:bg-gray-600;
}

/* Disabled state */
.range-input:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.range-input:disabled::-webkit-slider-thumb {
  @apply cursor-not-allowed;
}

.range-input:disabled::-moz-range-thumb {
  @apply cursor-not-allowed;
}

/* Range input with value label in thumb */
.range-input-with-value {
  @apply w-full appearance-none cursor-pointer bg-transparent;
  @apply focus:outline-none;
  height: 32px; /* Increased height to accommodate squared thumb */
}

.range-input-with-value::-webkit-slider-thumb {
  @apply appearance-none rounded cursor-pointer opacity-0;
  width: 32px;
  height: 32px;
}

.range-input-with-value::-moz-range-thumb {
  @apply rounded border-0 cursor-pointer opacity-0;
  width: 32px;
  height: 32px;
}

.range-input-with-value::-webkit-slider-runnable-track {
  @apply w-full h-2 rounded-lg;
  @apply bg-gray-200 dark:bg-gray-600;
}

.range-input-with-value::-moz-range-track {
  @apply w-full h-2 rounded-lg;
  @apply bg-gray-200 dark:bg-gray-600;
}

/* Value label that appears as thumb */
.range-value-label {
  @apply absolute pointer-events-none;
  @apply flex items-center justify-center;
  @apply bg-blue-600 dark:bg-blue-500 text-white;
  @apply rounded font-medium text-xs;
  @apply transition-colors;
  width: 32px;
  height: 32px;
  top: 4px; /* Account for py-1 (4px) padding on parent container */
}

.range-input-with-value:hover + .range-value-label {
  @apply bg-blue-700 dark:bg-blue-600;
}

.range-input-with-value:focus + .range-value-label {
  @apply ring-2 ring-blue-500 ring-offset-2;
}

.range-input-with-value:disabled + .range-value-label {
  @apply opacity-50 cursor-not-allowed;
}
</style>
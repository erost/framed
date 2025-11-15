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
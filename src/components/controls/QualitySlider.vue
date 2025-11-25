<!--
  QualitySlider Component
  Desired output quality
-->
<template>
  <div class="relative">
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
</template>

<script setup>
import { useCanvasRenderer } from '@/composables/useCanvasRenderer';

defineProps({
  /**
   * Test ID for testing
   */
  testId: {
    type: String,
    default: 'quality-slider',
  },
});

const { quality, updateQuality} = useCanvasRenderer();

/**
 * Handle quality change event
 * @param {Event} event - Input event from range slider
 */
const handleQualityChange = (event) => {
  const value = Number(event.target.value);
  updateQuality(value);
};

</script>

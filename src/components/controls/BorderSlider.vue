<!--
  BorderSlider Component
  Range slider for border spacing as percentage of frame size
-->
<template>
  <div class="relative">
    <input
      id="border"
      v-model.number="borderPercentage"
      type="range"
      name="border"
      :min="FRAME_CONSTRAINTS.minBorderPercentage"
      :max="FRAME_CONSTRAINTS.maxBorderPercentage"
      step="1"
      class="range-input-with-value"
      :data-testid="`${testId}-input`"
      @input="handleInput"
    >
    <div
      class="range-value-label"
      :style="{
        left: `calc(${
          (borderPercentage - FRAME_CONSTRAINTS.minBorderPercentage)
          / (FRAME_CONSTRAINTS.maxBorderPercentage - FRAME_CONSTRAINTS.minBorderPercentage)
          * 100
        }% - 16px)`
      }"
      :data-testid="`${testId}-value-label`"
    >
      {{ borderPercentage }}
    </div>
  </div>
</template>

<script setup>
import { useFrameConfig } from '@/composables/useFrameConfig';
import { FRAME_CONSTRAINTS } from '@/utils/constants';

/**
 * BorderSlider component
 * Allows users to adjust border spacing as a percentage of frame size (1-25%)
 * Border percentage applies to both sides of the frame
 */

defineProps({
  /**
   * Test ID for testing
   */
  testId: {
    type: String,
    default: 'border-slider',
  },
});

const { borderPercentage, updateBorderPercentage } = useFrameConfig();

/**
 * Handle input event to update border percentage
 */
const handleInput = (event) => {
  updateBorderPercentage(Number(event.target.value));
};
</script>

<!--
  FrameSizeSelector Component
  Button group selector for frame size with preset options
-->
<template>
  <div :data-testid="testId">
    <div
      class="selector-group"
      role="group"
      aria-label="Frame size"
    >
      <button
        v-for="option in frameSizeOptions"
        :key="option.value"
        type="button"
        :class="[
          'selector-btn',
          {
            'selector-btn-active': isActive(option),
            'selector-btn-inactive': !isActive(option)
          }
        ]"
        :aria-pressed="isActive(option)"
        :data-testid="`frame-size-${option.value}`"
        @click="handleSelect(option)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useFrameConfig } from '@/composables/useFrameConfig';
import { FRAME_SIZE_OPTIONS } from '@/utils/constants';

/**
 * FrameSizeSelector component
 * Allows users to select the frame size from predefined options using a button group
 */

defineProps({
  /**
   * Test ID for testing
   */
  testId: {
    type: String,
    default: 'frame-size-selector',
  },
});

const { frameSize, updateFrameSize } = useFrameConfig();

/**
 * Frame size options imported from constants
 */
const frameSizeOptions = FRAME_SIZE_OPTIONS;

/**
 * Check if an option is currently active
 */
const isActive = (option) => {
  return frameSize.value === option.value;
};

/**
 * Handle frame size selection
 * Updates the frame configuration with the selected size
 */
const handleSelect = (option) => {
  updateFrameSize(option.value);
};
</script>

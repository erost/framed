<!--
  AspectRatioSelector Component
  Button group selector for frame aspect ratio
-->
<template>
  <div :data-testid="testId">
    <div
      class="selector-group"
      role="group"
      aria-label="Frame aspect ratio"
    >
      <button
        v-for="ratio in aspectRatioOptions"
        :key="ratio"
        type="button"
        :class="[
          'selector-btn',
          {
            'selector-btn-active': aspectRatio === ratio,
            'selector-btn-inactive': aspectRatio !== ratio
          }
        ]"
        :aria-pressed="aspectRatio === ratio"
        :data-testid="`aspect-ratio-${ratio.replace(':', '-')}`"
        @click="handleSelect(ratio)"
      >
        {{ ratio }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useFrameConfig } from '@/composables/useFrameConfig';
import { ASPECT_RATIOS } from '@/utils/constants';

/**
 * AspectRatioSelector component
 * Allows users to select the frame aspect ratio from predefined options using a button group
 */

defineProps({
  /**
   * Test ID for testing
   */
  testId: {
    type: String,
    default: 'aspect-ratio-selector',
  },
});

const { aspectRatio, updateAspectRatio } = useFrameConfig();

/**
 * Get aspect ratio options from constants
 * Returns array of ratio strings (e.g., ['3:2', '4:3', '5:4', '16:9'])
 */
const aspectRatioOptions = computed(() => {
  return Object.keys(ASPECT_RATIOS);
});

/**
 * Handle aspect ratio selection
 * Updates the frame configuration with the selected ratio
 */
const handleSelect = (ratio) => {
  updateAspectRatio(ratio);
};
</script>

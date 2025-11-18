<!--
  AspectRatioSelector Component
  Button group selector for frame aspect ratio
-->
<template>
  <div :data-testid="testId">
    <div
      class="flex w-full rounded-lg border border-gray-600
             p-1 bg-gray-800"
      role="group"
      aria-label="Frame aspect ratio"
    >
      <button
        v-for="ratio in aspectRatioOptions"
        :key="ratio"
        type="button"
        :class="[
          'ratio-btn',
          {
            'btn-active': aspectRatio === ratio,
            'btn-inactive': aspectRatio !== ratio
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

<style scoped>
@import "tailwindcss" reference;

/**
 * Base button styles for aspect ratio selector buttons
 * Contains all common styling applied to all ratio buttons
 */
.ratio-btn {
  @apply flex flex-1 items-center justify-center px-3 py-2 text-sm font-medium rounded-md;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap;
  @apply transition-colors;
}

/**
 * Active button state
 * Applied to the currently selected aspect ratio
 */
.btn-active {
  @apply bg-gray-700 text-blue-400 shadow-sm;
}

/**
 * Inactive button state
 * Applied to non-selected aspect ratios
 */
.btn-inactive {
  @apply text-gray-300 hover:text-gray-100 hover:bg-gray-700 cursor-pointer;
}
</style>

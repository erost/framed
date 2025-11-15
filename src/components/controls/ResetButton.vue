<!--
  ResetButton Component
  Button to reset all configuration to default values
-->
<template>
  <button
    class="
      inline-flex items-center justify-center font-medium rounded-lg transition-colors
      focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-700 text-gray-100
      hover:bg-gray-600 focus:ring-gray-500 px-4 py-2 text-base
    "
    :data-testid="testId"
    @click="handleReset"
  >
    <svg
      class="w-5 h-5 mr-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 
           0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
    Reset
  </button>
</template>

<script setup>
import { useFrameConfig } from '@/composables/useFrameConfig';
import { useImageState } from '@/composables/useImageState';

/**
 * ResetButton component
 * Resets all configuration and clears images
 */

defineProps({
  /**
   * Test ID for testing
   */
  testId: {
    type: String,
    default: 'reset-button',
  },
});

const { reset: resetFrameConfig } = useFrameConfig();
const { clearImages } = useImageState();

/**
 * Handle reset action
 */
const handleReset = () => {
  resetFrameConfig();
  clearImages();
};
</script>

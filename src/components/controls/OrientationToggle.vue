<!--
  OrientationToggle Component
  Toggle between portrait and landscape frame orientations
-->
<template>
  <div
    :data-testid="testId"
  >
    <div
      class="flex w-full rounded-lg border border-gray-600
             p-1 bg-gray-800"
      role="group"
      aria-label="Frame orientation"
    >
      <button
        type="button"
        :class="[
          'orientation-btn',
          {
            'btn-active': orientation === 'portrait',
            'btn-inactive': orientation !== 'portrait'
          }
        ]"
        :aria-pressed="orientation === 'portrait'"
        data-testid="orientation-portrait"
        @click="handleSelect('portrait')"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <rect
            x="7"
            y="4"
            width="10"
            height="16"
            rx="1"
            stroke-width="2"
          />
        </svg>
        <span class="ml-2">Portrait</span>
      </button>

      <button
        type="button"
        :class="[
          'orientation-btn',
          {
            'btn-active': orientation === 'landscape',
            'btn-inactive': orientation !== 'landscape'
          }
        ]"
        :aria-pressed="orientation === 'landscape'"
        data-testid="orientation-landscape"
        @click="handleSelect('landscape')"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <rect
            x="4"
            y="7"
            width="16"
            height="10"
            rx="1"
            stroke-width="2"
          />
        </svg>
        <span class="ml-2">Landscape</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useFrameConfig } from '@/composables/useFrameConfig';

/**
 * OrientationToggle component
 * Allows users to toggle between portrait and landscape frame orientations
 */

defineProps({
  /**
   * Test ID for testing
   */
  testId: {
    type: String,
    default: 'orientation-toggle',
  },
});

const { orientation, updateOrientation } = useFrameConfig();

/**
 * Handle orientation selection
 */
const handleSelect = (value) => {
  updateOrientation(value);
};
</script>

<style scoped>
@import "tailwindcss" reference;

/**
 * Base button styles for orientation toggle buttons
 * Contains all common styling applied to both buttons
 */
.orientation-btn {
  @apply flex flex-1 items-center justify-center px-4 py-2 text-sm font-medium rounded-md;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
  @apply transition-colors;
}

/**
 * Active button state
 * Applied to the currently selected orientation
 */
.btn-active {
  @apply bg-gray-700 text-blue-400 shadow-sm;
}

/**
 * Inactive button state
 * Applied to the non-selected orientation
 */
.btn-inactive {
  @apply text-gray-300 hover:text-gray-100 hover:bg-gray-700 cursor-pointer;
}
</style>

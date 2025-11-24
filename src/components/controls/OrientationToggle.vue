<!--
  OrientationToggle Component
  Toggle between portrait and landscape frame orientations
-->
<template>
  <div
    class="selector-group"
    role="group"
    aria-label="Frame orientation"
    :data-testid="testId"
  >
    <button
      type="button"
      :class="[
        'selector-btn',
        {
          'selector-btn-active': orientation === ORIENTATIONS.PORTRAIT,
          'selector-btn-inactive': orientation !== ORIENTATIONS.PORTRAIT
        }
      ]"
      :aria-pressed="orientation === ORIENTATIONS.PORTRAIT"
      data-testid="orientation-portrait"
      @click="handleSelect(ORIENTATIONS.PORTRAIT)"
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
        'selector-btn',
        {
          'selector-btn-active': orientation === ORIENTATIONS.LANDSCAPE,
          'selector-btn-inactive': orientation !== ORIENTATIONS.LANDSCAPE
        }
      ]"
      :aria-pressed="orientation === ORIENTATIONS.LANDSCAPE"
      data-testid="orientation-landscape"
      @click="handleSelect(ORIENTATIONS.LANDSCAPE)"
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
</template>

<script setup>
import { useFrameConfig } from '@/composables/useFrameConfig';
import { ORIENTATIONS } from '@/utils/constants';

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

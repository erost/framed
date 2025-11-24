<!--
  FormatSelector Component
  Button group selector for image export format (PNG, JPEG, WebP)
-->
<template>
  <div :data-testid="testId">
    <div
      class="selector-group"
      role="group"
      aria-label="Export format"
    >
      <button
        v-for="fmt in IMAGE_FORMATS"
        :key="fmt.mimeType"
        type="button"
        :class="[
          'selector-btn',
          {
            'selector-btn-active': format === fmt.mimeType,
            'selector-btn-inactive': format !== fmt.mimeType
          }
        ]"
        :aria-pressed="format === fmt.mimeType"
        :data-testid="`format-${fmt.extension}`"
        @click="handleSelect(fmt.mimeType)"
      >
        {{ fmt.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useCanvasRenderer } from '@/composables/useCanvasRenderer';
import { IMAGE_FORMATS } from '@/utils/constants';

/**
 * FormatSelector component
 * Allows users to select the export format from predefined options using a button group
 */

defineProps({
  /**
   * Test ID for testing
   */
  testId: {
    type: String,
    default: 'format-selector',
  },
});

const { format, updateFormat } = useCanvasRenderer();

/**
 * Handle format selection
 * Updates the canvas renderer with the selected format
 */
const handleSelect = (mimeType) => {
  updateFormat(mimeType);
};
</script>

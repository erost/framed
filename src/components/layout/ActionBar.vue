<!--
  ActionBar Component
  Action buttons for reset and download
  Desktop: Vertical stack at bottom of sidebar
  Mobile: Horizontal row at bottom
-->
<template>
  <div
    class="bg-gray-800 md:bg-transparent md:border-0 border-t border-gray-700
           md:rounded-none md:shadow-none md:px-0 md:py-0 px-4 py-3"
    data-testid="action-bar"
  >
    <!-- Desktop: Vertical stack | Mobile: Horizontal row -->
    <div
      class="flex flex-1 md:flex-col gap-2 md:gap-2"
      data-testid="buttons-action-bar"
    >
      <div class="flex-1">
        <ResetButton />
      </div>
      <div class="flex-1">
        <DownloadButton
          :stage="stage"
          :preview-width="previewWidth"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import ResetButton from '@/components/controls/ResetButton.vue';
import DownloadButton from '@/components/controls/DownloadButton.vue';

/**
 * ActionBar component
 * Contains action buttons for reset and download
 *
 * Layout:
 * - Desktop (≥768px): Vertical stack at bottom of sidebar
 *   - Reset and Download buttons stacked, full-width
 * - Mobile (<768px): Horizontal row at bottom
 *   - Reset and Download buttons shown side-by-side, equal width
 */

defineProps({
  /**
   * Konva stage reference for download functionality
   */
  stage: {
    type: Object,
    default: null,
  },

  /**
   * Preview width for responsive canvas sizing
   */
  previewWidth: {
    type: Number,
    required: true,
  },
});

</script>

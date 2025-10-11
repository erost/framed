<!--
  ActionBar Component
  Action buttons (Download and Reset) placed below the canvas
-->
<template>
  <div
    class="w-full max-w-[1024px] mx-auto flex flex-col-reverse sm:flex-row 
           sm:justify-end gap-3 px-6"
    data-testid="action-bar"
  >
    <ResetButton />
    <DownloadButton
      :stage="stage"
      :preview-width="previewWidth"
    />
  </div>
</template>

<script setup>
import ResetButton from '@/components/controls/ResetButton.vue';
import DownloadButton from '@/components/controls/DownloadButton.vue';

/**
 * ActionBar component
 * Contains action buttons (Download and Reset)
 * - Desktop: Buttons aligned right, side by side
 * - Mobile: Stacked vertically (Download on top), full width
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

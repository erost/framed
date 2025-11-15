<!--
  ActionBar Component
  Action buttons (Download and Reset) placed below the canvas
-->
<template>
  <div
    class="w-full max-w-[1024px] mx-auto bg-white dark:bg-gray-800 border
           border-gray-200 dark:border-gray-700 rounded-lg shadow-sm px-6 py-4"
    data-testid="action-bar"
  >
    <div class="flex flex-col gap-6">
      <!-- Row 1: Quality and file output controls -->
      <div
        class="flex flex-col lg:flex-row gap-6 lg:items-start"
        data-testid="output-action-bar"
      >
        <div class="flex-1">
          <QualityInput />
        </div>
        <!-- Filename and Format stay together on mobile and desktop -->
        <div class="flex flex-1 gap-2 items-end">
          <div class="flex-1">
            <FileNameInput />
          </div>
          <div class="w-24">
            <FormatSelector />
          </div>
        </div>
      </div>

      <!-- Row 2: Buttons -->
      <div
        class="flex flex-col lg:flex-row gap-4 lg:justify-end lg:items-start"
        data-testid="buttons-action-bar"
      >
        <ResetButton />
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
import FileNameInput from '@/components/controls/FilenameInput.vue';
import QualityInput from '@/components/controls/QualityInput.vue';
import FormatSelector from '@/components/controls/FormatSelector.vue';

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

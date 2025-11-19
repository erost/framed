<!--
  ActionBar Component
  Action buttons and output settings
  Desktop: Vertical stack at bottom of sidebar
  Mobile: Second row at bottom
-->
<template>
  <div
    class="bg-gray-800 md:bg-transparent md:border-0 border-t border-gray-700
           md:rounded-none md:shadow-none md:px-0 md:py-0 px-4 py-3"
    data-testid="action-bar"
  >
    <!-- Desktop: Vertical stack | Mobile: Horizontal row -->
    <div class="flex md:flex-col gap-3 md:gap-3">
      <!-- Output settings (hidden on mobile, shown on desktop) -->
      <div class="hidden md:flex md:flex-col md:gap-3">
        <div class="flex gap-2">
          <div class="flex-1">
            <FileNameInput />
          </div>
          <div class="w-14">
            <FormatSelector />
          </div>
        </div>
        <QualityInput />
      </div>

      <!-- Action Buttons (always visible) -->
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
  </div>
</template>

<script setup>
import ResetButton from '@/components/controls/ResetButton.vue';
import DownloadButton from '@/components/controls/DownloadButton.vue';
import FileNameInput from '@/components/controls/FileNameInput.vue';
import QualityInput from '@/components/controls/QualityInput.vue';
import FormatSelector from '@/components/controls/FormatSelector.vue';

/**
 * ActionBar component
 * Contains action buttons and output settings
 *
 * Layout:
 * - Desktop (≥768px): Vertical stack in scrollable section at bottom of sidebar
 *   - Output settings (filename, format, quality) shown
 *   - Reset and Download buttons stacked, full-width
 * - Mobile (<768px): Second row at bottom
 *   - Output settings hidden (to save space)
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

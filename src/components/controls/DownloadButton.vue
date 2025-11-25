<!--
  DownloadButton Component
  Button to download the final framed image
-->
<template>
  <button
    class="
      w-full inline-flex items-center justify-center font-medium rounded-lg transition-colors
      focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-500 text-white hover:bg-blue-600
      focus:ring-blue-500 px-4 py-2 text-base
    "
    :class="{'opacity-50 cursor-not-allowed': disabled || loading}"
    :disabled="disabled || loading"
    :aria-busy="loading"
    :data-testid="testId"
    @click="handleDownload"
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
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
    Download
  </button>
</template>

<script setup>
import { ref, computed, toRef } from 'vue';
import { useCanvasRenderer } from '@/composables/useCanvasRenderer';
import { logError } from '@/utils/logger';

/**
 * DownloadButton component
 * Downloads the rendered canvas as an image file
 * Disabled when images are not uploaded
 *
 * Button takes full width of container:
 * - Desktop: Full width of sidebar
 * - Mobile: Equal share with Reset button
 */

const props = defineProps({
  /**
   * Konva stage reference for export
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

  /**
   * Test ID for testing
   */
  testId: {
    type: String,
    default: 'download-button',
  },
});

const { canExport, downloadImage } = useCanvasRenderer({
  previewWidth: toRef(() => props.previewWidth),
});

const loading = ref(false);

/**
 * Check if download button should be disabled
 * Disabled when images are not uploaded or during download
 */
const disabled = computed(() => {
  return !canExport.value;
});

/**
 * Handle download action
 */
const handleDownload = () => {
  if (!props.stage) {
    return;
  }

  loading.value = true;

  try {
    downloadImage(
      props.stage
    );
  } catch (error) {
    logError('Download failed:', error);
  } finally {
    loading.value = false;
  }
};
</script>

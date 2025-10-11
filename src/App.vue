<!--
  Root Application Component
  Picture Frame Creator - Main application layout
-->
<template>
  <div
    class="min-h-screen transition-colors"
    :class="themeClass"
  >
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <main
      ref="mainContentRef"
      class="container mx-auto px-4 py-8 max-w-7xl"
    >
      <!-- Configuration Bar -->
      <ConfigBar class="mb-8" />

      <!-- Canvas with Integrated Upload Zones -->
      <CanvasContainer
        ref="canvasContainerRef"
        :preview-width="previewWidth"
        @canvas-ready="handleCanvasReady"
      />

      <!-- Action Bar -->
      <ActionBar
        :stage="stage"
        :preview-width="previewWidth"
        class="mt-6"
      />
    </main>

    <!-- Footer -->
    <footer 
      class="mt-16 py-8 text-center text-sm text-gray-500 
             dark:text-gray-400 border-t border-gray-200 dark:border-gray-700"
    >
      <p>
        Framed &copy; 2025
        <span class="mx-2">•</span>
        Built by <a
          href="https://erost.net"
          target="_blank"
        >erost.net</a>
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useTheme } from '@/composables/useTheme';
import { PREVIEW_CONSTRAINTS } from '@/utils/constants';
import AppHeader from '@/components/layout/AppHeader.vue';
import ConfigBar from '@/components/layout/ConfigBar.vue';
import CanvasContainer from '@/components/layout/CanvasContainer.vue';
import ActionBar from '@/components/layout/ActionBar.vue';

/**
 * Root application component
 * Integrates all major components and provides global theme management
 */

const { theme } = useTheme();

const canvasContainerRef = ref(null);
const mainContentRef = ref(null);
const stage = ref(null);
const previewWidth = ref(PREVIEW_CONSTRAINTS.defaultWidth);
let resizeObserver = null;
let resizeTimeout = null;

/**
 * Apply theme class to root element
 */
const themeClass = computed(() => ({
  'dark': theme.value === 'dark',
  'bg-gray-50': theme.value === 'light',
  'bg-gray-900': theme.value === 'dark',
}));

/**
 * Handle canvas ready event
 * Stores the Konva stage reference needed for downloads
 */
const handleCanvasReady = (konvaStage) => {
  stage.value = konvaStage;
};

/**
 * Update preview width based on main content container size
 * Shared between ConfigBar and CanvasContainer for consistent sizing
 */
const updatePreviewWidth = () => {
  if (mainContentRef.value) {
    // Get container width
    const containerWidth = mainContentRef.value.clientWidth;

    // Account for max-w-[1024px] constraint and padding
    const maxWidth = 1024;
    const effectiveWidth = Math.min(containerWidth, maxWidth);

    // Account for padding (px-4 = 16px on each side = 32px total)
    // and CanvasContainer padding (p-6 = 24px on each side = 48px total)
    const availableWidth = effectiveWidth - 32 - 48;

    // Cap at maximum width for canvas
    previewWidth.value = Math.min(availableWidth, PREVIEW_CONSTRAINTS.defaultWidth);
  }
};

/**
 * Set up responsive sizing on mount
 */
onMounted(() => {
  // Initial size calculation
  updatePreviewWidth();

  // Use ResizeObserver for efficient container size tracking
  if (typeof ResizeObserver !== 'undefined' && mainContentRef.value) {
    resizeObserver = new ResizeObserver(() => {
      // Use requestAnimationFrame to batch updates and prevent ResizeObserver loop
      if (resizeTimeout) {
        cancelAnimationFrame(resizeTimeout);
      }
      resizeTimeout = requestAnimationFrame(() => {
        updatePreviewWidth();
        resizeTimeout = null;
      });
    });
    resizeObserver.observe(mainContentRef.value);
  } else {
    // Fallback to window resize event
    window.addEventListener('resize', updatePreviewWidth);
  }
});

/**
 * Clean up on unmount
 */
onUnmounted(() => {
  if (resizeTimeout) {
    cancelAnimationFrame(resizeTimeout);
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
  } else {
    window.removeEventListener('resize', updatePreviewWidth);
  }
});
</script>

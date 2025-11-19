<!--
  Root Application Component
  Picture Frame Creator - Main application layout
-->
<template>
  <div class="min-h-screen bg-gray-900 flex flex-col-reverse md:flex-row overflow-hidden">
    <!-- Desktop: Left Sidebar with Controls | Mobile: Bottom Controls in Reverse Column -->
    <aside
      ref="asideRef"
      class="md:w-80 flex flex-col md:border-r md:border-gray-700 md:h-screen"
    >
      <!-- Configuration Controls -->
      <div class="md:flex-1 md:p-4 md:space-y-4 md:overflow-y-auto">
        <ConfigBar />
      </div>

      <!-- Action Buttons (Desktop: scrollable section, Mobile: second row) -->
      <div class="md:border-t md:border-gray-700 md:p-4 md:space-y-3 md:overflow-y-auto">
        <ActionBar
          :stage="stage"
          :preview-width="previewWidth"
        />
      </div>
    </aside>

    <!-- Canvas Area -->
    <main
      ref="mainContentRef"
      class="flex-1 flex items-center justify-center overflow-hidden"
    >
      <CanvasContainer
        ref="canvasContainerRef"
        :preview-width="previewWidth"
        @canvas-ready="handleCanvasReady"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { PREVIEW_CONSTRAINTS } from '@/utils/constants';
import { useFrameConfig } from '@/composables/useFrameConfig';
import ConfigBar from '@/components/layout/ConfigBar.vue';
import CanvasContainer from '@/components/layout/CanvasContainer.vue';
import ActionBar from '@/components/layout/ActionBar.vue';

/**
 * Root application component
 * Integrates all major components with responsive, space-efficient layout
 *
 * Layout structure:
 * - Desktop (≥768px): Horizontal flexbox with left sidebar (320px, full height)
 *   and flex canvas area
 *   - Left sidebar (scrollable sections):
 *     - ConfigBar section: Configuration controls
 *     - ActionBar section: Output settings + full-width action buttons
 *   - Right area: Canvas taking maximum available space
 *   - No header or footer for maximum space efficiency
 *
 * - Mobile (<768px): Vertical reverse flexbox (column-reverse)
 *   - Canvas: Top area taking remaining space
 *   - Controls: Bottom area (2 rows):
 *     - Row 1 (ConfigBar): Horizontal scrollable configuration controls
 *     - Row 2 (ActionBar): Action buttons sharing width equally
 *   - Uses flex-col-reverse to position controls at bottom while maintaining proper document flow
 */

const canvasContainerRef = ref(null);
const mainContentRef = ref(null);
const asideRef = ref(null);
const stage = ref(null);
const previewWidth = ref(PREVIEW_CONSTRAINTS.defaultWidth);
let resizeObserver = null;
let resizeTimeout = null;

const { frameWidth, frameHeight } = useFrameConfig();

/**
 * Handle canvas ready event
 * Stores the Konva stage reference needed for downloads
 */
const handleCanvasReady = (konvaStage) => {
  stage.value = konvaStage;
};

/**
 * Update preview width based on window size and aside dimensions
 * Ensures canvas fits within available space by scaling to fit both width and height
 */
const updatePreviewWidth = () => {
  if (frameWidth.value && frameHeight.value) {
    // Use window dimensions for accurate viewport size
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;

    // Start with full window dimensions
    let availableWidth = windowWidth;
    let availableHeight = windowHeight;

    // Subtract aside dimensions
    if (isDesktop && asideRef.value) {
      // Desktop: aside is on the left, subtract its width
      const asideWidth = asideRef.value.clientWidth;
      availableWidth -= asideWidth;
    } else if (!isDesktop && asideRef.value) {
      // Mobile: aside is at the bottom, subtract its height
      const asideHeight = asideRef.value.clientHeight;
      availableHeight -= asideHeight;
    }

    // Account for padding: p-6 (24px) on desktop, p-4 (16px) on mobile
    const paddingHorizontal = isDesktop ? 48 : 32; // left + right
    const paddingVertical = isDesktop ? 48 : 32;   // top + bottom

    availableWidth -= paddingHorizontal;
    availableHeight -= paddingVertical;

    // Calculate scale factors for both dimensions
    const scaleByWidth = availableWidth / frameWidth.value;
    const scaleByHeight = availableHeight / frameHeight.value;

    // Use the smaller scale to ensure both dimensions fit
    const scale = Math.min(scaleByWidth, scaleByHeight);

    // Calculate final width based on scale
    const scaledWidth = frameWidth.value * scale;

    // Cap at maximum width for canvas
    previewWidth.value = Math.min(scaledWidth, PREVIEW_CONSTRAINTS.defaultWidth);
  }
};

/**
 * Watch for frame dimension changes and recalculate preview width
 */
watch([frameWidth, frameHeight], () => {
  updatePreviewWidth();
});

/**
 * Set up responsive sizing on mount
 */
onMounted(() => {
  // Initial size calculation
  updatePreviewWidth();

  // Use ResizeObserver for efficient container size tracking
  if (typeof ResizeObserver !== 'undefined') {
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

    // Observe main content area
    if (mainContentRef.value) {
      resizeObserver.observe(mainContentRef.value);
    }

    // Observe aside (mobile bottom bar height can change)
    if (asideRef.value) {
      resizeObserver.observe(asideRef.value);
    }
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

<!--
  Root Application Component
  Picture Frame Creator - Main application layout
-->
<template>
  <div class="min-h-screen bg-gray-900 flex flex-col-reverse md:flex-row overflow-hidden">
    <!-- Desktop: Left Sidebar with Controls | Mobile: Bottom Action Bar + CSS Slide-up Panel -->
    <aside
      ref="asideRef"
      class="md:w-80 flex flex-col md:border-r md:border-gray-700 md:h-screen relative"
    >
      <!-- Hidden checkbox for CSS-only toggle (mobile only) -->
      <input
        id="settings-panel-toggle"
        type="checkbox"
        class="hidden"
        data-testid="panel-toggle-checkbox"
      >

      <label
        for="settings-panel-toggle"
        class="chevron-toggle md:hidden"
        data-testid="panel-toggle-button"
      >
        <svg
          class="chevron-icon w-4 h-4 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </label>

      <!-- Configuration Controls - Slide-up Panel (Mobile) / Sidebar (Desktop) -->
      <div class="settings-panel md:flex-1 md:p-4 md:space-y-4 md:overflow-y-auto">
        <!-- Mobile: Circular Chevron Toggle Button (centered on top border of panel) -->
        <ConfigBar />
      </div>

      <!-- Action Buttons (Mobile) / Bottom Section (Desktop) -->
      <div
        class="action-section md:border-t md:border-gray-700 md:p-4 md:space-y-3 md:overflow-y-auto"
      >
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

<style scoped>
/* Mobile slide-up panel - CSS only with checkbox hack */
@media (max-width: 767px) {
  /* Aside container for proper stacking */
  aside {
    display: flex;
    flex-direction: column-reverse; /* Action bar at bottom, panel slides from below */
  }

  /* Action section stays at bottom */
  .action-section {
    position: relative;
    z-index: 60;
    background-color: rgb(31 41 55); /* bg-gray-800 */
  }

  /* Circular chevron toggle button - follows settings panel */
  .chevron-toggle {
    position: absolute;
    bottom: calc(100% - 16px); /* Position on border of settings panel (hidden state) */
    left: 50%;
    transform: translateX(-50%);
    width: 32px;
    height: 32px;
    background-color: rgb(31 41 55); /* bg-gray-800 */
    border: 2px solid rgb(55 65 81); /* border-gray-700 */
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 80; /* Higher than action section */
    transition: bottom 0.3s ease-in-out, background-color 0.2s, border-color 0.2s;
  }

  .chevron-toggle:hover {
    background-color: rgb(55 65 81); /* bg-gray-700 */
    border-color: rgb(75 85 99); /* border-gray-600 */
  }

  /* Settings panel starts hidden below viewport */
  .settings-panel {
    position: absolute;
    bottom: 100%; /* Position above action section */
    left: 0;
    right: 0;
    height: 33vh;
    transform: translateY(100%); /* Hidden below */
    transition: transform 0.3s ease-in-out;
    background-color: rgb(31 41 55); /* bg-gray-800 */
    border-top: 1px solid rgb(55 65 81); /* border-gray-700 */
    overflow-y: auto;
    padding: 1rem; /* p-4 */
    z-index: 50;
  }

  /* When checkbox is checked, slide panel up and move chevron with it */
  #settings-panel-toggle:checked ~ .chevron-toggle {
    bottom: calc(100% + 33vh - 16px); /* Move up by panel height */
  }

  #settings-panel-toggle:checked ~ .settings-panel {
    transform: translateY(0);
  }

  /* Rotate chevron when panel is open */
  #settings-panel-toggle:checked ~ .chevron-toggle .chevron-icon {
    transform: rotate(180deg);
  }
}
</style>

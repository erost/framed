/**
 * Canvas Renderer Composable
 * Manages canvas rendering logic for preview and high-resolution export
 * Generates Konva configuration objects for canvas layers
 */

import { computed } from 'vue';
import {
  calculateImageLayout,
  calculatePreviewScale,
  calculateScaledDimensions,
  calculateCenterOffset,
} from '@/utils/calculations.js';
import { useFrameConfig } from '@/composables/useFrameConfig';
import { useImageState } from '@/composables/useImageState';
import { PREVIEW_CONSTRAINTS } from '@/utils/constants';

/**
 * Composable for canvas rendering and export
 * @param {Object} options - Optional configuration
 * @param {import('vue').Ref<number>|number} options.previewWidth - Preview
 *   container width (for responsive scaling)
 * @returns {Object} Canvas rendering configuration and methods
 */
export function useCanvasRenderer(options = {}) {
  const frameConfig = useFrameConfig();
  const imageState = useImageState();

  const previewWidthRef = computed(() => {
    const width = options.previewWidth;
    if (!width) return PREVIEW_CONSTRAINTS.defaultWidth;

    return width.value;
  });

  /**
   * Calculate preview scale ratio for responsive display
   * @type {import('vue').ComputedRef<number>}
   */
  const previewScale = computed(() => {
    return calculatePreviewScale(frameConfig.frameWidth.value, previewWidthRef.value);
  });

  /**
   * Get scaled dimensions for preview mode
   * @type {import('vue').ComputedRef<{width: number, height: number}>}
   */
  const previewDimensions = computed(() => {
    // Use previewWidthRef directly for width to avoid rounding errors
    // Calculate height based on the scale to maintain aspect ratio
    return {
      width: previewWidthRef.value,
      height: frameConfig.frameHeight.value * previewScale.value,
    };
  });

  /**
   * Calculate image layout positions and dimensions
   * @type {import('vue').ComputedRef<Object>}
   */
  const imageLayout = computed(() => {
    return calculateImageLayout(
      frameConfig.frameWidth.value,
      frameConfig.frameHeight.value,
      frameConfig.orientation.value,
      frameConfig.spacing.value
    );
  });

  /**
   * Generate Konva stage configuration
   * Uses preview dimensions for responsive canvas
   * Export will use pixelRatio to generate full resolution images
   * @type {import('vue').ComputedRef<Object>}
   */
  const stageConfig = computed(() => {
    return {
      width: previewDimensions.value.width,
      height: previewDimensions.value.height,
    };
  });

  /**
   * Generate Konva background layer configuration
   * Uses preview dimensions for responsive display
   * @type {import('vue').ComputedRef<Object>}
   */
  const backgroundConfig = computed(() => {
    return {
      x: 0,
      y: 0,
      width: previewDimensions.value.width,
      height: previewDimensions.value.height,
      fill: frameConfig.backgroundColor.value,
    };
  });

  /**
   * Calculate image configuration for Konva
   * Uses preview-scaled coordinates for responsive display
   * @param {Object} image - Image data
   * @param {Object} slot - Layout slot (x, y, width, height) in full resolution
   * @returns {Object} Konva image configuration
   */
  const calculateImageConfig = (image, slot) => {
    const scale = previewScale.value;

    // Calculate scaled dimensions to fit within slot
    const scaledDimensions = calculateScaledDimensions(
      image.width,
      image.height,
      slot.width,
      slot.height,
      'fit' // Contain mode
    );

    // Calculate center offset within slot
    const centerOffset = calculateCenterOffset(
      scaledDimensions.width,
      scaledDimensions.height,
      slot.width,
      slot.height
    );

    // Return preview-scaled coordinates for responsive display
    return {
      x: (slot.x + centerOffset.x) * scale,
      y: (slot.y + centerOffset.y) * scale,
      width: scaledDimensions.width * scale,
      height: scaledDimensions.height * scale,
      image: null, // Will be set by component with actual Image object
    };
  };

  /**
   * Generate Konva configuration for first image
   * @type {import('vue').ComputedRef<Object|null>}
   */
  const image1Config = computed(() => {
    const image = imageState.images.value[0];
    if (!image) return null;

    const slot = imageLayout.value.image1;
    return calculateImageConfig(image, slot);
  });

  /**
   * Generate Konva configuration for second image
   * @type {import('vue').ComputedRef<Object|null>}
   */
  const image2Config = computed(() => {
    const image = imageState.images.value[1];
    if (!image) return null;

    const slot = imageLayout.value.image2;
    return calculateImageConfig(image, slot);
  });

  /**
   * Download canvas as image
   * @param {Object} stage - Konva stage instance
   * @param {string} filename - Download filename
   * @param {string} format - Image format ('png' or 'jpeg')
   * @param {number} quality - Image quality (0-1) for JPEG
   * @returns {void}
   */
  const downloadImage = (stage, filename = 'frame.png', format = 'png', quality = 0.95) => {
    if (!stage) {
      throw new Error('Stage instance is required for download');
    }

    // Capture reactive values to ensure current values are used
    const currentStageWidth = stageConfig.value.width;
    const currentFrameWidth = frameConfig.frameWidth.value;
    const pixelRatio = currentFrameWidth / currentStageWidth;

    try {
      const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const dataURL = stage.toDataURL({
        mimeType,
        quality,
        pixelRatio, // Scale up to full frame size
      });

      // Create download link
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      throw new Error(`Failed to download image: ${error.message}`);
    }
  };

  /**
   * Check if canvas is ready to render (has all required data)
   * @type {import('vue').ComputedRef<boolean>}
   */
  const isReady = computed(() => {
    return imageState.images.value[0] !== null && imageState.images.value[1] !== null;
  });

  /**
   * Check if canvas is ready for export
   * @type {import('vue').ComputedRef<boolean>}
   */
  const canExport = computed(() => {
    return isReady.value;
  });

  // Return public API
  return {
    // Computed configurations
    stageConfig,
    backgroundConfig,
    image1Config,
    image2Config,

    // Dimensions
    previewScale,
    previewDimensions,
    imageLayout,

    // State
    isReady,
    canExport,

    // Methods
    downloadImage,
  };
}

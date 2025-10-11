/**
 * Frame Configuration Composable
 * Manages frame configuration state including orientation, aspect ratio,
 * dimensions, border size, and background color
 */

import { ref, computed } from 'vue';
import { DEFAULT_CONFIG } from '@/utils/constants.js';
import { calculateFrameDimensions } from '@/utils/calculations.js';

// Singleton state
const orientation = ref(DEFAULT_CONFIG.orientation);
const aspectRatio = ref(DEFAULT_CONFIG.aspectRatio);
const backgroundColor = ref(DEFAULT_CONFIG.backgroundColor);
const frameSize = ref(DEFAULT_CONFIG.frameSize); // Size of longest side
const spacing = ref(DEFAULT_CONFIG.spacing);

// Computed dimensions based on frameSize (longest side)
const frameDimensions = computed(() => {
  return calculateFrameDimensions(frameSize.value, aspectRatio.value, orientation.value);
});

const frameWidth = computed(() => frameDimensions.value.width);
const frameHeight = computed(() => frameDimensions.value.height);

/**
 * Composable for managing frame configuration
 * @returns {Object} Frame configuration state and methods
 */
export function useFrameConfig() {
  // Methods
  /**
   * Update frame orientation
   * @param {string} value - New orientation ('portrait' or 'landscape')
   */
  const updateOrientation = (value) => {
    if (value === 'portrait' || value === 'landscape') {
      orientation.value = value;
    }
  };

  /**
   * Toggle orientation between portrait and landscape
   */
  const toggleOrientation = () => {
    orientation.value = orientation.value === 'portrait' ? 'landscape' : 'portrait';
  };

  /**
   * Update aspect ratio
   * @param {string} value - New aspect ratio (e.g., '3:2', '4:3')
   */
  const updateAspectRatio = (value) => {
    aspectRatio.value = value;
  };

  /**
   * Update background color
   * @param {string} value - New background color (hex format)
   */
  const updateBackgroundColor = (value) => {
    backgroundColor.value = value;
  };

  /**
   * Update frame size (longest side)
   * @param {number} value - New frame size in pixels
   */
  const updateFrameSize = (value) => {
    frameSize.value = Number(value);
  };

  /**
   * Update spacing between elements
   * @param {number} value - New spacing in pixels
   */
  const updateSpacing = (value) => {
    spacing.value = Number(value);
  };

  /**
   * Reset all configuration to defaults
   */
  const reset = () => {
    orientation.value = DEFAULT_CONFIG.orientation;
    aspectRatio.value = DEFAULT_CONFIG.aspectRatio;
    backgroundColor.value = DEFAULT_CONFIG.backgroundColor;
    frameSize.value = DEFAULT_CONFIG.frameSize;
    spacing.value = DEFAULT_CONFIG.spacing;
  };

  // Return public API
  return {
    // State
    orientation,
    aspectRatio,
    backgroundColor,
    frameSize,
    frameWidth, // Computed based on frameSize
    frameHeight, // Computed based on frameSize
    spacing,

    // Methods
    updateOrientation,
    toggleOrientation,
    updateAspectRatio,
    updateBackgroundColor,
    updateFrameSize,
    updateSpacing,
    reset,
  };
}

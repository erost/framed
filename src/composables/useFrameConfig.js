/**
 * Frame Configuration Composable
 * Manages frame configuration state including orientation, aspect ratio,
 * dimensions, border size, and background color
 */

import { ref, computed } from 'vue';
import { DEFAULT_CONFIG, ORIENTATIONS } from '@/utils/constants.js';
import { calculateFrameDimensions } from '@/utils/calculations.js';

// Singleton state
const orientation = ref(DEFAULT_CONFIG.orientation);
const aspectRatio = ref(DEFAULT_CONFIG.aspectRatio);
const backgroundColor = ref(DEFAULT_CONFIG.backgroundColor);
const frameSize = ref(DEFAULT_CONFIG.frameSize); // Size of longest side
const borderPercentage = ref(DEFAULT_CONFIG.borderPercentage); // Border as percentage (1-25)

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
    if (value === ORIENTATIONS.PORTRAIT || value === ORIENTATIONS.LANDSCAPE) {
      orientation.value = value;
    }
  };

  /**
   * Toggle orientation between portrait and landscape
   */
  const toggleOrientation = () => {
    orientation.value = orientation.value === ORIENTATIONS.PORTRAIT
      ? ORIENTATIONS.LANDSCAPE
      : ORIENTATIONS.PORTRAIT;
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
   * Update border percentage
   * @param {number} value - New border percentage (1-25)
   */
  const updateBorderPercentage = (value) => {
    borderPercentage.value = Number(value);
  };

  /**
   * Reset all configuration to defaults
   */
  const reset = () => {
    orientation.value = DEFAULT_CONFIG.orientation;
    aspectRatio.value = DEFAULT_CONFIG.aspectRatio;
    backgroundColor.value = DEFAULT_CONFIG.backgroundColor;
    frameSize.value = DEFAULT_CONFIG.frameSize;
    borderPercentage.value = DEFAULT_CONFIG.borderPercentage;
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
    borderPercentage,

    // Methods
    updateOrientation,
    toggleOrientation,
    updateAspectRatio,
    updateBackgroundColor,
    updateFrameSize,
    updateBorderPercentage,
    reset,
  };
}

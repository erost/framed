/**
 * Application Constants
 * Contains all constant values used throughout the application
 */

/**
 * Aspect ratio values
 * @constant {Object.<string, number>}
 */
export const ASPECT_RATIOS = {
  '3:2': 3 / 2,
  '4:3': 4 / 3,
  '5:4': 5 / 4,
  '16:9': 16 / 9,
};

/**
 * Frame orientation values
 * @constant {Object.<string, string>}
 */
export const ORIENTATIONS = {
  PORTRAIT: 'portrait',
  LANDSCAPE: 'landscape',
};

/**
 * Default frame configuration
 * @constant {Object}
 */
export const DEFAULT_CONFIG = {
  orientation: 'portrait',
  aspectRatio: '3:2',
  backgroundColor: '#FFFFFF',
  frameSize: 3000, // Size of the longest side (height for portrait, width for landscape)
  spacing: 100,
};

/**
 * Image file constraints
 * @constant {Object}
 */
export const IMAGE_CONSTRAINTS = {
  maxFileSize: 40 * 1024 * 1024, // 40MB
  minDimension: 800,
  supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  aspectRatioTolerance: 0.05, // 5%
};

/**
 * Frame dimension constraints
 * @constant {Object}
 */
export const FRAME_CONSTRAINTS = {
  minSize: 800,
  maxSize: 10000,
  minSpacing: 0,
  maxSpacing: 500,
};

/**
 * Theme values
 * @constant {Object.<string, string>}
 */
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

/**
 * Canvas preview constraints
 * @constant {Object}
 */
export const PREVIEW_CONSTRAINTS = {
  defaultWidth: 800,
};

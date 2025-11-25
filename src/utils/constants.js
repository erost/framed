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
 * Background color preset options
 * @constant {Object}
 */
export const COLOR_PRESETS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY: '#808080',
};

/**
 * Color picker mode values
 * @constant {Object}
 */
export const COLOR_MODES = {
  WHITE: 'white',
  BLACK: 'black',
  CUSTOM: 'custom',
};

/**
 * Default frame configuration
 * @constant {Object}
 */
export const DEFAULT_CONFIG = {
  orientation: 'portrait',
  aspectRatio: '3:2',
  backgroundColor: COLOR_PRESETS.WHITE,
  frameSize: 2048, // Size of the longest side (height for portrait, width for landscape)
  borderPercentage: 2, // Border as percentage of frame size (1-25)
};

/**
 * Image file constraints
 * @constant {Object}
 */
export const IMAGE_CONSTRAINTS = {
  maxFileSize: 40 * 1024 * 1024, // 40MB
  supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
};

/**
 * Frame size options for export
 * @constant {Array.<Object>}
 */
export const FRAME_SIZE_OPTIONS = [
  { label: '1024px', value: 1024 },
  { label: '2048px', value: 2048 },
  { label: '4096px', value: 4096 }
];

/**
 * Frame dimension constraints
 * @constant {Object}
 */
export const FRAME_CONSTRAINTS = {
  minBorderPercentage: 1,
  maxBorderPercentage: 25,
};

/**
 * Canvas preview constraints
 * @constant {Object}
 */
export const PREVIEW_CONSTRAINTS = {
  defaultWidth: 800,
};

/**
 * Image export formats with mime type and file extension
 * @constant {Array.<Object>}
 */
export const IMAGE_FORMATS = [
  { mimeType: 'image/png', extension: 'png', label: 'PNG' },
  { mimeType: 'image/jpeg', extension: 'jpeg', label: 'JPEG' },
  { mimeType: 'image/webp', extension: 'webp', label: 'WebP' },
];

export const EXPORT_DEFAULT = {
  defaultQuality: 85,
  defaultFileName: 'framed',
  defaultFormat: IMAGE_FORMATS[0].mimeType,
};

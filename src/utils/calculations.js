/**
 * Calculation utilities for frame dimensions and image layouts
 */

import { ASPECT_RATIOS } from './constants.js';

/**
 * Calculate frame dimensions based on size (longest side), aspect ratio, and orientation
 * Size parameter represents the longest side of the frame
 * - Portrait: size = height (longer side), width calculated from aspect ratio
 * - Landscape: size = width (longer side), height calculated from aspect ratio
 *
 * Example: 1080px size in 4:3 portrait -> height=1080, width=810
 *
 * @param {number} size - Size of the longest side in pixels
 * @param {string} aspectRatio - Aspect ratio (e.g., '3:2', '4:3')
 * @param {string} orientation - Frame orientation ('portrait' or 'landscape')
 * @returns {Object} Object with width and height {width: number, height: number}
 */
export function calculateFrameDimensions(size, aspectRatio, orientation) {
  const ratio = ASPECT_RATIOS[aspectRatio];

  if (!ratio) {
    throw new Error(`Invalid aspect ratio: ${aspectRatio}`);
  }

  if (orientation === 'portrait') {
    // Portrait: height is the longest side (size parameter)
    // Width = height / ratio
    // For 4:3 portrait with size=1080: width = 1080 / (4/3) = 810
    return {
      width: size / ratio,
      height: size,
    };
  } else if (orientation === 'landscape') {
    // Landscape: width is the longest side (size parameter)
    // Height = width / ratio
    // For 4:3 landscape with size=1080: height = 1080 / (4/3) = 810
    return {
      width: size,
      height: size / ratio,
    };
  } else {
    throw new Error(`Invalid orientation: ${orientation}`);
  }
}

/**
 * Calculate dimensions and positions for two images in a frame
 * Uses uniform spacing between all elements (edges and images)
 *
 * Spacing concept:
 * - Portrait: [spacing][image1][spacing][image2][spacing] (vertical)
 * - Landscape: [spacing][image1][spacing][image2][spacing] (horizontal)
 *
 * @param {number} frameWidth - Frame width in pixels
 * @param {number} frameHeight - Frame height in pixels
 * @param {string} orientation - Frame orientation ('portrait' or 'landscape')
 * @param {number} spacing - Uniform spacing between elements
 * @returns {Object} Layout object with image1 and image2 positions/dimensions
 */
export function calculateImageLayout(frameWidth, frameHeight, orientation, spacing) {
  if (orientation === 'portrait') {
    // Stack vertically: [spacing][image1][spacing][image2][spacing]
    // Available height for images: frameHeight - 3*spacing (top, middle, bottom)
    const availableHeight = frameHeight - 3 * spacing;
    const imageHeight = availableHeight / 2;

    // Full width minus spacing on both sides
    const availableWidth = frameWidth - 2 * spacing;
    const imageWidth = availableWidth;

    return {
      image1: {
        x: spacing,
        y: spacing,
        width: imageWidth,
        height: imageHeight,
      },
      image2: {
        x: spacing,
        y: spacing + imageHeight + spacing,
        width: imageWidth,
        height: imageHeight,
      },
    };
  } else {
    // Stack horizontally: [spacing][image1][spacing][image2][spacing]
    // Available width for images: frameWidth - 3*spacing (left, middle, right)
    const availableWidth = frameWidth - 3 * spacing;
    const imageWidth = availableWidth / 2;

    // Full height minus spacing on both sides
    const availableHeight = frameHeight - 2 * spacing;
    const imageHeight = availableHeight;

    return {
      image1: {
        x: spacing,
        y: spacing,
        width: imageWidth,
        height: imageHeight,
      },
      image2: {
        x: spacing + imageWidth + spacing,
        y: spacing,
        width: imageWidth,
        height: imageHeight,
      },
    };
  }
}

/**
 * Calculate scaled dimensions while maintaining aspect ratio
 * @param {number} sourceWidth - Original width
 * @param {number} sourceHeight - Original height
 * @param {number} targetWidth - Target container width
 * @param {number} targetHeight - Target container height
 * @param {string} mode - Scaling mode: 'fit' (contain) or 'fill' (cover)
 * @returns {Object} Scaled dimensions {width, height}
 */
export function calculateScaledDimensions(
  sourceWidth,
  sourceHeight,
  targetWidth,
  targetHeight,
  mode = 'fit'
) {
  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = targetWidth / targetHeight;

  let width, height;

  if (mode === 'fit') {
    // Contain - fit entire image within container
    if (sourceRatio > targetRatio) {
      // Image is wider than container
      width = targetWidth;
      height = targetWidth / sourceRatio;
    } else {
      // Image is taller than container
      height = targetHeight;
      width = targetHeight * sourceRatio;
    }
  } else if (mode === 'fill') {
    // Cover - fill entire container, may crop image
    if (sourceRatio > targetRatio) {
      // Image is wider, scale to height
      height = targetHeight;
      width = targetHeight * sourceRatio;
    } else {
      // Image is taller, scale to width
      width = targetWidth;
      height = targetWidth / sourceRatio;
    }
  } else {
    throw new Error(`Invalid scaling mode: ${mode}`);
  }

  return { width, height };
}

/**
 * Calculate centered offset for an element within a container
 * @param {number} elementWidth - Width of element to center
 * @param {number} elementHeight - Height of element to center
 * @param {number} containerWidth - Container width
 * @param {number} containerHeight - Container height
 * @returns {Object} Center offset {x, y}
 */
export function calculateCenterOffset(
  elementWidth,
  elementHeight,
  containerWidth,
  containerHeight
) {
  return {
    x: (containerWidth - elementWidth) / 2,
    y: (containerHeight - elementHeight) / 2,
  };
}

/**
 * Calculate preview scale ratio for responsive display
 * @param {number} frameWidth - Full frame width
 * @param {number} containerWidth - Available container width
 * @returns {number} Scale ratio (e.g., 0.5 for 50% scale)
 */
export function calculatePreviewScale(frameWidth, containerWidth) {
  return containerWidth / frameWidth;
}

/**
 * Get image orientation from dimensions
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {string} 'portrait' or 'landscape'
 */
export function getImageOrientation(width, height) {
  return height > width ? 'portrait' : 'landscape';
}

/**
 * Calculate aspect ratio from dimensions
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {number} Aspect ratio (width / height)
 */
export function calculateAspectRatio(width, height) {
  return width / height;
}

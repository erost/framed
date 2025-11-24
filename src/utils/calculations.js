/**
 * Calculation utilities for frame dimensions and image layouts
 */

import { ASPECT_RATIOS, ORIENTATIONS } from './constants.js';

/**
 * Calculate border spacing from percentage of frame size
 * Border percentage applies to both sides, so divide by 2
 * Example: frameSize=2048, borderPercentage=2 -> Math.round(2048 * 0.02 / 2) = 20px per side
 *
 * @param {number} frameSize - Size of the longest side in pixels
 * @param {number} borderPercentage - Border percentage (1-25)
 * @returns {number} Border spacing in pixels (per side)
 */
export function calculateBorderSpacing(frameSize, borderPercentage) {
  return Math.round((frameSize * borderPercentage) / 100 / 2);
}

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

  if (orientation === ORIENTATIONS.PORTRAIT) {
    // Portrait: height is the longest side (size parameter)
    // Width = height / ratio
    // For 4:3 portrait with size=1080: width = 1080 / (4/3) = 810
    return {
      width: size / ratio,
      height: size,
    };
  } else if (orientation === ORIENTATIONS.LANDSCAPE) {
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
 * Border spacing applies to frame edges, fixed inner spacing between images
 *
 * Spacing concept:
 * - Portrait: [border][image1][inner][image2][border] (vertical)
 * - Landscape: [border][image1][inner][image2][border] (horizontal)
 * - Inner spacing is always 20px (fixed distance between images)
 *
 * @param {number} frameWidth - Frame width in pixels
 * @param {number} frameHeight - Frame height in pixels
 * @param {string} orientation - Frame orientation ('portrait' or 'landscape')
 * @param {number} borderSpacing - Border spacing in pixels (edge distance)
 * @returns {Object} Layout object with image1 and image2 positions/dimensions
 */
export function calculateImageLayout(frameWidth, frameHeight, orientation, borderSpacing) {
  const INNER_SPACING = 20; // Fixed spacing between images

  if (orientation === ORIENTATIONS.PORTRAIT) {
    // Stack vertically: [border][image1][inner][image2][border]
    // Available height for images: frameHeight - 2*border - inner
    const availableHeight = frameHeight - 2 * borderSpacing - INNER_SPACING;
    const imageHeight = availableHeight / 2;

    // Full width minus border on both sides
    const availableWidth = frameWidth - 2 * borderSpacing;
    const imageWidth = availableWidth;

    return {
      image1: {
        x: borderSpacing,
        y: borderSpacing,
        width: imageWidth,
        height: imageHeight,
      },
      image2: {
        x: borderSpacing,
        y: borderSpacing + imageHeight + INNER_SPACING,
        width: imageWidth,
        height: imageHeight,
      },
    };
  } else {
    // Stack horizontally: [border][image1][inner][image2][border]
    // Available width for images: frameWidth - 2*border - inner
    const availableWidth = frameWidth - 2 * borderSpacing - INNER_SPACING;
    const imageWidth = availableWidth / 2;

    // Full height minus border on both sides
    const availableHeight = frameHeight - 2 * borderSpacing;
    const imageHeight = availableHeight;

    return {
      image1: {
        x: borderSpacing,
        y: borderSpacing,
        width: imageWidth,
        height: imageHeight,
      },
      image2: {
        x: borderSpacing + imageWidth + INNER_SPACING,
        y: borderSpacing,
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
  return height > width ? ORIENTATIONS.PORTRAIT : ORIENTATIONS.LANDSCAPE;
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

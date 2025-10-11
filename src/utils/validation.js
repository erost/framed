/**
 * Validation utilities for images and configuration
 */

import { IMAGE_CONSTRAINTS } from './constants.js';

/**
 * Validate image file before upload
 * @param {File} file - File object to validate
 * @returns {Object} Validation result {valid: boolean, error?: string}
 */
export function validateFile(file) {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  // Check file type
  if (!IMAGE_CONSTRAINTS.supportedFormats.includes(file.type)) {
    return {
      valid: false,
      error: 'Unsupported file format. Please use JPEG, PNG, or WebP.',
    };
  }

  // Check file size
  if (file.size > IMAGE_CONSTRAINTS.maxFileSize) {
    const maxSizeMB = IMAGE_CONSTRAINTS.maxFileSize / (1024 * 1024);
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`,
    };
  }

  return { valid: true };
}

/**
 * Validate image dimensions meet minimum requirements
 * @param {number} width - Image width in pixels
 * @param {number} height - Image height in pixels
 * @returns {Object} Validation result {valid: boolean, error?: string}
 */
export function validateImageDimensions(width, height) {
  const minDim = IMAGE_CONSTRAINTS.minDimension;
  const shortestSide = Math.min(width, height);

  if (shortestSide < minDim) {
    return {
      valid: false,
      error:
        `Image must be at least ${minDim}px on the shortest side. ` + `Current: ${shortestSide}px`,
    };
  }

  return { valid: true };
}

/**
 * Validate frame size (longest side) is within acceptable range
 * @param {number} size - Frame size in pixels
 * @param {number} minSize - Minimum allowed size
 * @param {number} maxSize - Maximum allowed size
 * @returns {Object} Validation result {valid: boolean, error?: string, clamped?: number}
 */
export function validateFrameSize(size, minSize = 800, maxSize = 10000) {
  if (size < minSize) {
    return {
      valid: false,
      error: `Frame size must be at least ${minSize}px`,
      clamped: minSize,
    };
  }

  if (size > maxSize) {
    return {
      valid: false,
      error: `Frame size must not exceed ${maxSize}px`,
      clamped: maxSize,
    };
  }

  return { valid: true };
}

/**
 * Validate spacing is within acceptable range
 * @param {number} size - Spacing size in pixels
 * @param {number} minSize - Minimum allowed size
 * @param {number} maxSize - Maximum allowed size
 * @returns {Object} Validation result {valid: boolean, error?: string, clamped?: number}
 */
export function validateSpacing(size, minSize = 0, maxSize = 500) {
  if (size < minSize) {
    return {
      valid: false,
      error: `Spacing must be at least ${minSize}px`,
      clamped: minSize,
    };
  }

  if (size > maxSize) {
    return {
      valid: false,
      error: `Spacing must not exceed ${maxSize}px`,
      clamped: maxSize,
    };
  }

  return { valid: true };
}

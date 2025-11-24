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
 * Extract valid filename characters from a filename
 * @param {string} filename - Original filename with extension
 * @returns {string} Valid characters (1-10 chars), or empty string if none
 */
export function extractValidFilenameChars(filename) {
  if (!filename) return '';

  // Remove extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');

  // Extract only valid characters (alphanumeric, spaces, underscore, dash, comma)
  const validChars = nameWithoutExt.replace(/[^\w,\s-]/g, '');

  // Return first 10 characters, min 1, max 10
  return validChars.slice(0, 10);
}

// Counter for ensuring uniqueness when generating UUIDs in rapid succession
let uuidCounter = 0;

/**
 * Generate UUID v1 (time-based)
 * Returns first 8 characters of UUID v1
 * @returns {string} First 8 characters of UUID v1
 */
export function generateUuidV1Short() {
  // UUID v1 format: time_low-time_mid-time_hi_and_version-clock_seq-node
  const timestamp = Date.now();
  const timeHex = timestamp.toString(16).padStart(12, '0');

  // Increment counter for uniqueness in rapid succession
  uuidCounter = (uuidCounter + 1) % 0xffff;

  // Add random component and counter for uniqueness
  const random = Math.floor(Math.random() * 0xffff)
    .toString(16)
    .padStart(4, '0');
  const counter = uuidCounter.toString(16).padStart(4, '0');

  // Construct UUID v1-like identifier (simplified version)
  const uuid = `${timeHex.slice(-6)}${counter}${random}`;

  return uuid.slice(0, 8);
}
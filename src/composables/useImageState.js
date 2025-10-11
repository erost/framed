/**
 * Image State Composable
 * Manages image upload, metadata extraction, and removal
 */

import { ref } from 'vue';
import { validateFile, validateImageDimensions } from '@/utils/validation.js';
import { getImageOrientation, calculateAspectRatio } from '@/utils/calculations.js';

/**
 * Load image and extract metadata
 * @param {File} file - Image file to load
 * @returns {Promise<Object>} Image metadata
 */
function loadImageMetadata(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const orientation = getImageOrientation(width, height);
        const aspectRatio = calculateAspectRatio(width, height);

        // Validate dimensions
        const dimensionValidation = validateImageDimensions(width, height);
        if (!dimensionValidation.valid) {
          reject(new Error(dimensionValidation.error));
          return;
        }

        resolve({
          file,
          dataUrl: e.target.result,
          width,
          height,
          orientation,
          aspectRatio,
        });
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target.result;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

// Singleton state - array of two images [image1, image2]
const images = ref([null, null]);

/**
 * Composable for managing image state
 * @returns {Object} Image state and methods
 */
export function useImageState() {
  /**
   * Add or update image at specified position
   * @param {File} file - Image file to upload
   * @param {number} position - Position index (0 or 1)
   * @returns {Promise<void>}
   * @throws {Error} If file validation fails
   */
  const addImage = async (file, position) => {
    // Validate position
    if (position !== 0 && position !== 1) {
      throw new Error('Position must be 0 or 1');
    }

    // Validate file
    const fileValidation = validateFile(file);
    if (!fileValidation.valid) {
      throw new Error(fileValidation.error);
    }

    // Load and extract metadata
    try {
      const imageData = await loadImageMetadata(file);

      // Store in state with unique ID
      images.value[position] = {
        id: `image-${position}-${Date.now()}`,
        ...imageData,
      };
    } catch (error) {
      throw new Error(`Failed to process image: ${error.message}`);
    }
  };

  /**
   * Remove image at specified position
   * @param {number} position - Position index (0 or 1)
   */
  const removeImage = (position) => {
    if (position === 0 || position === 1) {
      images.value[position] = null;
    }
  };

  /**
   * Clear all images
   */
  const clearImages = () => {
    images.value = [null, null];
  };

  // Return public API
  return {
    // State
    images,

    // Methods
    addImage,
    removeImage,
    clearImages,
  };
}

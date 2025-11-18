/**
 * Tests for useFrameConfig composable
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useFrameConfig } from '@/composables/useFrameConfig.js';
import { DEFAULT_CONFIG, ASPECT_RATIOS } from '@/utils/constants.js';

describe('useFrameConfig', () => {
  let frameConfig;

  // Helper to calculate expected dimensions
  const calcDimensions = (frameSize, aspectRatio, orientation) => {
    const ratio = ASPECT_RATIOS[aspectRatio];
    if (orientation === 'portrait') {
      return {
        width: frameSize / ratio,
        height: frameSize,
      };
    } else {
      return {
        width: frameSize,
        height: frameSize / ratio,
      };
    }
  };

  beforeEach(() => {
    frameConfig = useFrameConfig();
    // Reset to defaults to ensure clean state between tests
    frameConfig.reset();
  });

  describe('Initial State', () => {
    it('should initialize with default orientation', () => {
      expect(frameConfig.orientation.value).toBe(DEFAULT_CONFIG.orientation);
    });

    it('should initialize with default aspect ratio', () => {
      expect(frameConfig.aspectRatio.value).toBe(DEFAULT_CONFIG.aspectRatio);
    });

    it('should initialize with default background color', () => {
      expect(frameConfig.backgroundColor.value).toBe(
        DEFAULT_CONFIG.backgroundColor
      );
    });

    it('should initialize with default frame size', () => {
      expect(frameConfig.frameSize.value).toBe(DEFAULT_CONFIG.frameSize);
    });

    it('should initialize with default spacing', () => {
      expect(frameConfig.spacing.value).toBe(DEFAULT_CONFIG.spacing);
    });

    it('should calculate dimensions based on frameSize, aspect ratio, and orientation', () => {
      const expected = calcDimensions(
        DEFAULT_CONFIG.frameSize,
        DEFAULT_CONFIG.aspectRatio,
        DEFAULT_CONFIG.orientation
      );
      expect(frameConfig.frameWidth.value).toBeCloseTo(expected.width, 1);
      expect(frameConfig.frameHeight.value).toBe(expected.height);
    });
  });

  describe('updateOrientation', () => {
    it('should update orientation to portrait', () => {
      frameConfig.orientation.value = 'landscape';
      frameConfig.updateOrientation('portrait');
      expect(frameConfig.orientation.value).toBe('portrait');
    });

    it('should update orientation to landscape', () => {
      frameConfig.updateOrientation('landscape');
      expect(frameConfig.orientation.value).toBe('landscape');
    });

    it('should update frame dimensions when orientation changes', () => {
      // Start with portrait
      const portraitExpected = calcDimensions(
        DEFAULT_CONFIG.frameSize,
        DEFAULT_CONFIG.aspectRatio,
        'portrait'
      );
      expect(frameConfig.frameWidth.value).toBeCloseTo(portraitExpected.width, 1);
      expect(frameConfig.frameHeight.value).toBe(portraitExpected.height);

      // Change to landscape
      frameConfig.updateOrientation('landscape');
      const landscapeExpected = calcDimensions(
        DEFAULT_CONFIG.frameSize,
        DEFAULT_CONFIG.aspectRatio,
        'landscape'
      );
      expect(frameConfig.frameWidth.value).toBe(landscapeExpected.width);
      expect(frameConfig.frameHeight.value).toBeCloseTo(landscapeExpected.height, 1);
    });

    it('should ignore invalid orientation values', () => {
      const originalOrientation = frameConfig.orientation.value;
      frameConfig.updateOrientation('invalid');
      expect(frameConfig.orientation.value).toBe(originalOrientation);
    });
  });

  describe('toggleOrientation', () => {
    it('should toggle from portrait to landscape', () => {
      frameConfig.orientation.value = 'portrait';
      frameConfig.toggleOrientation();
      expect(frameConfig.orientation.value).toBe('landscape');
    });

    it('should toggle from landscape to portrait', () => {
      frameConfig.orientation.value = 'landscape';
      frameConfig.toggleOrientation();
      expect(frameConfig.orientation.value).toBe('portrait');
    });

    it('should update frame height when toggling orientation', () => {
      // Start with portrait
      frameConfig.orientation.value = 'portrait';
      const portraitHeight = frameConfig.frameHeight.value;

      // Toggle to landscape
      frameConfig.toggleOrientation();
      const landscapeHeight = frameConfig.frameHeight.value;

      expect(portraitHeight).not.toBe(landscapeHeight);
    });
  });

  describe('updateAspectRatio', () => {
    it('should update aspect ratio to 4:3', () => {
      frameConfig.updateAspectRatio('4:3');
      expect(frameConfig.aspectRatio.value).toBe('4:3');
    });

    it('should update aspect ratio to 5:4', () => {
      frameConfig.updateAspectRatio('5:4');
      expect(frameConfig.aspectRatio.value).toBe('5:4');
    });

    it('should update aspect ratio to 16:9', () => {
      frameConfig.updateAspectRatio('16:9');
      expect(frameConfig.aspectRatio.value).toBe('16:9');
    });

    it('should update frame dimensions when aspect ratio changes', () => {
      // Start with default (portrait 3:2)
      const initialExpected = calcDimensions(
        DEFAULT_CONFIG.frameSize,
        DEFAULT_CONFIG.aspectRatio,
        DEFAULT_CONFIG.orientation
      );
      expect(frameConfig.frameWidth.value).toBeCloseTo(initialExpected.width, 1);
      expect(frameConfig.frameHeight.value).toBe(initialExpected.height);

      // Change to 4:3
      frameConfig.updateAspectRatio('4:3');
      const newExpected = calcDimensions(
        DEFAULT_CONFIG.frameSize,
        '4:3',
        DEFAULT_CONFIG.orientation
      );
      expect(frameConfig.frameWidth.value).toBeCloseTo(newExpected.width, 1);
      expect(frameConfig.frameHeight.value).toBe(newExpected.height);
    });
  });

  describe('updateBackgroundColor', () => {
    it('should update background color to black', () => {
      frameConfig.updateBackgroundColor('#000000');
      expect(frameConfig.backgroundColor.value).toBe('#000000');
    });

    it('should update background color to gray', () => {
      frameConfig.updateBackgroundColor('#808080');
      expect(frameConfig.backgroundColor.value).toBe('#808080');
    });

    it('should update background color to custom color', () => {
      frameConfig.updateBackgroundColor('#FF5733');
      expect(frameConfig.backgroundColor.value).toBe('#FF5733');
    });
  });

  describe('updateFrameSize', () => {
    it('should update frame size to new value', () => {
      frameConfig.updateFrameSize(4000);
      expect(frameConfig.frameSize.value).toBe(4000);
    });

    it('should convert string to number', () => {
      frameConfig.updateFrameSize('5000');
      expect(frameConfig.frameSize.value).toBe(5000);
    });

    it('should update frame dimensions when size changes', () => {
      // Original default size
      const initialExpected = calcDimensions(
        DEFAULT_CONFIG.frameSize,
        DEFAULT_CONFIG.aspectRatio,
        DEFAULT_CONFIG.orientation
      );
      expect(frameConfig.frameWidth.value).toBeCloseTo(initialExpected.width, 1);
      expect(frameConfig.frameHeight.value).toBe(initialExpected.height);

      // Update to 4000
      frameConfig.updateFrameSize(4000);
      const newExpected = calcDimensions(
        4000,
        DEFAULT_CONFIG.aspectRatio,
        DEFAULT_CONFIG.orientation
      );
      expect(frameConfig.frameWidth.value).toBeCloseTo(newExpected.width, 1);
      expect(frameConfig.frameHeight.value).toBe(newExpected.height);
    });
  });

  describe('updateSpacing', () => {
    it('should update spacing to new value', () => {
      frameConfig.updateSpacing(150);
      expect(frameConfig.spacing.value).toBe(150);
    });

    it('should convert string to number', () => {
      frameConfig.updateSpacing('200');
      expect(frameConfig.spacing.value).toBe(200);
    });

    it('should allow spacing of 0', () => {
      frameConfig.updateSpacing(0);
      expect(frameConfig.spacing.value).toBe(0);
    });
  });

  describe('reset', () => {
    it('should reset all values to defaults', () => {
      // Change all values
      frameConfig.updateOrientation('landscape');
      frameConfig.updateAspectRatio('16:9');
      frameConfig.updateBackgroundColor('#000000');
      frameConfig.updateFrameSize(5000);
      frameConfig.updateSpacing(200);

      // Reset
      frameConfig.reset();

      // Verify all values are back to defaults
      expect(frameConfig.orientation.value).toBe(DEFAULT_CONFIG.orientation);
      expect(frameConfig.aspectRatio.value).toBe(DEFAULT_CONFIG.aspectRatio);
      expect(frameConfig.backgroundColor.value).toBe(
        DEFAULT_CONFIG.backgroundColor
      );
      expect(frameConfig.frameSize.value).toBe(DEFAULT_CONFIG.frameSize);
      expect(frameConfig.spacing.value).toBe(DEFAULT_CONFIG.spacing);
    });

    it('should reset computed frame dimensions', () => {
      // Change frame size
      frameConfig.updateFrameSize(5000);
      const changedExpected = calcDimensions(
        5000, 
        DEFAULT_CONFIG.aspectRatio, 
        DEFAULT_CONFIG.orientation
      );
      expect(frameConfig.frameHeight.value).toBe(changedExpected.height);
      expect(frameConfig.frameWidth.value).toBeCloseTo(changedExpected.width, 1);

      // Reset
      frameConfig.reset();

      // Dimensions should be back to default calculation
      const resetExpected = calcDimensions(
        DEFAULT_CONFIG.frameSize,
        DEFAULT_CONFIG.aspectRatio,
        DEFAULT_CONFIG.orientation
      );
      expect(frameConfig.frameWidth.value).toBeCloseTo(resetExpected.width, 1);
      expect(frameConfig.frameHeight.value).toBe(resetExpected.height);
    });
  });

  describe('Reactivity', () => {
    it('should react to multiple state changes', () => {
      // Change orientation to landscape
      frameConfig.updateOrientation('landscape');
      // Change aspect ratio to 16:9
      frameConfig.updateAspectRatio('16:9');

      // Calculate expected dimensions with current frameSize (DEFAULT_CONFIG.frameSize)
      const expected = calcDimensions(DEFAULT_CONFIG.frameSize, '16:9', 'landscape');
      expect(frameConfig.frameWidth.value).toBe(expected.width);
      expect(frameConfig.frameHeight.value).toBeCloseTo(expected.height, 1);
    });

    it('should maintain reactivity after reset', () => {
      frameConfig.reset();
      frameConfig.updateOrientation('landscape');

      // Should still be reactive (landscape 3:2 with default frameSize)
      const expected = calcDimensions(
        DEFAULT_CONFIG.frameSize,
        DEFAULT_CONFIG.aspectRatio,
        'landscape'
      );
      expect(frameConfig.frameWidth.value).toBe(expected.width);
      expect(frameConfig.frameHeight.value).toBeCloseTo(expected.height, 1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large frame size', () => {
      frameConfig.updateFrameSize(10000);
      expect(frameConfig.frameSize.value).toBe(10000);
      // Portrait 3:2: width=6666.67, height=10000
      expect(frameConfig.frameWidth.value).toBeCloseTo(6666.67, 1);
      expect(frameConfig.frameHeight.value).toBe(10000);
    });

    it('should handle very small frame size', () => {
      frameConfig.updateFrameSize(800);
      expect(frameConfig.frameSize.value).toBe(800);
      // Portrait 3:2: width=533.33, height=800
      expect(frameConfig.frameWidth.value).toBeCloseTo(533.33, 1);
      expect(frameConfig.frameHeight.value).toBe(800);
    });

    it('should handle zero spacing', () => {
      frameConfig.updateSpacing(0);
      expect(frameConfig.spacing.value).toBe(0);
    });

    it('should handle large spacing', () => {
      frameConfig.updateSpacing(500);
      expect(frameConfig.spacing.value).toBe(500);
    });
  });
});

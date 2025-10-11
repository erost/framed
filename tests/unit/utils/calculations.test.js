/**
 * Tests for calculation utilities
 */

import { describe, it, expect } from 'vitest';
import {
  calculateImageLayout,
  calculateScaledDimensions,
  calculateCenterOffset,
  calculatePreviewScale,
  getImageOrientation,
  calculateAspectRatio,
} from '@/utils/calculations';

describe('calculations.js', () => {
  describe('calculateImageLayout', () => {
    it('calculates vertical layout for portrait orientation', () => {
      const layout = calculateImageLayout(3000, 4500, 'portrait', 100);

      expect(layout.image1).toBeDefined();
      expect(layout.image2).toBeDefined();

      // Images should be stacked vertically
      expect(layout.image1.x).toBe(layout.image2.x);
      expect(layout.image1.width).toBe(layout.image2.width);
      expect(layout.image1.height).toBe(layout.image2.height);

      // Second image should be below first
      expect(layout.image2.y).toBeGreaterThan(layout.image1.y);
    });

    it('calculates horizontal layout for landscape orientation', () => {
      const layout = calculateImageLayout(4500, 3000, 'landscape', 100);

      expect(layout.image1).toBeDefined();
      expect(layout.image2).toBeDefined();

      // Images should be side by side
      expect(layout.image1.y).toBe(layout.image2.y);
      expect(layout.image1.width).toBe(layout.image2.width);
      expect(layout.image1.height).toBe(layout.image2.height);

      // Second image should be to the right of first
      expect(layout.image2.x).toBeGreaterThan(layout.image1.x);
    });

    it('accounts for border size in layout', () => {
      const layoutSmallBorder = calculateImageLayout(3000, 4500, 'portrait', 50);
      const layoutLargeBorder = calculateImageLayout(3000, 4500, 'portrait', 200);

      // Larger border should result in smaller available space
      expect(layoutSmallBorder.image1.width).toBeGreaterThan(
        layoutLargeBorder.image1.width
      );
      expect(layoutSmallBorder.image1.height).toBeGreaterThan(
        layoutLargeBorder.image1.height
      );
    });

    it('maintains proper padding between images', () => {
      const spacing = 100;
      const layout = calculateImageLayout(3000, 4500, 'portrait', spacing);

      // Gap between images should equal the spacing parameter
      const gap = layout.image2.y - (layout.image1.y + layout.image1.height);
      expect(gap).toBeCloseTo(spacing, 0);
    });
  });

  describe('calculateScaledDimensions', () => {
    it('fits wider image within container (fit mode)', () => {
      const result = calculateScaledDimensions(1600, 900, 800, 600, 'fit');

      expect(result.width).toBe(800);
      expect(result.height).toBeCloseTo(450, 0);
    });

    it('fits taller image within container (fit mode)', () => {
      const result = calculateScaledDimensions(900, 1600, 800, 600, 'fit');

      expect(result.width).toBeCloseTo(337.5, 0);
      expect(result.height).toBe(600);
    });

    it('fills container with wider image (fill mode)', () => {
      const result = calculateScaledDimensions(1600, 900, 800, 600, 'fill');

      expect(result.width).toBeCloseTo(1066.67, 0);
      expect(result.height).toBe(600);
    });

    it('fills container with taller image (fill mode)', () => {
      const result = calculateScaledDimensions(900, 1600, 800, 600, 'fill');

      expect(result.width).toBe(800);
      expect(result.height).toBeCloseTo(1422.22, 0);
    });

    it('throws error for invalid mode', () => {
      expect(() => {
        calculateScaledDimensions(1600, 900, 800, 600, 'invalid');
      }).toThrow('Invalid scaling mode');
    });

    it('maintains aspect ratio in fit mode', () => {
      const sourceRatio = 1600 / 900;
      const result = calculateScaledDimensions(1600, 900, 800, 600, 'fit');
      const resultRatio = result.width / result.height;

      expect(resultRatio).toBeCloseTo(sourceRatio, 2);
    });

    it('maintains aspect ratio in fill mode', () => {
      const sourceRatio = 1600 / 900;
      const result = calculateScaledDimensions(1600, 900, 800, 600, 'fill');
      const resultRatio = result.width / result.height;

      expect(resultRatio).toBeCloseTo(sourceRatio, 2);
    });
  });

  describe('calculateCenterOffset', () => {
    it('calculates center offset for smaller element', () => {
      const offset = calculateCenterOffset(400, 300, 800, 600);

      expect(offset.x).toBe(200);
      expect(offset.y).toBe(150);
    });

    it('calculates zero offset when element matches container', () => {
      const offset = calculateCenterOffset(800, 600, 800, 600);

      expect(offset.x).toBe(0);
      expect(offset.y).toBe(0);
    });

    it('calculates negative offset for larger element', () => {
      const offset = calculateCenterOffset(1000, 800, 800, 600);

      expect(offset.x).toBe(-100);
      expect(offset.y).toBe(-100);
    });

    it('handles non-square elements correctly', () => {
      const offset = calculateCenterOffset(200, 800, 1000, 1000);

      expect(offset.x).toBe(400);
      expect(offset.y).toBe(100);
    });
  });

  describe('calculatePreviewScale', () => {
    it('calculates scale for smaller preview', () => {
      const scale = calculatePreviewScale(3000, 1000);
      expect(scale).toBeCloseTo(0.333, 3);
    });

    it('calculates scale for larger preview', () => {
      const scale = calculatePreviewScale(1000, 2000);
      expect(scale).toBe(2);
    });

    it('calculates 1:1 scale for equal dimensions', () => {
      const scale = calculatePreviewScale(1500, 1500);
      expect(scale).toBe(1);
    });
  });

  describe('getImageOrientation', () => {
    it('returns portrait for taller images', () => {
      const orientation = getImageOrientation(1200, 1600);
      expect(orientation).toBe('portrait');
    });

    it('returns landscape for wider images', () => {
      const orientation = getImageOrientation(1600, 1200);
      expect(orientation).toBe('landscape');
    });

    it('returns landscape for square images', () => {
      const orientation = getImageOrientation(1200, 1200);
      expect(orientation).toBe('landscape');
    });
  });

  describe('calculateAspectRatio', () => {
    it('calculates aspect ratio correctly', () => {
      const ratio = calculateAspectRatio(1600, 900);
      expect(ratio).toBeCloseTo(1.778, 3);
    });

    it('calculates aspect ratio for portrait image', () => {
      const ratio = calculateAspectRatio(900, 1600);
      expect(ratio).toBeCloseTo(0.5625, 4);
    });

    it('returns 1 for square images', () => {
      const ratio = calculateAspectRatio(1200, 1200);
      expect(ratio).toBe(1);
    });
  });
});

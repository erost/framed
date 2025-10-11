/**
 * Tests for application constants
 */

import { describe, it, expect } from 'vitest';
import {
  ASPECT_RATIOS,
  ORIENTATIONS,
  DEFAULT_CONFIG,
  IMAGE_CONSTRAINTS,
  FRAME_CONSTRAINTS,
  THEMES,
  PREVIEW_CONSTRAINTS,
} from '@/utils/constants';

describe('constants.js', () => {
  describe('ASPECT_RATIOS', () => {
    it('should contain all required aspect ratios', () => {
      expect(ASPECT_RATIOS).toHaveProperty('3:2');
      expect(ASPECT_RATIOS).toHaveProperty('4:3');
      expect(ASPECT_RATIOS).toHaveProperty('5:4');
      expect(ASPECT_RATIOS).toHaveProperty('16:9');
    });

    it('should have correct numeric values', () => {
      expect(ASPECT_RATIOS['3:2']).toBe(1.5);
      expect(ASPECT_RATIOS['4:3']).toBeCloseTo(1.333, 3);
      expect(ASPECT_RATIOS['5:4']).toBe(1.25);
      expect(ASPECT_RATIOS['16:9']).toBeCloseTo(1.778, 3);
    });
  });

  describe('ORIENTATIONS', () => {
    it('should contain portrait and landscape', () => {
      expect(ORIENTATIONS.PORTRAIT).toBe('portrait');
      expect(ORIENTATIONS.LANDSCAPE).toBe('landscape');
    });
  });

  describe('DEFAULT_CONFIG', () => {
    it('should have all required properties', () => {
      expect(DEFAULT_CONFIG).toHaveProperty('orientation');
      expect(DEFAULT_CONFIG).toHaveProperty('aspectRatio');
      expect(DEFAULT_CONFIG).toHaveProperty('backgroundColor');
      expect(DEFAULT_CONFIG).toHaveProperty('frameSize');
      expect(DEFAULT_CONFIG).toHaveProperty('spacing');
    });

    it('should have valid default values', () => {
      expect(DEFAULT_CONFIG.orientation).toBe('portrait');
      expect(DEFAULT_CONFIG.aspectRatio).toBe('3:2');
      expect(DEFAULT_CONFIG.backgroundColor).toBe('#FFFFFF');
      expect(DEFAULT_CONFIG.frameSize).toBe(3000);
      expect(DEFAULT_CONFIG.spacing).toBe(100);
    });
  });

  describe('IMAGE_CONSTRAINTS', () => {
    it('should have all constraint properties', () => {
      expect(IMAGE_CONSTRAINTS).toHaveProperty('maxFileSize');
      expect(IMAGE_CONSTRAINTS).toHaveProperty('minDimension');
      expect(IMAGE_CONSTRAINTS).toHaveProperty('supportedFormats');
      expect(IMAGE_CONSTRAINTS).toHaveProperty('aspectRatioTolerance');
    });

    it('should have reasonable constraint values', () => {
      expect(IMAGE_CONSTRAINTS.maxFileSize).toBe(40 * 1024 * 1024);
      expect(IMAGE_CONSTRAINTS.minDimension).toBe(800);
      expect(IMAGE_CONSTRAINTS.aspectRatioTolerance).toBe(0.05);
    });

    it('should support common image formats', () => {
      expect(IMAGE_CONSTRAINTS.supportedFormats).toContain('image/jpeg');
      expect(IMAGE_CONSTRAINTS.supportedFormats).toContain('image/png');
      expect(IMAGE_CONSTRAINTS.supportedFormats).toContain('image/webp');
    });
  });

  describe('FRAME_CONSTRAINTS', () => {
    it('should have size constraints', () => {
      expect(FRAME_CONSTRAINTS.minSize).toBe(800);
      expect(FRAME_CONSTRAINTS.maxSize).toBe(10000);
    });

    it('should have spacing constraints', () => {
      expect(FRAME_CONSTRAINTS.minSpacing).toBe(0);
      expect(FRAME_CONSTRAINTS.maxSpacing).toBe(500);
    });
  });

  describe('THEMES', () => {
    it('should contain light and dark themes', () => {
      expect(THEMES.LIGHT).toBe('light');
      expect(THEMES.DARK).toBe('dark');
    });
  });

  describe('PREVIEW_CONSTRAINTS', () => {
    it('should have default preview width', () => {
      expect(PREVIEW_CONSTRAINTS.defaultWidth).toBe(800);
    });

    it('should be a positive number', () => {
      expect(PREVIEW_CONSTRAINTS.defaultWidth).toBeGreaterThan(0);
    });
  });
});

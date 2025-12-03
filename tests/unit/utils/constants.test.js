/**
 * Tests for application constants
 */

import { describe, it, expect } from 'vitest';
import {
  ASPECT_RATIOS,
  ORIENTATIONS,
  COLOR_PRESETS,
  DEFAULT_CONFIG,
  IMAGE_CONSTRAINTS,
  FRAME_CONSTRAINTS,
  FRAME_SIZE_OPTIONS,
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
  });

  describe('ORIENTATIONS', () => {
    it('should contain portrait and landscape', () => {
      expect(ORIENTATIONS.PORTRAIT).toBe('portrait');
      expect(ORIENTATIONS.LANDSCAPE).toBe('landscape');
    });
  });

  describe('COLOR_PRESETS', () => {
    it('should contain white, black, and gray presets', () => {
      expect(COLOR_PRESETS.WHITE).toBe('#FFFFFF');
      expect(COLOR_PRESETS.BLACK).toBe('#000000');
      expect(COLOR_PRESETS.GRAY).toBe('#808080');
    });
  });

  describe('DEFAULT_CONFIG', () => {
    it('should have all required properties', () => {
      expect(DEFAULT_CONFIG).toHaveProperty('orientation');
      expect(DEFAULT_CONFIG).toHaveProperty('aspectRatio');
      expect(DEFAULT_CONFIG).toHaveProperty('backgroundColor');
      expect(DEFAULT_CONFIG).toHaveProperty('backgroundMode');
      expect(DEFAULT_CONFIG).toHaveProperty('frameSize');
      expect(DEFAULT_CONFIG).toHaveProperty('borderPercentage');
    });
  });

  describe('IMAGE_CONSTRAINTS', () => {
    it('should have all constraint properties', () => {
      expect(IMAGE_CONSTRAINTS).toHaveProperty('maxFileSize');
      expect(IMAGE_CONSTRAINTS).toHaveProperty('supportedFormats');
    });

    it('should have reasonable constraint values', () => {
      expect(IMAGE_CONSTRAINTS.maxFileSize).toBe(40 * 1024 * 1024);
    });

    it('should support common image formats', () => {
      expect(IMAGE_CONSTRAINTS.supportedFormats).toContain('image/jpeg');
      expect(IMAGE_CONSTRAINTS.supportedFormats).toContain('image/png');
      expect(IMAGE_CONSTRAINTS.supportedFormats).toContain('image/webp');
    });
  });

  describe('FRAME_SIZE_OPTIONS', () => {
    it('should have all frame size options', () => {
      expect(FRAME_SIZE_OPTIONS).toHaveLength(3);
    });

    it('should contain 1024px option', () => {
      const option = FRAME_SIZE_OPTIONS.find(opt => opt.value === 1024);
      expect(option).toBeDefined();
      expect(option.label).toBe('1024px');
    });

    it('should contain 2048px option', () => {
      const option = FRAME_SIZE_OPTIONS.find(opt => opt.value === 2048);
      expect(option).toBeDefined();
      expect(option.label).toBe('2048px');
    });

    it('should contain 4096px option', () => {
      const option = FRAME_SIZE_OPTIONS.find(opt => opt.value === 4096);
      expect(option).toBeDefined();
      expect(option.label).toBe('4096px');
    });

    it('should have label and value properties', () => {
      FRAME_SIZE_OPTIONS.forEach(option => {
        expect(option).toHaveProperty('label');
        expect(option).toHaveProperty('value');
        expect(typeof option.label).toBe('string');
        expect(typeof option.value).toBe('number');
      });
    });
  });

  describe('FRAME_CONSTRAINTS', () => {
    it('should have border percentage constraints', () => {
      expect(FRAME_CONSTRAINTS.minBorderPercentage).toBe(1);
      expect(FRAME_CONSTRAINTS.maxBorderPercentage).toBe(25);
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

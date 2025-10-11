/**
 * Tests for validation utilities
 */

import { describe, it, expect } from 'vitest';
import {
  validateFile,
  validateImageDimensions,
  validateFrameSize,
  validateSpacing,
} from '@/utils/validation';

describe('validation.js', () => {
  describe('validateFile', () => {
    it('returns error when file is null', () => {
      const result = validateFile(null);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('No file provided');
    });

    it('accepts valid JPEG file', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB

      const result = validateFile(file);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('accepts valid PNG file', () => {
      const file = new File([''], 'test.png', { type: 'image/png' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 });

      const result = validateFile(file);
      expect(result.valid).toBe(true);
    });

    it('accepts valid WebP file', () => {
      const file = new File([''], 'test.webp', { type: 'image/webp' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 });

      const result = validateFile(file);
      expect(result.valid).toBe(true);
    });

    it('rejects unsupported file format', () => {
      const file = new File([''], 'test.gif', { type: 'image/gif' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 });

      const result = validateFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Unsupported file format');
    });

    it('rejects file exceeding size limit', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 51 * 1024 * 1024 }); // 51MB

      const result = validateFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds');
    });

    it('accepts file at maximum size limit', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 40 * 1024 * 1024 }); // Exactly 40MB

      const result = validateFile(file);
      expect(result.valid).toBe(true);
    });
  });

  describe('validateImageDimensions', () => {
    it('validates dimensions above minimum', () => {
      const result = validateImageDimensions(1920, 1080);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('validates dimensions at minimum (landscape)', () => {
      const result = validateImageDimensions(1200, 800);
      expect(result.valid).toBe(true);
    });

    it('validates dimensions at minimum (portrait)', () => {
      const result = validateImageDimensions(800, 1200);
      expect(result.valid).toBe(true);
    });

    it('rejects dimensions below minimum (width)', () => {
      const result = validateImageDimensions(600, 1200);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at least 800px');
    });

    it('rejects dimensions below minimum (height)', () => {
      const result = validateImageDimensions(1200, 600);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at least 800px');
    });

    it('error message includes actual dimension', () => {
      const result = validateImageDimensions(1200, 600);
      expect(result.error).toContain('600px');
    });
  });

  describe('validateFrameSize', () => {
    it('validates size within range', () => {
      const result = validateFrameSize(3000);
      expect(result.valid).toBe(true);
    });

    it('validates minimum size', () => {
      const result = validateFrameSize(800);
      expect(result.valid).toBe(true);
    });

    it('validates maximum size', () => {
      const result = validateFrameSize(10000);
      expect(result.valid).toBe(true);
    });

    it('rejects size below minimum', () => {
      const result = validateFrameSize(700);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at least 800px');
    });

    it('rejects size above maximum', () => {
      const result = validateFrameSize(10001);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('not exceed 10000px');
    });

    it('accepts custom min and max values', () => {
      const result = validateFrameSize(1500, 1000, 2000);
      expect(result.valid).toBe(true);
    });

    it('validates against custom minimum', () => {
      const result = validateFrameSize(900, 1000, 2000);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('1000px');
    });
  });

  describe('validateSpacing', () => {
    it('validates spacing within range', () => {
      const result = validateSpacing(100);
      expect(result.valid).toBe(true);
    });

    it('validates minimum spacing', () => {
      const result = validateSpacing(0);
      expect(result.valid).toBe(true);
    });

    it('validates maximum spacing', () => {
      const result = validateSpacing(500);
      expect(result.valid).toBe(true);
    });

    it('rejects negative spacing', () => {
      const result = validateSpacing(-10);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at least 0px');
    });

    it('rejects spacing above maximum', () => {
      const result = validateSpacing(501);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('not exceed 500px');
    });

    it('accepts custom min and max values', () => {
      const result = validateSpacing(75, 50, 100);
      expect(result.valid).toBe(true);
    });
  });
});

/**
 * Tests for validation utilities
 */

import { describe, it, expect } from 'vitest';
import {
  validateFile,
  extractValidFilenameChars,
  generateUuidV1Short,
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

  describe('extractValidFilenameChars', () => {
    it('extracts alphanumeric characters from filename', () => {
      const result = extractValidFilenameChars('my-photo-2024.jpg');
      expect(result).toBe('my-photo-2');
    });

    it('removes file extension', () => {
      const result = extractValidFilenameChars('image.png');
      expect(result).toBe('image');
    });

    it('limits to 10 characters', () => {
      const result = extractValidFilenameChars('verylongfilename.jpg');
      expect(result).toBe('verylongfi');
    });

    it('preserves spaces, underscores, dashes, and commas', () => {
      const result = extractValidFilenameChars('photo_01, test-name.jpg');
      expect(result).toBe('photo_01, ');
    });

    it('removes invalid special characters', () => {
      const result = extractValidFilenameChars('photo@#$%test.jpg');
      expect(result).toBe('phototest');
    });

    it('handles filename without extension', () => {
      const result = extractValidFilenameChars('myimage');
      expect(result).toBe('myimage');
    });

    it('returns empty string for null or undefined', () => {
      expect(extractValidFilenameChars(null)).toBe('');
      expect(extractValidFilenameChars(undefined)).toBe('');
      expect(extractValidFilenameChars('')).toBe('');
    });

    it('returns empty string when only invalid characters', () => {
      const result = extractValidFilenameChars('@#$%^&*.jpg');
      expect(result).toBe('');
    });

    it('handles multiple extensions correctly', () => {
      const result = extractValidFilenameChars('archive.tar.gz');
      expect(result).toBe('archivetar');
    });

    it('handles short filenames (min 1 char)', () => {
      const result = extractValidFilenameChars('a.jpg');
      expect(result).toBe('a');
    });
  });

  describe('generateUuidV1Short', () => {
    it('generates 8-character string', () => {
      const uuid = generateUuidV1Short();
      expect(uuid).toHaveLength(8);
    });

    it('generates hexadecimal characters only', () => {
      const uuid = generateUuidV1Short();
      expect(uuid).toMatch(/^[0-9a-f]{8}$/);
    });
  });
});

/**
 * Tests for useImageState composable
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useImageState } from '@/composables/useImageState.js';

// Mock File API
class MockFile {
  constructor(content, filename, options = {}) {
    this.content = content;
    this.name = filename;
    this.type = options.type || 'image/jpeg';
    this.size = options.size || 1024;
  }
}

// Mock FileReader
class MockFileReader {
  readAsDataURL() {
    // Simulate async file reading
    setTimeout(() => {
      if (this.onload) {
        this.onload({
          target: {
            result: 'data:image/jpeg;base64,fake-image-data'
          }
        });
      }
    }, 0);
  }
}

// Mock Image
class MockImage {
  constructor() {
    this.width = 1920;
    this.height = 1080;
  }

  set src(value) {
    // Simulate image loading
    setTimeout(() => {
      if (this.onload) {
        this.onload();
      }
    }, 0);
  }
}

// Set up global mocks
global.FileReader = MockFileReader;
global.Image = MockImage;

describe('useImageState', () => {
  let imageState;

  beforeEach(() => {
    imageState = useImageState();
    // Clear any existing images from previous tests (singleton state)
    imageState.clearImages();
  });

  describe('Initial State', () => {
    it('should initialize with empty images array', () => {
      expect(imageState.images.value).toEqual([null, null]);
    });
  });

  describe('addImage', () => {
    it('should add image at position 0', async () => {
      const file = new MockFile([], 'test.jpg', { type: 'image/jpeg' });

      await imageState.addImage(file, 0);

      expect(imageState.images.value[0]).toBeTruthy();
      expect(imageState.images.value[0].file.name).toBe('test.jpg');
    });

    it('should add image at position 1', async () => {
      const file = new MockFile([], 'test.jpg', { type: 'image/jpeg' });

      await imageState.addImage(file, 1);

      expect(imageState.images.value[1]).toBeTruthy();
      expect(imageState.images.value[1].file.name).toBe('test.jpg');
    });

    it('should extract image metadata', async () => {
      const file = new MockFile([], 'test.jpg', { type: 'image/jpeg' });

      await imageState.addImage(file, 0);

      const image = imageState.images.value[0];
      expect(image.width).toBe(1920);
      expect(image.height).toBe(1080);
      expect(image.orientation).toBe('landscape');
      expect(image.aspectRatio).toBeCloseTo(1.778, 2);
      expect(image.dataUrl).toBe('data:image/jpeg;base64,fake-image-data');
    });

    it('should generate unique ID for each image', async () => {
      const file1 = new MockFile([], 'test1.jpg', { type: 'image/jpeg' });
      const file2 = new MockFile([], 'test2.jpg', { type: 'image/jpeg' });

      await imageState.addImage(file1, 0);
      await imageState.addImage(file2, 1);

      const id1 = imageState.images.value[0].id;
      const id2 = imageState.images.value[1].id;

      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^image-0-\d+$/);
      expect(id2).toMatch(/^image-1-\d+$/);
    });

    it('should replace existing image at same position', async () => {
      const file1 = new MockFile([], 'test1.jpg', { type: 'image/jpeg' });
      const file2 = new MockFile([], 'test2.jpg', { type: 'image/jpeg' });

      await imageState.addImage(file1, 0);
      const firstId = imageState.images.value[0].id;

      await imageState.addImage(file2, 0);
      const secondId = imageState.images.value[0].id;

      expect(firstId).not.toBe(secondId);
      expect(imageState.images.value[0].file.name).toBe('test2.jpg');
    });

    it('should reject invalid position', async () => {
      const file = new MockFile([], 'test.jpg', { type: 'image/jpeg' });

      await expect(imageState.addImage(file, 2)).rejects.toThrow(
        'Position must be 0 or 1'
      );
      await expect(imageState.addImage(file, -1)).rejects.toThrow(
        'Position must be 0 or 1'
      );
    });

    it('should reject invalid file type', async () => {
      const file = new MockFile([], 'test.txt', { type: 'text/plain' });

      await expect(imageState.addImage(file, 0)).rejects.toThrow(
        'Unsupported file format'
      );
    });

    it('should reject file exceeding size limit', async () => {
      const file = new MockFile([], 'large.jpg', {
        type: 'image/jpeg',
        size: 51 * 1024 * 1024, // 51MB
      });

      await expect(imageState.addImage(file, 0)).rejects.toThrow(
        'File size exceeds'
      );
    });

    it('should handle portrait orientation correctly', async () => {
      // Mock portrait image
      global.Image = class PortraitImage {
        constructor() {
          this.width = 1080;
          this.height = 1920;
        }
        set src(value) {
          setTimeout(() => this.onload && this.onload(), 0);
        }
      };

      const file = new MockFile([], 'portrait.jpg', { type: 'image/jpeg' });

      await imageState.addImage(file, 0);

      const image = imageState.images.value[0];
      expect(image.orientation).toBe('portrait');
      expect(image.aspectRatio).toBeCloseTo(0.5625, 4);

      // Restore original mock
      global.Image = MockImage;
    });
  });

  describe('removeImage', () => {
    it('should remove image at position 0', async () => {
      const file = new MockFile([], 'test.jpg', { type: 'image/jpeg' });
      await imageState.addImage(file, 0);

      imageState.removeImage(0);

      expect(imageState.images.value[0]).toBeNull();
    });

    it('should remove image at position 1', async () => {
      const file = new MockFile([], 'test.jpg', { type: 'image/jpeg' });
      await imageState.addImage(file, 1);

      imageState.removeImage(1);

      expect(imageState.images.value[1]).toBeNull();
    });

    it('should not affect other position when removing', async () => {
      const file1 = new MockFile([], 'test1.jpg', { type: 'image/jpeg' });
      const file2 = new MockFile([], 'test2.jpg', { type: 'image/jpeg' });

      await imageState.addImage(file1, 0);
      await imageState.addImage(file2, 1);

      imageState.removeImage(0);

      expect(imageState.images.value[0]).toBeNull();
      expect(imageState.images.value[1]).toBeTruthy();
    });

    it('should handle removing already empty position', () => {
      imageState.removeImage(0);
      expect(imageState.images.value[0]).toBeNull();
    });

    it('should ignore invalid positions', () => {
      imageState.removeImage(2);
      imageState.removeImage(-1);
      expect(imageState.images.value).toEqual([null, null]);
    });
  });

  describe('clearImages', () => {
    it('should remove all images', async () => {
      const file1 = new MockFile([], 'test1.jpg', { type: 'image/jpeg' });
      const file2 = new MockFile([], 'test2.jpg', { type: 'image/jpeg' });

      await imageState.addImage(file1, 0);
      await imageState.addImage(file2, 1);

      imageState.clearImages();

      expect(imageState.images.value).toEqual([null, null]);
    });

    it('should work when images are already empty', () => {
      imageState.clearImages();
      expect(imageState.images.value).toEqual([null, null]);
    });
  });


  describe('Error Handling', () => {
    it('should handle FileReader error', async () => {
      global.FileReader = class ErrorFileReader {
        readAsDataURL() {
          setTimeout(() => this.onerror && this.onerror(), 0);
        }
      };

      const file = new MockFile([], 'test.jpg', { type: 'image/jpeg' });

      await expect(imageState.addImage(file, 0)).rejects.toThrow(
        'Failed to read file'
      );

      global.FileReader = MockFileReader;
    });

    it('should handle Image loading error', async () => {
      global.Image = class ErrorImage {
        set src(value) {
          setTimeout(() => this.onerror && this.onerror(), 0);
        }
      };

      const file = new MockFile([], 'test.jpg', { type: 'image/jpeg' });

      await expect(imageState.addImage(file, 0)).rejects.toThrow(
        'Failed to load image'
      );

      global.Image = MockImage;
    });
  });
});

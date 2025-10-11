/**
 * Tests for useCanvasRenderer composable
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ref } from 'vue';
import { useCanvasRenderer } from '@/composables/useCanvasRenderer.js';
import * as useFrameConfigModule from '@/composables/useFrameConfig.js';
import * as useImageStateModule from '@/composables/useImageState.js';

describe('useCanvasRenderer', () => {
  let mockFrameConfig;
  let mockImageState;

  beforeEach(() => {
    // Create mock values
    mockFrameConfig = {
      orientation: ref('portrait'),
      aspectRatio: ref('3:2'),
      backgroundColor: ref('#FFFFFF'),
      frameWidth: ref(3000),
      frameHeight: ref(4500), // Portrait 3:2 = 3000 * 1.5
      spacing: ref(100),
    };

    mockImageState = {
      images: ref([null, null]),
    };

    // Mock the composables
    vi.spyOn(useFrameConfigModule, 'useFrameConfig').mockReturnValue(mockFrameConfig);
    vi.spyOn(useImageStateModule, 'useImageState').mockReturnValue(mockImageState);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with default preview width', () => {
      const renderer = useCanvasRenderer();

      expect(renderer.previewScale).toBeDefined();
      expect(renderer.stageConfig).toBeDefined();
      expect(renderer.backgroundConfig).toBeDefined();
    });

    it('should initialize with custom preview width', () => {
      const renderer = useCanvasRenderer({ previewWidth: ref(1200) });

      // Scale should be 1200 / 3000 = 0.4
      expect(renderer.previewScale.value).toBe(0.4);
    });

    it('should not be ready without images', () => {
      const renderer = useCanvasRenderer();

      expect(renderer.isReady.value).toBe(false);
      expect(renderer.canExport.value).toBe(false);
    });
  });

  describe('Preview Scale Calculation', () => {
    it('should calculate correct preview scale', () => {
      const renderer = useCanvasRenderer({ previewWidth: ref(800) });

      // 800 / 3000 = 0.2666...
      expect(renderer.previewScale.value).toBeCloseTo(0.2667, 3);
    });

    it('should update scale when frame width changes', () => {
      const renderer = useCanvasRenderer({ previewWidth: ref(800) });

      expect(renderer.previewScale.value).toBeCloseTo(0.2667, 3);

      // Change frame width
      mockFrameConfig.frameWidth.value = 4000;

      // New scale: 800 / 4000 = 0.2
      expect(renderer.previewScale.value).toBe(0.2);
    });

    it('should support reactive previewWidth ref', () => {
      const previewWidth = ref(800);
      const renderer = useCanvasRenderer({ previewWidth });

      // Initial scale: 800 / 3000
      expect(renderer.previewScale.value).toBeCloseTo(0.2667, 3);

      // Change preview width
      previewWidth.value = 400;

      // New scale: 400 / 3000
      expect(renderer.previewScale.value).toBeCloseTo(0.1333, 3);
    });

    it('should update canvas dimensions when reactive previewWidth changes', () => {
      const previewWidth = ref(800);
      const renderer = useCanvasRenderer({ previewWidth });

      // Initial dimensions
      expect(renderer.previewDimensions.value.width).toBe(800);

      // Change preview width (simulating window resize)
      previewWidth.value = 600;

      // Dimensions should update
      expect(renderer.previewDimensions.value.width).toBe(600);
      expect(renderer.previewDimensions.value.height).toBeCloseTo(4500 * (600 / 3000), 1);
    });

    it('should respect max width of 800px in responsive container', () => {
      const previewWidth = ref(1200); // Larger than max
      const renderer = useCanvasRenderer({ previewWidth });

      // Even with large previewWidth, container logic should cap it
      // This test verifies the composable accepts the value correctly
      expect(renderer.previewScale.value).toBe(1200 / 3000);

      // When container caps it to 800
      previewWidth.value = 800;
      expect(renderer.previewDimensions.value.width).toBe(800);
    });
  });

  describe('Preview Dimensions', () => {
    it('should calculate correct preview dimensions', () => {
      const renderer = useCanvasRenderer({ previewWidth: ref(800) });

      const scale = 800 / 3000;
      expect(renderer.previewDimensions.value.width).toBe(800);
      expect(renderer.previewDimensions.value.height).toBeCloseTo(4500 * scale, 1);
    });

    it('should update dimensions when frame size changes', () => {
      const renderer = useCanvasRenderer({ previewWidth: ref(800) });

      mockFrameConfig.frameWidth.value = 4000;
      mockFrameConfig.frameHeight.value = 5000;

      const scale = 800 / 4000;
      expect(renderer.previewDimensions.value.width).toBe(800);
      expect(renderer.previewDimensions.value.height).toBe(5000 * scale);
    });
  });

  describe('Stage Configuration', () => {
    it('should generate correct stage config with preview dimensions', () => {
      const renderer = useCanvasRenderer({ previewWidth: ref(800) });

      const config = renderer.stageConfig.value;
      expect(config).toHaveProperty('width');
      expect(config).toHaveProperty('height');

      // Stage should use preview dimensions (not full frame dimensions)
      expect(config.width).toBe(800);
      const expectedHeight = 4500 * (800 / 3000);
      expect(config.height).toBeCloseTo(expectedHeight, 1);

      // Stage should NOT have scale properties (using actual dimensions instead)
      expect(config.scale).toBeUndefined();
      expect(config.scaleX).toBeUndefined();
      expect(config.scaleY).toBeUndefined();
    });

    it('should update dimensions when previewWidth changes', () => {
      const previewWidth = ref(800);
      const renderer = useCanvasRenderer({ previewWidth });

      expect(renderer.stageConfig.value.width).toBe(800);

      // Change preview width (simulating window resize)
      previewWidth.value = 600;

      expect(renderer.stageConfig.value.width).toBe(600);
      const expectedHeight = 4500 * (600 / 3000);
      expect(renderer.stageConfig.value.height).toBeCloseTo(expectedHeight, 1);
    });
  });

  describe('Background Configuration', () => {
    it('should generate correct background config with preview dimensions', () => {
      const renderer = useCanvasRenderer({ previewWidth: ref(800) });

      const config = renderer.backgroundConfig.value;
      expect(config.x).toBe(0);
      expect(config.y).toBe(0);
      // Background should use preview dimensions (not full frame dimensions)
      expect(config.width).toBe(800);
      const expectedHeight = 4500 * (800 / 3000);
      expect(config.height).toBeCloseTo(expectedHeight, 1);
      expect(config.fill).toBe('#FFFFFF');
    });

    it('should update background when color changes', () => {
      const renderer = useCanvasRenderer();

      expect(renderer.backgroundConfig.value.fill).toBe('#FFFFFF');

      mockFrameConfig.backgroundColor.value = '#000000';

      expect(renderer.backgroundConfig.value.fill).toBe('#000000');
    });
  });


  describe('Image Layout', () => {
    it('should calculate layout for portrait orientation', () => {
      mockFrameConfig.orientation.value = 'portrait';
      const renderer = useCanvasRenderer();

      const layout = renderer.imageLayout.value;
      expect(layout).toHaveProperty('image1');
      expect(layout).toHaveProperty('image2');

      // Portrait stacks vertically
      expect(layout.image1.y).toBeLessThan(layout.image2.y);
      expect(layout.image1.x).toBe(layout.image2.x);
    });

    it('should calculate layout for landscape orientation', () => {
      mockFrameConfig.orientation.value = 'landscape';
      mockFrameConfig.frameHeight.value = 2000; // Landscape
      const renderer = useCanvasRenderer();

      const layout = renderer.imageLayout.value;

      // Landscape stacks horizontally
      expect(layout.image1.x).toBeLessThan(layout.image2.x);
      expect(layout.image1.y).toBe(layout.image2.y);
    });

    it('should update layout when orientation changes', () => {
      const renderer = useCanvasRenderer();

      mockFrameConfig.orientation.value = 'portrait';
      const portraitLayout = renderer.imageLayout.value;

      mockFrameConfig.orientation.value = 'landscape';
      mockFrameConfig.frameWidth.value = 4500;  // Make it wider for landscape
      mockFrameConfig.frameHeight.value = 3000;
      const landscapeLayout = renderer.imageLayout.value;

      // Layouts should be different
      expect(portraitLayout).not.toEqual(landscapeLayout);
    });
  });

  describe('Image Configuration - No Images', () => {
    it('should return null configs when no images', () => {
      const renderer = useCanvasRenderer();

      expect(renderer.image1Config.value).toBeNull();
      expect(renderer.image2Config.value).toBeNull();
    });

    it('should return null for missing first image', () => {
      mockImageState.images.value[1] = {
        width: 1800,
        height: 1200,
        orientation: 'landscape',
      };

      const renderer = useCanvasRenderer();

      expect(renderer.image1Config.value).toBeNull();
      expect(renderer.image2Config.value).not.toBeNull();
    });
  });

  describe('Image Configuration - With Images', () => {
    beforeEach(() => {
      mockImageState.images.value[0] = {
        id: 'image-1',
        width: 1800,
        height: 1200,
        orientation: 'landscape',
        aspectRatio: 1.5,
      };
      mockImageState.images.value[1] = {
        id: 'image-2',
        width: 1800,
        height: 1200,
        orientation: 'landscape',
        aspectRatio: 1.5,
      };
    });

    it('should generate image configs when both images present', () => {
      const renderer = useCanvasRenderer();

      expect(renderer.image1Config.value).not.toBeNull();
      expect(renderer.image2Config.value).not.toBeNull();
    });

    it('should include position and dimensions in image config', () => {
      const renderer = useCanvasRenderer();

      const config = renderer.image1Config.value;
      expect(config).toHaveProperty('x');
      expect(config).toHaveProperty('y');
      expect(config).toHaveProperty('width');
      expect(config).toHaveProperty('height');
      expect(config.image).toBeNull(); // Set by component
    });

    it('should use preview-scaled coordinates', () => {
      const renderer = useCanvasRenderer({ previewWidth: ref(800) });

      const layout = renderer.imageLayout.value;
      const config = renderer.image1Config.value;
      const scale = 800 / 3000;

      // Coordinates should be scaled from layout coordinates
      // The config coordinates should be layout coords * scale
      expect(config.x).toBeGreaterThanOrEqual(layout.image1.x * scale);
      expect(config.y).toBeGreaterThanOrEqual(layout.image1.y * scale);
      expect(config.x).toBeLessThanOrEqual((layout.image1.x + layout.image1.width) * scale);
      expect(config.y).toBeLessThanOrEqual((layout.image1.y + layout.image1.height) * scale);
    });

    it('should update image configs when images change', () => {
      const renderer = useCanvasRenderer();

      const firstWidth = renderer.image1Config.value.width;

      // Change image to different aspect ratio
      mockImageState.images.value[0] = {
        id: 'image-1-new',
        width: 1200, // Different aspect ratio (portrait)
        height: 1600,
        orientation: 'portrait',
        aspectRatio: 0.75,
      };

      const newWidth = renderer.image1Config.value.width;

      // Width should be different due to different aspect ratio
      expect(newWidth).not.toBe(firstWidth);
    });
  });

  describe('isReady State', () => {
    it('should not be ready with no images', () => {
      const renderer = useCanvasRenderer();

      expect(renderer.isReady.value).toBe(false);
    });

    it('should not be ready with only one image', () => {
      mockImageState.images.value[0] = { width: 1800, height: 1200 };
      const renderer = useCanvasRenderer();

      expect(renderer.isReady.value).toBe(false);
    });

    it('should be ready with both images', () => {
      mockImageState.images.value[0] = { width: 1800, height: 1200 };
      mockImageState.images.value[1] = { width: 1800, height: 1200 };
      const renderer = useCanvasRenderer();

      expect(renderer.isReady.value).toBe(true);
    });

    it('should update reactively when images change', () => {
      const renderer = useCanvasRenderer();

      expect(renderer.isReady.value).toBe(false);

      mockImageState.images.value[0] = { width: 1800, height: 1200 };
      mockImageState.images.value[1] = { width: 1800, height: 1200 };

      expect(renderer.isReady.value).toBe(true);

      mockImageState.images.value[0] = null;

      expect(renderer.isReady.value).toBe(false);
    });
  });

  describe('canExport State', () => {
    it('should match isReady state', () => {
      const renderer = useCanvasRenderer();

      expect(renderer.canExport.value).toBe(renderer.isReady.value);

      mockImageState.images.value[0] = { width: 1800, height: 1200 };
      mockImageState.images.value[1] = { width: 1800, height: 1200 };

      expect(renderer.canExport.value).toBe(renderer.isReady.value);
      expect(renderer.canExport.value).toBe(true);
    });
  });

  describe('Download Image', () => {
    let mockStage;
    let mockLink;

    beforeEach(() => {
      // Mock Konva stage
      mockStage = {
        toDataURL: vi.fn(() => 'data:image/png;base64,mock'),
      };

      // Mock DOM createElement and appendChild
      mockLink = {
        download: '',
        href: '',
        click: vi.fn(),
      };

      vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
      vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
      vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});
    });

    it('should throw error if no stage provided', () => {
      const renderer = useCanvasRenderer();

      expect(() => renderer.downloadImage(null)).toThrow(
        'Stage instance is required for download'
      );
    });

    it('should download PNG by default', () => {
      const renderer = useCanvasRenderer({ previewWidth: ref(800) });

      renderer.downloadImage(mockStage);

      // PixelRatio = frameWidth / previewWidth = 3000 / 800 = 3.75
      expect(mockStage.toDataURL).toHaveBeenCalledWith({
        mimeType: 'image/png',
        quality: 0.95,
        pixelRatio: 3.75,
      });
      expect(mockLink.download).toBe('frame.png');
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('should download JPEG with custom filename', () => {
      const renderer = useCanvasRenderer({ previewWidth: ref(800) });

      renderer.downloadImage(mockStage, 'custom.jpg', 'jpeg');

      expect(mockStage.toDataURL).toHaveBeenCalledWith({
        mimeType: 'image/jpeg',
        quality: 0.95,
        pixelRatio: 3.75,
      });
      expect(mockLink.download).toBe('custom.jpg');
    });

    it('should use custom quality', () => {
      const renderer = useCanvasRenderer({ previewWidth: ref(800) });

      renderer.downloadImage(mockStage, 'test.jpg', 'jpeg', 0.8);

      expect(mockStage.toDataURL).toHaveBeenCalledWith({
        mimeType: 'image/jpeg',
        quality: 0.8,
        pixelRatio: 3.75,
      });
    });

    it('should calculate correct pixelRatio regardless of preview size', () => {
      // Test at different preview widths - output should always be same resolution
      const previewWidth = ref(800);
      const renderer = useCanvasRenderer({ previewWidth });

      // Stage width should be 800 (matching previewWidth)
      expect(renderer.stageConfig.value.width).toBe(800);

      renderer.downloadImage(mockStage);
      expect(mockStage.toDataURL).toHaveBeenCalledWith({
        mimeType: 'image/png',
        quality: 0.95,
        pixelRatio: 3000 / 800, // frameWidth / stageWidth = 3.75
      });

      // Change preview width (simulate window resize)
      previewWidth.value = 400;
      expect(renderer.stageConfig.value.width).toBe(400);
      mockStage.toDataURL.mockClear();

      renderer.downloadImage(mockStage);
      expect(mockStage.toDataURL).toHaveBeenCalledWith({
        mimeType: 'image/png',
        quality: 0.95,
        pixelRatio: 3000 / 400, // frameWidth / stageWidth = 7.5
      });

      // Change to larger preview
      previewWidth.value = 600;
      expect(renderer.stageConfig.value.width).toBe(600);
      mockStage.toDataURL.mockClear();

      renderer.downloadImage(mockStage);
      expect(mockStage.toDataURL).toHaveBeenCalledWith({
        mimeType: 'image/png',
        quality: 0.95,
        pixelRatio: 3000 / 600, // frameWidth / stageWidth = 5.0
      });

      // All three exports produce same 3000px wide image despite different preview sizes
      // Because: outputWidth = stageWidth * pixelRatio = 800 * 3.75 = 400 * 7.5 = 600 * 5.0 = 3000
    });

    it('should handle download errors', () => {
      mockStage.toDataURL.mockImplementation(() => {
        throw new Error('Canvas error');
      });

      const renderer = useCanvasRenderer();

      expect(() => renderer.downloadImage(mockStage)).toThrow(
        'Failed to download image'
      );
    });

    it('should clean up DOM elements after download', () => {
      const renderer = useCanvasRenderer();

      renderer.downloadImage(mockStage);

      expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
      expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
    });
  });


  describe('Responsive Canvas Pattern', () => {
    beforeEach(() => {
      mockImageState.images.value[0] = {
        width: 1800,
        height: 1200,
        orientation: 'landscape',
      };
      mockImageState.images.value[1] = {
        width: 1800,
        height: 1200,
        orientation: 'landscape',
      };
    });

    it('should use preview dimensions that scale responsively', () => {
      const previewWidth = ref(800);
      const renderer = useCanvasRenderer({ previewWidth });

      // Stage should use preview dimensions
      expect(renderer.stageConfig.value.width).toBe(800);
      const expectedHeight = 4500 * (800 / 3000);
      expect(renderer.stageConfig.value.height).toBeCloseTo(expectedHeight, 1);

      // All elements should use preview-scaled coordinates
      expect(renderer.backgroundConfig.value.width).toBe(800);
      const scale = 800 / 3000;
      expect(renderer.image1Config.value.x).toBeGreaterThanOrEqual(100 * scale); // Scaled coords

      // Simulate window resize
      previewWidth.value = 600;

      // Stage dimensions should update to new preview size
      expect(renderer.stageConfig.value.width).toBe(600);
      const newExpectedHeight = 4500 * (600 / 3000);
      expect(renderer.stageConfig.value.height).toBeCloseTo(newExpectedHeight, 1);

      // Element dimensions should update proportionally
      expect(renderer.backgroundConfig.value.width).toBe(600);
      const newScale = 600 / 3000;
      expect(renderer.image1Config.value.x).toBeGreaterThanOrEqual(100 * newScale);
    });

    it('should maintain aspect ratio during responsive scaling', () => {
      const previewWidth = ref(800);
      const renderer = useCanvasRenderer({ previewWidth });

      const width = renderer.stageConfig.value.width;
      const height = renderer.stageConfig.value.height;
      const aspectRatio = width / height;

      // Aspect ratio should match frame aspect ratio
      const frameAspectRatio = mockFrameConfig.frameWidth.value / mockFrameConfig.frameHeight.value;
      expect(aspectRatio).toBeCloseTo(frameAspectRatio, 4);

      // Change preview width
      previewWidth.value = 400;

      const newWidth = renderer.stageConfig.value.width;
      const newHeight = renderer.stageConfig.value.height;
      const newAspectRatio = newWidth / newHeight;

      // Aspect ratio should be maintained
      expect(newAspectRatio).toBeCloseTo(frameAspectRatio, 4);
    });
  });

  describe('Reactive Updates', () => {
    beforeEach(() => {
      mockImageState.images.value[0] = {
        width: 1800,
        height: 1200,
        orientation: 'landscape',
      };
      mockImageState.images.value[1] = {
        width: 1800,
        height: 1200,
        orientation: 'landscape',
      };
    });

    it('should update all configs when orientation changes', () => {
      const renderer = useCanvasRenderer();

      const initialLayout = renderer.imageLayout.value;

      mockFrameConfig.orientation.value = 'landscape';
      mockFrameConfig.frameHeight.value = 2000;

      const newLayout = renderer.imageLayout.value;

      expect(newLayout).not.toEqual(initialLayout);
    });

    it('should update configs when frame dimensions change', () => {
      const renderer = useCanvasRenderer({ previewWidth: ref(800) });

      const initialHeight = renderer.stageConfig.value.height;

      mockFrameConfig.frameWidth.value = 4000;
      mockFrameConfig.frameHeight.value = 5000;

      const newHeight = renderer.stageConfig.value.height;

      // Height should be different
      expect(newHeight).not.toBe(initialHeight);
    });

    it('should update background when color changes', () => {
      const renderer = useCanvasRenderer();

      expect(renderer.backgroundConfig.value.fill).toBe('#FFFFFF');

      mockFrameConfig.backgroundColor.value = '#FF0000';

      expect(renderer.backgroundConfig.value.fill).toBe('#FF0000');
    });
  });
});

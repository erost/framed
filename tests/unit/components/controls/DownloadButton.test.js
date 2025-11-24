import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import DownloadButton from '@/components/controls/DownloadButton.vue';
import { useFrameConfig } from '@/composables/useFrameConfig';
import { useImageState } from '@/composables/useImageState';

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
global.File = MockFile;

describe('DownloadButton', () => {
  let frameConfig;
  let imageState;
  let mockStage;

  beforeEach(() => {
    frameConfig = useFrameConfig();
    imageState = useImageState();
    frameConfig.reset();
    imageState.clearImages();

    // Mock Konva stage
    mockStage = {
      toDataURL: vi.fn(() => 'data:image/png;base64,mock'),
      toBlob: vi.fn((callback) => {
        callback(new Blob(['mock'], { type: 'image/png' }));
      }),
    };
  });


  describe('Disabled State', () => {
    it('is disabled when no images uploaded', () => {
      const wrapper = mount(DownloadButton, {
        props: { previewWidth: 800 },
      });

      const button = wrapper.find('button');
      expect(button.attributes('disabled')).toBe('');
    });

    it('is enabled when images uploaded', async () => {
      const file1 = new File([''], 'test1.jpg', { type: 'image/jpeg' });
      const file2 = new File([''], 'test2.jpg', { type: 'image/jpeg' });

      await imageState.addImage(file1, 0);
      await imageState.addImage(file2, 1);

      const wrapper = mount(DownloadButton, {
        props: { stage: mockStage, previewWidth: 800 },
      });

      await wrapper.vm.$nextTick();

      const button = wrapper.find('button');
      expect(button.attributes('disabled')).toBeUndefined();
    });

  });

  describe('Props', () => {
    it('accepts custom filename', async () => {
      const file1 = new File([''], 'test1.jpg', { type: 'image/jpeg' });
      const file2 = new File([''], 'test2.jpg', { type: 'image/jpeg' });

      await imageState.addImage(file1, 0);
      await imageState.addImage(file2, 1);

      const wrapper = mount(DownloadButton, {
        props: {
          stage: mockStage,
          filename: 'my-custom-frame',
          previewWidth: 800,
        },
      });

      await wrapper.vm.$nextTick();

      const button = wrapper.find('button');
      await button.trigger('click');

      await new Promise((resolve) => setTimeout(resolve, 10));
    });
  });

});

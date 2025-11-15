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

  describe('Rendering', () => {
    it('renders download button', () => {
      const wrapper = mount(DownloadButton, {
        props: { previewWidth: 800 },
      });

      expect(wrapper.find('button').exists()).toBe(true);
    });

    it('displays download text', () => {
      const wrapper = mount(DownloadButton, {
        props: { previewWidth: 800 },
      });

      expect(wrapper.text()).toContain('Download');
    });

    it('displays download icon when not loading', () => {
      const wrapper = mount(DownloadButton, {
        props: { previewWidth: 800 },
      });

      expect(wrapper.find('svg').exists()).toBe(true);
    });
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

    it('shows "Download" text even when disabled', () => {
      const wrapper = mount(DownloadButton, {
        props: { previewWidth: 800 },
      });

      expect(wrapper.text()).toContain('Download');
    });
  });

  describe('Button Text', () => {
    it('always shows "Download" text', async () => {
      const file1 = new File([''], 'test1.jpg', { type: 'image/jpeg' });
      const file2 = new File([''], 'test2.jpg', { type: 'image/jpeg' });

      await imageState.addImage(file1, 0);
      await imageState.addImage(file2, 1);

      const wrapper = mount(DownloadButton, {
        props: { stage: mockStage, previewWidth: 800 },
      });

      await wrapper.vm.$nextTick();

      expect(wrapper.text()).toContain('Download');
    });

    it('shows "Download" even when no images uploaded', () => {
      const wrapper = mount(DownloadButton, {
        props: { previewWidth: 800 },
      });

      expect(wrapper.text()).toContain('Download');
    });
  });

  describe('Loading State', () => {
    it('shows "Download" text after clicking', async () => {
      const file1 = new File([''], 'test1.jpg', { type: 'image/jpeg' });
      const file2 = new File([''], 'test2.jpg', { type: 'image/jpeg' });

      await imageState.addImage(file1, 0);
      await imageState.addImage(file2, 1);

      const wrapper = mount(DownloadButton, {
        props: { stage: mockStage, previewWidth: 800 },
      });

      await wrapper.vm.$nextTick();

      const button = wrapper.find('button');
      await button.trigger('click');

      expect(wrapper.text()).toContain('Download');
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

  describe('Accessibility', () => {
    it('has custom test ID', () => {
      const wrapper = mount(DownloadButton, {
        props: { testId: 'custom-download', previewWidth: 800, },
      });

      expect(wrapper.attributes('data-testid')).toBe('custom-download');
    });

    it('icon is hidden from screen readers', () => {
      const wrapper = mount(DownloadButton, {
        props: { previewWidth: 800 },
      });

      const svg = wrapper.find('svg');
      if (svg.exists()) {
        expect(svg.attributes('aria-hidden')).toBe('true');
      }
    });

    it('has aria-busy attribute', async () => {
      const file1 = new File([''], 'test1.jpg', { type: 'image/jpeg' });
      const file2 = new File([''], 'test2.jpg', { type: 'image/jpeg' });

      await imageState.addImage(file1, 0);
      await imageState.addImage(file2, 1);

      const wrapper = mount(DownloadButton, {
        props: { stage: mockStage, previewWidth: 800 },
      });

      await wrapper.vm.$nextTick();

      const button = wrapper.find('button');

      // Button should have aria-busy attribute (defaults to false when not loading)
      expect(button.attributes('aria-busy')).toBeDefined();
    });
  });
});

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ResetButton from '@/components/controls/ResetButton.vue';
import { useFrameConfig } from '@/composables/useFrameConfig';
import { useImageState } from '@/composables/useImageState';

// Mock FileReader for image loading
class MockFileReader {
  readAsDataURL() {
    setTimeout(() => {
      if (this.onload) {
        this.onload({
          target: {
            result: 'data:image/jpeg;base64,fake-image-data',
          },
        });
      }
    }, 0);
  }
}

// Mock Image for dimensions
class MockImage {
  constructor() {
    this.width = 1920;
    this.height = 1080;
  }

  set src(value) {
    setTimeout(() => {
      if (this.onload) {
        this.onload();
      }
    }, 0);
  }
}

global.FileReader = MockFileReader;
global.Image = MockImage;

describe('ResetButton', () => {
  let frameConfig;
  let imageState;

  beforeEach(() => {
    frameConfig = useFrameConfig();
    imageState = useImageState();
    // Ensure clean state
    frameConfig.reset();
    imageState.clearImages();
  });

  afterEach(() => {
    // Additional cleanup after each test
    imageState.clearImages();
  });


  describe('Interaction', () => {
    it('resets frame configuration when clicked', async () => {
      const wrapper = mount(ResetButton);

      // Modify config
      frameConfig.updateOrientation('landscape');
      frameConfig.updateAspectRatio('16:9');
      frameConfig.updateBackgroundColor('#000000');

      await wrapper.find('button').trigger('click');

      expect(frameConfig.orientation.value).toBe('portrait');
      expect(frameConfig.aspectRatio.value).toBe('3:2');
      expect(frameConfig.backgroundColor.value).toBe('#FFFFFF');
    });

    it('clears images when clicked', async () => {
      const wrapper = mount(ResetButton);

      // Add mock images using a simple approach
      const file1 = new File(['test'], 'test1.jpg', { type: 'image/jpeg' });
      const file2 = new File(['test'], 'test2.jpg', { type: 'image/jpeg' });

      // Add images and wait for async operations
      await imageState.addImage(file1, 0);
      await imageState.addImage(file2, 1);

      // Wait a bit for async image loading to complete
      await new Promise(resolve => setTimeout(resolve, 10));

      // Verify images were added
      expect(imageState.images.value.filter(img => img !== null)).toHaveLength(2);

      // Click reset button
      await wrapper.find('button').trigger('click');

      // Verify images were cleared
      expect(imageState.images.value.filter(img => img !== null)).toHaveLength(0);
    }, 10000);
  });

});

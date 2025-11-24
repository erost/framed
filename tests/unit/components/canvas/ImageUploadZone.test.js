import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ImageUploadZone from '@/components/canvas/ImageUploadZone.vue';
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

describe('ImageUploadZone', () => {
  let imageState;

  beforeEach(() => {
    imageState = useImageState();
    imageState.clearImages();
  });

  describe('Rendering', () => {
    it('renders upload zone', () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      expect(wrapper.find('.image-upload-zone').exists()).toBe(true);
    });

    it('renders with custom test ID', () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0, testId: 'custom-upload' },
      });

      expect(wrapper.attributes('data-testid')).toBe('custom-upload');
    });

    it('renders file input with correct test ID', () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0, testId: 'custom-upload' },
      });

      const input = wrapper.find('[data-testid="custom-upload-input"]');
      expect(input.exists()).toBe(true);
    });
  });

  describe('Upload Content for Position 0', () => {
    it('displays "Upload First Image" text for position 0', () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      expect(wrapper.text()).toContain('Upload First Image');
    });
  });

  describe('Upload Content for Position 1', () => {
    it('displays "Upload Second Image" text for position 1', () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 1 },
      });

      expect(wrapper.text()).toContain('Upload Second Image');
    });
  });

  describe('Click to Upload', () => {
    it('triggers file input click when zone is clicked', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      const fileInputRef = wrapper.vm.fileInput;
      const clickSpy = vi.fn();
      if (fileInputRef) {
        fileInputRef.click = clickSpy;
      }

      await wrapper.vm.handleClick();

      expect(clickSpy).toHaveBeenCalled();
    });

    it('does not trigger file input when image is already uploaded', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      await imageState.addImage(file, 0);
      await new Promise((resolve) => setTimeout(resolve, 10));
      await wrapper.vm.$nextTick();

      const input = wrapper.find('input[type="file"]');
      const clickSpy = vi.spyOn(input.element, 'click');

      await wrapper.find('.image-upload-zone').trigger('click');

      expect(clickSpy).not.toHaveBeenCalled();
    });
  });

  describe('File Selection', () => {
    it('uploads image when file is selected', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const input = wrapper.find('input[type="file"]');

      Object.defineProperty(input.element, 'files', {
        value: [file],
        writable: false,
      });

      await input.trigger('change');
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(imageState.images.value[0]).toBeTruthy();
    });

    it('emits upload event when image is selected', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const input = wrapper.find('input[type="file"]');

      Object.defineProperty(input.element, 'files', {
        value: [file],
        writable: false,
      });

      await input.trigger('change');
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(wrapper.emitted('upload')).toBeTruthy();
      expect(wrapper.emitted('upload')[0][0]).toMatchObject({
        position: 0,
      });
    });

    it('handles file selection for position 1', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 1 },
      });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const input = wrapper.find('input[type="file"]');

      Object.defineProperty(input.element, 'files', {
        value: [file],
        writable: false,
      });

      await input.trigger('change');
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(imageState.images.value[1]).toBeTruthy();
    });
  });

  describe('Drag and Drop', () => {
    it('sets dragging state on dragover', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      await wrapper.find('.image-upload-zone').trigger('dragover');

      expect(wrapper.vm.isDragging).toBe(true);
    });

    it('clears dragging state on dragleave', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      await wrapper.find('.image-upload-zone').trigger('dragover');
      expect(wrapper.vm.isDragging).toBe(true);

      await wrapper.find('.image-upload-zone').trigger('dragleave');
      expect(wrapper.vm.isDragging).toBe(false);
    });

    it('handles file drop', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      await wrapper.vm.handleDrop({
        dataTransfer: { files: [file] },
      });
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(imageState.images.value[0]).toBeTruthy();
    });

    it('clears dragging state after drop', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      wrapper.vm.isDragging = true;
      expect(wrapper.vm.isDragging).toBe(true);

      await wrapper.vm.handleDrop({
        dataTransfer: { files: [file] },
      });
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(wrapper.vm.isDragging).toBe(false);
    });

    it('emits upload event on drop', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      await wrapper.vm.handleDrop({
        dataTransfer: { files: [file] },
      });
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(wrapper.emitted('upload')).toBeTruthy();
    });
  });

  describe('Image Preview', () => {
    it('remove button has correct test ID', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0, testId: 'custom-upload' },
      });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      await imageState.addImage(file, 0);
      await new Promise((resolve) => setTimeout(resolve, 10));
      await wrapper.vm.$nextTick();

      const removeButton = wrapper.find('[data-testid="custom-upload-remove"]');
      expect(removeButton.exists()).toBe(true);
    });
  });

  describe('Image Removal', () => {
    it('removes image when remove button is clicked', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      await imageState.addImage(file, 0);
      await new Promise((resolve) => setTimeout(resolve, 10));
      await wrapper.vm.$nextTick();

      const removeButton = wrapper.find('.remove-button');
      await removeButton.trigger('click');

      expect(imageState.images.value[0]).toBeNull();
    });

    it('emits remove event when image is removed', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      await imageState.addImage(file, 0);
      await new Promise((resolve) => setTimeout(resolve, 10));
      await wrapper.vm.$nextTick();

      const removeButton = wrapper.find('.remove-button');
      await removeButton.trigger('click');

      expect(wrapper.emitted('remove')).toBeTruthy();
      expect(wrapper.emitted('remove')[0][0]).toEqual({ position: 0 });
    });

    it('clears error when image is removed', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      wrapper.vm.error = 'Test error';
      await wrapper.vm.$nextTick();

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      await imageState.addImage(file, 0);
      await new Promise((resolve) => setTimeout(resolve, 10));
      await wrapper.vm.$nextTick();

      const removeButton = wrapper.find('.remove-button');
      await removeButton.trigger('click');

      expect(wrapper.vm.error).toBe('');
    });

    it('resets file input when image is removed', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      await imageState.addImage(file, 0);
      await new Promise((resolve) => setTimeout(resolve, 10));
      await wrapper.vm.$nextTick();

      const input = wrapper.find('input[type="file"]');
      // File inputs can only be set to empty string programmatically
      const valueSpy = vi.spyOn(input.element, 'value', 'set');

      const removeButton = wrapper.find('.remove-button');
      await removeButton.trigger('click');

      expect(valueSpy).toHaveBeenCalledWith('');
    });

    it('stops click propagation when remove button is clicked', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      await imageState.addImage(file, 0);
      await new Promise((resolve) => setTimeout(resolve, 10));
      await wrapper.vm.$nextTick();

      const input = wrapper.find('input[type="file"]');
      const clickSpy = vi.spyOn(input.element, 'click');

      const removeButton = wrapper.find('.remove-button');
      await removeButton.trigger('click');

      // File input should not be clicked because event propagation is stopped
      expect(clickSpy).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('displays error message when upload fails', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      wrapper.vm.error = 'Upload failed';
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.error-message').exists()).toBe(true);
      expect(wrapper.text()).toContain('Upload failed');
    });

    it('can display error message programmatically', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      wrapper.vm.error = 'Test error message';
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.error).toBe('Test error message');
      expect(wrapper.find('.error-message').exists()).toBe(true);
      expect(wrapper.find('.error-message').text()).toBe('Test error message');
    });

    it('clears previous error before new upload', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      wrapper.vm.error = 'Previous error';
      await wrapper.vm.$nextTick();

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const input = wrapper.find('input[type="file"]');

      Object.defineProperty(input.element, 'files', {
        value: [file],
        writable: false,
      });

      await input.trigger('change');
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Error should be cleared even if upload succeeds
      expect(wrapper.vm.error).toBe('');
    });
  });

  describe('Edge Cases', () => {
    it('handles missing file in change event', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      const input = wrapper.find('input[type="file"]');
      Object.defineProperty(input.element, 'files', {
        value: [],
        writable: false,
      });

      await input.trigger('change');
      await wrapper.vm.$nextTick();

      expect(imageState.images.value[0]).toBeNull();
    });

    it('handles missing file in drop event', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      const dropEvent = new Event('drop');
      Object.defineProperty(dropEvent, 'dataTransfer', {
        value: { files: [] },
      });

      await wrapper.find('.image-upload-zone').trigger('drop', dropEvent);
      await wrapper.vm.$nextTick();

      expect(imageState.images.value[0]).toBeNull();
    });

    it('handles rapid drag over and leave', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      await wrapper.find('.image-upload-zone').trigger('dragover');
      await wrapper.find('.image-upload-zone').trigger('dragleave');
      await wrapper.find('.image-upload-zone').trigger('dragover');
      await wrapper.find('.image-upload-zone').trigger('dragleave');

      expect(wrapper.vm.isDragging).toBe(false);
    });

    it('handles image upload for both positions independently', async () => {
      const wrapper0 = mount(ImageUploadZone, {
        props: { position: 0 },
      });
      const wrapper1 = mount(ImageUploadZone, {
        props: { position: 1 },
      });

      const file0 = new File(['test0'], 'test0.jpg', { type: 'image/jpeg' });
      const file1 = new File(['test1'], 'test1.jpg', { type: 'image/jpeg' });

      await imageState.addImage(file0, 0);
      await imageState.addImage(file1, 1);
      await new Promise((resolve) => setTimeout(resolve, 10));
      await wrapper0.vm.$nextTick();
      await wrapper1.vm.$nextTick();

      expect(imageState.images.value[0]).toBeTruthy();
      expect(imageState.images.value[1]).toBeTruthy();
    });
  });
});

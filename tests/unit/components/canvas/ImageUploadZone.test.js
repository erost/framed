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

    it('renders with default test ID', () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      expect(wrapper.attributes('data-testid')).toBe('image-upload-zone');
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

    it('renders hidden file input', () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      const input = wrapper.find('input[type="file"]');
      expect(input.exists()).toBe(true);
      expect(input.classes()).toContain('hidden');
    });

    it('sets correct accepted file types', () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      const input = wrapper.find('input[type="file"]');
      expect(input.attributes('accept')).toBe('image/jpeg,image/png,image/webp');
    });
  });

  describe('Upload Content for Position 0', () => {
    it('displays "Upload First Image" text for position 0', () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      expect(wrapper.text()).toContain('Upload First Image');
    });

    it('displays upload icon', () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      expect(wrapper.find('svg[aria-hidden="true"]').exists()).toBe(true);
    });

    it('displays drag and drop instruction', () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      expect(wrapper.text()).toContain('Click or drag & drop');
    });

    it('displays file format and size information', () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      expect(wrapper.text()).toContain('JPEG, PNG, or WebP');
      expect(wrapper.text()).toContain('max 10MB');
    });
  });

  describe('Upload Content for Position 1', () => {
    it('displays "Upload Second Image" text for position 1', () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 1 },
      });

      expect(wrapper.text()).toContain('Upload Second Image');
    });

    it('validates position prop', () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      expect([0, 1]).toContain(wrapper.vm.position);
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
    it('shows image preview when image is uploaded', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      await imageState.addImage(file, 0);
      await new Promise((resolve) => setTimeout(resolve, 10));
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.image-preview').exists()).toBe(true);
      expect(wrapper.find('.upload-content').exists()).toBe(false);
    });

    it('displays uploaded image', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      await imageState.addImage(file, 0);
      await new Promise((resolve) => setTimeout(resolve, 10));
      await wrapper.vm.$nextTick();

      const img = wrapper.find('img');
      expect(img.exists()).toBe(true);
      expect(img.attributes('src')).toContain('data:image');
    });

    it('sets correct alt text for image', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      await imageState.addImage(file, 0);
      await new Promise((resolve) => setTimeout(resolve, 10));
      await wrapper.vm.$nextTick();

      const img = wrapper.find('img');
      expect(img.attributes('alt')).toBe('Uploaded image 1');
    });

    it('sets correct alt text for second image', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 1 },
      });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      await imageState.addImage(file, 1);
      await new Promise((resolve) => setTimeout(resolve, 10));
      await wrapper.vm.$nextTick();

      const img = wrapper.find('img');
      expect(img.attributes('alt')).toBe('Uploaded image 2');
    });

    it('shows remove button when image is uploaded', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      await imageState.addImage(file, 0);
      await new Promise((resolve) => setTimeout(resolve, 10));
      await wrapper.vm.$nextTick();

      const removeButton = wrapper.find('.remove-button');
      expect(removeButton.exists()).toBe(true);
    });

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

    it('error message has role="alert"', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      wrapper.vm.error = 'Upload failed';
      await wrapper.vm.$nextTick();

      const errorMsg = wrapper.find('.error-message');
      expect(errorMsg.attributes('role')).toBe('alert');
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

  describe('CSS Classes', () => {
    it('applies dragging classes when dragging', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      await wrapper.find('.image-upload-zone').trigger('dragover');

      const zone = wrapper.find('.image-upload-zone');
      expect(zone.classes()).toContain('border-blue-500');
      expect(zone.classes()).toContain('bg-blue-50');
    });

    it('applies default classes when not dragging and no image', () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      const zone = wrapper.find('.image-upload-zone');
      expect(zone.classes()).toContain('border-gray-300');
    });

    it('applies success classes when image is uploaded', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      await imageState.addImage(file, 0);
      await new Promise((resolve) => setTimeout(resolve, 10));
      await wrapper.vm.$nextTick();

      const zone = wrapper.find('.image-upload-zone');
      expect(zone.classes()).toContain('border-green-500');
    });

    it('applies error classes when error exists', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      wrapper.vm.error = 'Error message';
      await wrapper.vm.$nextTick();

      const zone = wrapper.find('.image-upload-zone');
      expect(zone.classes()).toContain('border-red-500');
    });

    it('does not apply success classes when error exists', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      await imageState.addImage(file, 0);
      await new Promise((resolve) => setTimeout(resolve, 10));
      await wrapper.vm.$nextTick();

      wrapper.vm.error = 'Error message';
      await wrapper.vm.$nextTick();

      const zone = wrapper.find('.image-upload-zone');
      expect(zone.classes()).toContain('border-red-500');
      expect(zone.classes()).not.toContain('border-green-500');
    });
  });

  describe('Accessibility', () => {
    it('remove button has aria-label', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      await imageState.addImage(file, 0);
      await new Promise((resolve) => setTimeout(resolve, 10));
      await wrapper.vm.$nextTick();

      const removeButton = wrapper.find('.remove-button');
      expect(removeButton.attributes('aria-label')).toBe('Remove image');
    });

    it('upload icon has aria-hidden', () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      const svg = wrapper.find('svg[aria-hidden="true"]');
      expect(svg.exists()).toBe(true);
    });

    it('remove button is a button element', async () => {
      const wrapper = mount(ImageUploadZone, {
        props: { position: 0 },
      });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      await imageState.addImage(file, 0);
      await new Promise((resolve) => setTimeout(resolve, 10));
      await wrapper.vm.$nextTick();

      const removeButton = wrapper.find('.remove-button');
      expect(removeButton.element.tagName).toBe('BUTTON');
      expect(removeButton.attributes('type')).toBe('button');
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

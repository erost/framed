import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import FormatSelector from '@/components/controls/FormatSelector.vue';
import { useCanvasRenderer } from '@/composables/useCanvasRenderer';
import { IMAGE_FORMATS } from '@/utils/constants';

describe('FormatSelector', () => {
  let wrapper;
  let canvasRenderer;

  beforeEach(() => {
    canvasRenderer = useCanvasRenderer();
    canvasRenderer.format.value = IMAGE_FORMATS[0].mimeType;
    wrapper = mount(FormatSelector);
  });

  describe('Structure', () => {
    it('renders the format selector', () => {
      expect(wrapper.find('[data-testid="format-selector"]').exists()).toBe(true);
    });

    it('is a select element', () => {
      expect(wrapper.find('[data-testid="format-selector"]').element.tagName).toBe('SELECT');
    });
  });

  describe('Format Options', () => {
    it('displays all available formats from IMAGE_FORMATS', () => {
      const options = wrapper.findAll('option');
      expect(options).toHaveLength(IMAGE_FORMATS.length);
    });

    it('displays format extensions not mime types', () => {
      const options = wrapper.findAll('option');
      options.forEach((option, index) => {
        const format = IMAGE_FORMATS[index];
        expect(option.text()).toBe(`.${format.extension}`);
      });
    });

    it('uses mime type as option value', () => {
      const options = wrapper.findAll('option');
      options.forEach((option, index) => {
        const format = IMAGE_FORMATS[index];
        expect(option.element.value).toBe(format.mimeType);
      });
    });
  });

  describe('Behavior', () => {
    it('binds to format value from composable', () => {
      const select = wrapper.find('[data-testid="format-selector"]');
      expect(select.element.value).toBe(IMAGE_FORMATS[0].mimeType);
    });

    it('updates format when selection changes', async () => {
      const select = wrapper.find('[data-testid="format-selector"]');
      const newFormat = IMAGE_FORMATS[1].mimeType;
      await select.setValue(newFormat);

      expect(canvasRenderer.format.value).toBe(newFormat);
    });
  });

  describe('Props', () => {
    it('accepts custom testId prop', () => {
      wrapper = mount(FormatSelector, {
        props: { testId: 'custom-test-id' },
      });

      expect(wrapper.find('[data-testid="custom-test-id"]').exists()).toBe(true);
    });

    it('uses default testId when not provided', () => {
      expect(wrapper.props('testId')).toBe('format-selector');
    });
  });
});

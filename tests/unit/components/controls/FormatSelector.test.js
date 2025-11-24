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
    it('renders the format selector container', () => {
      expect(wrapper.find('[data-testid="format-selector"]').exists()).toBe(true);
    });

    it('renders button group with role', () => {
      const group = wrapper.find('[role="group"]');
      expect(group.exists()).toBe(true);
      expect(group.attributes('aria-label')).toBe('Export format');
    });

    it('renders all format buttons', () => {
      const buttons = wrapper.findAll('button');
      expect(buttons).toHaveLength(IMAGE_FORMATS.length);
    });
  });

  describe('Format Buttons', () => {
    it('displays all available formats from IMAGE_FORMATS', () => {
      IMAGE_FORMATS.forEach((format) => {
        const button = wrapper.find(`[data-testid="format-${format.extension}"]`);
        expect(button.exists()).toBe(true);
      });
    });

    it('displays format labels', () => {
      const buttons = wrapper.findAll('button');
      buttons.forEach((button, index) => {
        const format = IMAGE_FORMATS[index];
        expect(button.text()).toBe(format.label);
      });
    });

    it('marks selected format button as active', () => {
      const activeButton = wrapper.find('[data-testid="format-png"]');
      expect(activeButton.classes()).toContain('selector-btn-active');
      expect(activeButton.attributes('aria-pressed')).toBe('true');
    });

    it('marks non-selected format buttons as inactive', () => {
      const inactiveButton = wrapper.find('[data-testid="format-jpeg"]');
      expect(inactiveButton.classes()).toContain('selector-btn-inactive');
      expect(inactiveButton.attributes('aria-pressed')).toBe('false');
    });
  });

  describe('Behavior', () => {
    it('updates format when button is clicked', async () => {
      const jpegButton = wrapper.find('[data-testid="format-jpeg"]');
      await jpegButton.trigger('click');

      expect(canvasRenderer.format.value).toBe('image/jpeg');
    });

    it('updates active state when format changes', async () => {
      const webpButton = wrapper.find('[data-testid="format-webp"]');
      await webpButton.trigger('click');

      await wrapper.vm.$nextTick();

      expect(webpButton.classes()).toContain('selector-btn-active');
      expect(webpButton.attributes('aria-pressed')).toBe('true');

      const pngButton = wrapper.find('[data-testid="format-png"]');
      expect(pngButton.classes()).toContain('selector-btn-inactive');
      expect(pngButton.attributes('aria-pressed')).toBe('false');
    });

    it('calls updateFormat with correct mime type', async () => {
      const webpButton = wrapper.find('[data-testid="format-webp"]');
      await webpButton.trigger('click');

      expect(canvasRenderer.format.value).toBe('image/webp');
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

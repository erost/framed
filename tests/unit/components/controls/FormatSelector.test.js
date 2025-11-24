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

  describe('Rendering', () => {
    it('renders button group with role', () => {
      const group = wrapper.find('[role="group"]');
      expect(group.exists()).toBe(true);
      expect(group.attributes('aria-label')).toBe('Export format');
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

      expect(webpButton.attributes('aria-pressed')).toBe('true');

      const pngButton = wrapper.find('[data-testid="format-png"]');
      expect(pngButton.attributes('aria-pressed')).toBe('false');
    });

    it('calls updateFormat with correct mime type', async () => {
      const webpButton = wrapper.find('[data-testid="format-webp"]');
      await webpButton.trigger('click');

      expect(canvasRenderer.format.value).toBe('image/webp');
    });
  });
});

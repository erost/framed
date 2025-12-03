import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ColorPicker from '@/components/controls/ColorPicker.vue';
import { useFrameConfig } from '@/composables/useFrameConfig';
import { COLOR_PRESETS } from '@/utils/constants';

describe('ColorPicker', () => {
  let frameConfig;

  beforeEach(() => {
    frameConfig = useFrameConfig();
    frameConfig.reset();
  });

  describe('Rendering', () => {
    it('renders button group with role', () => {
      const wrapper = mount(ColorPicker);
      const group = wrapper.find('[role="group"]');
      expect(group.exists()).toBe(true);
      expect(group.attributes('aria-label')).toBe('Frame background color');
    });
  });

  describe('Preset Colors', () => {
    it('selects white preset when clicked', async () => {
      const wrapper = mount(ColorPicker);
      const whiteButton = wrapper.find('[data-testid="color-white"]');

      await whiteButton.trigger('click');

      expect(frameConfig.backgroundColor.value).toBe(COLOR_PRESETS.WHITE);
    });

    it('selects black preset when clicked', async () => {
      const wrapper = mount(ColorPicker);
      const blackButton = wrapper.find('[data-testid="color-black"]');

      await blackButton.trigger('click');

      expect(frameConfig.backgroundColor.value).toBe(COLOR_PRESETS.BLACK);
    });

    it('marks white button as active when white is selected', async () => {
      const wrapper = mount(ColorPicker);

      // White is default, should be active
      const whiteButton = wrapper.find('[data-testid="color-white"]');
      expect(whiteButton.attributes('aria-pressed')).toBe('true');
    });

    it('marks black button as active when black is selected', async () => {
      const wrapper = mount(ColorPicker);
      const blackButton = wrapper.find('[data-testid="color-black"]');

      await blackButton.trigger('click');
      await wrapper.vm.$nextTick();

      expect(blackButton.attributes('aria-pressed')).toBe('true');
    });
  });

  describe('Custom Color', () => {
    it('updates background color when custom color changes', async () => {
      const wrapper = mount(ColorPicker);
      const colorInput = wrapper.find('[data-testid="color-custom"]');

      await colorInput.setValue('#00FF00');
      await colorInput.trigger('change');

      expect(frameConfig.backgroundColor.value).toBe('#00FF00');
    });

    it('converts custom color to uppercase', async () => {
      const wrapper = mount(ColorPicker);
      const colorInput = wrapper.find('[data-testid="color-custom"]');

      await colorInput.setValue('#00ff00');
      await colorInput.trigger('change');

      expect(frameConfig.backgroundColor.value).toBe('#00FF00');
    });

    it('marks custom button as active when custom color is selected', async () => {
      const wrapper = mount(ColorPicker);
      const customInput = wrapper.find('[data-testid="color-custom"]');

      await customInput.setValue('#FF5733');
      await customInput.trigger('change');
      await wrapper.vm.$nextTick();

      expect(customInput.attributes('aria-pressed')).toBe('true');
    });
  });

  describe('Integration', () => {
    it('switches between preset and custom colors', async () => {
      const wrapper = mount(ColorPicker);

      // Start with white (default)
      expect(frameConfig.backgroundColor.value).toBe(COLOR_PRESETS.WHITE);

      // Switch to black
      const blackButton = wrapper.find('[data-testid="color-black"]');
      await blackButton.trigger('click');
      expect(frameConfig.backgroundColor.value).toBe(COLOR_PRESETS.BLACK);

      // Switch to custom color
      const colorInput = wrapper.find('[data-testid="color-custom"]');
      await colorInput.setValue('#FF5733');
      await colorInput.trigger('change');
      expect(frameConfig.backgroundColor.value).toBe('#FF5733');

      // Switch back to white
      const whiteButton = wrapper.find('[data-testid="color-white"]');
      await whiteButton.trigger('click');
      expect(frameConfig.backgroundColor.value).toBe(COLOR_PRESETS.WHITE);
    });
  });
});

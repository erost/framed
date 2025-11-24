import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ColorPicker from '@/components/controls/ColorPicker.vue';
import { useFrameConfig } from '@/composables/useFrameConfig';

describe('ColorPicker', () => {
  let frameConfig;

  beforeEach(() => {
    frameConfig = useFrameConfig();
    frameConfig.reset();
  });

  describe('Rendering', () => {
    it('renders native color picker input', () => {
      const wrapper = mount(ColorPicker);

      const colorInput = wrapper.find('[data-testid="color-picker-input"]');
      expect(colorInput.exists()).toBe(true);
      expect(colorInput.attributes('type')).toBe('color');
    });

    it('has id attribute', () => {
      const wrapper = mount(ColorPicker);
      const colorInput = wrapper.find('[data-testid="color-picker-input"]');

      expect(colorInput.attributes('id')).toBe('background-color');
    });

    it('color input is full width', () => {
      const wrapper = mount(ColorPicker);

      const colorInput = wrapper.find('[data-testid="color-picker-input"]');
      expect(colorInput.classes()).toContain('color-picker-input');
    });
  });

  describe('Initial Value', () => {
    it('displays default background color in color picker', () => {
      const wrapper = mount(ColorPicker);

      const colorInput = wrapper.find('[data-testid="color-picker-input"]');
      expect(colorInput.element.value).toBe('#ffffff');
    });

    it('displays custom background color from config', async () => {
      frameConfig.updateBackgroundColor('#FF0000');

      const wrapper = mount(ColorPicker);
      await wrapper.vm.$nextTick();

      const colorInput = wrapper.find('[data-testid="color-picker-input"]');
      expect(colorInput.element.value).toBe('#ff0000');
    });
  });

  describe('Color Picker Interaction', () => {
    it('updates background color when color picker changes', async () => {
      const wrapper = mount(ColorPicker);
      const colorInput = wrapper.find('[data-testid="color-picker-input"]');

      await colorInput.setValue('#00FF00');
      await colorInput.trigger('change');

      expect(frameConfig.backgroundColor.value).toBe('#00FF00');
    });

    it('converts color to uppercase', async () => {
      const wrapper = mount(ColorPicker);
      const colorInput = wrapper.find('[data-testid="color-picker-input"]');

      await colorInput.setValue('#00ff00');
      await colorInput.trigger('change');

      expect(frameConfig.backgroundColor.value).toBe('#00FF00');
    });

    it('handles black color', async () => {
      const wrapper = mount(ColorPicker);
      const colorInput = wrapper.find('[data-testid="color-picker-input"]');

      await colorInput.setValue('#000000');
      await colorInput.trigger('change');

      expect(frameConfig.backgroundColor.value).toBe('#000000');
    });

    it('handles white color', async () => {
      const wrapper = mount(ColorPicker);
      const colorInput = wrapper.find('[data-testid="color-picker-input"]');

      await colorInput.setValue('#ffffff');
      await colorInput.trigger('change');

      expect(frameConfig.backgroundColor.value).toBe('#FFFFFF');
    });
  });

  describe('Reactivity', () => {
    it('updates input when background color changes externally', async () => {
      const wrapper = mount(ColorPicker);

      frameConfig.updateBackgroundColor('#0000FF');
      await wrapper.vm.$nextTick();

      const colorInput = wrapper.find('[data-testid="color-picker-input"]');
      expect(colorInput.element.value).toBe('#0000ff');
    });

    it('updates to different colors', async () => {
      const wrapper = mount(ColorPicker);
      const colorInput = wrapper.find('[data-testid="color-picker-input"]');

      const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];

      for (const color of colors) {
        frameConfig.updateBackgroundColor(color);
        await wrapper.vm.$nextTick();
        expect(colorInput.element.value).toBe(color.toLowerCase());
      }
    });
  });

  describe('Accessibility', () => {
    it('input has default test ID', () => {
      const wrapper = mount(ColorPicker);
      const colorInput = wrapper.find('input[type="color"]');
      expect(colorInput.attributes('data-testid')).toBe('color-picker-input');
    });

    it('color picker uses scoped class', () => {
      const wrapper = mount(ColorPicker);

      const colorInput = wrapper.find('[data-testid="color-picker-input"]');
      expect(colorInput.classes()).toContain('color-picker-input');
    });
  });

  describe('Component Structure', () => {
    it('uses scoped CSS classes', () => {
      const wrapper = mount(ColorPicker);

      const colorInput = wrapper.find('[data-testid="color-picker-input"]');
      expect(colorInput.classes()).toContain('color-picker-input');
    });

    it('input has proper type attribute', () => {
      const wrapper = mount(ColorPicker);

      const colorInput = wrapper.find('[data-testid="color-picker-input"]');
      expect(colorInput.attributes('type')).toBe('color');
    });

    it('input uses v-model binding', () => {
      const wrapper = mount(ColorPicker);

      const colorInput = wrapper.find('[data-testid="color-picker-input"]');
      expect(colorInput.element.value).toBe(frameConfig.backgroundColor.value.toLowerCase());
    });
  });

  describe('Integration', () => {
    it('works with frame configuration composable', async () => {
      const wrapper = mount(ColorPicker);
      const colorInput = wrapper.find('[data-testid="color-picker-input"]');

      // Initial state
      const initialColor = frameConfig.backgroundColor.value;

      // Change color
      await colorInput.setValue('#123456');
      await colorInput.trigger('change');

      // Verify config updated
      expect(frameConfig.backgroundColor.value).toBe('#123456');
      expect(frameConfig.backgroundColor.value).not.toBe(initialColor);
    });

    it('responds to external config changes', async () => {
      const wrapper = mount(ColorPicker);

      // Change externally
      frameConfig.updateBackgroundColor('#ABCDEF');
      await wrapper.vm.$nextTick();

      // Verify UI updated
      const colorInput = wrapper.find('[data-testid="color-picker-input"]');
      expect(colorInput.element.value).toBe('#abcdef');
    });
  });
});

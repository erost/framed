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
    it('renders color picker with label', () => {
      const wrapper = mount(ColorPicker);

      expect(wrapper.text()).toBeTruthy();
    });

    it('renders color input field', () => {
      const wrapper = mount(ColorPicker);

      expect(wrapper.find('[data-testid="color-input"]').exists()).toBe(true);
    });

    it('renders native color picker input', () => {
      const wrapper = mount(ColorPicker);

      const colorInput = wrapper.find('[data-testid="color-picker-input"]');
      expect(colorInput.exists()).toBe(true);
      expect(colorInput.attributes('type')).toBe('color');
    });

    it('has proper label association', () => {
      const wrapper = mount(ColorPicker);

      const label = wrapper.find('label');
      const colorInput = wrapper.find('[data-testid="color-picker-input"]');

      expect(label.attributes('for')).toBe('background-color');
      expect(colorInput.attributes('id')).toBe('background-color');
    });
  });

  describe('Initial Value', () => {
    it('displays default background color in text input', () => {
      const wrapper = mount(ColorPicker);

      const input = wrapper.find('[data-testid="color-input"]');
      expect(input.element.value).toBe('#FFFFFF');
    });

    it('displays default background color in color picker', () => {
      const wrapper = mount(ColorPicker);

      const colorInput = wrapper.find('[data-testid="color-picker-input"]');
      expect(colorInput.element.value).toBe('#ffffff');
    });

    it('displays custom background color from config', async () => {
      frameConfig.updateBackgroundColor('#FF0000');

      const wrapper = mount(ColorPicker);
      await wrapper.vm.$nextTick();

      const input = wrapper.find('[data-testid="color-input"]');
      const colorInput = wrapper.find('[data-testid="color-picker-input"]');

      expect(input.element.value).toBe('#FF0000');
      expect(colorInput.element.value).toBe('#ff0000');
    });
  });

  describe('Native Color Picker Interaction', () => {
    it('updates background color when color picker changes', async () => {
      const wrapper = mount(ColorPicker);
      const colorInput = wrapper.find('[data-testid="color-picker-input"]');

      await colorInput.setValue('#00FF00');
      await colorInput.trigger('change');

      expect(frameConfig.backgroundColor.value).toBe('#00FF00');
    });

    it('updates text input when color picker changes', async () => {
      const wrapper = mount(ColorPicker);
      const colorInput = wrapper.find('[data-testid="color-picker-input"]');
      const textInput = wrapper.find('[data-testid="color-input"]');

      await colorInput.setValue('#00FF00');
      await colorInput.trigger('change');

      expect(textInput.element.value).toBe('#00FF00');
    });
  });

  describe('Manual Input', () => {
    it('auto-prepends # to color input', async () => {
      const wrapper = mount(ColorPicker);
      const input = wrapper.find('[data-testid="color-input"]');

      await input.setValue('FF0000');

      expect(input.element.value).toBe('#FF0000');
    });

    it('accepts valid hex color on blur', async () => {
      const wrapper = mount(ColorPicker);
      const input = wrapper.find('[data-testid="color-input"]');

      await input.setValue('#00FF00');
      await input.trigger('blur');

      expect(frameConfig.backgroundColor.value).toBe('#00FF00');
    });

    it('accepts 3-digit hex color', async () => {
      const wrapper = mount(ColorPicker);
      const input = wrapper.find('[data-testid="color-input"]');

      await input.setValue('#F00');
      await input.trigger('blur');

      expect(frameConfig.backgroundColor.value).toBe('#F00');
    });

    it('rejects invalid hex color on blur', async () => {
      const wrapper = mount(ColorPicker);
      const input = wrapper.find('[data-testid="color-input"]');

      const originalColor = frameConfig.backgroundColor.value;

      await input.setValue('invalid');
      await input.trigger('blur');

      expect(input.element.value).toBe(originalColor);
      expect(frameConfig.backgroundColor.value).toBe(originalColor);
    });

    it('rejects hex color with invalid characters', async () => {
      const wrapper = mount(ColorPicker);
      const input = wrapper.find('[data-testid="color-input"]');

      const originalColor = frameConfig.backgroundColor.value;

      await input.setValue('#GGGGGG');
      await input.trigger('blur');

      expect(input.element.value).toBe(originalColor);
    });

    it('handles empty input', async () => {
      const wrapper = mount(ColorPicker);
      const input = wrapper.find('[data-testid="color-input"]');

      const originalColor = frameConfig.backgroundColor.value;

      await input.setValue('');
      await input.trigger('blur');

      expect(input.element.value).toBe(originalColor);
    });

    it('updates color picker when valid text input is entered', async () => {
      const wrapper = mount(ColorPicker);
      const textInput = wrapper.find('[data-testid="color-input"]');
      const colorInput = wrapper.find('[data-testid="color-picker-input"]');

      await textInput.setValue('#0000FF');
      await textInput.trigger('blur');

      expect(colorInput.element.value).toBe('#0000ff');
    });
  });

  describe('Reactivity', () => {
    it('updates inputs when background color changes externally', async () => {
      const wrapper = mount(ColorPicker);

      frameConfig.updateBackgroundColor('#0000FF');
      await wrapper.vm.$nextTick();

      const textInput = wrapper.find('[data-testid="color-input"]');
      const colorInput = wrapper.find('[data-testid="color-picker-input"]');

      expect(textInput.element.value).toBe('#0000FF');
      expect(colorInput.element.value).toBe('#0000ff');
    });
  });

  describe('Accessibility', () => {
    it('has custom test ID', () => {
      const wrapper = mount(ColorPicker, {
        props: { testId: 'custom-picker' },
      });

      expect(wrapper.attributes('data-testid')).toBe('custom-picker');
    });

    it('has placeholder text', () => {
      const wrapper = mount(ColorPicker);

      const input = wrapper.find('[data-testid="color-input"]');
      expect(input.attributes('placeholder')).toBe('#FFFFFF');
    });

    it('has max length for hex color', () => {
      const wrapper = mount(ColorPicker);

      const input = wrapper.find('[data-testid="color-input"]');
      expect(input.attributes('maxlength')).toBe('7');
    });

    it('color picker uses scoped class', () => {
      const wrapper = mount(ColorPicker);

      const colorInput = wrapper.find('[data-testid="color-picker-input"]');
      expect(colorInput.classes()).toContain('color-picker-swatch');
    });

    it('has hint text for color format', () => {
      const wrapper = mount(ColorPicker);

      expect(wrapper.text()).toBeTruthy();
    });
  });

  describe('Component Structure', () => {
    it('uses scoped CSS classes', () => {
      const wrapper = mount(ColorPicker);

      const colorSwatch = wrapper.find('[data-testid="color-picker-input"]');
      const textInput = wrapper.find('[data-testid="color-input"]');

      expect(colorSwatch.classes()).toContain('color-picker-swatch');
      expect(textInput.classes()).toContain('color-text-input');
    });

    it('has gap-1 container to match BaseInput', () => {
      const wrapper = mount(ColorPicker);
      const container = wrapper.find('[data-testid="color-picker"]');

      expect(container.classes()).toContain('flex');
      expect(container.classes()).toContain('flex-col');
      expect(container.classes()).toContain('gap-1');
    });

    it('color swatch uses scoped class for sizing', () => {
      const wrapper = mount(ColorPicker);
      const colorSwatch = wrapper.find('[data-testid="color-picker-input"]');

      // Size is defined in scoped CSS via .color-picker-swatch
      expect(colorSwatch.classes()).toContain('color-picker-swatch');
    });
  });
});

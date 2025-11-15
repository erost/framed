import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseInput from '@/components/shared/BaseInput.vue';

describe('BaseInput', () => {
  describe('Rendering', () => {
    it('renders input element', () => {
      const wrapper = mount(BaseInput);
      expect(wrapper.find('[data-testid="number-input"]').exists()).toBe(true);
    });

    it('renders with default test ID', () => {
      const wrapper = mount(BaseInput);
      expect(wrapper.attributes('data-testid')).toBe('base-input');
    });

    it('renders with custom test ID', () => {
      const wrapper = mount(BaseInput, {
        props: { testId: 'custom-input' },
      });
      expect(wrapper.attributes('data-testid')).toBe('custom-input');
    });

    it('renders without label by default', () => {
      const wrapper = mount(BaseInput);
      expect(wrapper.find('label').exists()).toBe(false);
    });

    it('renders with label when provided', () => {
      const wrapper = mount(BaseInput, {
        props: { label: 'Test Label' },
      });
      const label = wrapper.find('label');
      expect(label.exists()).toBe(true);
      expect(label.text()).toContain('Test Label');
    });

    it('renders unit display when provided', () => {
      const wrapper = mount(BaseInput, {
        props: { unit: 'px' },
      });
      const unitSpan = wrapper.find('.absolute.right-3');
      expect(unitSpan.exists()).toBe(true);
      expect(unitSpan.text()).toBe('px');
    });

    it('does not render unit display when not provided', () => {
      const wrapper = mount(BaseInput);
      const unitSpan = wrapper.find('.absolute.right-3');
      expect(unitSpan.exists()).toBe(false);
    });

    it('renders required asterisk when required is true', () => {
      const wrapper = mount(BaseInput, {
        props: { label: 'Required Field', required: true },
      });
      const asterisk = wrapper.find('[aria-label="required"]');
      expect(asterisk.exists()).toBe(true);
      expect(asterisk.text()).toBe('*');
    });

    it('does not render required asterisk when required is false', () => {
      const wrapper = mount(BaseInput, {
        props: { label: 'Optional Field', required: false },
      });
      const asterisk = wrapper.find('[aria-label="required"]');
      expect(asterisk.exists()).toBe(false);
    });

    it('renders error message when error prop is provided', () => {
      const wrapper = mount(BaseInput, {
        props: { error: 'Invalid value' },
      });
      const errorSpan = wrapper.find('[data-testid="input-error"]');
      expect(errorSpan.exists()).toBe(true);
      expect(errorSpan.text()).toBe('Invalid value');
    });

    it('renders hint message when hint prop is provided', () => {
      const wrapper = mount(BaseInput, {
        props: { hint: 'Enter a number between 1-100' },
      });
      const hintSpan = wrapper.find('[data-testid="input-hint"]');
      expect(hintSpan.exists()).toBe(true);
      expect(hintSpan.text()).toBe('Enter a number between 1-100');
    });

    it('does not render hint when error is present', () => {
      const wrapper = mount(BaseInput, {
        props: { hint: 'This is a hint', error: 'This is an error' },
      });
      const hintSpan = wrapper.find('[data-testid="input-hint"]');
      expect(hintSpan.exists()).toBe(false);
    });
  });

  describe('Input Type', () => {
    it('defaults to number type', () => {
      const wrapper = mount(BaseInput);
      const input = wrapper.find('[data-testid="number-input"]');
      expect(input.attributes('type')).toBe('number');
    });

    it('accepts text type', () => {
      const wrapper = mount(BaseInput, {
        props: { type: 'text' },
      });
      const input = wrapper.find('[data-testid="number-input"]');
      expect(input.attributes('type')).toBe('text');
    });

    it('validates input type prop', () => {
      // Vue will warn about invalid prop values in development
      const wrapper = mount(BaseInput, {
        props: { type: 'number' },
      });
      expect(wrapper.vm.type).toBe('number');
    });
  });

  describe('Input Attributes', () => {
    it('sets min attribute when provided', () => {
      const wrapper = mount(BaseInput, {
        props: { min: 10 },
      });
      const input = wrapper.find('[data-testid="number-input"]');
      expect(input.attributes('min')).toBe('10');
    });

    it('sets max attribute when provided', () => {
      const wrapper = mount(BaseInput, {
        props: { max: 100 },
      });
      const input = wrapper.find('[data-testid="number-input"]');
      expect(input.attributes('max')).toBe('100');
    });

    it('sets step attribute with default value of 1', () => {
      const wrapper = mount(BaseInput);
      const input = wrapper.find('[data-testid="number-input"]');
      expect(input.attributes('step')).toBe('1');
    });

    it('sets custom step attribute', () => {
      const wrapper = mount(BaseInput, {
        props: { step: 0.5 },
      });
      const input = wrapper.find('[data-testid="number-input"]');
      expect(input.attributes('step')).toBe('0.5');
    });

    it('sets placeholder attribute', () => {
      const wrapper = mount(BaseInput, {
        props: { placeholder: 'Enter value' },
      });
      const input = wrapper.find('[data-testid="number-input"]');
      expect(input.attributes('placeholder')).toBe('Enter value');
    });

    it('sets disabled attribute when disabled is true', () => {
      const wrapper = mount(BaseInput, {
        props: { disabled: true },
      });
      const input = wrapper.find('[data-testid="number-input"]');
      expect(input.attributes('disabled')).toBeDefined();
    });

    it('does not set disabled attribute when disabled is false', () => {
      const wrapper = mount(BaseInput, {
        props: { disabled: false },
      });
      const input = wrapper.find('[data-testid="number-input"]');
      expect(input.attributes('disabled')).toBeUndefined();
    });

    it('sets required attribute when required is true', () => {
      const wrapper = mount(BaseInput, {
        props: { required: true },
      });
      const input = wrapper.find('[data-testid="number-input"]');
      expect(input.attributes('required')).toBeDefined();
    });
  });

  describe('Model Value', () => {
    it('displays default value of 0', () => {
      const wrapper = mount(BaseInput);
      const input = wrapper.find('[data-testid="number-input"]');
      expect(input.element.value).toBe('0');
    });

    it('displays provided number value', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: 42 },
      });
      const input = wrapper.find('[data-testid="number-input"]');
      expect(input.element.value).toBe('42');
    });

    it('displays provided string value', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: 'test', type: 'text' },
      });
      const input = wrapper.find('[data-testid="number-input"]');
      expect(input.element.value).toBe('test');
    });

    it('emits update:modelValue event when number input changes', async () => {
      const wrapper = mount(BaseInput);
      const input = wrapper.find('[data-testid="number-input"]');

      await input.setValue('25');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')[0]).toEqual([25]);
    });

    it('emits update:modelValue event when text input changes', async () => {
      const wrapper = mount(BaseInput, {
        props: { type: 'text' },
      });
      const input = wrapper.find('[data-testid="number-input"]');

      await input.setValue('hello');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')[0]).toEqual(['hello']);
    });

    it('converts empty string to 0 for number type', async () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: 42 },
      });
      const input = wrapper.find('[data-testid="number-input"]');

      await input.setValue('');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')[0]).toEqual([0]);
    });

    it('converts string to number for number type', async () => {
      const wrapper = mount(BaseInput);
      const input = wrapper.find('[data-testid="number-input"]');

      await input.setValue('123');

      expect(wrapper.emitted('update:modelValue')[0]).toEqual([123]);
    });
  });

  describe('Event Handling', () => {
    it('emits blur event when input loses focus', async () => {
      const wrapper = mount(BaseInput);
      const input = wrapper.find('[data-testid="number-input"]');

      await input.trigger('blur');

      expect(wrapper.emitted('blur')).toBeTruthy();
      expect(wrapper.emitted('blur')).toHaveLength(1);
    });

    it('emits blur event with event object', async () => {
      const wrapper = mount(BaseInput);
      const input = wrapper.find('[data-testid="number-input"]');

      await input.trigger('blur');

      expect(wrapper.emitted('blur')[0][0]).toBeInstanceOf(Event);
    });

    it('emits update:modelValue on input event', async () => {
      const wrapper = mount(BaseInput);
      const input = wrapper.find('[data-testid="number-input"]');

      await input.trigger('input');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });
  });

  describe('CSS Classes', () => {
    it('applies padding-right class when unit is present', () => {
      const wrapper = mount(BaseInput, {
        props: { unit: 'px' },
      });
      const input = wrapper.find('[data-testid="number-input"]');
      expect(input.classes()).toContain('pr-10');
    });

    it('does not apply padding-right class when unit is not present', () => {
      const wrapper = mount(BaseInput);
      const input = wrapper.find('[data-testid="number-input"]');
      expect(input.classes()).not.toContain('pr-10');
    });

    it('applies disabled cursor class when disabled', () => {
      const wrapper = mount(BaseInput, {
        props: { disabled: true },
      });
      const input = wrapper.find('[data-testid="number-input"]');
      expect(input.classes()).toContain('disabled:cursor-not-allowed');
    });
  });

  describe('Accessibility', () => {
    it('generates unique input ID', () => {
      const wrapper1 = mount(BaseInput, {
        props: { label: 'Input 1' },
      });
      const wrapper2 = mount(BaseInput, {
        props: { label: 'Input 2' },
      });

      const input1 = wrapper1.find('[data-testid="number-input"]');
      const input2 = wrapper2.find('[data-testid="number-input"]');

      expect(input1.attributes('id')).toBeTruthy();
      expect(input2.attributes('id')).toBeTruthy();
      expect(input1.attributes('id')).not.toBe(input2.attributes('id'));
    });

    it('associates label with input via for and id attributes', () => {
      const wrapper = mount(BaseInput, {
        props: { label: 'Test Label' },
      });

      const label = wrapper.find('label');
      const input = wrapper.find('[data-testid="number-input"]');

      expect(label.attributes('for')).toBe(input.attributes('id'));
    });

    it('sets aria-invalid to true when error is present', () => {
      const wrapper = mount(BaseInput, {
        props: { error: 'Invalid input' },
      });
      const input = wrapper.find('[data-testid="number-input"]');
      expect(input.attributes('aria-invalid')).toBe('true');
    });

    it('sets aria-invalid to false when no error', () => {
      const wrapper = mount(BaseInput);
      const input = wrapper.find('[data-testid="number-input"]');
      expect(input.attributes('aria-invalid')).toBe('false');
    });

    it('sets aria-describedby when error is present', () => {
      const wrapper = mount(BaseInput, {
        props: { error: 'Invalid input' },
      });
      const input = wrapper.find('[data-testid="number-input"]');
      const errorId = input.attributes('aria-describedby');

      expect(errorId).toBeTruthy();
      expect(errorId).toContain('-error');

      const errorSpan = wrapper.find(`#${errorId}`);
      expect(errorSpan.exists()).toBe(true);
    });

    it('does not set aria-describedby when no error', () => {
      const wrapper = mount(BaseInput);
      const input = wrapper.find('[data-testid="number-input"]');
      expect(input.attributes('aria-describedby')).toBeUndefined();
    });

    it('error message has role="alert"', () => {
      const wrapper = mount(BaseInput, {
        props: { error: 'Error message' },
      });
      const errorSpan = wrapper.find('[data-testid="input-error"]');
      expect(errorSpan.attributes('role')).toBe('alert');
    });

    it('unit span has aria-hidden="true"', () => {
      const wrapper = mount(BaseInput, {
        props: { unit: 'px' },
      });
      const unitSpan = wrapper.find('.absolute.right-3');
      expect(unitSpan.attributes('aria-hidden')).toBe('true');
    });
  });

  describe('Component Structure', () => {
    it('has proper container structure', () => {
      const wrapper = mount(BaseInput);
      expect(wrapper.classes()).toContain('flex');
      expect(wrapper.classes()).toContain('flex-col');
      expect(wrapper.classes()).toContain('gap-1');
    });

    it('has relative positioning for unit display', () => {
      const wrapper = mount(BaseInput, {
        props: { unit: 'px' },
      });
      const inputContainer = wrapper.find('.relative');
      expect(inputContainer.exists()).toBe(true);
    });

    it('positions unit span absolutely', () => {
      const wrapper = mount(BaseInput, {
        props: { unit: 'px' },
      });
      const unitSpan = wrapper.find('.absolute.right-3');
      expect(unitSpan.classes()).toContain('absolute');
      expect(unitSpan.classes()).toContain('right-3');
      expect(unitSpan.classes()).toContain('top-1/2');
      expect(unitSpan.classes()).toContain('-translate-y-1/2');
    });
  });

  describe('Edge Cases', () => {
    it('handles zero as model value', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: 0 },
      });
      const input = wrapper.find('[data-testid="number-input"]');
      expect(input.element.value).toBe('0');
    });

    it('handles negative numbers', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: -10 },
      });
      const input = wrapper.find('[data-testid="number-input"]');
      expect(input.element.value).toBe('-10');
    });

    it('handles decimal numbers', () => {
      const wrapper = mount(BaseInput, {
        props: { modelValue: 3.14 },
      });
      const input = wrapper.find('[data-testid="number-input"]');
      expect(input.element.value).toBe('3.14');
    });

    it('handles both error and required props together', () => {
      const wrapper = mount(BaseInput, {
        props: {
          label: 'Required Field',
          required: true,
          error: 'This field is required',
        },
      });

      const asterisk = wrapper.find('[aria-label="required"]');
      const errorMsg = wrapper.find('[data-testid="input-error"]');

      expect(asterisk.exists()).toBe(true);
      expect(errorMsg.exists()).toBe(true);
    });

    it('handles both hint and unit props together', () => {
      const wrapper = mount(BaseInput, {
        props: {
          hint: 'Enter width in pixels',
          unit: 'px',
        },
      });

      const hintSpan = wrapper.find('[data-testid="input-hint"]');
      const unitSpan = wrapper.find('.absolute.right-3');

      expect(hintSpan.exists()).toBe(true);
      expect(unitSpan.exists()).toBe(true);
    });

    it('handles empty string label', () => {
      const wrapper = mount(BaseInput, {
        props: { label: '' },
      });
      expect(wrapper.find('label').exists()).toBe(false);
    });

    it('handles multiple rapid input changes', async () => {
      const wrapper = mount(BaseInput);
      const input = wrapper.find('[data-testid="number-input"]');

      await input.setValue('1');
      await input.setValue('12');
      await input.setValue('123');

      const emitted = wrapper.emitted('update:modelValue');
      expect(emitted).toHaveLength(3);
      expect(emitted[0]).toEqual([1]);
      expect(emitted[1]).toEqual([12]);
      expect(emitted[2]).toEqual([123]);
    });
  });
});

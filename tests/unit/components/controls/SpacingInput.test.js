import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import SpacingInput from '@/components/controls/SpacingInput.vue';
import BaseInput from '@/components/shared/BaseInput.vue';
import { useFrameConfig } from '@/composables/useFrameConfig';
import { FRAME_CONSTRAINTS } from '@/utils/constants';

describe('SpacingInput', () => {
  let frameConfig;

  beforeEach(() => {
    frameConfig = useFrameConfig();
    frameConfig.reset();
  });

  describe('Rendering', () => {
    it('renders BaseInput component', () => {
      const wrapper = mount(SpacingInput);
      expect(wrapper.findComponent(BaseInput).exists()).toBe(true);
    });

    it('renders with default test ID', () => {
      const wrapper = mount(SpacingInput);
      expect(wrapper.attributes('data-testid')).toBe('spacing-input');
    });

    it('renders with custom test ID', () => {
      const wrapper = mount(SpacingInput, {
        props: { testId: 'custom-spacing' },
      });
      expect(wrapper.attributes('data-testid')).toBe('custom-spacing');
    });

    it('displays spacing label', () => {
      const wrapper = mount(SpacingInput);
      expect(wrapper.text()).toContain('Spacing');
    });

    it('displays px unit', () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);
      expect(baseInput.props('unit')).toBe('px');
    });

    it('displays hint with range information', () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);
      expect(baseInput.props('hint')).toBe(
        `range(${FRAME_CONSTRAINTS.minSpacing}px:${FRAME_CONSTRAINTS.maxSpacing}px)`
      );
    });
  });

  describe('Input Configuration', () => {
    it('has number type', () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);
      expect(baseInput.props('type')).toBe('number');
    });

    it('sets minimum constraint', () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);
      expect(baseInput.props('min')).toBe(FRAME_CONSTRAINTS.minSpacing);
    });

    it('sets maximum constraint', () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);
      expect(baseInput.props('max')).toBe(FRAME_CONSTRAINTS.maxSpacing);
    });

    it('sets step to 10', () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);
      expect(baseInput.props('step')).toBe(10);
    });
  });

  describe('Initial Value', () => {
    it('displays default spacing value', () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);
      expect(baseInput.props('modelValue')).toBe(frameConfig.spacing.value);
    });

    it('displays custom spacing value from config', async () => {
      frameConfig.updateSpacing(100);

      const wrapper = mount(SpacingInput);
      await wrapper.vm.$nextTick();

      const baseInput = wrapper.findComponent(BaseInput);
      expect(baseInput.props('modelValue')).toBe(100);
    });
  });

  describe('Value Updates', () => {
    it('updates spacing when input changes', async () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', 50);

      expect(frameConfig.spacing.value).toBe(50);
    });

    it('updates to minimum value', async () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', FRAME_CONSTRAINTS.minSpacing);

      expect(frameConfig.spacing.value).toBe(FRAME_CONSTRAINTS.minSpacing);
    });

    it('updates to maximum value', async () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', FRAME_CONSTRAINTS.maxSpacing);

      expect(frameConfig.spacing.value).toBe(FRAME_CONSTRAINTS.maxSpacing);
    });

    it('updates to zero', async () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', 0);

      expect(frameConfig.spacing.value).toBe(0);
    });

    it('accepts intermediate values', async () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', 250);

      expect(frameConfig.spacing.value).toBe(250);
    });
  });

  describe('Validation', () => {
    it('shows no error for valid spacing', () => {
      frameConfig.updateSpacing(50);

      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);

      expect(baseInput.props('error')).toBe('');
    });

    it('shows error for spacing below minimum', async () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', -10);
      await wrapper.vm.$nextTick();

      expect(baseInput.props('error')).toBe(
        `Spacing must be at least ${FRAME_CONSTRAINTS.minSpacing}px`
      );
    });

    it('shows error for spacing above maximum', async () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', 600);
      await wrapper.vm.$nextTick();

      expect(baseInput.props('error')).toBe(
        `Spacing must not exceed ${FRAME_CONSTRAINTS.maxSpacing}px`
      );
    });

    it('shows no error at minimum boundary', async () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', FRAME_CONSTRAINTS.minSpacing);
      await wrapper.vm.$nextTick();

      expect(baseInput.props('error')).toBe('');
    });

    it('shows no error at maximum boundary', async () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', FRAME_CONSTRAINTS.maxSpacing);
      await wrapper.vm.$nextTick();

      expect(baseInput.props('error')).toBe('');
    });
  });

  describe('Blur Handling', () => {
    it('clamps value to minimum on blur when below range', async () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);

      // Set invalid value
      await baseInput.vm.$emit('update:modelValue', -50);
      await wrapper.vm.$nextTick();

      // Trigger blur
      await baseInput.vm.$emit('blur');
      await wrapper.vm.$nextTick();

      expect(frameConfig.spacing.value).toBe(FRAME_CONSTRAINTS.minSpacing);
    });

    it('clamps value to maximum on blur when above range', async () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);

      // Set invalid value
      await baseInput.vm.$emit('update:modelValue', 700);
      await wrapper.vm.$nextTick();

      // Trigger blur
      await baseInput.vm.$emit('blur');
      await wrapper.vm.$nextTick();

      expect(frameConfig.spacing.value).toBe(FRAME_CONSTRAINTS.maxSpacing);
    });

    it('does not change value on blur when valid', async () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);

      // Set valid value
      await baseInput.vm.$emit('update:modelValue', 100);
      await wrapper.vm.$nextTick();

      // Trigger blur
      await baseInput.vm.$emit('blur');
      await wrapper.vm.$nextTick();

      expect(frameConfig.spacing.value).toBe(100);
    });

    it('handles blur at minimum boundary', async () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', FRAME_CONSTRAINTS.minSpacing);
      await baseInput.vm.$emit('blur');
      await wrapper.vm.$nextTick();

      expect(frameConfig.spacing.value).toBe(FRAME_CONSTRAINTS.minSpacing);
    });

    it('handles blur at maximum boundary', async () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', FRAME_CONSTRAINTS.maxSpacing);
      await baseInput.vm.$emit('blur');
      await wrapper.vm.$nextTick();

      expect(frameConfig.spacing.value).toBe(FRAME_CONSTRAINTS.maxSpacing);
    });
  });

  describe('Reactivity', () => {
    it('updates input when spacing changes externally', async () => {
      const wrapper = mount(SpacingInput);

      frameConfig.updateSpacing(200);
      await wrapper.vm.$nextTick();

      const baseInput = wrapper.findComponent(BaseInput);
      expect(baseInput.props('modelValue')).toBe(200);
    });

    it('clears error when value becomes valid', async () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);

      // Set invalid value
      await baseInput.vm.$emit('update:modelValue', 600);
      await wrapper.vm.$nextTick();
      expect(baseInput.props('error')).toBeTruthy();

      // Set valid value
      await baseInput.vm.$emit('update:modelValue', 100);
      await wrapper.vm.$nextTick();
      expect(baseInput.props('error')).toBe('');
    });

    it('updates error when value becomes invalid', async () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);

      // Set valid value
      await baseInput.vm.$emit('update:modelValue', 100);
      await wrapper.vm.$nextTick();
      expect(baseInput.props('error')).toBe('');

      // Set invalid value
      await baseInput.vm.$emit('update:modelValue', -10);
      await wrapper.vm.$nextTick();
      expect(baseInput.props('error')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles zero spacing', async () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', 0);
      await wrapper.vm.$nextTick();

      expect(frameConfig.spacing.value).toBe(0);
      expect(baseInput.props('error')).toBe('');
    });

    it('handles multiple rapid value changes', async () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', 10);
      await baseInput.vm.$emit('update:modelValue', 50);
      await baseInput.vm.$emit('update:modelValue', 100);
      await wrapper.vm.$nextTick();

      expect(frameConfig.spacing.value).toBe(100);
    });

    it('handles clamping negative values multiple times', async () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);

      // First invalid value
      await baseInput.vm.$emit('update:modelValue', -10);
      await baseInput.vm.$emit('blur');
      await wrapper.vm.$nextTick();
      expect(frameConfig.spacing.value).toBe(FRAME_CONSTRAINTS.minSpacing);

      // Second invalid value
      await baseInput.vm.$emit('update:modelValue', -20);
      await baseInput.vm.$emit('blur');
      await wrapper.vm.$nextTick();
      expect(frameConfig.spacing.value).toBe(FRAME_CONSTRAINTS.minSpacing);
    });

    it('handles clamping excessive values multiple times', async () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);

      // First invalid value
      await baseInput.vm.$emit('update:modelValue', 600);
      await baseInput.vm.$emit('blur');
      await wrapper.vm.$nextTick();
      expect(frameConfig.spacing.value).toBe(FRAME_CONSTRAINTS.maxSpacing);

      // Second invalid value
      await baseInput.vm.$emit('update:modelValue', 700);
      await baseInput.vm.$emit('blur');
      await wrapper.vm.$nextTick();
      expect(frameConfig.spacing.value).toBe(FRAME_CONSTRAINTS.maxSpacing);
    });
  });

  describe('Integration with BaseInput', () => {
    it('passes correct props to BaseInput', () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);

      expect(baseInput.props()).toMatchObject({
        type: 'number',
        label: 'Spacing',
        unit: 'px',
        min: FRAME_CONSTRAINTS.minSpacing,
        max: FRAME_CONSTRAINTS.maxSpacing,
        step: 10,
      });
    });

    it('uses v-model binding with BaseInput', async () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);

      // Check initial binding
      expect(baseInput.props('modelValue')).toBe(frameConfig.spacing.value);

      // Update value
      await baseInput.vm.$emit('update:modelValue', 150);

      // Check value updated through v-model
      expect(frameConfig.spacing.value).toBe(150);
    });

    it('forwards blur event to BaseInput', async () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);

      // Set invalid value and blur
      await baseInput.vm.$emit('update:modelValue', -10);
      await baseInput.vm.$emit('blur');
      await wrapper.vm.$nextTick();

      // Verify handleBlur was called (value was clamped)
      expect(frameConfig.spacing.value).toBe(FRAME_CONSTRAINTS.minSpacing);
    });
  });

  describe('Component Composition', () => {
    it('is a wrapper around BaseInput', () => {
      const wrapper = mount(SpacingInput);
      expect(wrapper.findComponent(BaseInput).exists()).toBe(true);
      expect(wrapper.findAllComponents(BaseInput)).toHaveLength(1);
    });

    it('has BaseInput as direct child', () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);

      expect(baseInput.exists()).toBe(true);
      expect(wrapper.html()).toContain('data-testid="number-input"');
    });
  });

  describe('Constraints Verification', () => {
    it('uses FRAME_CONSTRAINTS.minSpacing constant', () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);
      expect(baseInput.props('min')).toBe(FRAME_CONSTRAINTS.minSpacing);
      expect(FRAME_CONSTRAINTS.minSpacing).toBe(0);
    });

    it('uses FRAME_CONSTRAINTS.maxSpacing constant', () => {
      const wrapper = mount(SpacingInput);
      const baseInput = wrapper.findComponent(BaseInput);
      expect(baseInput.props('max')).toBe(FRAME_CONSTRAINTS.maxSpacing);
      expect(FRAME_CONSTRAINTS.maxSpacing).toBe(500);
    });
  });
});

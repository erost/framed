import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import FrameSizeInput from '@/components/controls/FrameSizeInput.vue';
import BaseInput from '@/components/shared/BaseInput.vue';
import { useFrameConfig } from '@/composables/useFrameConfig';
import { FRAME_CONSTRAINTS } from '@/utils/constants';

describe('FrameSizeInput', () => {
  let frameConfig;

  beforeEach(() => {
    frameConfig = useFrameConfig();
    frameConfig.reset();
  });

  describe('Rendering', () => {
    it('renders BaseInput component', () => {
      const wrapper = mount(FrameSizeInput);
      expect(wrapper.findComponent(BaseInput).exists()).toBe(true);
    });

    it('renders with default test ID', () => {
      const wrapper = mount(FrameSizeInput);
      expect(wrapper.attributes('data-testid')).toBe('frame-size-input');
    });

    it('renders with custom test ID', () => {
      const wrapper = mount(FrameSizeInput, {
        props: { testId: 'custom-frame-size' },
      });
      expect(wrapper.attributes('data-testid')).toBe('custom-frame-size');
    });

    it('displays frame size label', () => {
      const wrapper = mount(FrameSizeInput);
      expect(wrapper.text()).toContain('Frame Size');
    });

    it('displays px unit', () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);
      expect(baseInput.props('unit')).toBe('px');
    });

    it('displays hint with range information', () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);
      expect(baseInput.props('hint')).toBe(
        `range(${FRAME_CONSTRAINTS.minSize}px:${FRAME_CONSTRAINTS.maxSize}px)`
      );
    });
  });

  describe('Input Configuration', () => {
    it('has number type', () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);
      expect(baseInput.props('type')).toBe('number');
    });

    it('sets minimum constraint', () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);
      expect(baseInput.props('min')).toBe(FRAME_CONSTRAINTS.minSize);
    });

    it('sets maximum constraint', () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);
      expect(baseInput.props('max')).toBe(FRAME_CONSTRAINTS.maxSize);
    });

    it('sets step to 100', () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);
      expect(baseInput.props('step')).toBe(100);
    });
  });

  describe('Initial Value', () => {
    it('displays default frame size value', () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);
      expect(baseInput.props('modelValue')).toBe(frameConfig.frameSize.value);
    });

    it('displays custom frame size value from config', async () => {
      frameConfig.updateFrameSize(2000);

      const wrapper = mount(FrameSizeInput);
      await wrapper.vm.$nextTick();

      const baseInput = wrapper.findComponent(BaseInput);
      expect(baseInput.props('modelValue')).toBe(2000);
    });
  });

  describe('Value Updates', () => {
    it('updates frame size when input changes', async () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', 1500);

      expect(frameConfig.frameSize.value).toBe(1500);
    });

    it('updates to minimum value', async () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', FRAME_CONSTRAINTS.minSize);

      expect(frameConfig.frameSize.value).toBe(FRAME_CONSTRAINTS.minSize);
    });

    it('updates to maximum value', async () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', FRAME_CONSTRAINTS.maxSize);

      expect(frameConfig.frameSize.value).toBe(FRAME_CONSTRAINTS.maxSize);
    });

    it('accepts intermediate values', async () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', 5000);

      expect(frameConfig.frameSize.value).toBe(5000);
    });

    it('accepts values in steps of 100', async () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', 3200);

      expect(frameConfig.frameSize.value).toBe(3200);
    });
  });

  describe('Validation', () => {
    it('shows no error for valid frame size', () => {
      frameConfig.updateFrameSize(2000);

      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      expect(baseInput.props('error')).toBe('');
    });

    it('shows error for frame size below minimum', async () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', 500);
      await wrapper.vm.$nextTick();

      expect(baseInput.props('error')).toBe(
        `Frame size must be at least ${FRAME_CONSTRAINTS.minSize}px`
      );
    });

    it('shows error for frame size above maximum', async () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', 15000);
      await wrapper.vm.$nextTick();

      expect(baseInput.props('error')).toBe(
        `Frame size must not exceed ${FRAME_CONSTRAINTS.maxSize}px`
      );
    });

    it('shows no error at minimum boundary', async () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', FRAME_CONSTRAINTS.minSize);
      await wrapper.vm.$nextTick();

      expect(baseInput.props('error')).toBe('');
    });

    it('shows no error at maximum boundary', async () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', FRAME_CONSTRAINTS.maxSize);
      await wrapper.vm.$nextTick();

      expect(baseInput.props('error')).toBe('');
    });

    it('shows error for zero value', async () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', 0);
      await wrapper.vm.$nextTick();

      expect(baseInput.props('error')).toBe(
        `Frame size must be at least ${FRAME_CONSTRAINTS.minSize}px`
      );
    });
  });

  describe('Blur Handling', () => {
    it('clamps value to minimum on blur when below range', async () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      // Set invalid value
      await baseInput.vm.$emit('update:modelValue', 500);
      await wrapper.vm.$nextTick();

      // Trigger blur
      await baseInput.vm.$emit('blur');
      await wrapper.vm.$nextTick();

      expect(frameConfig.frameSize.value).toBe(FRAME_CONSTRAINTS.minSize);
    });

    it('clamps value to maximum on blur when above range', async () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      // Set invalid value
      await baseInput.vm.$emit('update:modelValue', 15000);
      await wrapper.vm.$nextTick();

      // Trigger blur
      await baseInput.vm.$emit('blur');
      await wrapper.vm.$nextTick();

      expect(frameConfig.frameSize.value).toBe(FRAME_CONSTRAINTS.maxSize);
    });

    it('does not change value on blur when valid', async () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      // Set valid value
      await baseInput.vm.$emit('update:modelValue', 2000);
      await wrapper.vm.$nextTick();

      // Trigger blur
      await baseInput.vm.$emit('blur');
      await wrapper.vm.$nextTick();

      expect(frameConfig.frameSize.value).toBe(2000);
    });

    it('handles blur at minimum boundary', async () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', FRAME_CONSTRAINTS.minSize);
      await baseInput.vm.$emit('blur');
      await wrapper.vm.$nextTick();

      expect(frameConfig.frameSize.value).toBe(FRAME_CONSTRAINTS.minSize);
    });

    it('handles blur at maximum boundary', async () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', FRAME_CONSTRAINTS.maxSize);
      await baseInput.vm.$emit('blur');
      await wrapper.vm.$nextTick();

      expect(frameConfig.frameSize.value).toBe(FRAME_CONSTRAINTS.maxSize);
    });

    it('clamps zero value to minimum on blur', async () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', 0);
      await baseInput.vm.$emit('blur');
      await wrapper.vm.$nextTick();

      expect(frameConfig.frameSize.value).toBe(FRAME_CONSTRAINTS.minSize);
    });
  });

  describe('Reactivity', () => {
    it('updates input when frame size changes externally', async () => {
      const wrapper = mount(FrameSizeInput);

      frameConfig.updateFrameSize(3000);
      await wrapper.vm.$nextTick();

      const baseInput = wrapper.findComponent(BaseInput);
      expect(baseInput.props('modelValue')).toBe(3000);
    });

    it('clears error when value becomes valid', async () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      // Set invalid value
      await baseInput.vm.$emit('update:modelValue', 15000);
      await wrapper.vm.$nextTick();
      expect(baseInput.props('error')).toBeTruthy();

      // Set valid value
      await baseInput.vm.$emit('update:modelValue', 2000);
      await wrapper.vm.$nextTick();
      expect(baseInput.props('error')).toBe('');
    });

    it('updates error when value becomes invalid', async () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      // Set valid value
      await baseInput.vm.$emit('update:modelValue', 2000);
      await wrapper.vm.$nextTick();
      expect(baseInput.props('error')).toBe('');

      // Set invalid value
      await baseInput.vm.$emit('update:modelValue', 500);
      await wrapper.vm.$nextTick();
      expect(baseInput.props('error')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles multiple rapid value changes', async () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', 1000);
      await baseInput.vm.$emit('update:modelValue', 2000);
      await baseInput.vm.$emit('update:modelValue', 3000);
      await wrapper.vm.$nextTick();

      expect(frameConfig.frameSize.value).toBe(3000);
    });

    it('handles clamping below minimum multiple times', async () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      // First invalid value
      await baseInput.vm.$emit('update:modelValue', 500);
      await baseInput.vm.$emit('blur');
      await wrapper.vm.$nextTick();
      expect(frameConfig.frameSize.value).toBe(FRAME_CONSTRAINTS.minSize);

      // Second invalid value
      await baseInput.vm.$emit('update:modelValue', 300);
      await baseInput.vm.$emit('blur');
      await wrapper.vm.$nextTick();
      expect(frameConfig.frameSize.value).toBe(FRAME_CONSTRAINTS.minSize);
    });

    it('handles clamping above maximum multiple times', async () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      // First invalid value
      await baseInput.vm.$emit('update:modelValue', 12000);
      await baseInput.vm.$emit('blur');
      await wrapper.vm.$nextTick();
      expect(frameConfig.frameSize.value).toBe(FRAME_CONSTRAINTS.maxSize);

      // Second invalid value
      await baseInput.vm.$emit('update:modelValue', 15000);
      await baseInput.vm.$emit('blur');
      await wrapper.vm.$nextTick();
      expect(frameConfig.frameSize.value).toBe(FRAME_CONSTRAINTS.maxSize);
    });

    it('handles alternating valid and invalid values', async () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      // Valid
      await baseInput.vm.$emit('update:modelValue', 2000);
      await wrapper.vm.$nextTick();
      expect(baseInput.props('error')).toBe('');

      // Invalid
      await baseInput.vm.$emit('update:modelValue', 15000);
      await wrapper.vm.$nextTick();
      expect(baseInput.props('error')).toBeTruthy();

      // Valid again
      await baseInput.vm.$emit('update:modelValue', 3000);
      await wrapper.vm.$nextTick();
      expect(baseInput.props('error')).toBe('');
    });

    it('handles large step increments', async () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', 1000);
      await wrapper.vm.$nextTick();
      expect(frameConfig.frameSize.value).toBe(1000);

      await baseInput.vm.$emit('update:modelValue', 9000);
      await wrapper.vm.$nextTick();
      expect(frameConfig.frameSize.value).toBe(9000);
    });
  });

  describe('Integration with BaseInput', () => {
    it('passes correct props to BaseInput', () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      expect(baseInput.props()).toMatchObject({
        type: 'number',
        label: 'Frame Size',
        unit: 'px',
        min: FRAME_CONSTRAINTS.minSize,
        max: FRAME_CONSTRAINTS.maxSize,
        step: 100,
      });
    });

    it('uses v-model binding with BaseInput', async () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      // Check initial binding
      expect(baseInput.props('modelValue')).toBe(frameConfig.frameSize.value);

      // Update value
      await baseInput.vm.$emit('update:modelValue', 4500);

      // Check value updated through v-model
      expect(frameConfig.frameSize.value).toBe(4500);
    });

    it('forwards blur event to BaseInput', async () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      // Set invalid value and blur
      await baseInput.vm.$emit('update:modelValue', 500);
      await baseInput.vm.$emit('blur');
      await wrapper.vm.$nextTick();

      // Verify handleBlur was called (value was clamped)
      expect(frameConfig.frameSize.value).toBe(FRAME_CONSTRAINTS.minSize);
    });
  });

  describe('Component Composition', () => {
    it('is a wrapper around BaseInput', () => {
      const wrapper = mount(FrameSizeInput);
      expect(wrapper.findComponent(BaseInput).exists()).toBe(true);
      expect(wrapper.findAllComponents(BaseInput)).toHaveLength(1);
    });

    it('has BaseInput as direct child', () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      expect(baseInput.exists()).toBe(true);
      expect(wrapper.html()).toContain('data-testid="number-input"');
    });
  });

  describe('Constraints Verification', () => {
    it('uses FRAME_CONSTRAINTS.minSize constant', () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);
      expect(baseInput.props('min')).toBe(FRAME_CONSTRAINTS.minSize);
      expect(FRAME_CONSTRAINTS.minSize).toBe(800);
    });

    it('uses FRAME_CONSTRAINTS.maxSize constant', () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);
      expect(baseInput.props('max')).toBe(FRAME_CONSTRAINTS.maxSize);
      expect(FRAME_CONSTRAINTS.maxSize).toBe(10000);
    });

    it('has larger step size than SpacingInput', () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);
      expect(baseInput.props('step')).toBe(100);
    });
  });

  describe('Real-world Scenarios', () => {
    it('handles typical frame sizes', async () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      const commonSizes = [1920, 2560, 3840, 4096];

      for (const size of commonSizes) {
        await baseInput.vm.$emit('update:modelValue', size);
        await wrapper.vm.$nextTick();
        expect(frameConfig.frameSize.value).toBe(size);
        expect(baseInput.props('error')).toBe('');
      }
    });

    it('provides helpful error for too small frames', async () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', 640);
      await wrapper.vm.$nextTick();

      expect(baseInput.props('error')).toContain('at least');
      expect(baseInput.props('error')).toContain('800');
    });

    it('provides helpful error for too large frames', async () => {
      const wrapper = mount(FrameSizeInput);
      const baseInput = wrapper.findComponent(BaseInput);

      await baseInput.vm.$emit('update:modelValue', 20000);
      await wrapper.vm.$nextTick();

      expect(baseInput.props('error')).toContain('not exceed');
      expect(baseInput.props('error')).toContain('10000');
    });
  });
});

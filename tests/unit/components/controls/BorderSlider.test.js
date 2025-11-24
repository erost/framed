import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import BorderSlider from '@/components/controls/BorderSlider.vue';
import { useFrameConfig } from '@/composables/useFrameConfig';
import { FRAME_CONSTRAINTS } from '@/utils/constants';

describe('BorderSlider', () => {
  let frameConfig;

  beforeEach(() => {
    frameConfig = useFrameConfig();
    frameConfig.reset();
  });


  describe('Initial Value', () => {
    it('displays default border percentage value', () => {
      const wrapper = mount(BorderSlider);
      const input = wrapper.find('input[type="range"]');
      expect(input.element.value).toBe(String(frameConfig.borderPercentage.value));
    });

    it('displays custom border percentage value from config', async () => {
      frameConfig.updateBorderPercentage(10);

      const wrapper = mount(BorderSlider);
      await wrapper.vm.$nextTick();

      const input = wrapper.find('input[type="range"]');
      expect(input.element.value).toBe('10');
    });

    it('updates label with current value', () => {
      frameConfig.updateBorderPercentage(5);
      const wrapper = mount(BorderSlider);

      const valueLabel = wrapper.find('[data-testid="border-slider-value-label"]');
      expect(valueLabel.text()).toBe('5');
    });
  });

  describe('Value Updates', () => {
    it('updates border percentage when slider changes', async () => {
      const wrapper = mount(BorderSlider);
      const input = wrapper.find('input[type="range"]');

      await input.setValue(10);

      expect(frameConfig.borderPercentage.value).toBe(10);
    });

    it('updates to minimum value', async () => {
      const wrapper = mount(BorderSlider);
      const input = wrapper.find('input[type="range"]');

      await input.setValue(FRAME_CONSTRAINTS.minBorderPercentage);

      expect(frameConfig.borderPercentage.value).toBe(FRAME_CONSTRAINTS.minBorderPercentage);
    });

    it('updates to maximum value', async () => {
      const wrapper = mount(BorderSlider);
      const input = wrapper.find('input[type="range"]');

      await input.setValue(FRAME_CONSTRAINTS.maxBorderPercentage);

      expect(frameConfig.borderPercentage.value).toBe(FRAME_CONSTRAINTS.maxBorderPercentage);
    });

    it('accepts intermediate values', async () => {
      const wrapper = mount(BorderSlider);
      const input = wrapper.find('input[type="range"]');

      await input.setValue(15);

      expect(frameConfig.borderPercentage.value).toBe(15);
    });

    it('updates label when value changes', async () => {
      const wrapper = mount(BorderSlider);
      const input = wrapper.find('input[type="range"]');

      await input.setValue(12);
      await wrapper.vm.$nextTick();

      const valueLabel = wrapper.find('[data-testid="border-slider-value-label"]');
      expect(valueLabel.text()).toBe('12');
    });
  });

  describe('Reactivity', () => {
    it('updates input when border percentage changes externally', async () => {
      const wrapper = mount(BorderSlider);

      frameConfig.updateBorderPercentage(8);
      await wrapper.vm.$nextTick();

      const input = wrapper.find('input[type="range"]');
      expect(input.element.value).toBe('8');
    });

    it('updates label when border percentage changes externally', async () => {
      const wrapper = mount(BorderSlider);

      frameConfig.updateBorderPercentage(20);
      await wrapper.vm.$nextTick();

      const valueLabel = wrapper.find('[data-testid="border-slider-value-label"]');
      expect(valueLabel.text()).toBe('20');
    });
  });

  describe('Edge Cases', () => {
    it('handles multiple rapid value changes', async () => {
      const wrapper = mount(BorderSlider);
      const input = wrapper.find('input[type="range"]');

      await input.setValue(5);
      await input.setValue(10);
      await input.setValue(15);
      await wrapper.vm.$nextTick();

      expect(frameConfig.borderPercentage.value).toBe(15);
    });

    it('handles minimum boundary', async () => {
      const wrapper = mount(BorderSlider);
      const input = wrapper.find('input[type="range"]');

      await input.setValue(FRAME_CONSTRAINTS.minBorderPercentage);
      await wrapper.vm.$nextTick();

      expect(frameConfig.borderPercentage.value).toBe(FRAME_CONSTRAINTS.minBorderPercentage);
      const valueLabel = wrapper.find('[data-testid="border-slider-value-label"]');
      expect(valueLabel.text()).toBe(String(FRAME_CONSTRAINTS.minBorderPercentage));
    });

    it('handles maximum boundary', async () => {
      const wrapper = mount(BorderSlider);
      const input = wrapper.find('input[type="range"]');

      await input.setValue(FRAME_CONSTRAINTS.maxBorderPercentage);
      await wrapper.vm.$nextTick();

      expect(frameConfig.borderPercentage.value).toBe(FRAME_CONSTRAINTS.maxBorderPercentage);
      const valueLabel = wrapper.find('[data-testid="border-slider-value-label"]');
      expect(valueLabel.text()).toBe(String(FRAME_CONSTRAINTS.maxBorderPercentage));
    });

    it('handles alternating values', async () => {
      const wrapper = mount(BorderSlider);
      const input = wrapper.find('input[type="range"]');

      await input.setValue(3);
      await wrapper.vm.$nextTick();
      expect(frameConfig.borderPercentage.value).toBe(3);

      await input.setValue(20);
      await wrapper.vm.$nextTick();
      expect(frameConfig.borderPercentage.value).toBe(20);

      await input.setValue(7);
      await wrapper.vm.$nextTick();
      expect(frameConfig.borderPercentage.value).toBe(7);
    });

    it('handles large jumps in value', async () => {
      const wrapper = mount(BorderSlider);
      const input = wrapper.find('input[type="range"]');

      await input.setValue(1);
      await wrapper.vm.$nextTick();
      expect(frameConfig.borderPercentage.value).toBe(1);

      await input.setValue(25);
      await wrapper.vm.$nextTick();
      expect(frameConfig.borderPercentage.value).toBe(25);
    });
  });

  describe('Integration', () => {
    it('works with frame configuration composable', async () => {
      const wrapper = mount(BorderSlider);
      const input = wrapper.find('input[type="range"]');

      // Initial state
      const initialValue = frameConfig.borderPercentage.value;

      // Change value
      await input.setValue(18);

      // Verify config updated
      expect(frameConfig.borderPercentage.value).toBe(18);
      expect(frameConfig.borderPercentage.value).not.toBe(initialValue);
    });

    it('responds to external config changes', async () => {
      const wrapper = mount(BorderSlider);

      // Change externally
      frameConfig.updateBorderPercentage(14);
      await wrapper.vm.$nextTick();

      // Verify UI updated
      const input = wrapper.find('input[type="range"]');
      expect(input.element.value).toBe('14');
      const valueLabel = wrapper.find('[data-testid="border-slider-value-label"]');
      expect(valueLabel.text()).toBe('14');
    });
  });


  describe('Real-world Scenarios', () => {
    it('handles typical border percentages', async () => {
      const wrapper = mount(BorderSlider);
      const input = wrapper.find('input[type="range"]');
      const valueLabel = wrapper.find('[data-testid="border-slider-value-label"]');

      const commonValues = [2, 5, 10, 15, 20];

      for (const value of commonValues) {
        await input.setValue(value);
        await wrapper.vm.$nextTick();
        expect(frameConfig.borderPercentage.value).toBe(value);
        expect(valueLabel.text()).toBe(String(value));
      }
    });
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import QualitySlider from '@/components/controls/QualitySlider.vue';
import { useCanvasRenderer } from '@/composables/useCanvasRenderer';

describe('QualitySlider', () => {
  let canvasRenderer;

  beforeEach(() => {
    canvasRenderer = useCanvasRenderer();
    canvasRenderer.updateQuality(80); // Reset to default
  });

  describe('Rendering', () => {
    it('renders slider container', () => {
      const wrapper = mount(QualitySlider);
      expect(wrapper.find('[data-testid="quality-range-input"]').exists()).toBe(true);
    });

    it('renders with default test ID', () => {
      const wrapper = mount(QualitySlider);
      expect(wrapper.vm.testId).toBe('quality-slider');
    });

    it('renders with custom test ID', () => {
      const wrapper = mount(QualitySlider, {
        props: { testId: 'custom-quality' },
      });
      expect(wrapper.vm.testId).toBe('custom-quality');
    });

    it('displays value in label', () => {
      const wrapper = mount(QualitySlider);
      const valueLabel = wrapper.find('[data-testid="quality-value-label"]');
      expect(valueLabel.exists()).toBe(true);
      expect(valueLabel.text()).toBeTruthy();
    });
  });

  describe('Input Configuration', () => {
    it('has range type', () => {
      const wrapper = mount(QualitySlider);
      const input = wrapper.find('input[type="range"]');
      expect(input.exists()).toBe(true);
    });

    it('sets minimum to 1', () => {
      const wrapper = mount(QualitySlider);
      const input = wrapper.find('input[type="range"]');
      expect(input.attributes('min')).toBe('1');
    });

    it('sets maximum to 100', () => {
      const wrapper = mount(QualitySlider);
      const input = wrapper.find('input[type="range"]');
      expect(input.attributes('max')).toBe('100');
    });

    it('has name attribute', () => {
      const wrapper = mount(QualitySlider);
      const input = wrapper.find('input[type="range"]');
      expect(input.attributes('name')).toBe('quality');
    });
  });

  describe('Initial Value', () => {
    it('displays default quality value', () => {
      const wrapper = mount(QualitySlider);
      const input = wrapper.find('input[type="range"]');
      expect(input.element.value).toBe(String(canvasRenderer.quality.value));
    });

    it('displays custom quality value from config', async () => {
      canvasRenderer.updateQuality(50);

      const wrapper = mount(QualitySlider);
      await wrapper.vm.$nextTick();

      const input = wrapper.find('input[type="range"]');
      expect(input.element.value).toBe('50');
    });

    it('updates label with current value', () => {
      canvasRenderer.updateQuality(75);
      const wrapper = mount(QualitySlider);

      const valueLabel = wrapper.find('[data-testid="quality-value-label"]');
      expect(valueLabel.text()).toBe('75');
    });
  });

  describe('Value Updates', () => {
    it('updates quality when slider changes', async () => {
      const wrapper = mount(QualitySlider);
      const input = wrapper.find('input[type="range"]');

      await input.setValue(90);

      expect(canvasRenderer.quality.value).toBe(90);
    });

    it('updates to minimum value', async () => {
      const wrapper = mount(QualitySlider);
      const input = wrapper.find('input[type="range"]');

      await input.setValue(1);

      expect(canvasRenderer.quality.value).toBe(1);
    });

    it('updates to maximum value', async () => {
      const wrapper = mount(QualitySlider);
      const input = wrapper.find('input[type="range"]');

      await input.setValue(100);

      expect(canvasRenderer.quality.value).toBe(100);
    });

    it('accepts intermediate values', async () => {
      const wrapper = mount(QualitySlider);
      const input = wrapper.find('input[type="range"]');

      await input.setValue(65);

      expect(canvasRenderer.quality.value).toBe(65);
    });

    it('updates label when value changes', async () => {
      const wrapper = mount(QualitySlider);
      const input = wrapper.find('input[type="range"]');

      await input.setValue(55);
      await wrapper.vm.$nextTick();

      const valueLabel = wrapper.find('[data-testid="quality-value-label"]');
      expect(valueLabel.text()).toBe('55');
    });
  });

  describe('Reactivity', () => {
    it('updates input when quality changes externally', async () => {
      const wrapper = mount(QualitySlider);

      canvasRenderer.updateQuality(45);
      await wrapper.vm.$nextTick();

      const input = wrapper.find('input[type="range"]');
      expect(input.element.value).toBe('45');
    });

    it('updates label when quality changes externally', async () => {
      const wrapper = mount(QualitySlider);

      canvasRenderer.updateQuality(95);
      await wrapper.vm.$nextTick();

      const valueLabel = wrapper.find('[data-testid="quality-value-label"]');
      expect(valueLabel.text()).toBe('95');
    });
  });

  describe('Edge Cases', () => {
    it('handles multiple rapid value changes', async () => {
      const wrapper = mount(QualitySlider);
      const input = wrapper.find('input[type="range"]');

      await input.setValue(25);
      await input.setValue(50);
      await input.setValue(75);
      await wrapper.vm.$nextTick();

      expect(canvasRenderer.quality.value).toBe(75);
    });

    it('handles minimum boundary', async () => {
      const wrapper = mount(QualitySlider);
      const input = wrapper.find('input[type="range"]');

      await input.setValue(1);
      await wrapper.vm.$nextTick();

      expect(canvasRenderer.quality.value).toBe(1);
      const valueLabel = wrapper.find('[data-testid="quality-value-label"]');
      expect(valueLabel.text()).toBe('1');
    });

    it('handles maximum boundary', async () => {
      const wrapper = mount(QualitySlider);
      const input = wrapper.find('input[type="range"]');

      await input.setValue(100);
      await wrapper.vm.$nextTick();

      expect(canvasRenderer.quality.value).toBe(100);
      const valueLabel = wrapper.find('[data-testid="quality-value-label"]');
      expect(valueLabel.text()).toBe('100');
    });

    it('handles alternating values', async () => {
      const wrapper = mount(QualitySlider);
      const input = wrapper.find('input[type="range"]');

      await input.setValue(30);
      await wrapper.vm.$nextTick();
      expect(canvasRenderer.quality.value).toBe(30);

      await input.setValue(70);
      await wrapper.vm.$nextTick();
      expect(canvasRenderer.quality.value).toBe(70);

      await input.setValue(40);
      await wrapper.vm.$nextTick();
      expect(canvasRenderer.quality.value).toBe(40);
    });

    it('handles large jumps in value', async () => {
      const wrapper = mount(QualitySlider);
      const input = wrapper.find('input[type="range"]');

      await input.setValue(1);
      await wrapper.vm.$nextTick();
      expect(canvasRenderer.quality.value).toBe(1);

      await input.setValue(100);
      await wrapper.vm.$nextTick();
      expect(canvasRenderer.quality.value).toBe(100);
    });
  });

  describe('Integration', () => {
    it('works with canvas renderer composable', async () => {
      const wrapper = mount(QualitySlider);
      const input = wrapper.find('input[type="range"]');

      // Initial state
      const initialValue = canvasRenderer.quality.value;

      // Change value
      await input.setValue(85);

      // Verify config updated
      expect(canvasRenderer.quality.value).toBe(85);
      expect(canvasRenderer.quality.value).not.toBe(initialValue);
    });

    it('responds to external config changes', async () => {
      const wrapper = mount(QualitySlider);

      // Change externally
      canvasRenderer.updateQuality(60);
      await wrapper.vm.$nextTick();

      // Verify UI updated
      const input = wrapper.find('input[type="range"]');
      expect(input.element.value).toBe('60');
      const valueLabel = wrapper.find('[data-testid="quality-value-label"]');
      expect(valueLabel.text()).toBe('60');
    });
  });

  describe('Real-world Scenarios', () => {
    it('handles typical quality percentages', async () => {
      const wrapper = mount(QualitySlider);
      const input = wrapper.find('input[type="range"]');
      const valueLabel = wrapper.find('[data-testid="quality-value-label"]');

      const commonValues = [50, 70, 80, 90, 100];

      for (const value of commonValues) {
        await input.setValue(value);
        await wrapper.vm.$nextTick();
        expect(canvasRenderer.quality.value).toBe(value);
        expect(valueLabel.text()).toBe(String(value));
      }
    });
  });
});

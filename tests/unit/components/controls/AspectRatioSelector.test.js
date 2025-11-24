import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import AspectRatioSelector from '@/components/controls/AspectRatioSelector.vue';
import { useFrameConfig } from '@/composables/useFrameConfig';
import { ASPECT_RATIOS } from '@/utils/constants';

describe('AspectRatioSelector', () => {
  let frameConfig;

  beforeEach(() => {
    frameConfig = useFrameConfig();
    frameConfig.reset();
  });

  describe('Initial Value', () => {
    it('reflects current aspect ratio from config', async () => {
      frameConfig.updateAspectRatio('16:9');

      const wrapper = mount(AspectRatioSelector);

      const button = wrapper.find('[data-testid="aspect-ratio-16-9"]');
      expect(button.attributes('aria-pressed')).toBe('true');
    });

    it('only one button is active at a time', () => {
      const wrapper = mount(AspectRatioSelector);

      const buttons = wrapper.findAll('button');
      const activeButtons = buttons.filter(
        (btn) => btn.attributes('aria-pressed') === 'true'
      );

      expect(activeButtons).toHaveLength(1);
    });
  });

  describe('Interaction', () => {
    it('updates aspect ratio when button is clicked', async () => {
      const wrapper = mount(AspectRatioSelector);
      const button = wrapper.find('[data-testid="aspect-ratio-4-3"]');

      await button.trigger('click');

      expect(frameConfig.aspectRatio.value).toBe('4:3');
    });

    it('updates for all available ratios', async () => {
      const wrapper = mount(AspectRatioSelector);

      for (const ratio of Object.keys(ASPECT_RATIOS)) {
        const testId = `aspect-ratio-${ratio.replace(':', '-')}`;
        const button = wrapper.find(`[data-testid="${testId}"]`);

        await button.trigger('click');
        expect(frameConfig.aspectRatio.value).toBe(ratio);
      }
    });

    it('switches active state when different button is clicked', async () => {
      const wrapper = mount(AspectRatioSelector);

      const button32 = wrapper.find('[data-testid="aspect-ratio-3-2"]');
      const button43 = wrapper.find('[data-testid="aspect-ratio-4-3"]');

      expect(button32.attributes('aria-pressed')).toBe('true');
      expect(button43.attributes('aria-pressed')).toBe('false');

      await button43.trigger('click');
      await wrapper.vm.$nextTick();

      expect(button32.attributes('aria-pressed')).toBe('false');
      expect(button43.attributes('aria-pressed')).toBe('true');
    });

    it('clicking active button does not cause error', async () => {
      const wrapper = mount(AspectRatioSelector);

      const button = wrapper.find('[data-testid="aspect-ratio-3-2"]');
      await button.trigger('click');
      await wrapper.vm.$nextTick();

      expect(button.attributes('aria-pressed')).toBe('true');
      expect(frameConfig.aspectRatio.value).toBe('3:2');
    });
  });

  describe('Reactivity', () => {
    it('updates display when aspect ratio changes externally', async () => {
      const wrapper = mount(AspectRatioSelector);

      frameConfig.updateAspectRatio('5:4');
      await wrapper.vm.$nextTick();

      const button = wrapper.find('[data-testid="aspect-ratio-5-4"]');
      expect(button.attributes('aria-pressed')).toBe('true');
    });

    it('previous button becomes inactive when ratio changes externally', async () => {
      const wrapper = mount(AspectRatioSelector);

      const button32 = wrapper.find('[data-testid="aspect-ratio-3-2"]');
      expect(button32.attributes('aria-pressed')).toBe('true');

      frameConfig.updateAspectRatio('16:9');
      await wrapper.vm.$nextTick();

      expect(button32.attributes('aria-pressed')).toBe('false');
    });
  });
});

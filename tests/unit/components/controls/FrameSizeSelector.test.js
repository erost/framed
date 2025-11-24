import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import FrameSizeSelector from '@/components/controls/FrameSizeSelector.vue';
import { useFrameConfig } from '@/composables/useFrameConfig';

describe('FrameSizeSelector', () => {
  let frameConfig;

  beforeEach(() => {
    frameConfig = useFrameConfig();
    frameConfig.reset();
  });

  describe('Interaction', () => {
    it('updates frame size when 1024px button is clicked', async () => {
      const wrapper = mount(FrameSizeSelector);
      const button = wrapper.find('[data-testid="frame-size-1024"]');

      await button.trigger('click');

      expect(frameConfig.frameSize.value).toBe(1024);
    });

    it('updates frame size when 2048px button is clicked', async () => {
      const wrapper = mount(FrameSizeSelector);
      const button = wrapper.find('[data-testid="frame-size-2048"]');

      await button.trigger('click');

      expect(frameConfig.frameSize.value).toBe(2048);
    });

    it('updates frame size when 4096px button is clicked', async () => {
      const wrapper = mount(FrameSizeSelector);
      const button = wrapper.find('[data-testid="frame-size-4096"]');

      await button.trigger('click');

      expect(frameConfig.frameSize.value).toBe(4096);
    });

    it('switches active state when different button is clicked', async () => {
      frameConfig.updateFrameSize(1024);
      const wrapper = mount(FrameSizeSelector);

      const button1024 = wrapper.find('[data-testid="frame-size-1024"]');
      const button2048 = wrapper.find('[data-testid="frame-size-2048"]');

      expect(button1024.attributes('aria-pressed')).toBe('true');
      expect(button2048.attributes('aria-pressed')).toBe('false');

      await button2048.trigger('click');
      await wrapper.vm.$nextTick();

      expect(button1024.attributes('aria-pressed')).toBe('false');
      expect(button2048.attributes('aria-pressed')).toBe('true');
    });

    it('clicking active button does not cause error', async () => {
      frameConfig.updateFrameSize(2048);
      const wrapper = mount(FrameSizeSelector);

      const button = wrapper.find('[data-testid="frame-size-2048"]');
      await button.trigger('click');
      await wrapper.vm.$nextTick();

      expect(button.attributes('aria-pressed')).toBe('true');
      expect(frameConfig.frameSize.value).toBe(2048);
    });
  });

  describe('Reactivity', () => {
    it('updates display when frame size changes externally', async () => {
      const wrapper = mount(FrameSizeSelector);

      frameConfig.updateFrameSize(4096);
      await wrapper.vm.$nextTick();

      const button = wrapper.find('[data-testid="frame-size-4096"]');
      expect(button.attributes('aria-pressed')).toBe('true');
    });

    it('previous button becomes inactive when size changes externally', async () => {
      frameConfig.updateFrameSize(1024);
      const wrapper = mount(FrameSizeSelector);

      const button1024 = wrapper.find('[data-testid="frame-size-1024"]');
      expect(button1024.attributes('aria-pressed')).toBe('true');

      frameConfig.updateFrameSize(2048);
      await wrapper.vm.$nextTick();

      expect(button1024.attributes('aria-pressed')).toBe('false');
    });
  });

  describe('Accessibility', () => {
    it('sets aria-pressed correctly', async () => {
      frameConfig.updateFrameSize(1024);
      const wrapper = mount(FrameSizeSelector);

      const button1024 = wrapper.find('[data-testid="frame-size-1024"]');
      const button2048 = wrapper.find('[data-testid="frame-size-2048"]');

      expect(button1024.attributes('aria-pressed')).toBe('true');
      expect(button2048.attributes('aria-pressed')).toBe('false');

      await button2048.trigger('click');
      await wrapper.vm.$nextTick();

      expect(button1024.attributes('aria-pressed')).toBe('false');
      expect(button2048.attributes('aria-pressed')).toBe('true');
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid button clicks', async () => {
      const wrapper = mount(FrameSizeSelector);

      const button1024 = wrapper.find('[data-testid="frame-size-1024"]');
      const button2048 = wrapper.find('[data-testid="frame-size-2048"]');
      const button4096 = wrapper.find('[data-testid="frame-size-4096"]');

      await button1024.trigger('click');
      await button2048.trigger('click');
      await button4096.trigger('click');
      await wrapper.vm.$nextTick();

      expect(frameConfig.frameSize.value).toBe(4096);
    });

    it('handles unknown size values gracefully', async () => {
      frameConfig.updateFrameSize(9999);
      const wrapper = mount(FrameSizeSelector);

      const buttons = wrapper.findAll('button');
      const activeButtons = buttons.filter(
        (btn) => btn.attributes('aria-pressed') === 'true'
      );

      // No button should be active for unknown size
      expect(activeButtons).toHaveLength(0);
    });
  });

  describe('Integration', () => {
    it('works with frame configuration composable', async () => {
      // Set initial size different from 2048
      frameConfig.updateFrameSize(1024);
      const wrapper = mount(FrameSizeSelector);

      // Initial state
      const initialSize = frameConfig.frameSize.value;

      // Click button
      const button = wrapper.find('[data-testid="frame-size-2048"]');
      await button.trigger('click');

      // Verify config updated
      expect(frameConfig.frameSize.value).toBe(2048);
      expect(frameConfig.frameSize.value).not.toBe(initialSize);
    });

    it('responds to external config changes', async () => {
      const wrapper = mount(FrameSizeSelector);

      // Change externally
      frameConfig.updateFrameSize(4096);
      await wrapper.vm.$nextTick();

      // Verify UI updated
      const button = wrapper.find('[data-testid="frame-size-4096"]');
      expect(button.attributes('aria-pressed')).toBe('true');
    });
  });
});

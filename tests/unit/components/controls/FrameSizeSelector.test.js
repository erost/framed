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

  describe('Rendering', () => {
    it('renders frame size button group', () => {
      const wrapper = mount(FrameSizeSelector);

      expect(wrapper.find('[role="group"]').exists()).toBe(true);
    });

    it('renders all frame size buttons', () => {
      const wrapper = mount(FrameSizeSelector);

      const buttons = wrapper.findAll('button');

      expect(buttons).toHaveLength(3);
    });

    it('renders correct button labels', () => {
      const wrapper = mount(FrameSizeSelector);

      const buttons = wrapper.findAll('button');
      const buttonTexts = buttons.map((btn) => btn.text());

      expect(buttonTexts).toContain('1024px');
      expect(buttonTexts).toContain('2048px');
      expect(buttonTexts).toContain('4096px');
    });

    it('has default test ID', () => {
      const wrapper = mount(FrameSizeSelector);

      expect(wrapper.attributes('data-testid')).toBe('frame-size-selector');
    });

    it('has custom test ID', () => {
      const wrapper = mount(FrameSizeSelector, {
        props: { testId: 'custom-size' },
      });

      expect(wrapper.attributes('data-testid')).toBe('custom-size');
    });
  });

  describe('Initial Value', () => {
    it('reflects current frame size from config', async () => {
      frameConfig.updateFrameSize(2048);

      const wrapper = mount(FrameSizeSelector);

      const button = wrapper.find('[data-testid="frame-size-2048"]');
      expect(button.attributes('aria-pressed')).toBe('true');
      expect(button.classes()).toContain('selector-btn-active');
    });

    it('only one button is active at a time', () => {
      const wrapper = mount(FrameSizeSelector);

      const buttons = wrapper.findAll('button');
      const activeButtons = buttons.filter(
        (btn) => btn.attributes('aria-pressed') === 'true'
      );

      expect(activeButtons.length).toBeLessThanOrEqual(1);
    });
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
      expect(button.classes()).toContain('selector-btn-active');
    });

    it('previous button becomes inactive when size changes externally', async () => {
      frameConfig.updateFrameSize(1024);
      const wrapper = mount(FrameSizeSelector);

      const button1024 = wrapper.find('[data-testid="frame-size-1024"]');
      expect(button1024.attributes('aria-pressed')).toBe('true');

      frameConfig.updateFrameSize(2048);
      await wrapper.vm.$nextTick();

      expect(button1024.attributes('aria-pressed')).toBe('false');
      expect(button1024.classes()).toContain('selector-btn-inactive');
    });
  });

  describe('Accessibility', () => {
    it('has role group', () => {
      const wrapper = mount(FrameSizeSelector);

      expect(wrapper.find('[role="group"]').exists()).toBe(true);
    });

    it('has aria-label on button group', () => {
      const wrapper = mount(FrameSizeSelector);

      expect(wrapper.find('[role="group"]').attributes('aria-label')).toBe('Frame size');
    });

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

    it('all buttons have scoped class with focus ring styles', () => {
      const wrapper = mount(FrameSizeSelector);

      const buttons = wrapper.findAll('button');
      buttons.forEach((button) => {
        expect(button.classes()).toContain('selector-btn');
      });
    });
  });

  describe('Visual Consistency', () => {
    it('active button has selector-btn-active class', () => {
      frameConfig.updateFrameSize(1024);
      const wrapper = mount(FrameSizeSelector);

      const activeButton = wrapper.find('[data-testid="frame-size-1024"]');
      expect(activeButton.classes()).toContain('selector-btn-active');
    });

    it('inactive buttons have selector-btn-inactive class', () => {
      frameConfig.updateFrameSize(1024);
      const wrapper = mount(FrameSizeSelector);

      const inactiveButton = wrapper.find('[data-testid="frame-size-2048"]');
      expect(inactiveButton.classes()).toContain('selector-btn-inactive');
    });
  });

  describe('Component Structure', () => {
    it('uses scoped CSS classes', () => {
      const wrapper = mount(FrameSizeSelector);

      const buttons = wrapper.findAll('button');
      buttons.forEach((button) => {
        expect(button.classes()).toContain('selector-btn');
      });
    });

    it('applies selector-btn-active to active button only', () => {
      frameConfig.updateFrameSize(1024);
      const wrapper = mount(FrameSizeSelector);

      const activeButton = wrapper.find('[data-testid="frame-size-1024"]');
      const inactiveButton = wrapper.find('[data-testid="frame-size-2048"]');

      expect(activeButton.classes()).toContain('selector-btn-active');
      expect(activeButton.classes()).not.toContain('selector-btn-inactive');

      expect(inactiveButton.classes()).toContain('selector-btn-inactive');
      expect(inactiveButton.classes()).not.toContain('selector-btn-active');
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

    it('all buttons have type="button"', () => {
      const wrapper = mount(FrameSizeSelector);

      const buttons = wrapper.findAll('button');
      buttons.forEach((button) => {
        expect(button.attributes('type')).toBe('button');
      });
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

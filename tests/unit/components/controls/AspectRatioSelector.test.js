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

  describe('Rendering', () => {
    it('renders aspect ratio button group', () => {
      const wrapper = mount(AspectRatioSelector);

      expect(wrapper.find('[role="group"]').exists()).toBe(true);
    });

    it('renders all aspect ratio buttons', () => {
      const wrapper = mount(AspectRatioSelector);

      const buttons = wrapper.findAll('button');
      const ratioCount = Object.keys(ASPECT_RATIOS).length;

      expect(buttons).toHaveLength(ratioCount);
    });

    it('renders correct button labels', () => {
      const wrapper = mount(AspectRatioSelector);

      const buttons = wrapper.findAll('button');
      const buttonTexts = buttons.map((btn) => btn.text());

      expect(buttonTexts).toContain('3:2');
      expect(buttonTexts).toContain('4:3');
      expect(buttonTexts).toContain('5:4');
      expect(buttonTexts).toContain('16:9');
    });

    it('has full-width flex layout', () => {
      const wrapper = mount(AspectRatioSelector);

      const buttonGroup = wrapper.find('[role="group"]');
      expect(buttonGroup.classes()).toContain('flex');
      expect(buttonGroup.classes()).toContain('w-full');
      expect(buttonGroup.classes()).not.toContain('inline-flex');
    });

    it('has proper styling classes', () => {
      const wrapper = mount(AspectRatioSelector);

      const buttonGroup = wrapper.find('[role="group"]');
      expect(buttonGroup.classes()).toContain('rounded-lg');
      expect(buttonGroup.classes()).toContain('border');
      expect(buttonGroup.classes()).toContain('bg-gray-50');
    });

    it('buttons are always side by side (no flex-col)', () => {
      const wrapper = mount(AspectRatioSelector);

      const buttonGroup = wrapper.find('[role="group"]');
      expect(buttonGroup.classes()).not.toContain('flex-col');
    });

    it('buttons use scoped CSS class with flex-1', () => {
      const wrapper = mount(AspectRatioSelector);

      const buttons = wrapper.findAll('button');
      buttons.forEach((button) => {
        // Buttons should have the base class that includes flex-1 in scoped CSS
        expect(button.classes()).toContain('ratio-btn');
      });
    });
  });

  describe('Initial Value', () => {
    it('3:2 button is active by default', () => {
      const wrapper = mount(AspectRatioSelector);

      const button = wrapper.find('[data-testid="aspect-ratio-3-2"]');
      expect(button.attributes('aria-pressed')).toBe('true');
      expect(button.classes()).toContain('btn-active');
    });

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

  describe('Accessibility', () => {
    it('has role group', () => {
      const wrapper = mount(AspectRatioSelector);

      expect(wrapper.find('[role="group"]').exists()).toBe(true);
    });

    it('has aria-label on button group', () => {
      const wrapper = mount(AspectRatioSelector);

      expect(wrapper.find('[role="group"]').attributes('aria-label')).toBe('Frame aspect ratio');
    });

    it('sets aria-pressed correctly', async () => {
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

    it('has custom test ID', () => {
      const wrapper = mount(AspectRatioSelector, {
        props: { testId: 'custom-ratio' },
      });

      expect(wrapper.attributes('data-testid')).toBe('custom-ratio');
    });

    it('all buttons have scoped class with focus ring styles', () => {
      const wrapper = mount(AspectRatioSelector);

      const buttons = wrapper.findAll('button');
      buttons.forEach((button) => {
        // All buttons should have the base class that includes focus:ring in scoped CSS
        expect(button.classes()).toContain('ratio-btn');
      });
    });
  });

  describe('Visual Consistency', () => {
    it('matches OrientationToggle visual style with border and rounded corners', () => {
      const wrapper = mount(AspectRatioSelector);

      const buttonGroup = wrapper.find('[role="group"]');
      expect(buttonGroup.classes()).toContain('border');
      expect(buttonGroup.classes()).toContain('rounded-lg');
      expect(buttonGroup.classes()).toContain('border-gray-300');
    });

    it('has same background color as OrientationToggle', () => {
      const wrapper = mount(AspectRatioSelector);

      const buttonGroup = wrapper.find('[role="group"]');
      expect(buttonGroup.classes()).toContain('bg-gray-50');
    });

    it('active button has btn-active class', () => {
      const wrapper = mount(AspectRatioSelector);

      const activeButton = wrapper.find('[data-testid="aspect-ratio-3-2"]');
      expect(activeButton.classes()).toContain('btn-active');
    });

    it('inactive buttons have btn-inactive class', () => {
      const wrapper = mount(AspectRatioSelector);

      const inactiveButton = wrapper.find('[data-testid="aspect-ratio-4-3"]');
      expect(inactiveButton.classes()).toContain('btn-inactive');
    });
  });

  describe('Component Structure', () => {
    it('uses scoped CSS classes', () => {
      const wrapper = mount(AspectRatioSelector);

      const buttons = wrapper.findAll('button');
      buttons.forEach((button) => {
        expect(button.classes()).toContain('ratio-btn');
      });
    });

    it('applies btn-active to active button only', () => {
      const wrapper = mount(AspectRatioSelector);

      const activeButton = wrapper.find('[data-testid="aspect-ratio-3-2"]');
      const inactiveButton = wrapper.find('[data-testid="aspect-ratio-4-3"]');

      expect(activeButton.classes()).toContain('btn-active');
      expect(activeButton.classes()).not.toContain('btn-inactive');

      expect(inactiveButton.classes()).toContain('btn-inactive');
      expect(inactiveButton.classes()).not.toContain('btn-active');
    });
  });
});

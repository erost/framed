import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import OrientationToggle from '@/components/controls/OrientationToggle.vue';
import { useFrameConfig } from '@/composables/useFrameConfig';

describe('OrientationToggle', () => {
  let frameConfig;

  beforeEach(() => {
    // Reset frame config before each test to ensure clean state
    frameConfig = useFrameConfig();
    frameConfig.reset();
  });

  describe('Rendering', () => {
    it('renders portrait button', () => {
      const wrapper = mount(OrientationToggle);

      expect(wrapper.find('[data-testid="orientation-portrait"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="orientation-portrait"]').text()).toContain('Portrait');
    });

    it('renders landscape button', () => {
      const wrapper = mount(OrientationToggle);

      expect(wrapper.find('[data-testid="orientation-landscape"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="orientation-landscape"]').text()).toContain('Landscape');
    });

    it('renders both SVG icons', () => {
      const wrapper = mount(OrientationToggle);

      const svgs = wrapper.findAll('svg');
      expect(svgs).toHaveLength(2);
    });

    it('has full-width flex layout', () => {
      const wrapper = mount(OrientationToggle);

      const buttonGroup = wrapper.find('[role="group"]');
      expect(buttonGroup.classes()).toContain('flex');
      expect(buttonGroup.classes()).toContain('w-full');
      expect(buttonGroup.classes()).not.toContain('inline-flex');
      expect(buttonGroup.classes()).not.toContain('flex-col');
    });

    it('buttons use scoped CSS class with flex-1', () => {
      const wrapper = mount(OrientationToggle);

      const portraitBtn = wrapper.find('[data-testid="orientation-portrait"]');
      const landscapeBtn = wrapper.find('[data-testid="orientation-landscape"]');

      // Buttons should have the base class that includes flex-1 in scoped CSS
      expect(portraitBtn.classes()).toContain('orientation-btn');
      expect(landscapeBtn.classes()).toContain('orientation-btn');
    });
  });

  describe('Active State', () => {
    it('portrait button is active by default', () => {
      const wrapper = mount(OrientationToggle);

      const portraitBtn = wrapper.find('[data-testid="orientation-portrait"]');
      expect(portraitBtn.attributes('aria-pressed')).toBe('true');
      expect(portraitBtn.classes()).toContain('btn-active');
    });

    it('landscape button is inactive by default', () => {
      const wrapper = mount(OrientationToggle);

      const landscapeBtn = wrapper.find('[data-testid="orientation-landscape"]');
      expect(landscapeBtn.attributes('aria-pressed')).toBe('false');
      expect(landscapeBtn.classes()).toContain('btn-inactive');
    });

    it('switches active state when button is clicked', async () => {
      const wrapper = mount(OrientationToggle);

      await wrapper.find('[data-testid="orientation-landscape"]').trigger('click');
      await wrapper.vm.$nextTick();

      const portraitBtn = wrapper.find('[data-testid="orientation-portrait"]');
      const landscapeBtn = wrapper.find('[data-testid="orientation-landscape"]');

      expect(portraitBtn.attributes('aria-pressed')).toBe('false');
      expect(landscapeBtn.attributes('aria-pressed')).toBe('true');
    });
  });

  describe('Interaction', () => {
    it('changes to landscape when landscape button clicked', async () => {
      const wrapper = mount(OrientationToggle);

      await wrapper.find('[data-testid="orientation-landscape"]').trigger('click');
      await wrapper.vm.$nextTick();

      const landscapeBtn = wrapper.find('[data-testid="orientation-landscape"]');
      expect(landscapeBtn.attributes('aria-pressed')).toBe('true');
    });

    it('changes to portrait when portrait button clicked', async () => {
      const wrapper = mount(OrientationToggle);

      // First switch to landscape
      await wrapper.find('[data-testid="orientation-landscape"]').trigger('click');
      await wrapper.vm.$nextTick();

      // Then switch back to portrait
      await wrapper.find('[data-testid="orientation-portrait"]').trigger('click');
      await wrapper.vm.$nextTick();

      const portraitBtn = wrapper.find('[data-testid="orientation-portrait"]');
      expect(portraitBtn.attributes('aria-pressed')).toBe('true');
    });

    it('clicking active button does not cause error', async () => {
      const wrapper = mount(OrientationToggle);

      await wrapper.find('[data-testid="orientation-portrait"]').trigger('click');
      await wrapper.vm.$nextTick();

      const portraitBtn = wrapper.find('[data-testid="orientation-portrait"]');
      expect(portraitBtn.attributes('aria-pressed')).toBe('true');
    });
  });

  describe('Accessibility', () => {
    it('has role group', () => {
      const wrapper = mount(OrientationToggle);

      expect(wrapper.find('[role="group"]').exists()).toBe(true);
    });

    it('has aria-label on button group', () => {
      const wrapper = mount(OrientationToggle);

      expect(wrapper.find('[role="group"]').attributes('aria-label')).toBe('Frame orientation');
    });

    it('sets aria-pressed correctly', async () => {
      const wrapper = mount(OrientationToggle);

      const portraitBtn = wrapper.find('[data-testid="orientation-portrait"]');
      const landscapeBtn = wrapper.find('[data-testid="orientation-landscape"]');

      expect(portraitBtn.attributes('aria-pressed')).toBe('true');
      expect(landscapeBtn.attributes('aria-pressed')).toBe('false');

      await landscapeBtn.trigger('click');
      await wrapper.vm.$nextTick();

      expect(portraitBtn.attributes('aria-pressed')).toBe('false');
      expect(landscapeBtn.attributes('aria-pressed')).toBe('true');
    });

    it('has custom test ID', () => {
      const wrapper = mount(OrientationToggle, {
        props: { testId: 'custom-orientation' },
      });

      expect(wrapper.attributes('data-testid')).toBe('custom-orientation');
    });
  });

  describe('Component Structure', () => {
    it('uses scoped CSS classes', () => {
      const wrapper = mount(OrientationToggle);

      const portraitBtn = wrapper.find('[data-testid="orientation-portrait"]');
      const landscapeBtn = wrapper.find('[data-testid="orientation-landscape"]');

      // Check that custom class names are applied
      expect(portraitBtn.classes()).toContain('orientation-btn');
      expect(landscapeBtn.classes()).toContain('orientation-btn');
    });

    it('applies btn-active to active button', () => {
      const wrapper = mount(OrientationToggle);

      const portraitBtn = wrapper.find('[data-testid="orientation-portrait"]');
      const landscapeBtn = wrapper.find('[data-testid="orientation-landscape"]');

      // Portrait is active by default
      expect(portraitBtn.classes()).toContain('btn-active');
      expect(landscapeBtn.classes()).toContain('btn-inactive');
    });

    it('applies btn-inactive to inactive button', async () => {
      const wrapper = mount(OrientationToggle);

      // Switch to landscape so portrait becomes inactive
      await wrapper.find('[data-testid="orientation-landscape"]').trigger('click');
      await wrapper.vm.$nextTick();

      const portraitBtn = wrapper.find('[data-testid="orientation-portrait"]');
      const landscapeBtn = wrapper.find('[data-testid="orientation-landscape"]');

      expect(landscapeBtn.classes()).toContain('btn-active');
      expect(portraitBtn.classes()).toContain('btn-inactive');
    });
  });
});

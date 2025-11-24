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

  describe('Active State', () => {
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
  });
});

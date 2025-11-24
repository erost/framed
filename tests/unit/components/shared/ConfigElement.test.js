import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ConfigElement from '@/components/shared/ConfigElement.vue';

describe('ConfigElement', () => {
  describe('Slot Rendering', () => {
    it('renders label and element slot content', () => {
      const wrapper = mount(ConfigElement, {
        slots: {
          label: 'Orientation',
          element: '<div data-testid="test-control">Control Content</div>',
        },
      });

      expect(wrapper.text()).toContain('Orientation');
      expect(wrapper.find('[data-testid="test-control"]').exists()).toBe(true);
      expect(wrapper.text()).toContain('Control Content');
    });

    it('renders element slot without label', () => {
      const wrapper = mount(ConfigElement, {
        slots: {
          element: '<div data-testid="test-control">Control Content</div>',
        },
      });

      expect(wrapper.find('[data-testid="test-control"]').exists()).toBe(true);
    });
  });

  describe('Integration', () => {
    it('renders complex element slot content', () => {
      const wrapper = mount(ConfigElement, {
        slots: {
          label: 'Frame Size',
          element: `
            <div class="selector-group">
              <button>1024px</button>
              <button>2048px</button>
              <button>4096px</button>
            </div>
          `,
        },
      });

      expect(wrapper.text()).toContain('Frame Size');
      expect(wrapper.findAll('button')).toHaveLength(3);
    });
  });

  describe('Accessibility', () => {
    it('label text is visible and readable', () => {
      const wrapper = mount(ConfigElement, {
        slots: {
          label: 'Border Size',
          element: '<input type="range" />',
        },
      });

      const labelText = wrapper.find('.text-xs');
      expect(labelText.isVisible()).toBe(true);
      expect(labelText.text()).toBe('Border Size');
    });
  });
});

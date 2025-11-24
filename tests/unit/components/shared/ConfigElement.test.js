import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ConfigElement from '@/components/shared/ConfigElement.vue';

describe('ConfigElement', () => {
  describe('Structure', () => {
    it('renders the config element wrapper', () => {
      const wrapper = mount(ConfigElement, {
        slots: {
          label: 'Test Label',
          element: '<div>Test Element</div>',
        },
      });

      expect(wrapper.find('[data-testid="config-element"]').exists()).toBe(true);
    });

    it('has correct flex layout structure', () => {
      const wrapper = mount(ConfigElement, {
        slots: {
          label: 'Test Label',
          element: '<div>Test Element</div>',
        },
      });

      const container = wrapper.find('[data-testid="config-element"]');
      expect(container.classes()).toContain('flex');
      expect(container.classes()).toContain('flex-col');
      expect(container.classes()).toContain('gap-2');
    });
  });

  describe('Label Slot', () => {
    it('renders label slot content', () => {
      const wrapper = mount(ConfigElement, {
        slots: {
          label: 'Orientation',
          element: '<div>Test Element</div>',
        },
      });

      expect(wrapper.text()).toContain('Orientation');
    });

    it('applies correct label styling', () => {
      const wrapper = mount(ConfigElement, {
        slots: {
          label: 'Test Label',
          element: '<div>Test Element</div>',
        },
      });

      const label = wrapper.find('.text-xs');
      expect(label.exists()).toBe(true);
      expect(label.classes()).toContain('font-medium');
      expect(label.classes()).toContain('text-gray-400');
      expect(label.classes()).toContain('uppercase');
      expect(label.classes()).toContain('tracking-wide');
    });

    it('does not render label container when slot is empty', () => {
      const wrapper = mount(ConfigElement, {
        slots: {
          element: '<div>Test Element</div>',
        },
      });

      expect(wrapper.find('.text-xs').exists()).toBe(false);
    });
  });

  describe('Element Slot', () => {
    it('renders element slot content', () => {
      const wrapper = mount(ConfigElement, {
        slots: {
          label: 'Test Label',
          element: '<div data-testid="test-control">Control Content</div>',
        },
      });

      expect(wrapper.find('[data-testid="test-control"]').exists()).toBe(true);
      expect(wrapper.text()).toContain('Control Content');
    });

    it('renders element slot even without label', () => {
      const wrapper = mount(ConfigElement, {
        slots: {
          element: '<div data-testid="test-control">Control Content</div>',
        },
      });

      expect(wrapper.find('[data-testid="test-control"]').exists()).toBe(true);
    });
  });

  describe('Props', () => {
    it('accepts custom testId prop', () => {
      const wrapper = mount(ConfigElement, {
        props: { testId: 'custom-config' },
        slots: {
          label: 'Test Label',
          element: '<div>Test Element</div>',
        },
      });

      expect(wrapper.find('[data-testid="custom-config"]').exists()).toBe(true);
    });

    it('uses default testId when not provided', () => {
      const wrapper = mount(ConfigElement, {
        slots: {
          label: 'Test Label',
          element: '<div>Test Element</div>',
        },
      });

      expect(wrapper.props('testId')).toBe('config-element');
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

    it('maintains label-element hierarchy', () => {
      const wrapper = mount(ConfigElement, {
        slots: {
          label: 'Test Label',
          element: '<div data-testid="test-element">Element</div>',
        },
      });

      const container = wrapper.find('[data-testid="config-element"]');
      const children = container.element.children;

      // First child should be label, second should be element container
      expect(children).toHaveLength(2);
      expect(children[0].textContent).toContain('Test Label');
      expect(children[1].querySelector('[data-testid="test-element"]')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('renders semantic HTML structure', () => {
      const wrapper = mount(ConfigElement, {
        slots: {
          label: 'Orientation',
          element: '<button>Portrait</button>',
        },
      });

      const container = wrapper.find('[data-testid="config-element"]');
      expect(container.element.tagName).toBe('DIV');
    });

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

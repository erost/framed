import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ActionBar from '@/components/layout/ActionBar.vue';

// Mock all child components to avoid dependency issues
vi.mock('@/components/controls/ResetButton.vue', () => ({
  default: {
    name: 'ResetButton',
    template: '<button data-testid="reset-button">Reset</button>',
  },
}));

vi.mock('@/components/controls/DownloadButton.vue', () => ({
  default: {
    name: 'DownloadButton',
    template: '<button data-testid="download-button">Download</button>',
  },
}));

describe('ActionBar', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(ActionBar, {
      props: { previewWidth: 800 },
    });
  });

  describe('Structure', () => {
    it('renders the action bar with correct structure', () => {
      expect(wrapper.find('[data-testid="action-bar"]').exists()).toBe(true);
    });

    it('renders reset and download buttons', () => {
      expect(wrapper.find('[data-testid="reset-button"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="download-button"]').exists()).toBe(true);
    });

    it('contains exactly 2 child buttons', () => {
      const actionBar = wrapper.find('[data-testid="action-bar"]');
      const children = actionBar.findAll('[data-testid]');
      expect(children).toHaveLength(2);
    });
  });

  describe('Layout', () => {
    it('has flex layout with gap-3', () => {
      const actionBar = wrapper.find('[data-testid="action-bar"]');
      expect(actionBar.classes()).toContain('flex');
      expect(actionBar.classes()).toContain('gap-3');
    });

    it('has max width constraint', () => {
      const actionBar = wrapper.find('[data-testid="action-bar"]');
      expect(actionBar.classes()).toContain('w-full');
      expect(actionBar.classes()).toContain('max-w-[1024px]');
      expect(actionBar.classes()).toContain('mx-auto');
    });

    it('has proper padding', () => {
      const actionBar = wrapper.find('[data-testid="action-bar"]');
      expect(actionBar.classes()).toContain('px-6');
    });
  });

  describe('Responsive Behavior', () => {
    it('stacks buttons in reverse on mobile (Download on top)', () => {
      const actionBar = wrapper.find('[data-testid="action-bar"]');
      expect(actionBar.classes()).toContain('flex-col-reverse');
    });

    it('arranges buttons in row on desktop with justify-end', () => {
      const actionBar = wrapper.find('[data-testid="action-bar"]');
      expect(actionBar.classes()).toContain('sm:flex-row');
      expect(actionBar.classes()).toContain('sm:justify-end');
    });
  });

  describe('Props', () => {
    it('accepts stage prop for download functionality', () => {
      const mockStage = { toDataURL: vi.fn() };
      wrapper = mount(ActionBar, {
        props: {
          stage: mockStage,
          previewWidth: 800,
        },
      });

      expect(wrapper.props('stage')).toStrictEqual(mockStage);
    });

    it('requires previewWidth prop', () => {
      expect(wrapper.props('previewWidth')).toBe(800);
    });

    it('has default null stage', () => {
      wrapper = mount(ActionBar, {
        props: {
          previewWidth: 800,
        },
      });

      expect(wrapper.props('stage')).toBeNull();
    });
  });

  describe('Button Order', () => {
    it('has reset button first in DOM (appears second on desktop)', () => {
      const actionBar = wrapper.find('[data-testid="action-bar"]');
      const buttons = actionBar.findAll('[data-testid]');
      expect(buttons[0].attributes('data-testid')).toBe('reset-button');
    });

    it('has download button second in DOM', () => {
      const actionBar = wrapper.find('[data-testid="action-bar"]');
      const buttons = actionBar.findAll('[data-testid]');
      expect(buttons[1].attributes('data-testid')).toBe('download-button');
    });
  });
});

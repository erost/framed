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

    it('renders action buttons', () => {
      expect(wrapper.find('[data-testid="reset-button"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="download-button"]').exists()).toBe(true);
    });

    it('contains action buttons section', () => {
      expect(wrapper.find('[data-testid="buttons-action-bar"]').exists()).toBe(true);
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

  describe('Component Organization', () => {
    it('has reset and download buttons in buttons section', () => {
      const buttonsSection = wrapper.find('[data-testid="buttons-action-bar"]');
      expect(buttonsSection.find('[data-testid="reset-button"]').exists()).toBe(true);
      expect(buttonsSection.find('[data-testid="download-button"]').exists()).toBe(true);
    });
  });
});

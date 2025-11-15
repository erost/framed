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

vi.mock('@/components/controls/QualityInput.vue', () => ({
  default: {
    name: 'QualityInput',
    template: '<div data-testid="quality-input">Quality</div>',
  },
}));

vi.mock('@/components/controls/FileNameInput.vue', () => ({
  default: {
    name: 'FileNameInput',
    template: '<div data-testid="file-name-input">Filename</div>',
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

    it('renders all components (inputs and buttons)', () => {
      expect(wrapper.find('[data-testid="quality-input"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="file-name-input"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="reset-button"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="download-button"]').exists()).toBe(true);
    });

    it('contains output controls and action buttons', () => {
      expect(wrapper.find('[data-testid="output-action-bar"]').exists()).toBe(true);
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
    it('has quality and filename inputs in output section', () => {
      const outputSection = wrapper.find('[data-testid="output-action-bar"]');
      expect(outputSection.find('[data-testid="quality-input"]').exists()).toBe(true);
      expect(outputSection.find('[data-testid="file-name-input"]').exists()).toBe(true);
    });

    it('has reset and download buttons in buttons section', () => {
      const buttonsSection = wrapper.find('[data-testid="buttons-action-bar"]');
      expect(buttonsSection.find('[data-testid="reset-button"]').exists()).toBe(true);
      expect(buttonsSection.find('[data-testid="download-button"]').exists()).toBe(true);
    });
  });
});

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

    it('has default null stage', () => {
      wrapper = mount(ActionBar, {
        props: {
          previewWidth: 800,
        },
      });

      expect(wrapper.props('stage')).toBeNull();
    });
  });
});

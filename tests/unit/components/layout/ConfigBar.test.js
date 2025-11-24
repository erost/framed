import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ConfigBar from '@/components/layout/ConfigBar.vue';

// Mock all child components to avoid dependency issues
vi.mock('@/components/controls/OrientationToggle.vue', () => ({
  default: {
    name: 'OrientationToggle',
    template: '<div data-testid="orientation-toggle">OrientationToggle</div>',
  },
}));

vi.mock('@/components/controls/AspectRatioSelector.vue', () => ({
  default: {
    name: 'AspectRatioSelector',
    template: '<div data-testid="aspect-ratio-selector">AspectRatioSelector</div>',
  },
}));

vi.mock('@/components/controls/ColorPicker.vue', () => ({
  default: {
    name: 'ColorPicker',
    template: '<div data-testid="color-picker">ColorPicker</div>',
  },
}));

vi.mock('@/components/controls/FrameSizeSelector.vue', () => ({
  default: {
    name: 'FrameSizeSelector',
    template: '<div data-testid="frame-size-selector">FrameSizeSelector</div>',
  },
}));

vi.mock('@/components/controls/BorderSlider.vue', () => ({
  default: {
    name: 'BorderSlider',
    template: '<div data-testid="border-slider">BorderSlider</div>',
  },
}));

vi.mock('@/components/controls/FormatSelector.vue', () => ({
  default: {
    name: 'FormatSelector',
    template: '<div data-testid="format-selector">FormatSelector</div>',
  },
}));

vi.mock('@/components/controls/QualitySlider.vue', () => ({
  default: {
    name: 'QualitySlider',
    template: '<div data-testid="quality-slider">QualitySlider</div>',
  },
}));

describe('ConfigBar', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(ConfigBar);
  });

  describe('Component Integration', () => {
    it('renders all control components', () => {
      expect(wrapper.find('[data-testid="orientation-toggle"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="aspect-ratio-selector"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="color-picker"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="frame-size-selector"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="border-slider"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="format-selector"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="quality-slider"]').exists()).toBe(true);
    });
  });
});

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

vi.mock('@/components/controls/FrameSizeInput.vue', () => ({
  default: {
    name: 'FrameSizeInput',
    template: '<div data-testid="frame-size-input">FrameSizeInput</div>',
  },
}));

vi.mock('@/components/controls/SpacingInput.vue', () => ({
  default: {
    name: 'SpacingInput',
    template: '<div data-testid="spacing-input">SpacingInput</div>',
  },
}));

describe('ConfigBar', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(ConfigBar);
  });

  describe('Structure', () => {
    it('renders the config bar with correct structure', () => {
      expect(wrapper.find('[data-testid="config-bar"]').exists()).toBe(true);
    });

    it('renders both configuration rows', () => {
      expect(wrapper.find('[data-testid="row-orientation-aspect"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="row-frame-config"]').exists()).toBe(true);
    });
  });

  describe('Row 1: Orientation and Aspect Ratio', () => {
    it('renders orientation and aspect ratio controls', () => {
      const row = wrapper.find('[data-testid="row-orientation-aspect"]');
      expect(row.find('[data-testid="orientation-toggle"]').exists()).toBe(true);
      expect(row.find('[data-testid="aspect-ratio-selector"]').exists()).toBe(true);
    });

    it('contains exactly 2 child components', () => {
      const row = wrapper.find('[data-testid="row-orientation-aspect"]');
      const children = row.findAll('[data-testid]');
      expect(children).toHaveLength(2);
    });
  });

  describe('Row 2: Frame Configuration Controls', () => {
    it('renders color picker, frame size, and spacing controls', () => {
      const row = wrapper.find('[data-testid="row-frame-config"]');
      expect(row.find('[data-testid="color-picker"]').exists()).toBe(true);
      expect(row.find('[data-testid="frame-size-input"]').exists()).toBe(true);
      expect(row.find('[data-testid="spacing-input"]').exists()).toBe(true);
    });

    it('contains exactly 3 child components', () => {
      const row = wrapper.find('[data-testid="row-frame-config"]');
      const children = row.findAll('[data-testid]');
      expect(children).toHaveLength(3);
    });
  });


  describe('Component Rendering', () => {
    it('renders all control components', () => {
      expect(wrapper.find('[data-testid="orientation-toggle"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="aspect-ratio-selector"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="color-picker"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="frame-size-input"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="spacing-input"]').exists()).toBe(true);
    });
  });

  describe('Layout Organization', () => {
    it('maintains correct order of rows', () => {
      const rows = wrapper.findAll('[data-testid^="row-"]');
      expect(rows).toHaveLength(2);
      expect(rows[0].attributes('data-testid')).toBe('row-orientation-aspect');
      expect(rows[1].attributes('data-testid')).toBe('row-frame-config');
    });
  });
});

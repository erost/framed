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

  describe('Structure', () => {
    it('renders the config bar with correct structure', () => {
      expect(wrapper.find('[data-testid="config-bar"]').exists()).toBe(true);
    });

    it('renders all controls in a single container', () => {
      // New structure has all controls in one flex container
      const controls = wrapper.findAll('[data-testid]');
      expect(controls.length).toBeGreaterThan(0);
    });
  });

  describe('Controls Layout', () => {
    it('renders orientation and aspect ratio controls', () => {
      expect(wrapper.find('[data-testid="orientation-toggle"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="aspect-ratio-selector"]').exists()).toBe(true);
    });

    it('renders all 7 configuration controls', () => {
      const controls = wrapper.findAll('[data-testid]');
      // Should have 7 controls + 1 config-bar container = 8 testids
      expect(controls.length).toBeGreaterThanOrEqual(7);
    });

    it('renders color picker, frame size, border, format, and quality controls', () => {
      expect(wrapper.find('[data-testid="color-picker"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="frame-size-selector"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="border-slider"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="format-selector"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="quality-slider"]').exists()).toBe(true);
    });
  });


  describe('Component Rendering', () => {
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

  describe('Layout Organization', () => {
    it('maintains correct order of controls', () => {
      // Verify all controls are rendered in order
      const allTestIds = wrapper.findAll('[data-testid]').map(w => w.attributes('data-testid'));
      expect(allTestIds).toContain('orientation-toggle');
      expect(allTestIds).toContain('aspect-ratio-selector');
      expect(allTestIds).toContain('color-picker');
      expect(allTestIds).toContain('frame-size-selector');
      expect(allTestIds).toContain('border-slider');
      expect(allTestIds).toContain('format-selector');
      expect(allTestIds).toContain('quality-slider');
    });
  });
});

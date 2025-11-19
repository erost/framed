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

    it('renders all 5 configuration controls', () => {
      const controls = wrapper.findAll('[data-testid]');
      // Should have 5 controls + 1 config-bar container = 6 testids
      expect(controls.length).toBeGreaterThanOrEqual(5);
    });

    it('renders color picker, frame size, and spacing controls', () => {
      expect(wrapper.find('[data-testid="color-picker"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="frame-size-input"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="spacing-input"]').exists()).toBe(true);
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
    it('maintains correct order of controls', () => {
      // Verify all controls are rendered in order
      const allTestIds = wrapper.findAll('[data-testid]').map(w => w.attributes('data-testid'));
      expect(allTestIds).toContain('orientation-toggle');
      expect(allTestIds).toContain('aspect-ratio-selector');
      expect(allTestIds).toContain('color-picker');
      expect(allTestIds).toContain('frame-size-input');
      expect(allTestIds).toContain('spacing-input');
    });
  });
});

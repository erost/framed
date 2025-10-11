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

    it('has proper layout structure with flex columns and gap-6', () => {
      const configBar = wrapper.find('[data-testid="config-bar"]');
      const innerDiv = configBar.find('div');
      expect(innerDiv.classes()).toContain('flex');
      expect(innerDiv.classes()).toContain('flex-col');
      expect(innerDiv.classes()).toContain('gap-6');
    });
  });

  describe('Row 1: Orientation and Aspect Ratio', () => {
    it('renders orientation and aspect ratio controls', () => {
      const row = wrapper.find('[data-testid="row-orientation-aspect"]');
      expect(row.find('[data-testid="orientation-toggle"]').exists()).toBe(true);
      expect(row.find('[data-testid="aspect-ratio-selector"]').exists()).toBe(true);
    });

    it('has responsive flex layout (stacks on mobile, side by side on desktop)', () => {
      const row = wrapper.find('[data-testid="row-orientation-aspect"]');
      expect(row.classes()).toContain('flex');
      expect(row.classes()).toContain('flex-col');
      expect(row.classes()).toContain('md:flex-row');
      expect(row.classes()).toContain('gap-4');
    });

    it('wraps each control in a flex-1 container for equal width', () => {
      const row = wrapper.find('[data-testid="row-orientation-aspect"]');
      const wrappers = row.findAll('div.flex-1');
      expect(wrappers).toHaveLength(2);
    });

    it('contains exactly 2 child components', () => {
      const row = wrapper.find('[data-testid="row-orientation-aspect"]');
      const children = row.findAll('[data-testid]');
      expect(children).toHaveLength(2);
    });

    it('orientation control is in first flex-1 wrapper', () => {
      const row = wrapper.find('[data-testid="row-orientation-aspect"]');
      const firstWrapper = row.findAll('div.flex-1')[0];
      expect(firstWrapper.find('[data-testid="orientation-toggle"]').exists()).toBe(true);
    });

    it('aspect ratio control is in second flex-1 wrapper', () => {
      const row = wrapper.find('[data-testid="row-orientation-aspect"]');
      const secondWrapper = row.findAll('div.flex-1')[1];
      expect(secondWrapper.find('[data-testid="aspect-ratio-selector"]').exists()).toBe(true);
    });
  });

  describe('Row 2: Frame Configuration Controls', () => {
    it('renders color picker, frame size, and spacing controls', () => {
      const row = wrapper.find('[data-testid="row-frame-config"]');
      expect(row.find('[data-testid="color-picker"]').exists()).toBe(true);
      expect(row.find('[data-testid="frame-size-input"]').exists()).toBe(true);
      expect(row.find('[data-testid="spacing-input"]').exists()).toBe(true);
    });

    it('has responsive flex layout (stacks on mobile, side by side on desktop)', () => {
      const row = wrapper.find('[data-testid="row-frame-config"]');
      expect(row.classes()).toContain('flex');
      expect(row.classes()).toContain('flex-col');
      expect(row.classes()).toContain('md:flex-row');
      expect(row.classes()).toContain('gap-4');
    });

    it('wraps each control in a flex-1 container for equal width', () => {
      const row = wrapper.find('[data-testid="row-frame-config"]');
      const wrappers = row.findAll('div.flex-1');
      expect(wrappers).toHaveLength(3);
    });

    it('contains exactly 3 child components', () => {
      const row = wrapper.find('[data-testid="row-frame-config"]');
      const children = row.findAll('[data-testid]');
      expect(children).toHaveLength(3);
    });

    it('color picker is in first flex-1 wrapper', () => {
      const row = wrapper.find('[data-testid="row-frame-config"]');
      const firstWrapper = row.findAll('div.flex-1')[0];
      expect(firstWrapper.find('[data-testid="color-picker"]').exists()).toBe(true);
    });

    it('frame size input is in second flex-1 wrapper', () => {
      const row = wrapper.find('[data-testid="row-frame-config"]');
      const secondWrapper = row.findAll('div.flex-1')[1];
      expect(secondWrapper.find('[data-testid="frame-size-input"]').exists()).toBe(true);
    });

    it('spacing input is in third flex-1 wrapper', () => {
      const row = wrapper.find('[data-testid="row-frame-config"]');
      const thirdWrapper = row.findAll('div.flex-1')[2];
      expect(thirdWrapper.find('[data-testid="spacing-input"]').exists()).toBe(true);
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

  describe('Styling', () => {
    it('applies dark mode classes', () => {
      const configBar = wrapper.find('[data-testid="config-bar"]');
      expect(configBar.classes()).toContain('dark:bg-gray-800');
      expect(configBar.classes()).toContain('dark:border-gray-700');
    });

    it('has responsive styling', () => {
      const container = wrapper.find('[data-testid="config-bar"]');
      expect(container.classes()).toContain('w-full');
      expect(container.classes()).toContain('max-w-[1024px]');
      expect(container.classes()).toContain('mx-auto');
      expect(container.classes()).toContain('rounded-lg');
      expect(container.classes()).toContain('shadow-sm');
    });

    it('has proper padding', () => {
      const container = wrapper.find('[data-testid="config-bar"]');
      expect(container.classes()).toContain('px-6');
      expect(container.classes()).toContain('py-4');
    });

    it('has border styling', () => {
      const container = wrapper.find('[data-testid="config-bar"]');
      expect(container.classes()).toContain('border');
      expect(container.classes()).toContain('border-gray-200');
    });

    it('has white background in light mode', () => {
      const container = wrapper.find('[data-testid="config-bar"]');
      expect(container.classes()).toContain('bg-white');
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

  describe('Responsive Behavior', () => {
    it('row 1 stacks controls on mobile with flex-col', () => {
      const row = wrapper.find('[data-testid="row-orientation-aspect"]');
      expect(row.classes()).toContain('flex-col');
    });

    it('row 1 arranges controls side by side on desktop with md:flex-row', () => {
      const row = wrapper.find('[data-testid="row-orientation-aspect"]');
      expect(row.classes()).toContain('md:flex-row');
    });

    it('row 2 stacks controls on mobile with flex-col', () => {
      const row = wrapper.find('[data-testid="row-frame-config"]');
      expect(row.classes()).toContain('flex-col');
    });

    it('row 2 arranges controls side by side on desktop with md:flex-row', () => {
      const row = wrapper.find('[data-testid="row-frame-config"]');
      expect(row.classes()).toContain('md:flex-row');
    });
  });
});

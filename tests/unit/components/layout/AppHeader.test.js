import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import AppHeader from '@/components/layout/AppHeader.vue';
import { useTheme } from '@/composables/useTheme.js';

// Mock the useTheme composable
vi.mock('@/composables/useTheme.js', () => ({
  useTheme: vi.fn(),
}));

describe('AppHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the header with correct structure', () => {
    useTheme.mockReturnValue({
      theme: ref('light'),
      toggleTheme: vi.fn(),
    });

    const wrapper = mount(AppHeader);

    expect(wrapper.find('[data-testid="app-header"]').exists()).toBe(true);
    expect(wrapper.find('h1').text()).toBe('Framed');
  });

  it('displays theme toggle button', () => {
    useTheme.mockReturnValue({
      theme: ref('light'),
      toggleTheme: vi.fn(),
    });

    const wrapper = mount(AppHeader);

    const toggleButton = wrapper.find('[data-testid="theme-toggle"]');
    expect(toggleButton.exists()).toBe(true);
  });

  it('shows moon icon in light mode', () => {
    useTheme.mockReturnValue({
      theme: ref('light'),
      toggleTheme: vi.fn(),
    });

    const wrapper = mount(AppHeader);

    const moonIcon = wrapper.find('svg').element;
    expect(moonIcon).toBeTruthy();
    // Moon icon has path with specific d attribute
    expect(wrapper.html()).toContain('M20.354 15.354A9 9 0 018.646 3.646');
  });

  it('shows sun icon in dark mode', () => {
    useTheme.mockReturnValue({
      theme: ref('dark'),
      toggleTheme: vi.fn(),
    });

    const wrapper = mount(AppHeader);

    const sunIcon = wrapper.find('svg').element;
    expect(sunIcon).toBeTruthy();
    // Sun icon has path with specific d attribute
    expect(wrapper.html()).toContain('M12 3v1m0 16v1m9-9h-1M4 12H3');
  });

  it('calls toggleTheme when theme button is clicked', async () => {
    const toggleThemeMock = vi.fn();
    useTheme.mockReturnValue({
      theme: ref('light'),
      toggleTheme: toggleThemeMock,
    });

    const wrapper = mount(AppHeader);

    const toggleButton = wrapper.find('[data-testid="theme-toggle"]');
    await toggleButton.trigger('click');

    expect(toggleThemeMock).toHaveBeenCalledTimes(1);
  });

  it('has correct aria-label for light mode', () => {
    useTheme.mockReturnValue({
      theme: ref('light'),
      toggleTheme: vi.fn(),
    });

    const wrapper = mount(AppHeader);

    const toggleButton = wrapper.find('[data-testid="theme-toggle"]');
    expect(toggleButton.attributes('aria-label')).toBe('Switch to dark mode');
  });

  it('has correct aria-label for dark mode', () => {
    useTheme.mockReturnValue({
      theme: ref('dark'),
      toggleTheme: vi.fn(),
    });

    const wrapper = mount(AppHeader);

    const toggleButton = wrapper.find('[data-testid="theme-toggle"]');
    expect(toggleButton.attributes('aria-label')).toBe('Switch to light mode');
  });

  it('applies dark mode classes', () => {
    useTheme.mockReturnValue({
      theme: ref('light'),
      toggleTheme: vi.fn(),
    });

    const wrapper = mount(AppHeader);

    const header = wrapper.find('[data-testid="app-header"]');
    expect(header.classes()).toContain('dark:bg-gray-800');
    expect(header.classes()).toContain('dark:border-gray-700');
  });

  it('has proper button type attribute', () => {
    useTheme.mockReturnValue({
      theme: ref('light'),
      toggleTheme: vi.fn(),
    });

    const wrapper = mount(AppHeader);

    const toggleButton = wrapper.find('[data-testid="theme-toggle"]');
    expect(toggleButton.attributes('type')).toBe('button');
  });
});

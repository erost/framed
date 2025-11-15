import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AppHeader from '@/components/layout/AppHeader.vue';

describe('AppHeader', () => {
  it('renders the header with correct structure', () => {
    const wrapper = mount(AppHeader);

    expect(wrapper.find('[data-testid="app-header"]').exists()).toBe(true);
    expect(wrapper.find('h1').text()).toBe('Framed');
  });

  it('has correct header classes', () => {
    const wrapper = mount(AppHeader);

    const header = wrapper.find('[data-testid="app-header"]');
    expect(header.classes()).toContain('bg-white');
    expect(header.classes()).toContain('dark:bg-gray-800');
    expect(header.classes()).toContain('border-b');
    expect(header.classes()).toContain('dark:border-gray-700');
  });

  it('displays the application title', () => {
    const wrapper = mount(AppHeader);

    const title = wrapper.find('h1');
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe('Framed');
  });

  it('has correct title styling', () => {
    const wrapper = mount(AppHeader);

    const title = wrapper.find('h1');
    expect(title.classes()).toContain('text-2xl');
    expect(title.classes()).toContain('font-bold');
  });
});

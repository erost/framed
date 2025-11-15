import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AppHeader from '@/components/layout/AppHeader.vue';

describe('AppHeader', () => {
  it('renders the header with correct structure', () => {
    const wrapper = mount(AppHeader);

    expect(wrapper.find('[data-testid="app-header"]').exists()).toBe(true);
    expect(wrapper.find('h1').text()).toBe('Framed');
  });

  it('displays the application title', () => {
    const wrapper = mount(AppHeader);

    const title = wrapper.find('h1');
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe('Framed');
  });

});

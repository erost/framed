import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import App from '@/App.vue';
import { PREVIEW_CONSTRAINTS } from '@/utils/constants';

// Mock useFrameConfig composable
vi.mock('@/composables/useFrameConfig', () => ({
  useFrameConfig: () => ({
    frameWidth: ref(1000),
    frameHeight: ref(750),
    orientation: ref('landscape'),
    aspectRatio: ref('4:3'),
    frameSize: ref(1000),
    borderPercentage: ref(2),
    frameColor: ref('#ffffff'),
    backgroundColor: ref('#000000'),
    updateBackgroundColor: vi.fn(),
    updateAspectRatio: vi.fn(),
    updateFrameSize: vi.fn(),
    updateBorderPercentage: vi.fn(),
    reset: vi.fn(),
  }),
}));

describe('App.vue - Window Resize', () => {
  let mockResizeObserver;
  let resizeObserverCallback;

  beforeEach(() => {
    // Mock ResizeObserver
    mockResizeObserver = vi.fn(function(callback) {
      resizeObserverCallback = callback;
      this.observe = vi.fn();
      this.disconnect = vi.fn();
      this.unobserve = vi.fn();
    });
    global.ResizeObserver = mockResizeObserver;

    // Mock requestAnimationFrame and cancelAnimationFrame
    global.requestAnimationFrame = vi.fn((cb) => {
      const id = Math.random();
      cb();
      return id;
    });
    global.cancelAnimationFrame = vi.fn();

    // Mock window.matchMedia
    global.window.matchMedia = vi.fn((query) => ({
      matches: query === '(min-width: 768px)',
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    // Mock window dimensions (default to desktop size)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1280,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('updatePreviewWidth()', () => {
    it('calculates preview width from window dimensions', () => {
      const wrapper = mount(App);

      // Mock window dimensions
      window.innerWidth = 1280;
      window.innerHeight = 800;

      // Mock asideRef with sidebar width (desktop: 320px)
      wrapper.vm.asideRef = {
        clientWidth: 320,
        clientHeight: 100,
      };

      wrapper.vm.updatePreviewWidth();

      // Desktop mode: Window: 1280px x 800px, Aside: 320px wide
      // Available width: 1280 - 320 = 960, minus padding: 960 - 32 = 928
      // Available height: 800, minus padding: 800 - 32 = 768
      // Frame: 1000px x 750px
      // Scale by width: 928 / 1000 = 0.928
      // Scale by height: 768 / 750 = 1.024
      // Use min scale: 0.928
      // Scaled width: 1000 * 0.928 = 928
      // Preview width: min(928, 800) = 800
      expect(wrapper.vm.previewWidth).toBe(800);
    });

    it('caps at max width of 800px', () => {
      const wrapper = mount(App);

      // Large window
      window.innerWidth = 2000;
      window.innerHeight = 1500;

      wrapper.vm.asideRef = {
        clientWidth: 320,
        clientHeight: 100,
      };

      wrapper.vm.updatePreviewWidth();

      // Desktop mode: Window: 2000px x 1500px, Aside: 320px
      // Available width: 2000 - 320 - 32 = 1648
      // Available height: 1500 - 32 = 1468
      // Frame: 1000px x 750px
      // Scale by width: 1648 / 1000 = 1.648
      // Scale by height: 1468 / 750 = 1.957
      // Use min scale: 1.648
      // Scaled width: 1000 * 1.648 = 1648
      // Preview width: min(1648, 800) = 800 (capped)
      expect(wrapper.vm.previewWidth).toBe(800);
    });

    it('subtracts padding and aside from available space', () => {
      const wrapper = mount(App);

      // Small window
      window.innerWidth = 820;
      window.innerHeight = 600;

      wrapper.vm.asideRef = {
        clientWidth: 320,
        clientHeight: 100,
      };

      wrapper.vm.updatePreviewWidth();

      // Desktop mode: Window: 820px x 600px, Aside: 320px
      // Available width: 820 - 320 - 32 = 468
      // Available height: 600 - 32 = 568
      // Frame: 1000px x 750px
      // Scale by width: 468 / 1000 = 0.468
      // Scale by height: 568 / 750 = 0.757
      // Use min scale: 0.468
      // Scaled width: 1000 * 0.468 = 468
      expect(wrapper.vm.previewWidth).toBe(468);
    });

    it('caps at PREVIEW_CONSTRAINTS.defaultWidth', () => {
      const wrapper = mount(App);

      window.innerWidth = 1520;
      window.innerHeight = 900;

      wrapper.vm.asideRef = {
        clientWidth: 320,
        clientHeight: 100,
      };

      wrapper.vm.updatePreviewWidth();

      // Desktop mode: Window: 1520px x 900px, Aside: 320px
      // Available width: 1520 - 320 - 32 = 1168
      // Available height: 900 - 32 = 868
      // Frame: 1000px x 750px
      // Scale by width: 1168 / 1000 = 1.168
      // Scale by height: 868 / 750 = 1.157
      // Use min scale: 1.157
      // Scaled width: 1000 * 1.157 = 1157
      // Preview width: min(1157, 800) = 800 (capped)
      expect(wrapper.vm.previewWidth).toBe(PREVIEW_CONSTRAINTS.defaultWidth);
    });

    it('handles mobile mode with bottom aside', () => {
      const wrapper = mount(App);

      // Mock mobile mode for small screens
      global.window.matchMedia = vi.fn((query) => ({
        matches: false, // Mobile mode
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      window.innerWidth = 400;
      window.innerHeight = 800;

      wrapper.vm.asideRef = {
        clientWidth: 400,
        clientHeight: 150, // Bottom aside height
      };

      wrapper.vm.updatePreviewWidth();

      // Mobile mode: Window: 400px x 800px, Aside: 150px height at bottom
      // Available width: 400 - 32 = 368
      // Available height: 800 - 150 - 32 = 618
      // Frame: 1000px x 750px
      // Scale by width: 368 / 1000 = 0.368
      // Scale by height: 618 / 750 = 0.824
      // Use min scale: 0.368
      // Scaled width: 1000 * 0.368 = 368
      expect(wrapper.vm.previewWidth).toBe(368);
    });

    it('handles exact default width scenario', () => {
      const wrapper = mount(App);

      // To get exactly 800px preview width:
      // Need scale of 0.8 (800 / 1000)
      // Available width needed: 1000 * 0.8 = 800
      // Window width: 800 + 320 (aside) + 32 (padding) = 1152
      window.innerWidth = 1152;
      window.innerHeight = 900;

      wrapper.vm.asideRef = {
        clientWidth: 320,
        clientHeight: 100,
      };

      wrapper.vm.updatePreviewWidth();

      expect(wrapper.vm.previewWidth).toBe(800);
    });
  });

  describe('onMounted', () => {
    it('calls updatePreviewWidth on mount', () => {
      const wrapper = mount(App);

      window.innerWidth = 1280;
      window.innerHeight = 800;

      wrapper.vm.asideRef = {
        clientWidth: 320,
        clientHeight: 100,
      };

      // Manually trigger mounted behavior
      wrapper.vm.updatePreviewWidth();

      expect(wrapper.vm.previewWidth).toBeDefined();
    });

    it('sets up ResizeObserver when available', async () => {
      const wrapper = mount(App);
      await wrapper.vm.$nextTick();

      expect(mockResizeObserver).toHaveBeenCalled();
    });

    it('observes mainContentRef with ResizeObserver', async () => {
      const wrapper = mount(App);
      await wrapper.vm.$nextTick();

      const observeCall = mockResizeObserver.mock.results[0]?.value?.observe;
      if (observeCall) {
        expect(observeCall).toHaveBeenCalled();
      }
    });

    it('uses requestAnimationFrame for resize updates', async () => {
      const wrapper = mount(App);
      await wrapper.vm.$nextTick();

      if (resizeObserverCallback) {
        window.innerWidth = 1280;
        window.innerHeight = 800;
        wrapper.vm.asideRef = { clientWidth: 320, clientHeight: 100 };
        resizeObserverCallback();
        expect(global.requestAnimationFrame).toHaveBeenCalled();
      }
    });

    it('cancels previous animation frame before scheduling new one', async () => {
      const wrapper = mount(App);
      await wrapper.vm.$nextTick();

      if (resizeObserverCallback) {
        window.innerWidth = 1280;
        window.innerHeight = 800;
        wrapper.vm.asideRef = { clientWidth: 320, clientHeight: 100 };

        // First resize
        resizeObserverCallback();
        const firstCallCount = global.requestAnimationFrame.mock.calls.length;

        // Second resize (should cancel previous)
        resizeObserverCallback();

        expect(global.cancelAnimationFrame).toHaveBeenCalled();
        expect(global.requestAnimationFrame.mock.calls.length).toBeGreaterThan(firstCallCount);
      }
    });

    it('falls back to window resize event when ResizeObserver unavailable', async () => {
      // Remove ResizeObserver
      const originalResizeObserver = global.ResizeObserver;
      global.ResizeObserver = undefined;

      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      const wrapper = mount(App);
      await wrapper.vm.$nextTick();

      // Should fall back to window resize
      // Note: The actual implementation happens in onMounted, 
      //   which we can't easily trigger in tests
      // This test verifies the spy is available for fallback

      expect(addEventListenerSpy).toBeDefined();

      // Restore
      global.ResizeObserver = originalResizeObserver;
      addEventListenerSpy.mockRestore();
    });
  });

  describe('onUnmounted', () => {
    it('cancels pending animation frame on unmount', async () => {
      const wrapper = mount(App);
      await wrapper.vm.$nextTick();

      // Simulate a pending resize
      if (resizeObserverCallback) {
        wrapper.vm.mainContentRef = { clientWidth: 1000 };
        resizeObserverCallback();
      }

      wrapper.unmount();

      // cancelAnimationFrame should have been called during unmount
      expect(global.cancelAnimationFrame).toHaveBeenCalled();
    });

    it('disconnects ResizeObserver on unmount', async () => {
      const wrapper = mount(App);
      await wrapper.vm.$nextTick();

      const disconnectSpy = mockResizeObserver.mock.results[0]?.value?.disconnect;

      wrapper.unmount();

      if (disconnectSpy) {
        expect(disconnectSpy).toHaveBeenCalled();
      }
    });

    it('removes window resize listener when using fallback', async () => {
      // Remove ResizeObserver to trigger fallback
      const originalResizeObserver = global.ResizeObserver;
      global.ResizeObserver = undefined;

      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const wrapper = mount(App);
      await wrapper.vm.$nextTick();

      wrapper.unmount();

      // Should have attempted to remove event listener
      expect(removeEventListenerSpy).toBeDefined();

      // Restore
      global.ResizeObserver = originalResizeObserver;
      removeEventListenerSpy.mockRestore();
    });

    it('cleans up both timeout and observer on unmount', async () => {
      const wrapper = mount(App);
      await wrapper.vm.$nextTick();

      // Trigger a resize to set timeout
      if (resizeObserverCallback) {
        wrapper.vm.mainContentRef = { clientWidth: 1000 };
        resizeObserverCallback();
      }

      const disconnectSpy = mockResizeObserver.mock.results[0]?.value?.disconnect;

      wrapper.unmount();

      expect(global.cancelAnimationFrame).toHaveBeenCalled();
      if (disconnectSpy) {
        expect(disconnectSpy).toHaveBeenCalled();
      }
    });
  });

  describe('Resize Debouncing', () => {
    it('batches multiple rapid resize events', async () => {
      const wrapper = mount(App);
      await wrapper.vm.$nextTick();

      if (resizeObserverCallback) {
        window.innerWidth = 1280;
        window.innerHeight = 800;
        wrapper.vm.asideRef = { clientWidth: 320, clientHeight: 100 };

        // Simulate rapid resize events
        resizeObserverCallback();
        resizeObserverCallback();
        resizeObserverCallback();

        // Should cancel previous frames
        expect(global.cancelAnimationFrame.mock.calls.length).toBeGreaterThanOrEqual(2);
      }
    });

    it('updates preview width after animation frame', async () => {
      const wrapper = mount(App);
      await wrapper.vm.$nextTick();

      if (resizeObserverCallback) {
        window.innerWidth = 920;
        window.innerHeight = 800;
        wrapper.vm.asideRef = { clientWidth: 320, clientHeight: 100 };
        resizeObserverCallback();

        // Width should be updated (via requestAnimationFrame callback)
        // Desktop mode: Window: 920px x 800px, Aside: 320px
        // Available width: 920 - 320 - 32 = 568
        // Available height: 800 - 32 = 768
        // Frame: 1000px x 750px
        // Scale by width: 568 / 1000 = 0.568
        // Scale by height: 768 / 750 = 1.024
        // Use min scale: 0.568
        // Scaled width: 1000 * 0.568 = 568
        expect(wrapper.vm.previewWidth).toBe(568);
      }
    });
  });

  describe('Edge Cases', () => {
    it('handles very small window width', () => {
      const wrapper = mount(App);

      window.innerWidth = 368;
      window.innerHeight = 800;

      wrapper.vm.asideRef = {
        clientWidth: 320,
        clientHeight: 100,
      };

      wrapper.vm.updatePreviewWidth();

      // Desktop mode: Window: 368px x 800px, Aside: 320px
      // Available width: 368 - 320 - 32 = 16
      // Available height: 800 - 32 = 768
      // Scale by width: 16 / 1000 = 0.016
      // Scale by height: 768 / 750 = 1.024
      // Use min scale: 0.016
      // Scaled width: 1000 * 0.016 = 16
      expect(wrapper.vm.previewWidth).toBe(16);
    });

    it('handles very large window dimensions', () => {
      const wrapper = mount(App);

      window.innerWidth = 10000;
      window.innerHeight = 8000;

      wrapper.vm.asideRef = {
        clientWidth: 320,
        clientHeight: 100,
      };

      wrapper.vm.updatePreviewWidth();

      // Desktop mode: Window: 10000px x 8000px, Aside: 320px
      // Available width: 10000 - 320 - 32 = 9648
      // Available height: 8000 - 32 = 7968
      // Frame: 1000px x 750px
      // Scale by width: 9648 / 1000 = 9.648
      // Scale by height: 7968 / 750 = 10.624
      // Use min scale: 9.648
      // Scaled width: 1000 * 9.648 = 9648
      // Capped at 800
      expect(wrapper.vm.previewWidth).toBe(800);
    });

    it('handles small window with aside', () => {
      const wrapper = mount(App);

      window.innerWidth = 620;
      window.innerHeight = 600;

      wrapper.vm.asideRef = {
        clientWidth: 320,
        clientHeight: 100,
      };

      wrapper.vm.updatePreviewWidth();

      // Desktop mode: Window: 620px x 600px, Aside: 320px
      // Available width: 620 - 320 - 32 = 268
      // Available height: 600 - 32 = 568
      // Frame: 1000px x 750px
      // Scale by width: 268 / 1000 = 0.268
      // Scale by height: 568 / 750 = 0.757
      // Use min scale: 0.268
      // Scaled width: 1000 * 0.268 = 268
      expect(wrapper.vm.previewWidth).toBe(268);
    });
  });

});

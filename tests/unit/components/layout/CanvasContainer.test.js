import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import CanvasContainer from '@/components/layout/CanvasContainer.vue';

// Mock FrameCanvas component to avoid vue-konva issues in tests
vi.mock('@/components/canvas/FrameCanvas.vue', () => ({
  default: {
    name: 'FrameCanvas',
    template: '<div data-testid="frame-canvas">Mocked FrameCanvas</div>',
    methods: {
      getStage: vi.fn(() => ({})),
    },
  },
}));

describe('CanvasContainer', () => {
  let wrapper;

  beforeEach(() => {
    // Mock ResizeObserver
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
      unobserve: vi.fn(),
    }));
  });

  it('renders the canvas container with correct structure', () => {
    wrapper = mount(CanvasContainer, {
      props: { previewWidth: 800 },
    });
    expect(wrapper.find('[data-testid="canvas-container"]').exists()).toBe(true);
  });

  it('renders FrameCanvas component', () => {
    wrapper = mount(CanvasContainer, {
      props: { previewWidth: 800 },
    });
    expect(wrapper.find('[data-testid="frame-canvas"]').exists()).toBe(true);
  });

  it('is full height', () => {
    wrapper = mount(CanvasContainer, {
      props: { previewWidth: 800 },
    });
    const container = wrapper.find('[data-testid="canvas-container"]');
    expect(container.classes()).toContain('h-full');
  });

  it('is full width', () => {
    wrapper = mount(CanvasContainer, {
      props: { previewWidth: 800 },
    });
    const container = wrapper.find('[data-testid="canvas-container"]');
    expect(container.classes()).toContain('w-full');
  });

  describe('handleCanvasReady function', () => {
    it('handleCanvasReady method exists', () => {
      wrapper = mount(CanvasContainer, {
        props: { previewWidth: 800 },
      });
      expect(typeof wrapper.vm.handleCanvasReady).toBe('function');
    });

    it('emits canvasReady event when handleCanvasReady is called', () => {
      wrapper = mount(CanvasContainer, {
        props: { previewWidth: 800 },
      });
      const mockStage = { toDataURL: vi.fn(), width: 800, height: 600 };
      wrapper.vm.handleCanvasReady(mockStage);
      expect(wrapper.emitted('canvasReady')).toBeTruthy();
    });

    it('emits canvasReady event with stage reference', () => {
      wrapper = mount(CanvasContainer, {
        props: { previewWidth: 800 },
      });
      const mockStage = { toDataURL: vi.fn(), width: 800, height: 600 };
      wrapper.vm.handleCanvasReady(mockStage);
      expect(wrapper.emitted('canvasReady')[0][0]).toStrictEqual(mockStage);
    });

    it('emits canvasReady event exactly once per call', () => {
      wrapper = mount(CanvasContainer, {
        props: { previewWidth: 800 },
      });
      const mockStage = { toDataURL: vi.fn() };
      wrapper.vm.handleCanvasReady(mockStage);
      expect(wrapper.emitted('canvasReady')).toHaveLength(1);
    });

    it('can call handleCanvasReady multiple times', () => {
      wrapper = mount(CanvasContainer, {
        props: { previewWidth: 800 },
      });
      const mockStage = { toDataURL: vi.fn() };
      wrapper.vm.handleCanvasReady(mockStage);
      wrapper.vm.handleCanvasReady(mockStage);
      expect(wrapper.emitted('canvasReady')).toHaveLength(2);
    });
  });

  describe('Refs', () => {
    it('has containerRef defined', () => {
      wrapper = mount(CanvasContainer, {
        props: { previewWidth: 800 },
      });
      expect(wrapper.vm.containerRef).toBeDefined();
    });

    it('has canvasRef defined', () => {
      wrapper = mount(CanvasContainer, {
        props: { previewWidth: 800 },
      });
      expect(wrapper.vm.canvasRef).toBeDefined();
    });
  });
});

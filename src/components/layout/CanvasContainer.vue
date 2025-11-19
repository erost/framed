<!--
  CanvasContainer Component
  Wrapper for the canvas preview area with responsive sizing
-->
<template>
  <div
    ref="containerRef"
    class="w-full h-full flex items-center justify-center"
    data-testid="canvas-container"
  >
    <FrameCanvas
      ref="canvasRef"
      :preview-width="previewWidth"
      @ready="handleCanvasReady"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import FrameCanvas from '@/components/canvas/FrameCanvas.vue';

/**
 * CanvasContainer component
 * Provides a centered, responsive container for the canvas preview
 */

defineProps({
  /**
   * Preview width from parent (calculated in App.vue)
   */
  previewWidth: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['canvasReady']);

const containerRef = ref(null);
const canvasRef = ref(null);

/**
 * Handle canvas ready event
 */
const handleCanvasReady = (stage) => {
  emit('canvasReady', stage);
};
</script>

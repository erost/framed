<!--
  FrameCanvas Component
  Main canvas component with integrated upload zones
  Combines canvas preview and image upload functionality
-->
<template>
  <div
    class="frame-canvas-container relative bg-gray-900 rounded-lg p-4"
    :data-testid="testId"
  >
    <!-- Konva Canvas -->
    <div
      class="relative"
      :style="getCanvasContainerStyle()"
    >
      <v-stage
        v-if="stageConfig"
        ref="stageRef"
        :config="stageConfig"
        data-testid="konva-stage"
      >
        <!-- Background Layer -->
        <v-layer>
          <v-rect
            v-if="backgroundConfig"
            :config="backgroundConfig"
          />
        </v-layer>

        <!-- Images Layer -->
        <v-layer>
          <v-image
            v-if="image1ConfigWithElement"
            :config="image1ConfigWithElement"
          />
          <v-image
            v-if="image2ConfigWithElement"
            :config="image2ConfigWithElement"
          />
        </v-layer>
      </v-stage>

      <!-- Upload Zone Overlays -->
      <div
        v-if="stageConfig"
        class="absolute inset-0 pointer-events-none"
        :style="{ padding: '16px' }"
      >
        <!-- Upload Zone 1 -->
        <div
          v-if="imageLayout"
          class="absolute pointer-events-auto"
          :style="getUploadZoneStyle(imageLayout.image1, 0)"
        >
          <div
            class="upload-zone w-full h-full flex items-center justify-center 
                   cursor-pointer rounded-lg transition-all duration-200"
            :class="getUploadZoneClass(0)"
            @click="triggerFileInput(0)"
            @dragover.prevent="handleDragOver(0)"
            @dragleave.prevent="handleDragLeave(0)"
            @drop.prevent="handleDrop($event, 0)"
          >
            <input
              ref="fileInput1"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFileSelect($event, 0)"
            >

            <div
              v-if="!images[0]"
              class="text-center p-4"
            >
              <svg
                class="w-12 h-12 mx-auto mb-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <p class="text-sm font-medium text-gray-300">
                {{ orientation === ORIENTATIONS.PORTRAIT ? 'Top' : 'Left' }} Image
              </p>
              <p class="text-xs text-gray-400 mt-1">
                Click or drop
              </p>
            </div>

            <button
              v-else
              class="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 
                     text-white rounded-full shadow-lg transition-colors z-10"
              @click.stop="removeImage(0)"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Upload Zone 2 -->
        <div
          v-if="imageLayout"
          class="absolute pointer-events-auto"
          :style="getUploadZoneStyle(imageLayout.image2, 1)"
        >
          <div
            class="upload-zone w-full h-full flex items-center justify-center 
                   cursor-pointer rounded-lg transition-all duration-200"
            :class="getUploadZoneClass(1)"
            @click="triggerFileInput(1)"
            @dragover.prevent="handleDragOver(1)"
            @dragleave.prevent="handleDragLeave(1)"
            @drop.prevent="handleDrop($event, 1)"
          >
            <input
              ref="fileInput2"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFileSelect($event, 1)"
            >

            <div
              v-if="!images[1]"
              class="text-center p-4"
            >
              <svg
                class="w-12 h-12 mx-auto mb-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <p class="text-sm font-medium text-gray-300">
                {{ orientation === ORIENTATIONS.PORTRAIT ? 'Bottom' : 'Right' }} Image
              </p>
              <p class="text-xs text-gray-400 mt-1">
                Click or drop
              </p>
            </div>

            <button
              v-else
              class="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 
                     text-white rounded-full shadow-lg transition-colors z-10"
              @click.stop="removeImage(1)"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State (when no canvas yet) -->
    <div
      v-if="!stageConfig"
      class="flex items-center justify-center h-96 text-gray-400"
      data-testid="canvas-placeholder"
    >
      <div class="text-center">
        <svg
          class="w-16 h-16 mx-auto mb-4 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 
               2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 
               2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p class="text-lg font-medium">
          Picture Framing Canvas
        </p>
        <p class="text-sm mt-2">
          Configure settings to start
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, toRef } from 'vue';
import { useCanvasRenderer } from '@/composables/useCanvasRenderer';
import { useImageState } from '@/composables/useImageState';
import { useFrameConfig } from '@/composables/useFrameConfig';
import { PREVIEW_CONSTRAINTS, ORIENTATIONS } from '@/utils/constants';
import { logError } from '@/utils/logger';

/**
 * FrameCanvas component
 * Renders the frame using Konva.js with integrated upload zones
 */

const props = defineProps({
  /**
   * Preview width for responsive display
   */
  previewWidth: {
    type: Number,
    default: PREVIEW_CONSTRAINTS.defaultWidth,
  },

  /**
   * Test ID for testing
   */
  testId: {
    type: String,
    default: 'frame-canvas',
  },
});

const emit = defineEmits(['ready']);

const stageRef = ref(null);
const fileInput1 = ref(null);
const fileInput2 = ref(null);
const image1Element = ref(null);
const image2Element = ref(null);
const dragOver = ref([false, false]);

const {
  stageConfig,
  backgroundConfig,
  image1Config,
  image2Config,
  imageLayout,
  previewScale,
  previewDimensions,
  isReady
} = useCanvasRenderer({ previewWidth: toRef(() => props.previewWidth) });

const { images, addImage, removeImage: removeImageFromState } = useImageState();
const { orientation } = useFrameConfig();

/**
 * Create an image element from a data URL
 * @param {string} dataUrl - The data URL to load
 * @returns {Promise<HTMLImageElement>} Promise that resolves with the loaded image
 */
const createImageElement = (dataUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
};

/**
 * Load image elements from dataUrls
 */
watch(() => images.value[0], async (newImage) => {
  if (newImage && newImage.dataUrl) {
    try {
      image1Element.value = await createImageElement(newImage.dataUrl);
    } catch (error) {
      logError('Failed to load image 1:', error);
      image1Element.value = null;
    }
  } else {
    image1Element.value = null;
  }
}, { immediate: true });

watch(() => images.value[1], async (newImage) => {
  if (newImage && newImage.dataUrl) {
    try {
      image2Element.value = await createImageElement(newImage.dataUrl);
    } catch (error) {
      logError('Failed to load image 2:', error);
      image2Element.value = null;
    }
  } else {
    image2Element.value = null;
  }
}, { immediate: true });

/**
 * Computed config with actual image elements
 */
const image1ConfigWithElement = computed(() => {
  if (!image1Config.value || !image1Element.value) return null;
  return {
    ...image1Config.value,
    image: image1Element.value,
  };
});

const image2ConfigWithElement = computed(() => {
  if (!image2Config.value || !image2Element.value) return null;
  return {
    ...image2Config.value,
    image: image2Element.value,
  };
});

/**
 * Calculate upload zone position and size based on image layout
 */
const getUploadZoneStyle = (slot) => {
  if (!slot || !previewScale.value) return {};

  const scale = previewScale.value;
  return {
    left: `${slot.x * scale}px`,
    top: `${slot.y * scale}px`,
    width: `${slot.width * scale}px`,
    height: `${slot.height * scale}px`,
  };
};

/**
 * Get upload zone classes based on state
 */
const getUploadZoneClass = (index) => {
  const hasImage = !!images.value[index];
  const isDragging = dragOver.value[index];

  return {
    'border-2 border-dashed': !hasImage,
    'border-blue-400 bg-blue-900/20': !hasImage && isDragging,
    // eslint-disable-next-line max-len
    'border-gray-600 bg-gray-800/50 hover:border-blue-400 hover:bg-blue-900/10': !hasImage && !isDragging,
    '': hasImage,
  };
};

/**
 * Trigger file input click
 */
const triggerFileInput = (index) => {
  if (index === 0 && fileInput1.value) {
    fileInput1.value.click();
  } else if (index === 1 && fileInput2.value) {
    fileInput2.value.click();
  }
};

/**
 * Handle drag over
 */
const handleDragOver = (index) => {
  dragOver.value[index] = true;
};

/**
 * Handle drag leave
 */
const handleDragLeave = (index) => {
  dragOver.value[index] = false;
};

/**
 * Handle file drop
 */
const handleDrop = async (event, index) => {
  dragOver.value[index] = false;
  const files = event.dataTransfer?.files;
  if (files && files[0]) {
    await processFile(files[0], index);
  }
};

/**
 * Handle file select from input
 */
const handleFileSelect = async (event, index) => {
  const files = event.target?.files;
  if (files && files[0]) {
    await processFile(files[0], index);
  }
};

/**
 * Process uploaded file
 */
const processFile = async (file, position) => {
  try {
    await addImage(file, position);
  } catch (error) {
    logError('Image upload error:', error);
  }
};

/**
 * Remove image
 */
const removeImage = (position) => {
  removeImageFromState(position);

  // Reset file input
  if (position === 0 && fileInput1.value) {
    fileInput1.value.value = '';
  } else if (position === 1 && fileInput2.value) {
    fileInput2.value.value = '';
  }
};

/**
 * Calculate canvas container style to constrain scaled stage size
 * The stage uses scale transform, so we need to set container dimensions
 * to the scaled size to prevent overflow
 */
const getCanvasContainerStyle = () => {
  if (!previewScale.value) return {};

  return {
    width: `${previewDimensions.value.width}px`,
    height: `${previewDimensions.value.height}px`,
  };
};

/**
 * Get the Konva stage instance
 */
const getStage = () => {
  return stageRef.value?.getNode();
};

// Watch for canvas ready state and emit ready event
watch(isReady, (ready) => {
  if (ready) {
    setTimeout(() => {
      const stage = getStage();
      if (stage) {
        emit('ready', stage);
      }
    }, 100);
  }
}, { immediate: true });

onMounted(() => {
  if (isReady.value) {
    setTimeout(() => {
      const stage = getStage();
      if (stage) {
        emit('ready', stage);
      }
    }, 100);
  }
});
</script>

<style scoped>
.frame-canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.upload-zone {
  position: relative;
}

.upload-zone:hover {
  backdrop-filter: blur(2px);
}
</style>

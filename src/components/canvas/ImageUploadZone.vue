<!--
  ImageUploadZone Component
  Drag-and-drop file upload zone for images
-->
<template>
  <div
    class="image-upload-zone"
    :class="zoneClasses"
    :data-testid="testId"
    @click="handleClick"
    @drop.prevent="handleDrop"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
  >
    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      class="hidden"
      :data-testid="`${testId}-input`"
      @change="handleFileSelect"
    >

    <div
      v-if="!image"
      class="upload-content"
    >
      <svg
        class="w-12 h-12 mb-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
      <p class="text-base font-medium text-gray-300 mb-1">
        {{ position === 0 ? 'Upload First Image' : 'Upload Second Image' }}
      </p>
      <p class="text-sm text-gray-400">
        Click or drag & drop
      </p>
      <p class="text-xs text-gray-400 mt-2">
        JPEG, PNG, or WebP (max {{ maxFileSizeMB }}MB)
      </p>
    </div>

    <div
      v-else
      class="image-preview"
    >
      <img
        :src="image.dataUrl"
        :alt="`Uploaded image ${position + 1}`"
        class="max-w-full max-h-full object-contain rounded"
      >
      <button
        class="remove-button"
        type="button"
        aria-label="Remove image"
        :data-testid="`${testId}-remove`"
        @click.stop="handleRemove"
      >
        <svg
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 
            111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 
            11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <div
      v-if="error"
      class="error-message"
      role="alert"
    >
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useImageState } from '@/composables/useImageState';
import { IMAGE_CONSTRAINTS } from '@/utils/constants';

/**
 * ImageUploadZone component
 * Provides drag-and-drop and click-to-upload functionality for images
 */

const props = defineProps({
  /**
   * Image position (0 or 1)
   */
  position: {
    type: Number,
    required: true,
    validator: (value) => [0, 1].includes(value),
  },

  /**
   * Test ID for testing
   */
  testId: {
    type: String,
    default: 'image-upload-zone',
  },
});

const emit = defineEmits(['upload', 'remove', 'error']);

const { images, addImage, removeImage } = useImageState();

const fileInput = ref(null);
const isDragging = ref(false);
const error = ref('');

/**
 * Get current image for this position
 */
const image = computed(() => images.value[props.position] || null);

/**
 * Compute zone classes based on state
 */
const zoneClasses = computed(() => ({
  'border-blue-500 bg-blue-900 bg-opacity-20': isDragging.value,
  'border-gray-600 hover:border-gray-400': !isDragging.value && !image.value,
  'border-green-400': image.value && !error.value,
  'border-red-400': error.value,
}));

/**
 * Get file size in MB for display
 */
const maxFileSizeMB = computed(() => {
  return Math.round(IMAGE_CONSTRAINTS.maxFileSize / (1024 * 1024));
});

/**
 * Handle click to trigger file input
 */
const handleClick = () => {
  if (!image.value) {
    fileInput.value?.click();
  }
};

/**
 * Handle file selection from input
 */
const handleFileSelect = async (event) => {
  const file = event.target.files?.[0];
  if (file) {
    await uploadImage(file);
  }
};

/**
 * Handle drag over
 */
const handleDragOver = () => {
  isDragging.value = true;
};

/**
 * Handle drag leave
 */
const handleDragLeave = () => {
  isDragging.value = false;
};

/**
 * Handle file drop
 */
const handleDrop = async (event) => {
  isDragging.value = false;

  const file = event.dataTransfer?.files?.[0];
  if (file) {
    await uploadImage(file);
  }
};

/**
 * Upload image file
 */
const uploadImage = async (file) => {
  error.value = '';

  try {
    await addImage(file, props.position);
    emit('upload', {
      position: props.position,
      image: images.value[props.position],
    });
  } catch (err) {
    error.value = err.message || 'Failed to upload image';
    emit('error', {
      position: props.position,
      error: err,
    });
  }
};

/**
 * Handle image removal
 */
const handleRemove = () => {
  removeImage(props.position);
  error.value = '';
  emit('remove', { position: props.position });

  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};
</script>

<style scoped>
.image-upload-zone {
  position: relative;
  min-height: 200px;
  border-width: 2px;
  border-style: dashed;
  border-radius: 0.5rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-content {
  text-align: center;
  pointer-events: none;
}

.image-preview {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.remove-button:hover {
  background-color: rgba(0, 0, 0, 0.9);
}

.error-message {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  right: 0.5rem;
  padding: 0.5rem;
  background-color: rgba(239, 68, 68, 0.1);
  border-width: 1px;
  border-style: solid;
  border-color: #ef4444;
  border-radius: 0.375rem;
  color: #ef4444;
  font-size: 0.875rem;
  text-align: center;
}
</style>

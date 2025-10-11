<!--
  ColorPicker Component
  Color picker using native HTML input type="color"
-->
<template>
  <div
    class="flex flex-col gap-1"
    :data-testid="testId"
  >
    <label
      for="background-color"
      class="text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      Frame Color
    </label>

    <div class="flex items-center gap-3">
      <input
        id="background-color"
        v-model="localColor"
        type="color"
        class="color-picker-swatch"
        data-testid="color-picker-input"
        @change="handleColorChange"
      >

      <input
        v-model="colorInput"
        type="text"
        class="color-text-input"
        placeholder="#FFFFFF"
        maxlength="7"
        data-testid="color-input"
        @input="handleManualInput"
        @blur="handleManualBlur"
      >
    </div>

    <span class="text-sm text-gray-500 dark:text-gray-400">
      (hex format)
    </span>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useFrameConfig } from '@/composables/useFrameConfig';

/**
 * ColorPicker component
 * Uses native HTML color input for color selection
 */

defineProps({
  /**
   * Test ID for testing
   */
  testId: {
    type: String,
    default: 'color-picker',
  },
});

const { backgroundColor, updateBackgroundColor } = useFrameConfig();

const localColor = ref(backgroundColor.value);
const colorInput = ref(backgroundColor.value);

/**
 * Handle color change from native color picker
 */
const handleColorChange = (event) => {
  const value = event.target.value.toUpperCase();
  updateBackgroundColor(value);
  colorInput.value = value;
};

/**
 * Handle manual color input
 */
const handleManualInput = (event) => {
  let value = event.target.value;

  // Auto-prepend # if not present
  if (value && !value.startsWith('#')) {
    value = '#' + value;
    colorInput.value = value;
  }
};

/**
 * Handle manual color input blur
 */
const handleManualBlur = () => {
  const value = colorInput.value.toUpperCase();

  // Validate hex color format
  const hexPattern = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  if (hexPattern.test(value)) {
    updateBackgroundColor(value);
    localColor.value = value;
  } else {
    // Reset to current valid color if invalid
    colorInput.value = backgroundColor.value;
    localColor.value = backgroundColor.value;
  }
};

/**
 * Watch for background color changes from other sources
 */
watch(backgroundColor, (newColor) => {
  if (colorInput.value !== newColor) {
    colorInput.value = newColor;
    localColor.value = newColor;
  }
});
</script>

<style scoped>
@import "tailwindcss" reference;

/**
 * Color picker swatch
 * Sized to match BaseInput height (py-2 = ~40px)
 */
.color-picker-swatch {
  @apply w-10 h-10 border border-gray-300 rounded-lg cursor-pointer;
  @apply dark:border-gray-600;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
  -webkit-appearance: none;
  padding: 0;
}

/**
 * Color text input
 * Matches BaseInput styling
 */
.color-text-input {
  @apply flex-1 px-3 py-2 border border-gray-300 rounded-lg;
  @apply bg-white text-gray-900 text-sm;
  @apply focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
  @apply dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100;
}

/* Remove default color input styling on some browsers */
input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 2px;
}

input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 6px;
}

input[type="color"]::-moz-color-swatch {
  border: none;
  border-radius: 6px;
}
</style>

<!--
  ColorPicker Component
  Color picker using native HTML input type="color"
-->
<template>
  <input
    id="background-color"
    v-model="backgroundColor"
    type="color"
    class="color-picker-input"
    data-testid="color-picker-input"
    @change="handleColorChange"
  >
</template>

<script setup>
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

/**
 * Handle color change from native color picker
 */
const handleColorChange = (event) => {
  const value = event.target.value.toUpperCase();
  updateBackgroundColor(value);
};
</script>

<style scoped>
@import "tailwindcss" reference;

/**
 * Color picker input
 * Full width color input
 */
.color-picker-input {
  @apply w-full h-10 border border-gray-600 rounded-lg cursor-pointer;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
  -webkit-appearance: none;
  padding: 0;
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

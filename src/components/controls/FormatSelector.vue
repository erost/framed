<!--
  FormatSelector Component
  Select image export format (PNG, JPEG)
-->
<template>
  <div class="flex flex-col gap-1">
    <label 
      for="format" 
      class="text-sm font-medium text-gray-300"
    >
      Format
    </label>
    <select
      id="format"
      v-model="format"
      class="px-3 py-2 bg-gray-700 text-gray-100 rounded cursor-pointer h-[42px]
            focus:ring-2 focus:ring-blue-400 focus:outline-none 
            hover:bg-gray-600 appearance-none"
      :data-testid="testId"
      @change="handleFormatChange"
    >
      <option
        v-for="fmt in IMAGE_FORMATS"
        :key="fmt.mimeType"
        :value="fmt.mimeType"
      >
        .{{ fmt.extension }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { useCanvasRenderer } from '@/composables/useCanvasRenderer';
import { IMAGE_FORMATS } from '@/utils/constants';

defineProps({
  /**
   * Test ID for testing
   */
  testId: {
    type: String,
    default: 'format-selector',
  },
});

const { format, updateFormat } = useCanvasRenderer();

/**
 * Handle format change
 * @param {Event} event - Change event
 */
const handleFormatChange = (event) => {
  updateFormat(event.target.value);
};
</script>

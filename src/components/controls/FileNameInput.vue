<!--
  FileNameInput Component
  Desidered filename for download with validation
-->
<template>
  <BaseInput
    v-model="fileName"
    type="text"
    label="Filename"
    :error="validationError"
    :test-id="testId"
  />
</template>

<script setup>
import { computed } from 'vue';
import BaseInput from '@/components/shared/BaseInput.vue';
import { validateFileName } from '@/utils/validation';
import { useCanvasRenderer } from '@/composables/useCanvasRenderer';

defineProps({
  /**
   * Test ID for testing
   */
  testId: {
    type: String,
    default: 'file-name-input',
  },
});

const { fileName } = useCanvasRenderer();

const validationError = computed(() => {
  const result = validateFileName(fileName.value);
  return result.error || '';
});

</script>
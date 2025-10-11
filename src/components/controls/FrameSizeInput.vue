<!--
  FrameSizeInput Component
  Number input for frame size (longest side) with validation
-->
<template>
  <BaseInput
    v-model="frameSize"
    type="number"
    label="Frame Size"
    unit="px"
    :min="FRAME_CONSTRAINTS.minSize"
    :max="FRAME_CONSTRAINTS.maxSize"
    :step="100"
    :error="validationError"
    :hint="`range(${FRAME_CONSTRAINTS.minSize}px:${FRAME_CONSTRAINTS.maxSize}px)`"
    :test-id="testId"
    @blur="handleBlur"
  />
</template>

<script setup>
import { computed } from 'vue';
import { useFrameConfig } from '@/composables/useFrameConfig';
import { FRAME_CONSTRAINTS } from '@/utils/constants';
import { validateFrameSize } from '@/utils/validation';
import BaseInput from '@/components/shared/BaseInput.vue';

/**
 * FrameSizeInput component
 * Input for frame size (longest side) with validation and constraints
 */

defineProps({
  /**
   * Test ID for testing
   */
  testId: {
    type: String,
    default: 'frame-size-input',
  },
});

const { frameSize, updateFrameSize } = useFrameConfig();

/**
 * Validate frame size and return error message
 */
const validationError = computed(() => {
  const result = validateFrameSize(frameSize.value);
  return result.error || '';
});

/**
 * Handle blur event to validate and clamp value
 */
const handleBlur = () => {
  const result = validateFrameSize(frameSize.value);

  if (!result.valid && result.clamped !== undefined) {
    updateFrameSize(result.clamped);
  }
};
</script>

<!--
  SpacingInput Component
  Number input for spacing between images and frame edges
-->
<template>
  <BaseInput
    v-model="spacing"
    type="number"
    label="Spacing"
    unit="px"
    :min="FRAME_CONSTRAINTS.minSpacing"
    :max="FRAME_CONSTRAINTS.maxSpacing"
    :step="10"
    :error="validationError"
    :hint="`range(${FRAME_CONSTRAINTS.minSpacing}px:${FRAME_CONSTRAINTS.maxSpacing}px)`"
    :test-id="testId"
    @blur="handleBlur"
  />
</template>

<script setup>
import { computed } from 'vue';
import { useFrameConfig } from '@/composables/useFrameConfig';
import { FRAME_CONSTRAINTS } from '@/utils/constants';
import { validateSpacing } from '@/utils/validation';
import BaseInput from '@/components/shared/BaseInput.vue';

/**
 * SpacingInput component
 * Input for spacing between images and frame edges with validation
 */

defineProps({
  /**
   * Test ID for testing
   */
  testId: {
    type: String,
    default: 'spacing-input',
  },
});

const { spacing, updateSpacing } = useFrameConfig();

/**
 * Validate spacing and return error message
 */
const validationError = computed(() => {
  const result = validateSpacing(spacing.value);
  return result.error || '';
});

/**
 * Handle blur event to validate and clamp value
 */
const handleBlur = () => {
  const result = validateSpacing(spacing.value);

  if (!result.valid && result.clamped !== undefined) {
    updateSpacing(result.clamped);
  }
};
</script>

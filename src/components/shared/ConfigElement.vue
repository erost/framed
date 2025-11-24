<!--
  ConfigElement Component
  Wrapper component for consistent configuration control layout
  Provides label and element slots for standardized naming and spacing
-->
<template>
  <div
    class="flex flex-col gap-2"
    :data-testid="testId"
  >
    <!-- Label slot for configuration name -->
    <div
      v-if="$slots.label"
      class="text-xs font-medium text-gray-400 uppercase tracking-wide"
    >
      <slot name="label" />
    </div>

    <!-- Element slot for the actual control component -->
    <div>
      <slot name="element" />
    </div>
  </div>
</template>

<script setup>
/**
 * ConfigElement component
 * Provides consistent layout for configuration controls
 *
 * Slots:
 * - label: Configuration control label (e.g., "Orientation", "Border Size")
 * - element: The actual control component (e.g., OrientationToggle, BorderSlider)
 *
 * Layout:
 * - Label above element
 * - Consistent spacing and typography
 * - Label styled with uppercase text, small size, and muted color
 */

defineProps({
  /**
   * Test ID for testing
   */
  testId: {
    type: String,
    default: 'config-element',
  },
});
</script>

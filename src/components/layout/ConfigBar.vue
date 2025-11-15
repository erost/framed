<!--
  ConfigBar Component
  Top configuration bar with all frame controls and action buttons
-->
<template>
  <div
    class="w-full max-w-[1024px] mx-auto bg-gray-800 border
           border-gray-700 rounded-lg shadow-sm px-6 py-4"
    data-testid="config-bar"
  >
    <div class="flex flex-col gap-6">
      <!-- Row 1: Orientation and Aspect Ratio Controls -->
      <div
        class="flex flex-col md:flex-row gap-4 md:items-center"
        data-testid="row-orientation-aspect"
      >
        <div class="flex-1">
          <OrientationToggle />
        </div>
        <div class="flex-1">
          <AspectRatioSelector />
        </div>
      </div>

      <!-- Row 2: Frame Configuration Controls -->
      <div
        class="flex flex-col md:flex-row gap-4"
        data-testid="row-frame-config"
      >
        <div class="flex-1">
          <ColorPicker />
        </div>
        <div class="flex-1">
          <FrameSizeInput />
        </div>
        <div class="flex-1">
          <SpacingInput />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import OrientationToggle from '@/components/controls/OrientationToggle.vue';
import AspectRatioSelector from '@/components/controls/AspectRatioSelector.vue';
import ColorPicker from '@/components/controls/ColorPicker.vue';
import FrameSizeInput from '@/components/controls/FrameSizeInput.vue';
import SpacingInput from '@/components/controls/SpacingInput.vue';

/**
 * ConfigBar component
 * Contains all frame configuration controls
 * Organized in 2 rows:
 * - Row 1: OrientationToggle and AspectRatioSelector 
 *          (side by side on desktop with equal width, stacked on mobile)
 * - Row 2: ColorPicker, FrameSizeInput, SpacingInput 
 *          (responsive flex layout)
 */
</script>

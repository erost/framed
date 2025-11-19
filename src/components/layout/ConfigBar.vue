<!--
  ConfigBar Component
  Configuration controls for frame settings
  Desktop: Vertical stack in sidebar
  Mobile: Horizontal row at bottom
-->
<template>
  <div
    class="bg-gray-800 md:bg-transparent md:border-0 border-t border-gray-700
           md:rounded-none md:shadow-none md:px-0 md:py-0 px-4 py-3"
    data-testid="config-bar"
  >
    <!-- Mobile: Horizontal scrollable row -->
    <div class="flex md:flex-col gap-3 md:gap-4 overflow-x-auto md:overflow-x-visible">
      <div class="flex-shrink-0 md:flex-shrink min-w-[200px] md:min-w-0 md:w-full">
        <OrientationToggle />
      </div>
      <div class="flex-shrink-0 md:flex-shrink min-w-[200px] md:min-w-0 md:w-full">
        <AspectRatioSelector />
      </div>
      <div class="flex-shrink-0 md:flex-shrink min-w-[200px] md:min-w-0 md:w-full">
        <ColorPicker />
      </div>
      <div class="flex-shrink-0 md:flex-shrink min-w-[150px] md:min-w-0 md:w-full">
        <FrameSizeInput />
      </div>
      <div class="flex-shrink-0 md:flex-shrink min-w-[150px] md:min-w-0 md:w-full">
        <SpacingInput />
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
 *
 * Layout:
 * - Desktop (≥768px): Vertical stack in left sidebar
 * - Mobile (<768px): Horizontal scrollable row at bottom
 *
 * Controls included:
 * - OrientationToggle: Switch between portrait/landscape
 * - AspectRatioSelector: Select aspect ratio preset
 * - ColorPicker: Choose frame color
 * - FrameSizeInput: Adjust frame border size
 * - SpacingInput: Adjust spacing between image and frame
 */
</script>

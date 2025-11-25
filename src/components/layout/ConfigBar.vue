<!--
  ConfigBar Component
  Configuration controls for frame settings
  Desktop: Vertical stack in sidebar
  Mobile: Horizontal row at bottom
-->
<template>
  <div
    class="bg-gray-800 md:bg-transparent md:border-0 border-gray-700
           md:rounded-none md:shadow-none md:px-0 md:py-0 px-4 py-0"
    data-testid="config-bar"
  >
    <!-- Desktop & Mobile Panel: Vertical stack -->
    <div class="flex flex-col gap-3 md:gap-4">
      <div class="w-full">
        <ConfigElement test-id="config-orientation">
          <template #label>
            Orientation
          </template>
          <template #element>
            <OrientationToggle />
          </template>
        </ConfigElement>
      </div>
      <div class="w-full">
        <ConfigElement test-id="config-aspect-ratio">
          <template #label>
            Aspect Ratio
          </template>
          <template #element>
            <AspectRatioSelector />
          </template>
        </ConfigElement>
      </div>
      <div class="w-full">
        <ConfigElement test-id="config-frame-size">
          <template #label>
            Frame Size
          </template>
          <template #element>
            <FrameSizeSelector />
          </template>
        </ConfigElement>
      </div>
      <div class="w-full">
        <ConfigElement test-id="config-frame-color">
          <template #label>
            Frame Color
          </template>
          <template #element>
            <ColorPicker />
          </template>
        </ConfigElement>
      </div>
      <div class="w-full">
        <ConfigElement test-id="config-border-size">
          <template #label>
            Border Size
          </template>
          <template #element>
            <BorderSlider />
          </template>
        </ConfigElement>
      </div>
      <div class="w-full">
        <ConfigElement test-id="config-export-format">
          <template #label>
            Export Format
          </template>
          <template #element>
            <FormatSelector />
          </template>
        </ConfigElement>
      </div>
      <div class="w-full">
        <ConfigElement test-id="config-quality">
          <template #label>
            Quality
          </template>
          <template #element>
            <QualitySlider />
          </template>
        </ConfigElement>
      </div>
    </div>
  </div>
</template>

<script setup>
import ConfigElement from '@/components/shared/ConfigElement.vue';
import OrientationToggle from '@/components/controls/OrientationToggle.vue';
import AspectRatioSelector from '@/components/controls/AspectRatioSelector.vue';
import ColorPicker from '@/components/controls/ColorPicker.vue';
import FrameSizeSelector from '@/components/controls/FrameSizeSelector.vue';
import BorderSlider from '@/components/controls/BorderSlider.vue';
import FormatSelector from '@/components/controls/FormatSelector.vue';
import QualitySlider from '@/components/controls/QualitySlider.vue';

/**
 * ConfigBar component
 * Contains all frame configuration and output settings controls
 *
 * Layout:
 * - Desktop (≥768px): Vertical stack in left sidebar
 * - Mobile (<768px): Horizontal scrollable row at bottom
 *
 * Controls included:
 * - OrientationToggle: Switch between portrait/landscape
 * - AspectRatioSelector: Select aspect ratio preset
 * - ColorPicker: Choose frame color
 * - FrameSizeSelector: Select frame size preset
 * - BorderSlider: Adjust border spacing as percentage
 * - FormatSelector: Choose export format (PNG, JPEG, WebP)
 * - QualitySlider: Adjust export quality percentage
 */
</script>

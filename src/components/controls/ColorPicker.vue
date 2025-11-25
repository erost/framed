<!--
  ColorPicker Component
  Button group selector with preset colors (White, Black) and custom color picker
-->
<template>
  <div :data-testid="testId">
    <div
      class="selector-group"
      role="group"
      aria-label="Frame background color"
    >
      <!-- White preset -->
      <button
        type="button"
        :class="[
          'selector-btn',
          {
            'selector-btn-active': isWhiteActive,
            'selector-btn-inactive': !isWhiteActive
          }
        ]"
        :aria-pressed="isWhiteActive"
        data-testid="color-white"
        @click="handleSelectWhite"
      >
        <div
          class="color-swatch"
          :style="{ backgroundColor: COLOR_PRESETS.WHITE, border: '1px solid #4B5563' }"
        />
      </button>

      <!-- Black preset -->
      <button
        type="button"
        :class="[
          'selector-btn',
          {
            'selector-btn-active': isBlackActive,
            'selector-btn-inactive': !isBlackActive
          }
        ]"
        :aria-pressed="isBlackActive"
        data-testid="color-black"
        @click="handleSelectBlack"
      >
        <div
          class="color-swatch"
          :style="{ backgroundColor: COLOR_PRESETS.BLACK }"
        />
      </button>

      <!-- Custom color picker -->
      <div
        :class="[
          'custom-color-wrapper',
          'selector-btn',
          {
            'selector-btn-active': isCustomActive,
            'selector-btn-inactive': !isCustomActive
          }
        ]"
        @click="handleSelectCustom"
      >
        <input
          ref="colorInput"
          v-model="customColor"
          type="color"
          class="custom-color-input color-swatch"
          :aria-pressed="isCustomActive"
          data-testid="color-custom"
          @change="handleCustomColorChange"
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useFrameConfig } from '@/composables/useFrameConfig';
import { COLOR_PRESETS, COLOR_MODES } from '@/utils/constants';

/**
 * ColorPicker component
 * Provides preset color options (White, Black) and custom color selection
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

// Track which mode is selected using COLOR_MODES constants
const selectedMode = ref(COLOR_MODES.WHITE); // Default to white since that's the default background color
// Custom color state for the color input (defaults to gray)
const customColor = ref(COLOR_PRESETS.GRAY);
const colorInput = ref(null);

/**
 * Check if white preset is active
 */
const isWhiteActive = computed(() => selectedMode.value === COLOR_MODES.WHITE);

/**
 * Check if black preset is active
 */
const isBlackActive = computed(() => selectedMode.value === COLOR_MODES.BLACK);

/**
 * Check if custom mode is active
 */
const isCustomActive = computed(() => selectedMode.value === COLOR_MODES.CUSTOM);

/**
 * Handle white preset selection
 */
const handleSelectWhite = () => {
  selectedMode.value = COLOR_MODES.WHITE;
  updateBackgroundColor(COLOR_PRESETS.WHITE);
};

/**
 * Handle black preset selection
 */
const handleSelectBlack = () => {
  selectedMode.value = COLOR_MODES.BLACK;
  updateBackgroundColor(COLOR_PRESETS.BLACK);
};

/**
 * Handle custom mode selection (when clicking the custom button)
 */
const handleSelectCustom = () => {
  selectedMode.value = COLOR_MODES.CUSTOM;
};

/**
 * Handle custom color selection from color picker
 * Updates both the custom color state and the background color
 */
const handleCustomColorChange = (event) => {
  const value = event.target.value.toUpperCase();
  selectedMode.value = COLOR_MODES.CUSTOM;
  customColor.value = value;
  updateBackgroundColor(value);
};

/**
 * Watch backgroundColor changes from external sources
 * (e.g., reset button) to determine which mode should be active
 */
watch(backgroundColor, (newColor) => {
  if (newColor === COLOR_PRESETS.WHITE) {
    selectedMode.value = COLOR_MODES.WHITE;
  } else if (newColor === COLOR_PRESETS.BLACK) {
    selectedMode.value = COLOR_MODES.BLACK;
  } else {
    selectedMode.value = COLOR_MODES.CUSTOM;
    customColor.value = newColor;
  }
});

/**
 * Watch selectedMode changes to update background color for custom mode
 */
watch(selectedMode, (mode) => {
  if (mode === COLOR_MODES.CUSTOM) {
    updateBackgroundColor(customColor.value);
  }
});
</script>

<style scoped>
@import "tailwindcss" reference;
/**
 * Color swatch inside button
 * Small padding so selector-btn-active background is visible around it
 */
.color-swatch {
  width: 100%;
  height: 32px;
  border-radius: 4px;
  margin: 3px;
}

/**
 * Custom color wrapper to match button width in selector group
 */
.custom-color-wrapper {
  flex: 1;
}

/**
 * Style the custom color input to look like a selector button
 * Apply shared selector button classes
 */
.custom-color-input {
  /* Inherit selector button styles */
  cursor: pointer;
  border: none;

  /* Remove default browser styling */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

/* Style the color swatch inside the input */
.custom-color-input::-webkit-color-swatch-wrapper {
  padding: 0;
}

.custom-color-input::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
}

.custom-color-input::-moz-color-swatch {
  border: none;
  border-radius: 4px;
}
</style>

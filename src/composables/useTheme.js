/**
 * Theme Composable
 * Manages theme state (light/dark) with localStorage persistence
 */

import { ref, watch } from 'vue';
import { THEMES } from '@/utils/constants.js';

const THEME_STORAGE_KEY = 'erost-framed-theme';

/**
 * Apply theme to document
 * @param {string} theme - Theme to apply ('light' or 'dark')
 */
function applyTheme(theme) {
  if (theme === THEMES.DARK) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

/**
 * Get theme from localStorage or system preference
 * @returns {string} Theme ('light' or 'dark')
 */
function getInitialTheme() {
  // Check localStorage first
  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === THEMES.LIGHT || storedTheme === THEMES.DARK) {
      return storedTheme;
    }
  } catch {
    // localStorage not available
  }

  // Check system preference
  try {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return THEMES.DARK;
    }
  } catch {
    // matchMedia not available
  }

  // Default to light
  return THEMES.LIGHT;
}

// Singleton state
const theme = ref(getInitialTheme());

// Apply initial theme
applyTheme(theme.value);

// Watch for theme changes and persist/apply
watch(theme, (newTheme) => {
  // Persist to localStorage
  try {
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  } catch (error) {
    // localStorage not available or quota exceeded
    console.warn('Failed to persist theme to localStorage:', error);
  }

  // Apply to document
  applyTheme(newTheme);
});

/**
 * Composable for managing theme state
 * @returns {Object} Theme state and methods
 */
export function useTheme() {
  /**
   * Toggle theme between light and dark
   */
  const toggleTheme = () => {
    theme.value = theme.value === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
  };

  return {
    // State
    theme,

    // Methods
    toggleTheme,
  };
}

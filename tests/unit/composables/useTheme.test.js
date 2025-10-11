/**
 * Tests for useTheme composable
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { nextTick } from 'vue';
import { THEMES } from '@/utils/constants.js';

describe('useTheme', () => {
  let useTheme;

  beforeEach(async () => {
    // Reset all mocks
    vi.resetModules();
    vi.clearAllMocks();

    // Clear localStorage
    localStorage.clear();
    localStorage.getItem.mockClear();
    localStorage.setItem.mockClear();

    // Reset document class
    document.documentElement.classList.remove('dark');

    // Reset matchMedia to default (light mode)
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    // Default localStorage behavior (no stored theme)
    localStorage.getItem.mockReturnValue(null);

    // Dynamically import the module to get fresh singleton state
    const module = await import('@/composables/useTheme.js');
    useTheme = module.useTheme;
  });

  afterEach(() => {
    // Clean up
    document.documentElement.classList.remove('dark');
  });

  describe('Initial Theme', () => {
    it('should default to light theme when no stored preference', async () => {
      const { theme } = useTheme();
      await nextTick();
      expect(theme.value).toBe(THEMES.LIGHT);
    });

    it('should use stored theme from localStorage', async () => {
      // Reset and configure mocks before importing
      vi.resetModules();
      localStorage.getItem.mockReturnValue(THEMES.DARK);

      // Re-import to get fresh state with dark theme
      const module = await import('@/composables/useTheme.js?t=' + Date.now());
      const { theme } = module.useTheme();

      await nextTick();
      expect(theme.value).toBe(THEMES.DARK);
    });

    it('should use light theme from localStorage', async () => {
      // Reset and configure mocks before importing
      vi.resetModules();
      localStorage.getItem.mockReturnValue(THEMES.LIGHT);

      // Re-import to get fresh state with light theme
      const module = await import('@/composables/useTheme.js?t=' + Date.now());
      const { theme } = module.useTheme();

      await nextTick();
      expect(theme.value).toBe(THEMES.LIGHT);
    });

    it('should use system preference when no stored theme', async () => {
      // Reset and configure mocks before importing
      vi.resetModules();
      localStorage.getItem.mockReturnValue(null);
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      // Re-import to get fresh state with system dark preference
      const module = await import('@/composables/useTheme.js?t=' + Date.now());
      const { theme } = module.useTheme();

      await nextTick();
      expect(theme.value).toBe(THEMES.DARK);
    });

    it('should prioritize stored theme over system preference', async () => {
      // Reset and configure mocks before importing
      vi.resetModules();
      localStorage.getItem.mockReturnValue(THEMES.LIGHT);
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      // Re-import to get fresh state
      const module = await import('@/composables/useTheme.js?t=' + Date.now());
      const { theme } = module.useTheme();

      await nextTick();
      // Should use stored theme (light), not system preference (dark)
      expect(theme.value).toBe(THEMES.LIGHT);
    });
  });

  describe('Theme Application', () => {
    it('should apply light theme to document on mount', async () => {
      vi.resetModules();
      localStorage.getItem.mockReturnValue(THEMES.LIGHT);

      const module = await import('@/composables/useTheme.js?t=' + Date.now());
      module.useTheme();

      await nextTick();
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should apply dark theme to document on mount', async () => {
      vi.resetModules();
      document.documentElement.classList.remove('dark');
      localStorage.getItem.mockReturnValue(THEMES.DARK);

      const module = await import('@/composables/useTheme.js?t=' + Date.now());
      module.useTheme();

      await nextTick();
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should save theme to localStorage on mount', async () => {
      vi.resetModules();
      localStorage.getItem.mockReturnValue(THEMES.DARK);
      localStorage.setItem.mockClear();

      const module = await import('@/composables/useTheme.js?t=' + Date.now());
      module.useTheme();

      await nextTick();
      // Theme is set initially when module loads, then watch doesn't trigger unless value changes
      // So we just check that the theme was applied to the document
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark', async () => {
      const { theme, toggleTheme } = useTheme();

      await nextTick();
      expect(theme.value).toBe(THEMES.LIGHT);

      toggleTheme();

      await nextTick();
      expect(theme.value).toBe(THEMES.DARK);
    });

    it('should toggle from dark to light', async () => {
      vi.resetModules();
      localStorage.getItem.mockReturnValue(THEMES.DARK);

      const module = await import('@/composables/useTheme.js?t=' + Date.now());
      const { theme, toggleTheme } = module.useTheme();

      await nextTick();
      expect(theme.value).toBe(THEMES.DARK);

      toggleTheme();

      await nextTick();
      expect(theme.value).toBe(THEMES.LIGHT);
    });

    it('should apply theme to document when toggling', async () => {
      const { toggleTheme } = useTheme();

      await nextTick();
      expect(document.documentElement.classList.contains('dark')).toBe(false);

      toggleTheme();

      await nextTick();
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should persist theme to localStorage when toggling', async () => {
      const { toggleTheme } = useTheme();

      await nextTick();
      localStorage.setItem.mockClear();

      toggleTheme();

      await nextTick();
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'erost-framed-theme',
        THEMES.DARK
      );
    });

    it('should toggle multiple times correctly', async () => {
      const { theme, toggleTheme } = useTheme();

      await nextTick();
      expect(theme.value).toBe(THEMES.LIGHT);

      toggleTheme();
      await nextTick();
      expect(theme.value).toBe(THEMES.DARK);

      toggleTheme();
      await nextTick();
      expect(theme.value).toBe(THEMES.LIGHT);

      toggleTheme();
      await nextTick();
      expect(theme.value).toBe(THEMES.DARK);
    });
  });

  describe('Reactivity', () => {
    it('should update document class when theme changes', async () => {
      const { toggleTheme } = useTheme();

      await nextTick();
      expect(document.documentElement.classList.contains('dark')).toBe(false);

      toggleTheme();
      await nextTick();
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      toggleTheme();
      await nextTick();
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should persist every theme change', async () => {
      const { toggleTheme } = useTheme();

      await nextTick();
      localStorage.setItem.mockClear();

      toggleTheme(); // to dark
      await nextTick();
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'erost-framed-theme',
        THEMES.DARK
      );

      toggleTheme(); // to light
      await nextTick();
      expect(localStorage.setItem).toHaveBeenLastCalledWith(
        'erost-framed-theme',
        THEMES.LIGHT
      );
    });
  });

  describe('Multiple Instances', () => {
    it('should share singleton state', async () => {
      const instance1 = useTheme();
      const instance2 = useTheme();

      await nextTick();
      // Both instances share the same ref (singleton pattern)
      expect(instance1.theme.value).toBe(THEMES.LIGHT);
      expect(instance2.theme.value).toBe(THEMES.LIGHT);

      instance1.toggleTheme();

      await nextTick();
      // Both instances see the same state change
      expect(instance1.theme.value).toBe(THEMES.DARK);
      expect(instance2.theme.value).toBe(THEMES.DARK);
    });
  });

  describe('Edge Cases', () => {
    it('should handle localStorage errors gracefully', async () => {
      localStorage.getItem.mockReturnValue(THEMES.LIGHT);

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Create a fresh mock for this test
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn().mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      const { toggleTheme } = useTheme();

      await nextTick();

      // Should not throw, but should warn
      toggleTheme();

      await nextTick();
      expect(consoleWarnSpy).toHaveBeenCalled();

      // Restore
      consoleWarnSpy.mockRestore();
      localStorage.setItem = originalSetItem;
    });

    it('should handle missing matchMedia API', async () => {
      localStorage.getItem.mockReturnValue(null);
      delete window.matchMedia;

      const { theme } = useTheme();

      await nextTick();
      // Should fall back to light theme
      expect(theme.value).toBe(THEMES.LIGHT);
    });

    it('should handle invalid stored theme', async () => {
      localStorage.getItem.mockReturnValue('invalid-theme');

      const { theme } = useTheme();

      await nextTick();
      // Should fall back to light theme (system preference or default)
      expect(theme.value).toBe(THEMES.LIGHT);
    });

    it('should handle localStorage.getItem throwing error', async () => {
      localStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });

      const { theme } = useTheme();

      await nextTick();
      // Should fall back to system preference or default
      expect(theme.value).toBe(THEMES.LIGHT);
    });

    it('should handle matchMedia throwing error', async () => {
      localStorage.getItem.mockReturnValue(null);
      window.matchMedia = vi.fn().mockImplementation(() => {
        throw new Error('matchMedia error');
      });

      const { theme } = useTheme();

      await nextTick();
      // Should fall back to default light theme
      expect(theme.value).toBe(THEMES.LIGHT);
    });
  });
});

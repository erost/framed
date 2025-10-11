<!--
  AppHeader Component
  Top header bar with application title and theme toggle
-->
<template>
  <header
    class="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4"
    data-testid="app-header"
  >
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Framed
      </h1>

      <button
        type="button"
        class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
               dark:hover:bg-gray-600 transition-colors"
        :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        data-testid="theme-toggle"
        @click="toggleTheme"
      >
        <!-- Sun icon for light mode -->
        <svg
          v-if="theme === 'dark'"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-yellow-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 
               6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 
               12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>

        <!-- Moon icon for dark mode -->
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-gray-700 dark:text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 
               9.003 0 008.354-5.646z"
          />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme.js';

/**
 * AppHeader component with theme toggle
 * Displays application title and allows users to switch between light/dark themes
 */

const { theme, toggleTheme } = useTheme();
</script>

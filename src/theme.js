const THEME_STORAGE_KEY = 'theme';

/**
 * Read the persisted theme preference from localStorage.
 * @returns {'light' | 'dark'}
 */
export function getStoredTheme() {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === 'dark' ? 'dark' : 'light';
}

/**
 * Apply the theme by toggling the `dark` class on the document root.
 * @param {'light' | 'dark'} theme
 */
export function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

/**
 * Persist and apply a theme selection.
 * @param {'light' | 'dark'} theme
 */
export function setTheme(theme) {
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme);
}

/**
 * Initialize theme from localStorage before first paint when possible.
 */
export function initTheme() {
  applyTheme(getStoredTheme());
}

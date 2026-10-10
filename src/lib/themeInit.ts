// Runs synchronously before paint so the page never flashes the wrong
// theme - ThemeToggle's own script just has to sync button state after this
// has already set the attribute. Kept as a string in its own module (not
// written inline in Layout.astro) so astro.config.mjs can hash this exact
// text for the CSP; editing it here updates the hash automatically.
export const THEME_INIT_SCRIPT = `(function () {
  var stored = localStorage.getItem('theme');
  var choice = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
  var resolved = choice === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : choice;
  document.documentElement.setAttribute('data-theme', resolved);
  document.documentElement.style.colorScheme = resolved;
})();`;

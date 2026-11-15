try {
  const theme = localStorage.getItem('onyx-theme')
  document.documentElement.dataset.theme =
    theme === 'light' || theme === 'dark'
      ? theme
      : typeof matchMedia === 'function' &&
          !matchMedia('(prefers-color-scheme: dark)').matches
        ? 'light'
        : 'dark'
  const language = localStorage.getItem('onyx-language')
  document.documentElement.lang = ['en', 'it', 'de'].includes(language) ? language : 'en'
} catch {
  document.documentElement.dataset.theme =
    typeof matchMedia === 'function' &&
    !matchMedia('(prefers-color-scheme: dark)').matches
      ? 'light'
      : 'dark'
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './popup.html',
    './src/**/*.tsx',
  ],
  corePlugins: {
    preflight: false
  },
  important: true,
  theme: {
    extend: {},
  },
  plugins: [],
}

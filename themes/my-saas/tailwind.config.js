/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./themes/**/layouts/**/*.html",
    "./content/**/layouts/**/*.html",
    "./layouts/**/*.html",
    "./content/**/*.html",
    "./node_modules/flowbite/**/*.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)', // This is the one you tested
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
        },
        gray: {
          50: 'var(--color-gray-50)',
          100: 'var(--color-gray-100)',
          200: 'var(--color-gray-200)',
          300: 'var(--color-gray-300)',
          400: 'var(--color-gray-400)',
          500: 'var(--color-gray-500)',
          600: 'var(--color-gray-600)',
          700: 'var(--color-gray-700)',
          800: 'var(--color-gray-800)',
          900: 'var(--color-gray-900)',
        },
        slate: {
            50: 'var(--color-slate-50)',
            100: 'var(--color-slate-100)',
            200: 'var(--color-slate-200)',
        },
        'brand-secondary': 'var(--gradient-via)',
        'brand-tertiary': 'var(--gradient-to)',
        'hero-gradient-from': 'var(--hero-gradient-from)',
        'hero-gradient-via': 'var(--hero-gradient-via)',
        'hero-gradient-to': 'var(--hero-gradient-to)',
      }
    },
  },
  plugins: [
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/aspect-ratio'),
    // require('flowbite/plugin'),
    // require('flowbite-typography'),
  ],
}


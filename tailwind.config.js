/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#dce6ff',
          200: '#b8ccff',
          300: '#7fa3ff',
          400: '#4a78fa',
          500: '#2452e8',
          600: '#1a3fcc',
          700: '#1530a4',
          800: '#162785',
          900: '#16256b',
        },
        surface: {
          DEFAULT: '#ffffff',
          secondary: '#f8f9fb',
          tertiary: '#f1f3f7',
        }
      },
    },
  },
  plugins: [],
}

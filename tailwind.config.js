/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './pages/index.tsx',
  ],
  theme: {
    extend: {
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateY(-25%)' },
          '50%': { transform: 'translateY(0)' }
        }
      },
      animation: {
        bounce: 'bounce 1s infinite'
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
  prefix: 'tw-',
};

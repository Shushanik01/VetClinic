/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Colors
      colors: {
        // Green
        'green-50': '#EBF9F9',
        'green-100': '#D7F3F3',
        'green-200': '#D1FAE5',
        'green-300': '#88C1BF',
        'green-400': '#128280',
        'green-600': '#0A6462',

        // Neutral
        'neutral-0': '#FFFFFF',
        'neutral-50': '#F5F6F7',
        'neutral-100': '#E5E7EB',
        'neutral-400': '#99A1AF',

        // Black
        'black-600': '#6A7282',
        'black-700': '#878B93',
        'black-800': '#364153',
        'black-900': '#101828',

        // Pink
        'pink-100': '#FCEDF2',
        'pink-600': '#DC2E68',

        // Red
        'red-100': '#FCE9ED',
        'red-400': '#E30404',

        // Blue
        'blue-300': '#DBEAFE',
        'blue-600': '#006CF0',

        // Teal
        'teal-400': '#2DD4BF',
        'teal-600': '#0D9488',
      },

      // Fonts
      fontFamily: {
        lato: ['Lato', 'sans-serif'],
      },

      // Fonts size
      fontSize: {
        h1: [
          '48px',
          { lineHeight: 'auto', letterSpacing: '0px', fontWeight: '700' },
        ],
        h2: [
          '32px',
          { lineHeight: '36px', letterSpacing: '0px', fontWeight: '500' },
        ],
        h3: [
          '24px',
          { lineHeight: '32px', letterSpacing: '0px', fontWeight: '400' },
        ],
        button: [
          '16px',
          { lineHeight: '24px', letterSpacing: '0.5px', fontWeight: '400' },
        ],
        'body-m-regular': [
          '16px',
          { lineHeight: '24px', letterSpacing: '0px', fontWeight: '400' },
        ],
        'body-m-bold': [
          '16px',
          { lineHeight: '24px', letterSpacing: '0px', fontWeight: '700' },
        ],
        'body-s-regular': [
          '14px',
          { lineHeight: '20px', letterSpacing: '0.15px', fontWeight: '400' },
        ],
        'body-s-bold': [
          '14px',
          { lineHeight: '20px', letterSpacing: '0.15px', fontWeight: '700' },
        ],
        caption: [
          '12px',
          { lineHeight: '16px', letterSpacing: '0.25px', fontWeight: '400' },
        ],
      },
    },
  },
  plugins: [],
};

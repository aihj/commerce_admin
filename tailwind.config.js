/** @type {import('tailwindcss').Config} */

const px0_100 = { ...Array.from(Array(101)).map((_, i) => `${i}px`) };
const px0_200 = { ...Array.from(Array(201)).map((_, i) => `${i}px`) };

const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: {
          darkest: '#312E81',
          dark: '#4338CA',
          light: '#EBEEFE',
        },
        secondary: {
          darkest: '#111927',
          light: '#F3F4F6',
        },
        info: {
          dark: '#0E7090',
        },
        error: {
          main: '#F04438',
          dark: '#B42318',
        },
      },
      spacing: px0_100,
      fontSize: px0_100,
      width: px0_200,
      minWidth: px0_200,
      lineHeight: px0_100,
      borderRadius: px0_100,
    },
  },
  plugins: [],
};
export default config;

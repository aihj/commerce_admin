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
          main: '#6366F1',
          light: '#EBEEFE',
          lightest: '#F5F7FF',
        },
        secondary: {
          darkest: '#111927',
          main: '#384250',
          light: '#F3F4F6',
        },
        success: {
          darkest: '#134E48',
          dark: '#107569',
          main: '#15B79E',
          light: '#CCFBEF',
          lightest: '#F0FDF9',
        },
        info: {
          darkest: '#164C63',
          dark: '#0E7090',
          main: '#06AED4',
          light: '#CFF9FE',
          lightest: '#ECFDFF',
        },
        error: {
          darkest: '#7A271A',
          dark: '#B42318',
          main: '#F04438',
          light: '#FEE4E2',
          lightest: '#FEF3F2',
        },
        warning: {
          darkest: '#7A2E0E',
          dark: '#B54708',
          main: '#F79009',
          light: '#FEF0C7',
          lightest: '#FFFAEB',
        },
        neutral: {
          main: '#B5BCC4',
          lightest: '#F8F9FA',
        },
        blue: {
          main: '#2970FF',
        },
        pink: {
          main: '#F8648C',
        },
        gray: {
          900: '#292B30',
          800: '#44474D',
          700: '#5D5F66',
          600: '#7E8085',
          500: '#A7AAAF',
          400: '#C4C7CB',
          300: '#ECEEF0',
          200: '#F4F5F6',
          100: '#FAFAFA',
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

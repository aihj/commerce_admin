/** @type {import('tailwindcss').Config} */

import plugin from 'tailwindcss/plugin';

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
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.Title-60-Bold-2L': {
          fontSize: '60px',
          lineHeight: '84px',
          fontWeight: 700,
        },
        '.Title-40-Bold': {
          fontSize: '40px',
          lineHeight: '60px',
          fontWeight: 700,
        },
        '.Title-36-Bold': {
          fontSize: '36px',
          lineHeight: '54px',
          fontWeight: 700,
        },
        '.Title-36-Bold-2L': {
          fontSize: '36px',
          lineHeight: '50px',
          fontWeight: 700,
        },
        '.Title-32-Bold': {
          fontSize: '32px',
          lineHeight: '44px',
          fontWeight: 700,
        },
        '.Title-28-Bold': {
          fontSize: '28px',
          lineHeight: '40px',
          fontWeight: 700,
        },
        '.Title-24-Bold': {
          fontSize: '24px',
          lineHeight: '34px',
          fontWeight: 700,
        },
        '.Title-22-Bold': {
          fontSize: '22px',
          lineHeight: '32px',
          fontWeight: 700,
        },
        '.Title-20-Bold': {
          fontSize: '20px',
          lineHeight: '30px',
          fontWeight: 700,
        },
        '.Title-18-Bold': {
          fontSize: '18px',
          lineHeight: '28px',
          fontWeight: 700,
        },
        '.Title-16-Bold': {
          fontSize: '16px',
          lineHeight: '24px',
          fontWeight: 700,
        },
        '.Title-14-Bold': {
          fontSize: '14px',
          lineHeight: '22px',
          fontWeight: 700,
        },
        '.Title-12-Bold': {
          fontSize: '12px',
          lineHeight: '18px',
          fontWeight: 700,
        },
        '.Body-18-Regular': {
          fontSize: '18px',
          lineHeight: '28px',
          fontWeight: 400,
        },
        '.Body-16-Regular': {
          fontSize: '16px',
          lineHeight: '24px',
          fontWeight: 400,
        },
        '.Body-14-Regular': {
          fontSize: '14px',
          lineHeight: '22px',
          fontWeight: 400,
        },
        '.Label-18-Bold': {
          fontSize: '18px',
          lineHeight: '28px',
          fontWeight: 700,
        },
        '.Label-18-SemiBold': {
          fontSize: '18px',
          lineHeight: '24px',
          fontWeight: 600,
        },
        '.Label-16-SemiBold': {
          fontSize: '16px',
          lineHeight: '24px',
          fontWeight: 600,
        },
        '.Label-14-Bold': {
          fontSize: '14px',
          lineHeight: '22px',
          fontWeight: 700,
        },
        '.Label-14-SemiBold': {
          fontSize: '14px',
          lineHeight: '22px',
          fontWeight: 600,
        },
        '.Label-14-Regular': {
          fontSize: '14px',
          lineHeight: '22px',
          fontWeight: 400,
        },
        '.Label-12-Bold': {
          fontSize: '12px',
          lineHeight: '18px',
          fontWeight: 700,
        },
        '.Label-12-SemiBold': {
          fontSize: '12px',
          lineHeight: '18px',
          fontWeight: 600,
        },
        '.Label-12-Regular': {
          fontSize: '12px',
          lineHeight: '18px',
          fontWeight: 400,
        },
        '.Label-3-3': {
          fontSize: '12px',
          lineHeight: '18px',
          fontWeight: 400,
        },
        '.Label-10-SemiBold': {
          fontSize: '10px',
          lineHeight: '16px',
          fontWeight: 600,
        },
        '.Label-10-Regular': {
          fontSize: '10px',
          lineHeight: '16px',
          fontWeight: 400,
        },
        '.Label-8-SemiBold': {
          fontSize: '8px',
          lineHeight: '12px',
          fontWeight: 600,
        },
      }); // 타입을 any로 설정하여 오류를 무시
    }),
  ],
};
export default config;

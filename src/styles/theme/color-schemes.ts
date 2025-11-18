import type {
  ColorSystemOptions,
  PaletteColorOptions,
} from '@mui/material/styles';

import {
  california,
  kepple,
  neonBlue,
  nevada,
  redOrange,
  shakespeare,
  stormGrey,
} from './colors';
import type { ColorScheme, PrimaryColor } from './types';

const primarySchemes: Record<
  PrimaryColor,
  Record<ColorScheme, PaletteColorOptions>
> = {
  neonBlue: {
    dark: {
      ...neonBlue,
      light: neonBlue[300],
      main: neonBlue[400],
      dark: neonBlue[500],
      contrastText: 'var(--mui-palette-common-black)',
      activated:
        'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-activatedOpacity))',
      hovered:
        'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-hoverOpacity))',
      selected:
        'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-selectedOpacity))',
    },
    light: {
      ...neonBlue,
      lightest: '#F5F7FF',
      light: '#EBEEFE',
      main: '#6366F1',
      dark: '#4338CA',
      darkest: '#312E81',
      contrastText: 'var(--mui-palette-common-white)',
      activated:
        'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-activatedOpacity))',
      hovered:
        'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-hoverOpacity))',
      selected:
        'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-selectedOpacity))',
    },
  },
};

interface Config {
  primaryColor: PrimaryColor;
}

export function colorSchemes(
  config: Config
): Partial<Record<ColorScheme, ColorSystemOptions>> {
  const primary = primarySchemes[config.primaryColor];

  return {
    dark: {
      palette: {
        action: { disabledBackground: 'rgba(0, 0, 0, 0.12)' },
        background: {
          default: 'var(--mui-palette-neutral-950)',
          defaultChannel: '9 10 11',
          paper: 'var(--mui-palette-neutral-900)',
          level1: 'var(--mui-palette-neutral-800)',
          level2: 'var(--mui-palette-neutral-700)',
          level3: 'var(--mui-palette-neutral-600)',
        },
        common: { black: '#000000', white: '#ffffff' },
        divider: 'var(--mui-palette-neutral-700)',
        dividerChannel: '50 56 62',
        error: {
          ...redOrange,
          light: redOrange[300],
          main: redOrange[400],
          dark: redOrange[500],
          contrastText: 'var(--mui-palette-common-black)',
          activated:
            'rgba(var(--mui-palette-error-mainChannel) / var(--mui-palette-action-activatedOpacity))',
          hovered:
            'rgba(var(--mui-palette-error-mainChannel) / var(--mui-palette-action-hoverOpacity))',
          selected:
            'rgba(var(--mui-palette-error-mainChannel) / var(--mui-palette-action-selectedOpacity))',
        },
        info: {
          ...shakespeare,
          light: shakespeare[300],
          main: shakespeare[400],
          dark: shakespeare[500],
          contrastText: 'var(--mui-palette-common-black)',
          activated:
            'rgba(var(--mui-palette-info-mainChannel) / var(--mui-palette-action-activatedOpacity))',
          hovered:
            'rgba(var(--mui-palette-info-mainChannel) / var(--mui-palette-action-hoverOpacity))',
          selected:
            'rgba(var(--mui-palette-info-mainChannel) / var(--mui-palette-action-selectedOpacity))',
        },
        neutral: { ...nevada },
        primary: primary.dark,
        secondary: {
          ...nevada,
          light: nevada[100],
          main: nevada[200],
          dark: nevada[300],
          contrastText: 'var(--mui-palette-common-black)',
          activated:
            'rgba(var(--mui-palette-secondary-mainChannel) / var(--mui-palette-action-activatedOpacity))',
          hovered:
            'rgba(var(--mui-palette-secondary-mainChannel) / var(--mui-palette-action-hoverOpacity))',
          selected:
            'rgba(var(--mui-palette-secondary-mainChannel) / var(--mui-palette-action-selectedOpacity))',
        },
        success: {
          ...kepple,
          light: kepple[300],
          main: kepple[400],
          dark: kepple[500],
          contrastText: 'var(--mui-palette-common-black)',
          activated:
            'rgba(var(--mui-palette-success-mainChannel) / var(--mui-palette-action-activatedOpacity))',
          hovered:
            'rgba(var(--mui-palette-success-mainChannel) / var(--mui-palette-action-hoverOpacity))',
          selected:
            'rgba(var(--mui-palette-success-mainChannel) / var(--mui-palette-action-selectedOpacity))',
        },
        text: {
          primary: 'var(--mui-palette-neutral-100)',
          primaryChannel: '240 244 248',
          secondary: 'var(--mui-palette-neutral-400)',
          secondaryChannel: '159 166 173',
          disabled: 'var(--mui-palette-neutral-600)',
        },
        warning: {
          ...california,
          light: california[300],
          main: california[400],
          dark: california[500],
          contrastText: 'var(--mui-palette-common-black)',
          activated:
            'rgba(var(--mui-palette-warning-mainChannel) / var(--mui-palette-action-activatedOpacity))',
          hovered:
            'rgba(var(--mui-palette-warning-mainChannel) / var(--mui-palette-action-hoverOpacity))',
          selected:
            'rgba(var(--mui-palette-warning-mainChannel) / var(--mui-palette-action-selectedOpacity))',
        },
        Avatar: { defaultBg: 'var(--mui-palette-neutral-200)' },
        Backdrop: { bg: 'rgba(0, 0, 0, 0.5)' },
        OutlinedInput: { border: 'var(--mui-palette-neutral-700)' },
        TableCell: { border: 'var(--mui-palette-divider)' },
        Tooltip: { bg: 'rgba(10, 13, 20, 0.75)' },
      },
    },
    light: {
      palette: {
        action: { disabledBackground: 'rgba(0, 0, 0, 0.06)' },
        background: {
          default: 'var(--mui-palette-common-white)',
          defaultChannel: '255 255 255',
          paper: 'var(--mui-palette-common-white)',
          level1: 'var(--mui-palette-neutral-50)',
          level2: 'var(--mui-palette-neutral-100)',
          level3: 'var(--mui-palette-neutral-200)',
        },
        common: { black: '#000000', white: '#ffffff' },
        divider: 'var(--mui-palette-neutral-200)',
        dividerChannel: '220 223 228',
        error: {
          ...redOrange,
          lightest: '#FEF3F2',
          light: '#FEE4E2',
          main: '#F04438',
          dark: '#B42318',
          darkest: '#7A271A',
          contrastText: 'var(--mui-palette-common-white)',
          activated:
            'rgba(var(--mui-palette-error-mainChannel) / var(--mui-palette-action-activatedOpacity))',
          hovered:
            'rgba(var(--mui-palette-error-mainChannel) / var(--mui-palette-action-hoverOpacity))',
          selected:
            'rgba(var(--mui-palette-error-mainChannel) / var(--mui-palette-action-selectedOpacity))',
        },
        info: {
          ...shakespeare,
          lightest: '#ECFDFF',
          light: '#CFF9FE',
          main: '#06AED4',
          dark: '#0E7090',
          darkest: '#164C63',
          contrastText: 'var(--mui-palette-common-white)',
          activated:
            'rgba(var(--mui-palette-info-mainChannel) / var(--mui-palette-action-activatedOpacity))',
          hovered:
            'rgba(var(--mui-palette-info-mainChannel) / var(--mui-palette-action-hoverOpacity))',
          selected:
            'rgba(var(--mui-palette-info-mainChannel) / var(--mui-palette-action-selectedOpacity))',
        },
        neutral: { ...stormGrey },
        primary: primary.light,
        secondary: {
          ...nevada,
          lightest: '#F8F9FA',
          light: '#F3F4F6',
          main: '#384250',
          dark: '#1C2536',
          darkest: '#111927',
          contrastText: 'var(--mui-palette-common-white)',
          activated:
            'rgba(var(--mui-palette-secondary-mainChannel) / var(--mui-palette-action-activatedOpacity))',
          hovered:
            'rgba(var(--mui-palette-secondary-mainChannel) / var(--mui-palette-action-hoverOpacity))',
          selected:
            'rgba(var(--mui-palette-secondary-mainChannel) / var(--mui-palette-action-selectedOpacity))',
        },
        success: {
          ...kepple,
          lightest: '#F0FDF9',
          light: '#CCFBEF',
          main: '#15B79E',
          dark: '#107569',
          darkest: '#134E48',
          contrastText: 'var(--mui-palette-common-white)',
          activated:
            'rgba(var(--mui-palette-success-mainChannel) / var(--mui-palette-action-activatedOpacity))',
          hovered:
            'rgba(var(--mui-palette-success-mainChannel) / var(--mui-palette-action-hoverOpacity))',
          selected:
            'rgba(var(--mui-palette-success-mainChannel) / var(--mui-palette-action-selectedOpacity))',
        },
        text: {
          primary: 'var(--mui-palette-neutral-900)',
          primaryChannel: '33 38 54',
          secondary: 'var(--mui-palette-neutral-500)',
          secondaryChannel: '102 112 133',
          disabled: 'var(--mui-palette-neutral-400)',
        },
        warning: {
          ...california,
          lightest: '#FFFAEB',
          light: '#FEF0C7',
          main: '#F79009',
          dark: '#B54708',
          darkest: '#7A2E0E',
          contrastText: 'var(--mui-palette-common-white)',
          activated:
            'rgba(var(--mui-palette-warning-mainChannel) / var(--mui-palette-action-activatedOpacity))',
          hovered:
            'rgba(var(--mui-palette-warning-mainChannel) / var(--mui-palette-action-hoverOpacity))',
          selected:
            'rgba(var(--mui-palette-warning-mainChannel) / var(--mui-palette-action-selectedOpacity))',
        },
        Avatar: { defaultBg: 'var(--mui-palette-neutral-600)' },
        Backdrop: { bg: 'rgb(18, 22, 33, 0.8)' },
        OutlinedInput: { border: 'var(--mui-palette-neutral-200)' },
        TableCell: { border: 'var(--mui-palette-divider)' },
        Tooltip: { bg: 'rgba(10, 13, 20, 0.75)' },
      },
    },
  };
}

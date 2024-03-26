import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiFormControl = {
  styleOverrides: { root: { padding: '10px 0' } },
} satisfies Components<Theme>['MuiFormControl'];

'use client';

import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider as Provider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/ko';

export interface LocalizationProviderProps {
  children: React.ReactNode;
}

const LocalizationProvider = ({
  children,
}: LocalizationProviderProps): React.JSX.Element => {
  return (
    <Provider dateAdapter={AdapterDayjs} adapterLocale="ko">
      {children}
    </Provider>
  );
};

export { LocalizationProvider };

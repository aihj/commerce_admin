'use client';

import React from 'react';
import { Main } from '.';
import { AuthGuard } from '@/components/auth/AuthGuard';

const page = (): React.JSX.Element => {
  return (
    <AuthGuard>
      <Main />
    </AuthGuard>
  );
};

export default page;

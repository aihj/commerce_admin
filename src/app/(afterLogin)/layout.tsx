'use client';

import * as React from 'react';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { Layout as DefaultLayout } from '@/components/layout';

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div>
      <AuthGuard>
        <DefaultLayout>{children}</DefaultLayout>
      </AuthGuard>
    </div>
  );
};

export default Layout;

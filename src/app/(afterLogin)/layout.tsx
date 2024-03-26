import * as React from 'react';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { Layout as DefaultLayout } from '@/components/layout';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps): React.JSX.Element => {
  return (
    <div>
      <AuthGuard>
        <DefaultLayout>{children}</DefaultLayout>
      </AuthGuard>
    </div>
  );
};

export default Layout;

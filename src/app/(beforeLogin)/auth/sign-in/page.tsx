import * as React from 'react';

import { SignInForm } from '@/components/auth/SignInForm';
import { GuestGuard } from '@/components/auth/GuestGuard';
import { SplitLayout } from '@/components/auth/SplitLayout';

const Page = (): React.JSX.Element => {
  return (
    <GuestGuard>
      <SplitLayout>
        <SignInForm />
      </SplitLayout>
    </GuestGuard>
  );
};

export default Page;

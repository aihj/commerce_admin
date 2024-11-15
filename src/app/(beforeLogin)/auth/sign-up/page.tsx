import * as React from 'react';

import { SignUpForm } from '@/components/auth/SignUpForm';
import { GuestGuard } from '@/components/auth/GuestGuard';
import { SplitLayout } from '@/components/auth/SplitLayout';

const Page = (): React.JSX.Element => {
  return (
    <GuestGuard>
      <SplitLayout>
        <SignUpForm />
      </SplitLayout>
    </GuestGuard>
  );
};

export default Page;

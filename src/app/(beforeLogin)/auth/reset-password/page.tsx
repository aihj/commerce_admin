import * as React from 'react';

import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { GuestGuard } from '@/components/auth/GuestGuard';
import { SplitLayout } from '@/components/auth/SplitLayout';

const Page = (): React.JSX.Element => {
  return (
    <GuestGuard>
      <SplitLayout>
        <ResetPasswordForm />
      </SplitLayout>
    </GuestGuard>
  );
};

export default Page;

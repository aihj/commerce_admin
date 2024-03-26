import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { GuestGuard } from '@/components/auth/GuestGuard';
import { SplitLayout } from '@/components/auth/SplitLayout';

export const metadata: Metadata = {
  title: `Sign up | Custom | Auth | ${config.site.name}`,
};

export default function Page(): React.JSX.Element {
  return (
    <GuestGuard>
      <SplitLayout>
        <SignUpForm />
      </SplitLayout>
    </GuestGuard>
  );
}

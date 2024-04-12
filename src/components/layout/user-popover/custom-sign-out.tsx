'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import MenuItem from '@mui/material/MenuItem';

import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/logger/defaultLogger';
import { useUser } from '@/hooks/useUser';
import { toast } from '@/components/core/Toaster';
import { signOut } from 'next-auth/react';

export function CustomSignOut(): React.JSX.Element {
  const { checkSession } = useUser();
  const router = useRouter();

  const handleSignOut = React.useCallback(async (): Promise<void> => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        logger.error('Sign out error', error);
        toast.error('Something went wrong, unable to sign out');
        return;
      }

      // Refresh the auth state
      await checkSession?.();

      // nextAuth user정보 삭제
      await signOut();
      // UserProvider, for this case, will not refresh the router and we need to do it manually
      router.refresh();

      // After refresh, AuthGuard will handle the redirect
    } catch (err) {
      logger.error('Sign out error', err);
      toast.error('Something went wrong, unable to sign out');
    }
  }, [checkSession, router]);

  return (
    <MenuItem
      component="div"
      onClick={handleSignOut}
      sx={{ justifyContent: 'center' }}
    >
      Sign out
    </MenuItem>
  );
}

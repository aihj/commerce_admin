'use client';

import * as React from 'react';
import { useCallback } from 'react';
import MenuItem from '@mui/material/MenuItem';
import { logger } from '@/lib/logger/defaultLogger';
import { toast } from '@/components/core/Toaster';
import { signOut } from 'next-auth/react';
import { PATH } from '@/paths';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { User } from '@/types/user';
import { LOGOUT_USER } from '@/redux/slices/userSlice';

export function CustomSignOut(): React.JSX.Element {
  const user: User = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const handleSignOut = useCallback(async (): Promise<void> => {
    try {
      await signOut({ callbackUrl: PATH.AUTH.NEXT_AUTH.LOGIN, redirect: true });
      if (user.wuserIdx) {
        logger.error('Sign out', '계정 정보 삭제');
        dispatch(LOGOUT_USER());
        // router.refresh();
      } else {
        logger.error(
          'Sign out error',
          '제대로 된 계정 정보가 등록되어 있지 않았습니다.'
        );
        // router.refresh();
      }
    } catch (error) {
      logger.error('Sign out error', error);
      toast.error('Something went wrong, unable to sign out');
    }
  }, [dispatch, user.wuserIdx]);

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

'use client';

import * as React from 'react';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { config } from '@/config';
import { PATH } from '@/paths';
import { AuthStrategy } from '@/lib/auth/strategy';
import { logger } from '@/lib/logger/defaultLogger';
import { signOut, useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { UPDATE_USER } from '@/redux/slices/userSlice';
import { User } from '@/types/user';

export interface AuthGuardProps {
  children: React.ReactNode;
}

/* 올바른 권한을 가진 사람만 접근할 수 있게 도와줌 */
export function AuthGuard({
  children,
}: AuthGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const user: User = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const [isChecking, setIsChecking] = React.useState<boolean>(false);

  const checkPermissions = useCallback(async (): Promise<void> => {
    setIsChecking(true);
    // logger.debug('[AuthGuard] <checkPermissions> session: ', session);
    // logger.debug('[AuthGuard] <checkPermissions> user: ', user);
    // window.session = session;
    // window.user = user;
    if (session) {
      if (session.user.error === 'refresh_token_update_failed') {
        signOut();
      }
      // 이미 로그인 한 사람이라면
      if (user.wuserIdx !== null && session.user.wuserIdx === user.wuserIdx) {
        setIsChecking(false);
        return;
      }

      dispatch(
        // 리덕스에 유저 정보 저장
        UPDATE_USER({
          wroleName: session.user.wroleName,
          phone: session.user.phone,
          email: session.user.email,
          status: session.user.status,
          wuserIdx: session.user.wuserIdx,
          conferenceIdx: session.user.conferenceIdx,
        })
      );
      setIsChecking(false);
      return;
    } else {
      logger.debug('[AuthGuard]: session 존재 안함');
    }

    switch (config.auth.strategy) {
      case AuthStrategy.NEXT_AUTH: {
        logger.debug(
          '[AuthGuard]: 유저가 로그인 하지 않았습니다. 로그인 페이지로 이동합니다.'
        );
        router.replace(PATH.AUTH.NEXT_AUTH.LOGIN);
        setIsChecking(false);
        return;
      }
      default: {
        logger.error('[AuthGuard]: Unknown auth strategy');
        setIsChecking(false);
        return;
      }
    }
  }, [dispatch, router, session, user]);

  React.useEffect(() => {
    checkPermissions().catch((e) => {
      logger.error('[AuthGuard]: 잘못된 권한입니다.', e);
    });
  }, [user, checkPermissions]);

  if (isChecking) {
    return null;
  }

  return <React.Fragment>{children}</React.Fragment>;
}

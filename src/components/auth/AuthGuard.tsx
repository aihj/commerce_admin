'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';

import { config } from '@/config';
import { PATH } from '@/paths';
import { AuthStrategy } from '@/lib/auth/strategy';
import { defaultLogger } from '@/lib/logger/defaultLogger';
import { useUser } from '@/hooks/useUser';
import { useSession } from 'next-auth/react';

export interface AuthGuardProps {
  children: React.ReactNode;
}

/* 올바른 권한을 가진 사람만 접근할 수 있게 도와줌 */
export function AuthGuard({
  children,
}: AuthGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { data: session } = useSession();
  const { user, error, isLoading, updateUser } = useUser();
  const [isChecking, setIsChecking] = React.useState<boolean>(true);

  const checkPermissions = async (): Promise<void> => {
    defaultLogger.debug('[AuthGuard] <checkPermissions>');
    if (isLoading) {
      defaultLogger.debug('[AuthGuard] <checkPermissions> isLoading');
      return;
    } else {
      defaultLogger.debug('[AuthGuard] <checkPermissions> 계속 진행');
    }

    if (error) {
      defaultLogger.debug('[AuthGuard] <checkPermissions> error: ' + error);
      setIsChecking(false);
      return;
    }

    if (!user) {
      if (session) {
        defaultLogger.debug(
          '[AuthGuard] <checkPermissions> session: ' + session
        );
        if (updateUser) {
          updateUser(session);
          return;
        }
      }
      defaultLogger.debug(
        '[AuthGuard]: 유저가 로그인 하지 않았습니다. 로그인 페이지로 이동합니다.'
      );

      switch (config.auth.strategy) {
        case AuthStrategy.NEXT_AUTH: {
          router.replace(PATH.AUTH.NEXT_AUTH.LOGIN);
          return;
        }
        default: {
          defaultLogger.error('[AuthGuard]: Unknown auth strategy');
          return;
        }
      }
    }

    setIsChecking(false);
  };

  React.useEffect(() => {
    checkPermissions().catch(() => {
      defaultLogger.error('[AuthGuard]: 잘못된 권한입니다..');
    });
  }, [user, error, isLoading, checkPermissions]);

  if (isChecking) {
    return null;
  }

  if (error) {
    return <Alert color="error">{error}</Alert>;
  }

  return <React.Fragment>{children}</React.Fragment>;
}

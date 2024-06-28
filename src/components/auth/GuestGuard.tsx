'use client';

import * as React from 'react';

import { PATH } from '@/paths';
import { logger } from '@/lib/logger/defaultLogger';
import { useAppSelector } from '@/redux/hooks';
import { useSession } from 'next-auth/react';
// import { useSession } from 'next-auth/react';

export interface GuestGuardProps {
  children: React.ReactNode;
}

// 현재 유저 권한이 있는지 확인하고 유저 권한이 있다면 마이페이지로 이동시키는 컴포넌트
export function GuestGuard({
  children,
}: GuestGuardProps): React.JSX.Element | null {
  const { data: session } = useSession();
  const router = useRouter();
  const user = useAppSelector((state) => state.user);
  const [isChecking, setIsChecking] = React.useState<boolean>(true);
  // const { data: session } = useSession();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkPermissions = async (): Promise<void> => {
    setIsChecking(true);
    // logger.debug('[GuestGuard checkPermissions] : user : ', user);
    // logger.debug('[GuestGuard checkPermissions] : session : ', session);

    if (session === undefined) {
      setIsChecking(false);
      return;
    }
    if (session === null) {
      setIsChecking(false);
      return;
    }

    // 만약에 유저 권한이 있을 경우
    if (session) {
      logger.debug('[GuestGuard]: User is logged in, redirecting to dashboard');

      router.replace(PATH.HOME);
      return;
    }
    setIsChecking(false);
  };

  React.useEffect(() => {
    checkPermissions().catch(() => {
      // noop
    });
  }, [user, checkPermissions]);

  if (isChecking) {
    return null;
  }

  return <React.Fragment>{children}</React.Fragment>;
}

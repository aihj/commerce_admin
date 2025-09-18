'use client';

import * as React from 'react';

import { useAppSelector } from '@/redux/hooks';
import { useSession } from 'next-auth/react';
import { DELETE_PCO } from '@/redux/slices/pcoSlice';
import { useDispatch } from 'react-redux';

export interface GuestGuardProps {
  children: React.ReactNode;
}

// 현재 유저 권한이 있는지 확인하고 유저 권한이 있다면 마이페이지로 이동시키는 컴포넌트
export function GuestGuard({
  children,
}: GuestGuardProps): React.JSX.Element | null {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.user);
  const [isChecking, setIsChecking] = React.useState<boolean>(true);
  // const { data: session } = useSession();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkPermissions = async (): Promise<void> => {
    // 과거 로그인 이력으로 next auth session이 쿠키에 남아있는 경우
    if (session) {
      // await signOut({ redirect: false });
      return;
    } else {
      dispatch(DELETE_PCO());
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

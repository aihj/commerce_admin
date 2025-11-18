'use client';

import * as React from 'react';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PATH } from '@/paths';
import { logger } from '@/lib/logger/defaultLogger';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { UPDATE_USER } from '@/redux/slices/userSlice';
import { User } from '@/types/user';

export interface AuthGuardProps {
  children: React.ReactNode;
}

/* 올바른 권한을 가진 사람만 접근할 수 있게 도와줌 */
const AuthGuard = ({ children }: AuthGuardProps): React.JSX.Element | null => {
  const router = useRouter();
  const user: User = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();
  const [isChecking, setIsChecking] = React.useState<boolean>(false);

  const checkPermissions = useCallback(async (): Promise<void> => {
    setIsChecking(true);

    if (session) {
      // 이미 로그인 한 사람이라면
      if (user.wuserIdx !== null && session.user.wuserIdx === user.wuserIdx) {
        setIsChecking(false);
        return;
      }

      dispatch(
        // 리덕스에 유저 정보 저장
        UPDATE_USER({
          wroleNameList: session.user.wroleNameList,
          wuserIdx: session.user.wuserIdx,
          wuserStatus: session.user.wuserStatus,
          conferenceIdx: session.user.conferenceIdx,
        })
      );
      setIsChecking(false);
      return;
    } else {
      if (status !== 'loading') {
        logger.debug('[AuthGuard]: session 존재 안함');
        // Swal.fire({
        //   title: '자동 로그아웃',
        //   text: '세션이 만료되었습니다. 다시 로그인 후 이용해 주세요.',
        //   allowEscapeKey: false,
        //   allowOutsideClick: false,
        // }).then((result) => {
        //   if (result.isConfirmed) {
        //     router.replace(PATH.AUTH.NEXT_AUTH.LOGIN);
        //   }
        // });
        router.replace(PATH.AUTH.NEXT_AUTH.LOGIN);
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
};

export { AuthGuard };

import { LogoutIcon } from '@/components/icons/LogoutIcon';
import { IconButton } from '@mui/material';
import { PATH } from '@/paths';
import { signOut } from 'next-auth/react';
import { useAppSelector } from '@/redux/hooks';
import { logger } from '@/lib/logger/defaultLogger';
import { dispatch } from '@/redux/store';
import { LOGOUT_USER } from '@/redux/slices/userSlice';
import { User } from '@/types/user';
import { DELETE_PCO } from '@/redux/slices/pcoSlice';

const LogoutButton = () => {
  const user: User = useAppSelector((state) => state.user);
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: PATH.AUTH.NEXT_AUTH.LOGIN,
      redirect: true,
    });

    if (user.wuserIdx) {
      logger.error('Sign out', '계정 정보 삭제');
      dispatch(LOGOUT_USER());
      dispatch(DELETE_PCO());
      // router.refresh();
    } else {
      logger.error(
        'Sign out error',
        '제대로 된 계정 정보가 등록되어 있지 않았습니다.'
      );
      // router.refresh();
    }
  };
  return (
    <IconButton onClick={handleSignOut}>
      <LogoutIcon />
    </IconButton>
  );
};

export { LogoutButton };

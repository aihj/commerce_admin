import { LogoutIcon } from '@/components/icons/LogoutIcon';
import { IconButton } from '@mui/material';

const LogoutButton = () => {
  return (
    <IconButton onClick={() => alert('로그아웃')}>
      <LogoutIcon />
    </IconButton>
  );
};

export { LogoutButton };

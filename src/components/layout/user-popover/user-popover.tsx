'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { config } from '@/config';
import { PATH } from '@/paths';
import { AuthStrategy } from '@/lib/auth/strategy';

import { CustomSignOut } from './custom-sign-out';
import { useUser } from '@/hooks/useUser';

export interface UserPopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  open: boolean;
}

// 우측 상단의 사용자 정보 페이지
export function UserPopover({
  anchorEl,
  onClose,
  open,
}: UserPopoverProps): React.JSX.Element {
  const { user } = useUser();
  // const { data: session } = useSession();
  // console.log('user : ', user);
  // console.log('session : ', session);
  // --------------------------------------------------------------------
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      onClose={onClose}
      open={Boolean(open)}
      slotProps={{ paper: { sx: { width: '280px' } } }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      <Box sx={{ p: 2 }}>
        <Typography>{user?.[process.env.NEXT_PUBLIC_LOGIN_TYPE]}</Typography>
        <Typography color="text.secondary" variant="body2">
          {user?.name}
        </Typography>
      </Box>
      <Divider />
      <List sx={{ p: 1 }}>
        <MenuItem
          component={RouterLink}
          href={PATH.SETTING.MY_PAGE}
          onClick={onClose}
        >
          <ListItemIcon>
            <UserIcon />
          </ListItemIcon>
          My Page
        </MenuItem>
      </List>
      <Divider />
      <Box sx={{ p: 1 }}>
        {config.auth.strategy === AuthStrategy.NEXT_AUTH ? (
          <CustomSignOut />
        ) : null}
      </Box>
    </Popover>
  );
}

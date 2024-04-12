import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import { usePopover } from '@/hooks/usePopover';
import { UserPopover } from '@/components/layout/user-popover/user-popover';
import { useUser } from '@/hooks/useUser';

function UserButton() {
  const { user } = useUser();
  const popover = usePopover<HTMLButtonElement>();
  return (
    <>
      <Box
        component="button"
        onClick={popover.handleOpen}
        ref={popover.anchorRef}
        sx={{
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          p: 0,
        }}
      >
        <Badge
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          color="success"
          sx={{
            '& .MuiBadge-dot': {
              border: '2px solid var(--MainNav-background)',
              borderRadius: '50%',
              bottom: '6px',
              height: '12px',
              right: '6px',
              width: '12px',
            },
          }}
          variant="dot"
        >
          {!!user?.adminProfileHost && (
            <Avatar
              src={
                user.adminProfileHost +
                user.adminProfilePath +
                user.adminProfileName
              }
            />
          )}
        </Badge>
      </Box>
      <UserPopover
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
      />
    </>
  );
}

export { UserButton };

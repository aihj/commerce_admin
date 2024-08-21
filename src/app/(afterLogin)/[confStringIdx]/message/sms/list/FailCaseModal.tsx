import {
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';

interface FailCaseModalProps {
  open: boolean;
  handleClose: () => void;
}

const FailCaseModal = ({ open, handleClose }: FailCaseModalProps) => {
  return (
    <Dialog
      maxWidth="sm"
      onClose={handleClose}
      open={open}
      sx={{
        // '& .MuiDialog-container': { justifyContent: 'flex-end' },
        '& .MuiDialog-paper': { height: '100%', width: '100%' },
      }}
    >
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, minHeight: 0 }}
      >
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            flex: '0 0 auto',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6">발송 실패 리스트</Typography>
          <IconButton onClick={handleClose}>
            <XIcon />
          </IconButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export { FailCaseModal };

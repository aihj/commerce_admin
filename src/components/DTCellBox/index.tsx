import { Box } from '@mui/material';
import { ReactElement } from 'react';

interface DTCellBoxProps {
  children: ReactElement;
  style?: NonNullable<unknown>;
}

const DTCellBox = ({ children, style }: DTCellBoxProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        fontWeight: 500,
        ...style,
      }}
    >
      {children}
    </Box>
  );
};

export { DTCellBox };

import React, { ReactNode } from 'react';
import Box from '@mui/material/Box';

interface TitleProps {
  children: ReactNode;
}

const Title = ({ children }: TitleProps) => {
  return (
    <Box
      sx={{
        p: 2,
        fontWeight: 600,
        borderRadius: 2,
        bgcolor: 'var(--mui-palette-primary-50)',
      }}
    >
      {children}
    </Box>
  );
};

export { Title };

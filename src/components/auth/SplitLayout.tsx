import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export interface SplitLayoutProps {
  children: React.ReactNode;
}

// 로그인시 추가 설명을 입력하는 페이지
export function SplitLayout({ children }: SplitLayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '1fr 800px' },
        minHeight: '100vh',
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'var(--mui-palette-background-level1)',
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          p: 3,
        }}
      >
        <Stack spacing={4} sx={{ maxWidth: '700px' }}>
          <Stack spacing={1}>
            <Typography variant="h4">Medistaff PCO Admin</Typography>
            <Typography color="text.secondary">
              메디스태프 학술대회 관리자용 페이지입니다.
            </Typography>
          </Stack>
        </Stack>
      </Box>
      <Box
        sx={{
          boxShadow: 'var(--mui-shadows-8)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 auto',
            justifyContent: 'center',
            p: 3,
          }}
        >
          <Box sx={{ maxWidth: '420px', width: '100%' }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
}

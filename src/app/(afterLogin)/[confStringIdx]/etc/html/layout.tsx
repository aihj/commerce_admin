'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { SideNav } from '@/components/core/SideNav';
import { PATH } from '@/paths';
import { useParams } from 'next/navigation';
import { NavItemConfig } from '@/types/nav';
import { useMemo } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  const { confStringIdx } = useParams();
  const navItems: NavItemConfig[] = useMemo(() => {
    return [
      {
        key: 'EACH/ETC',
        title: 'HTML',
        icon: 'tent',
        items: [
          {
            key: 'EACH/ETC/HTML/GREETINGS',
            title: '인사말',
            href: PATH.EACH.ETC.HTML.GREETINGS(confStringIdx),
          },
          {
            key: 'EACH/ETC/HTML/VENUE_INFORMATION',
            title: '오시는 길',
            href: PATH.EACH.ETC.HTML.VENUE_INFORMATION(confStringIdx),
          },
          {
            key: 'EACH/ETC/HTML/CONSTITUTION',
            title: '학회 회칙',
            href: PATH.EACH.ETC.HTML.CONSTITUTION(confStringIdx),
          },
        ],
      },
    ];
  }, [confStringIdx]);

  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={4}
        sx={{ position: 'relative' }}
      >
        <SideNav navItems={navItems} />
        <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>{children}</Box>
      </Stack>
    </Box>
  );
}

'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import GlobalStyles from '@mui/material/GlobalStyles';

import { layoutConfig, eachPcoLayoutConfig } from '../config';
import { MainNav } from './MainNav';
import { SideNav } from './SideNav';
// import { useSearchParams } from 'next/navigation';
// import { logger } from '@/lib/logger/defaultLogger';

export interface VerticalLayoutProps {
  children?: React.ReactNode;
}

export function VerticalLayout({
  children,
}: VerticalLayoutProps): React.JSX.Element {
  /*
  TODO : 현재 url에 따라서 보여주는 navItem이 달라야함
  confStringIdx를 현재 param으로 가지고 있다면 eathPcolayoutConfig을 그렇지 않으면서 탑 권한을 가지고 있으면 layoutConfig를 보여줘야함
  */
  // const params = useSearchParams();
  // logger.debug('<VerticalLayout> params', params);
  const navItem = layoutConfig.navItems.concat(eachPcoLayoutConfig.navItems);
  // logger.debug('<VerticalLayout> navItem', navItem);

  return (
    <React.Fragment>
      <GlobalStyles
        styles={{
          body: {
            '--MainNav-height': '56px',
            '--MainNav-zIndex': 1000,
            '--SideNav-width': '280px',
            '--SideNav-zIndex': 1100,
            '--MobileNav-width': '320px',
            '--MobileNav-zIndex': 1100,
          },
        }}
      />
      <Box
        sx={{
          bgcolor: 'var(--mui-palette-background-default)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          minHeight: '100%',
        }}
      >
        <SideNav items={navItem} />
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            pl: { lg: 'var(--SideNav-width)' },
          }}
        >
          <MainNav items={navItem} />
          <Box
            component="main"
            sx={{
              '--Content-margin': '0 auto',
              '--Content-maxWidth': 'var(--maxWidth-xl)',
              '--Content-paddingX': '24px',
              '--Content-paddingY': { xs: '24px', lg: '64px' },
              '--Content-padding':
                'var(--Content-paddingY) var(--Content-paddingX)',
              '--Content-width': '100%',
              display: 'flex',
              flex: '1 1 auto',
              flexDirection: 'column',
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
}

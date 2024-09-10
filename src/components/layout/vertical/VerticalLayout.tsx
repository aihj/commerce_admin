'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import GlobalStyles from '@mui/material/GlobalStyles';

import { layoutConfig, eachPcoLayoutConfig } from '../config';
import { MainNav } from './MainNav';
import { SideNav } from './SideNav';
import { User } from '@/types/user';
import { useAppSelector } from '@/redux/hooks';
import { useSelector } from 'react-redux';
import {
  selectConferenceName,
  selectConferenceStringIdx,
} from '@/redux/slices/pcoSlice';

export interface VerticalLayoutProps {
  children?: React.ReactNode;
}

export function VerticalLayout({
  children,
}: VerticalLayoutProps): React.JSX.Element {
  const user: User = useAppSelector((state) => state.user);
  const conferenceStringIdx = useSelector(selectConferenceStringIdx);
  const conferenceName = useSelector(selectConferenceName);

  // region ************* 메뉴 화면 정의 *************
  let navItem = undefined;
  if (conferenceStringIdx) {
    navItem = eachPcoLayoutConfig(conferenceStringIdx, conferenceName).navItems;
    if (user.wroleName === 'pco_admin_all_top') {
      // 최고 관리자의 경우 모든 학회 정보까지 보여주기
      navItem = navItem.concat(layoutConfig().navItems as any);
    }
  } else navItem = layoutConfig().navItems;
  // endregion ************* 메뉴 화면 정의 *************

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

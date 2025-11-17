'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import GlobalStyles from '@mui/material/GlobalStyles';

import {
  기본메뉴
} from '../config';
import { MainNav } from './MainNav';
import { SideNav } from './SideNav';
import { User } from '@/types/user';
import { useAppSelector } from '@/redux/hooks';
import { useSelector } from 'react-redux';
import {
  selectConferenceName,
  selectConferenceStringIdx,
} from '@/redux/slices/pcoSlice';
import { NavItemConfig } from '@/types/nav';

const appendMenuItems = (
  menu: NavItemConfig,
  additionalItems: NavItemConfig[]
) => {
  if (menu.items) {
    return {
      ...menu, // key, title 유지
      items: [...menu.items, ...additionalItems], // 하위 items만 추가
    };
  }
};

export interface VerticalLayoutProps {
  children?: React.ReactNode;
}

export function VerticalLayout({
  children,
}: VerticalLayoutProps): React.JSX.Element {
  const user: User = useAppSelector((state) => state.user);
  const conferenceStringIdx = useSelector(selectConferenceStringIdx);
  console.log('conferenceStringIdx', conferenceStringIdx);
  const conferenceName = useSelector(selectConferenceName);

  // region ************* 메뉴 화면 정의 *************
  let navItem: NavItemConfig[] = [];
  navItem = 기본메뉴;
  // const 학회통합최고관리자 =
  //   user.wroleNameList &&
  //   user.wroleNameList[0]?.wroleName === 'pco_admin_all_top';
    

  // if (conferenceStringIdx) {
  //   if (학회통합최고관리자) {
  //     const newItems = appendMenuItems(
  //       학술대회별기본메뉴(conferenceStringIdx, conferenceName)[0],
  //       학술대회별최고관리자메뉴(conferenceStringIdx)
  //     );

  //     navItem = [newItems, ...학회비종속최고관리자메뉴] as NavItemConfig[];
  //   } else {
  //     navItem = 학술대회별기본메뉴(conferenceStringIdx, conferenceName);
  //   }
  // } else {
  //   if (학회통합최고관리자) {
  //     navItem = 학회비종속최고관리자메뉴;
  //   } else {
  //     navItem = [];
  //   }

  //   navItem = 학회비종속최고관리자메뉴;
  // }
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

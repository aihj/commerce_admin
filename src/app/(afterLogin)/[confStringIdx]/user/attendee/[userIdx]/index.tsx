'use client';

import React, { useRef } from 'react';
import { PageTitle } from '@/components/core/PageTitle';
import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import { BasicInfo } from './BasicInfo';
import { TermsAgreeInfo } from './TermsAgreeInfo';
import { RegisterDetailInfo } from './RegisterDetailInfo';
import { RegisterInfo } from './RegisterInfo';
import { PaymentListInfo } from './PaymentListInfo';
import { ScrollMenu } from '@/components/ScrollMenu';

interface UserDetailProps {
  userIdx: number;
}

const UserDetail = ({ userIdx }: UserDetailProps) => {
  console.log('userIdx', userIdx);
  const basicRef = useRef<HTMLElement>(null);
  const termAgreeRef = useRef<HTMLElement>(null);
  const registerDetailRef = useRef<HTMLElement>(null);
  const registerRef = useRef<HTMLElement>(null);
  const paymentRef = useRef<HTMLElement>(null);

  const menus = [
    {
      title: '일반 정보',
      type: 'basic',
    },
    {
      title: '약관 동의 여부',
      type: 'termAgree',
    },
    {
      title: '회원/등록 정보',
      type: 'registerDetail',
    },
    {
      title: '학회 등록 정보',
      type: 'register',
    },
    {
      title: '전체 결제 정보',
      type: 'payment',
    },
  ];

  const handleMenuClick = (menu: string) => {
    console.log(menu);
    if (menu === 'basic') {
      basicRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (menu === 'termAgree') {
      termAgreeRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (menu === 'registerDetail') {
      console.log('registerDetailRef.current', registerDetailRef.current);
      registerDetailRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (menu === 'register') {
      registerRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (menu === 'payment') {
      paymentRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
    >
      <Stack direction="column" spacing={4}>
        <div>
          {/* TODO breadcrumbs */}
          <PageTitle title="유저 상세" />
        </div>
        <ScrollMenu menus={menus} handleMenuClick={handleMenuClick} />
        <BasicInfo ref={basicRef} />
        <TermsAgreeInfo ref={termAgreeRef} />
        <RegisterDetailInfo ref={registerDetailRef} />
        <RegisterInfo ref={registerRef} />
        <PaymentListInfo ref={paymentRef} />
      </Stack>
    </Box>
  );
};

export { UserDetail };

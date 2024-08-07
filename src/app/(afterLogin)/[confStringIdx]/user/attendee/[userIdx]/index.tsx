'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PageTitle } from '@/components/core/PageTitle';
import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import { BasicInfo } from './BasicInfo';
import { TermsAgreeInfo } from './TermsAgreeInfo';
import { RegisterDetailInfo } from './RegisterDetailInfo';
import { RegisterInfo } from './RegisterInfo';
import { PaymentListInfo } from './PaymentListInfo';
import { ScrollMenu } from '@/components/ScrollMenu';
import {
  getAttendeeBasicInfo,
  getAttendeeRegisterDetailOptionInfo,
  getAttendeeRegisterInfo,
  getAttendeeRegisterPaymentsInfo,
  getAttendeeTermsInfo,
} from '@/api/attendeeApi';
import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '@/redux/hooks';
import { selectConferenceIdx } from '@/redux/slices/pcoSlice';
import { getConferenceRegisterOptions } from '@/api/conferenceApi';
import { RegisterDetailOptionsState } from '@/constants/registerOptions';
import { logger } from '@/lib/logger/defaultLogger';

interface UserDetailProps {
  userIdx: number;
}

const UserDetail = ({ userIdx }: UserDetailProps) => {
  const conferenceIdx = useAppSelector(selectConferenceIdx);

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

  // 학회 세부 옵션 정보 (시작)
  const [registerDetailOptions, setRegisterDetailOptions] = useState<
    RegisterDetailOptionsState[] | null
  >();
  [
    {
      idx: -1,
      type: '',
      label: '',
      isEssential: false,
      value: '',
    },
  ];
  useEffect(() => {
    getConferenceRegisterOptions(conferenceIdx as number)
      .then((result) => {
        getAttendeeRegisterDetailOptionInfo(userIdx)
          .then(({ content }) => {
            if (content) {
              const optionsData = result.map((item) => ({
                idx: item.optionIdx,
                key: item.optionKey,
                name: item.optionKey,
                type: item.optionType,
                label: item.optionLabel,
                isEssential: item.isEssential === 1 ? true : false,
                value: content?.find(
                  (option) => option.optionIdx === item.optionIdx
                )?.optionValue as string,
              }));
              setRegisterDetailOptions(optionsData);
            } else {
              setRegisterDetailOptions(null);
            }
          })
          .catch((error) => {
            logger.error('<getAttendeeRegisterDetailOptionInfo> error', error);
          });
      })
      .catch((error) => {
        logger.error('<getConferenceRegisterOptions> error', error);
      });
  }, [conferenceIdx, userIdx]);
  // 학회 세부 옵션 정보 (끝)

  const {
    isLoading: getAttendeeBasicInfoIsLoading,
    error: getAttendeeBasicInfoError,
    data: getAttendeeBasicInfoData,
  } = useQuery({
    queryKey: ['getAttendeeBasicInfo', userIdx],
    queryFn: () => getAttendeeBasicInfo(userIdx),
    enabled: !!conferenceIdx,
  });

  const {
    isLoading: getAttendeeTermsInfoIsLoading,
    error: getAttendeeTermsInfoError,
    data: getAttendeeTermsInfoData,
  } = useQuery({
    queryKey: ['getAttendeeTermsInfo', userIdx],
    queryFn: () => getAttendeeTermsInfo(userIdx),
    enabled: !!conferenceIdx,
  });

  const {
    isLoading: getAttendeeRegisterInfoIsLoading,
    error: getAttendeeRegisterInfoError,
    data: getAttendeeRegisterInfoData,
  } = useQuery({
    queryKey: ['getAttendeeRegisterInfo', userIdx],
    queryFn: () => getAttendeeRegisterInfo(userIdx),
    enabled: !!conferenceIdx,
  });

  const {
    isLoading: getAttendeeRegisterPaymentsInfoIsLoading,
    error: getAttendeeRegisterPaymentsInfoError,
    data: getAttendeeRegisterPaymentsInfoData,
  } = useQuery({
    queryKey: ['getAttendeeRegisterPaymentsInfo', userIdx],
    queryFn: () => getAttendeeRegisterPaymentsInfo(userIdx),
    enabled: !!conferenceIdx,
  });

  // 전체 api 공통으로 사용 TODO <PageLoading />
  if (
    getAttendeeBasicInfoIsLoading ||
    getAttendeeTermsInfoIsLoading ||
    getAttendeeRegisterInfoIsLoading ||
    getAttendeeRegisterPaymentsInfoIsLoading
  ) {
    return 'getAttendeeBasicInfoIsLoading';
  }

  if (
    getAttendeeBasicInfoError ||
    getAttendeeTermsInfoError ||
    getAttendeeRegisterInfoError ||
    getAttendeeRegisterPaymentsInfoError
  ) {
    return 'getAttendeeBasicInfoError';
  }
  // 전체 api 공통으로 사용

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
        <BasicInfo
          ref={basicRef}
          basicInfo={getAttendeeBasicInfoData?.content}
        />
        <TermsAgreeInfo
          ref={termAgreeRef}
          terms={getAttendeeTermsInfoData?.content}
        />
        <RegisterDetailInfo
          ref={registerDetailRef}
          options={registerDetailOptions}
        />
        <RegisterInfo
          ref={registerRef}
          registerInfo={getAttendeeRegisterInfoData?.content}
        />
        <PaymentListInfo
          ref={paymentRef}
          paymentList={getAttendeeRegisterPaymentsInfoData?.content}
        />
      </Stack>
    </Box>
  );
};

export { UserDetail };

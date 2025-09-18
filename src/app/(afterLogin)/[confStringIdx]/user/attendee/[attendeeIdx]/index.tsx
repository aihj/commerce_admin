'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PageTitle } from '@/components/core/PageTitle';
import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import {
  getAttendeeBasicInfo,
  getAttendeeRegisterDetailOptionInfo,
  getAttendeeRegisterInfo,
  getAttendeeRegisterPaymentsInfo,
  getAttendeeTermsInfo,
  updateAttendeeBasicInfo,
  updateAttendeeRegisterDetailInfo,
} from '@/api/attendeeApi';
import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '@/redux/hooks';
import { selectConferenceIdx } from '@/redux/slices/pcoSlice';
import { logger } from '@/lib/logger/defaultLogger';
import { UserDuplicatedInfoRequest } from '@/api/types/publicTypes';
import { checkDuplicatedEmail, checkDuplicatedPhone } from '@/api/publicApi';
import { BasicInfo, BasicInfoForm } from './BasicInfo';
import { TermsAgreeInfo } from './TermsAgreeInfo';
import { RegisterDetailInfo } from './RegisterDetailInfo';
import { getConferenceRegisterOptions } from '@/api/conferenceApi';
import { RegisterDetailOptionsState } from '@/constants/registerOptions';
import { AttendeeRegisterDetailInfoRequest } from '@/api/types/attendeeTypes';
import { RegisterInfo } from './RegisterInfo';
import { PaymentListInfo } from './PaymentListInfo';

interface UserDetailProps {
  attendeeIdx: number;
}

const UserDetail = ({ attendeeIdx }: UserDetailProps) => {
  const conferenceIdx = useAppSelector(selectConferenceIdx);

  const basicRef = useRef<HTMLElement>(null);
  const termAgreeRef = useRef<HTMLElement>(null);
  const registerDetailRef = useRef<HTMLElement>(null);
  const registerRef = useRef<HTMLElement>(null);
  const paymentRef = useRef<HTMLElement>(null);

  // const [menus, setMenus] = useState<
  //   {
  //     title: string;
  //     type: string;
  //   }[]
  // >([]);

  // const handleMenuClick = (menu: string) => {
  //   if (menu === 'basic') {
  //     basicRef.current?.scrollIntoView({ behavior: 'smooth' });
  //   } else if (menu === 'termAgree') {
  //     termAgreeRef.current?.scrollIntoView({ behavior: 'smooth' });
  //   } else if (menu === 'registerDetail') {
  //     console.log('registerDetailRef.current', registerDetailRef.current);
  //     registerDetailRef.current?.scrollIntoView({ behavior: 'smooth' });
  //   } else if (menu === 'register') {
  //     registerRef.current?.scrollIntoView({ behavior: 'smooth' });
  //   } else if (menu === 'payment') {
  //     paymentRef.current?.scrollIntoView({ behavior: 'smooth' });
  //   }
  // };

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
    getConferenceRegisterOptions()
      .then((result) => {
        getAttendeeRegisterDetailOptionInfo(attendeeIdx)
          .then(({ content }) => {
            if (content?.length) {
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
  }, [conferenceIdx, attendeeIdx]);
  // // 학회 세부 옵션 정보 (끝)

  const [checkedEmail, setCheckedEmail] = useState<boolean>(false);
  const [checkedPhone, setCheckedPhone] = useState<boolean>(false);

  const {
    isLoading: getAttendeeBasicInfoIsLoading,
    error: getAttendeeBasicInfoError,
    data: getAttendeeBasicInfoData,
    refetch: getAttendeeBasicInfoRefetch,
  } = useQuery({
    queryKey: ['getAttendeeBasicInfo', attendeeIdx],
    queryFn: () => getAttendeeBasicInfo(attendeeIdx),
    enabled: !!conferenceIdx,
  });

  const {
    isLoading: getAttendeeTermsInfoIsLoading,
    error: getAttendeeTermsInfoError,
    data: getAttendeeTermsInfoData,
  } = useQuery({
    queryKey: ['getAttendeeTermsInfo', attendeeIdx],
    queryFn: () => getAttendeeTermsInfo(attendeeIdx),
    enabled: !!conferenceIdx,
  });

  const {
    isLoading: getAttendeeRegisterInfoIsLoading,
    error: getAttendeeRegisterInfoError,
    data: getAttendeeRegisterInfoData,
  } = useQuery({
    queryKey: ['getAttendeeRegisterInfo', attendeeIdx],
    queryFn: () => getAttendeeRegisterInfo(attendeeIdx),
    enabled: !!conferenceIdx,
  });

  const {
    isLoading: getAttendeeRegisterPaymentsInfoIsLoading,
    error: getAttendeeRegisterPaymentsInfoError,
    data: getAttendeeRegisterPaymentsInfoData,
  } = useQuery({
    queryKey: ['getAttendeeRegisterPaymentsInfo', attendeeIdx],
    queryFn: () => getAttendeeRegisterPaymentsInfo(attendeeIdx),
    enabled: !!conferenceIdx,
  });

  const handleBasicInfo = (basicInfo: BasicInfoForm) => {
    updateAttendeeBasicInfo(basicInfo)
      .then((result) => {
        if (result.status === 200) {
          Swal.fire({
            title: '저장 완료',
            text: '회원정보가 수정되었습니다.',
          }).then((result) => {
            if (result.isConfirmed) {
              getAttendeeBasicInfoRefetch();
            }
          });
        }
      })
      .catch((error) => {
        logger.error('<updateAttendeeBasicInfo> error', error);
        Swal.fire({
          title: '저장 실패',
          text: '다시 시도하거나 관리자에게 문의해 주세요.',
        });
      });
  };

  const handleRegisterDetailInfo = (
    detailInfo: AttendeeRegisterDetailInfoRequest
  ) => {
    updateAttendeeRegisterDetailInfo(detailInfo)
      .then((result) => {
        if (result.status === 200) {
          Swal.fire({
            title: '저장 완료',
            text: '학회 등록 세부 정보가 수정되었습니다.',
          });
        }
      })
      .catch((error) => {
        logger.error('<updateAttendeeRegisterDetailInfo> error', error);
        Swal.fire({
          title: '저장 실패',
          text: '다시 시도하거나 관리자에게 문의해 주세요.',
        });
      });
  };

  const handleDuplicatedEmail = (data: UserDuplicatedInfoRequest) => {
    setCheckedEmail(false);
    checkDuplicatedEmail(data)
      .then((result) => {
        if (result.status === 200) {
          setCheckedEmail(true);
          Swal.fire({
            title: '중복확인 완료',
            text: '사용 가능한 이메일입니다.',
          });
        }
      })
      .catch((error) => {
        logger.error('<handleDuplicatedEmail> error', error);
        if (error.response.data.code.includes('duplicate')) {
          Swal.fire({
            title: '중복확인 실패',
            text: '이미 사용중인 이메일 입니다.',
          });
        } else {
          Swal.fire({
            title: '중복확인 실패',
            text: '다시 시도하거나 관리자에게 문의해 주세요.',
          });
        }
      });
  };

  const handleDuplicatedPhone = (data: UserDuplicatedInfoRequest) => {
    setCheckedPhone(false);
    checkDuplicatedPhone(data)
      .then((result) => {
        if (result.status === 200) {
          setCheckedPhone(true);
          Swal.fire({
            title: '중복확인 완료',
            text: '사용 가능한 휴대폰 번호 입니다.',
          });
        }
      })
      .catch((error) => {
        logger.error('<handleDuplicatedPhone> error', error);
        if (error.response.data.code.includes('duplicate')) {
          Swal.fire({
            title: '중복확인 실패',
            text: '이미 사용중인 휴대폰 번호 입니다.',
          });
        } else {
          Swal.fire({
            title: '중복확인 실패',
            text: '다시 시도하거나 관리자에게 문의해 주세요.',
          });
        }
      });
  };

  // useEffect(() => {
  //   let newMenu = [
  //     {
  //       title: '일반 정보',
  //       type: 'basic',
  //     },
  //   ];
  //   if (getAttendeeTermsInfoData?.content) {
  //     newMenu = [
  //       ...newMenu,
  //       {
  //         title: '약관 동의 여부',
  //         type: 'termAgree',
  //       },
  //     ];
  //   }
  //   if (registerDetailOptions) {
  //     newMenu = [
  //       ...newMenu,
  //       {
  //         title: '회원/등록 정보',
  //         type: 'registerDetail',
  //       },
  //     ];
  //   }
  //   if (getAttendeeRegisterInfoData?.content) {
  //     newMenu = [
  //       ...newMenu,
  //       {
  //         title: '학회 등록 정보',
  //         type: 'register',
  //       },
  //     ];
  //   }
  //   if (getAttendeeRegisterPaymentsInfoData?.content) {
  //     newMenu = [
  //       ...newMenu,
  //       {
  //         title: '전체 결제 정보',
  //         type: 'payment',
  //       },
  //     ];
  //   }
  //   setMenus(newMenu);
  // }, [
  //   getAttendeeTermsInfo,
  //   registerDetailOptions,
  //   getAttendeeBasicInfoData,
  //   getAttendeeRegisterPaymentsInfoData,
  // ]);

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
          <PageTitle title="회원 상세" />
        </div>
        {/* <ScrollMenu menus={menus} handleMenuClick={handleMenuClick} /> */}
        <BasicInfo
          ref={basicRef}
          attendeeIdx={attendeeIdx}
          conferenceIdx={conferenceIdx as number}
          basicInfo={getAttendeeBasicInfoData?.content}
          handleBasicInfo={(data: BasicInfoForm) => handleBasicInfo(data)}
          checkedEmail={checkedEmail}
          handleDuplicatedEmail={(data: UserDuplicatedInfoRequest) =>
            handleDuplicatedEmail(data)
          }
          checkedPhone={checkedPhone}
          handleDuplicatedPhone={(data: UserDuplicatedInfoRequest) =>
            handleDuplicatedPhone(data)
          }
        />
        <TermsAgreeInfo
          ref={termAgreeRef}
          terms={getAttendeeTermsInfoData?.content}
        />
        {getAttendeeRegisterInfoData?.content ? (
          <RegisterInfo
            ref={registerRef}
            registerInfo={getAttendeeRegisterInfoData?.content}
          />
        ) : null}
        {registerDetailOptions?.length ? (
          <RegisterDetailInfo
            ref={registerDetailRef}
            conferenceIdx={conferenceIdx as number}
            attendeeIdx={attendeeIdx}
            options={registerDetailOptions}
            handleRegisterDetailInfo={(
              data: AttendeeRegisterDetailInfoRequest
            ) => handleRegisterDetailInfo(data)}
          />
        ) : null}

        {getAttendeeRegisterPaymentsInfoData?.content ? (
          <PaymentListInfo
            ref={paymentRef}
            paymentList={getAttendeeRegisterPaymentsInfoData?.content}
          />
        ) : null}
      </Stack>
    </Box>
  );
};

export { UserDetail };

'use client';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { useQuery } from '@tanstack/react-query';
import { getAppConferenceDetail } from '@/api/conferenceApi';
import { logger } from '@/lib/logger/defaultLogger';
import Table from '@mui/material/Table';
import { useParams } from 'next/navigation';
import { AppExposureConferenceDetailResponse } from '@/api/types/AppExposureConferenceTypes';
import { AxiosError } from 'axios';
import { PageLoading } from '@/components/core/Loading';
import Box from '@mui/material/Box';
import { PageTitle } from '@/components/core/PageTitle';
import Typography from '@mui/material/Typography';
import * as React from 'react';

const AppRegisterView = () => {
  const { conferenceIdx } = useParams();
  const { data, isPending, error } = useQuery<
    any,
    AxiosError,
    AppExposureConferenceDetailResponse
  >({
    queryKey: ['getAppConferenceDetail', conferenceIdx],
    queryFn: () =>
      getAppConferenceDetail(Number(conferenceIdx))
        .then((result) => {
          return result.content;
        })
        .catch((error) => {
          logger.error('<getAppConferenceList error>', error);
        }),
  });
  if (isPending || error) {
    return <PageLoading />;
  }
  const supportStatusMap: Record<
    'online_offline' | 'online_only' | 'offline_only',
    string
  > = {
    online_offline: '(온라인 + 오프라인)',
    online_only: '(온라인만)',
    offline_only: '(오프라인만)',
  };

  const getApplyStatus: Record<'active' | 'apply' | 'delete', string> = {
    active: '등록',
    apply: '대기',
    delete: '등록 거절',
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
      <div className="mb-24">
        <PageTitle title="강좌 등록 상세" />
      </div>
      <Box display="flex" alignItems="center" gap={4}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2" color="textSecondary">
            등록요청일:
          </Typography>
          <Typography variant="body1">
            {data?.conferenceRegistrationT ?? '-'}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2" color="textSecondary">
            등록 상태:
          </Typography>
          <Typography variant="body1">
            {getApplyStatus[data?.conferenceApplyStatus] ?? '-'}
          </Typography>
        </Box>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>항목명</TableCell>
            <TableCell>내용</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>학회명</TableCell>
            <TableCell>{data.conferenceName}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>주최/주관</TableCell>
            <TableCell>{data.committeeName}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>일반 평점</TableCell>
            <TableCell>{data.electiveCredit}점</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>필수 평점</TableCell>
            <TableCell>{data.essentialCredit}점</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>학회 일시</TableCell>
            <TableCell>{data.conferenceDate}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>사전등록 일시</TableCell>
            <TableCell>{data.conferencePreDate}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>장소</TableCell>
            <TableCell>
              <ul>
                <li>
                  <span>
                    {
                      supportStatusMap[
                        data?.onlineOfflineSupportStatus ?? 'online_offline'
                      ]
                    }
                  </span>
                </li>
                <li>
                  <span>행사장명 : </span>
                  <span>{data?.locationName}</span>
                </li>
                <li>
                  <span>주소 : </span>
                  <span>{data?.locationAddr}</span>
                </li>
              </ul>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>학회명</TableCell>
            <TableCell>{data.conferenceName}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>참여권한</TableCell>
            <TableCell>{data.userLevelInfo}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>대상 전문 과목</TableCell>
            <TableCell>{data.specialtyNameList}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>이미지</TableCell>
            <TableCell>
              <Box
                alt="학회 포스터"
                component="img"
                src={data.posterUrl}
                sx={{ height: '100px', width: 'auto' }}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>내용</TableCell>
            <TableCell>{data.conferenceDesc}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>홈페이지 URL</TableCell>
            <TableCell>{data.homeUrl}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>사전등록 URL</TableCell>
            <TableCell>{data.preUrl}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>담당자 연락처</TableCell>
            <TableCell>
              <ul>
                <li>
                  <span>담당자 성함 : </span>
                  <span>{data.name}</span>
                </li>
                <li>
                  <span>전화번호 또는 휴대폰 번호 : </span>
                  <span>{data.phone}</span>
                </li>
                <li>
                  <span>이메일 주소 : </span>
                  <span>{data.email}</span>
                </li>
              </ul>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>결과 안내받기</TableCell>
            <TableCell>{data.resultAlertEmail}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>개인정보 제공 동의</TableCell>
            <TableCell>개인정보 제공 및 활용에 동의합니다.</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};

export default AppRegisterView;

'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Button, Card, Stack } from '@mui/material';
import { getFaculty } from '@/api/facultyApi';
import { PageTitle } from '@/components/core/PageTitle';
import { Label } from '@/components/core/Label';
import {
  FACULTY_STATUS,
  GetFacultyResponse,
  facultyStatusLabels,
} from '@/api/types/facultyTypes';

import { FacultyProfile } from '../FacultyProfile';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectConferenceStringIdx } from '@/redux/slices/pcoSlice';
import { PATH } from '@/paths';
import { Loading } from '@/components/core/Loading';
import { Alert } from '@/components/core/Alert';

import '@/components/editor/simple/simple-editor.scss';

interface FacultyDetailProps {
  facultyIdx: string;
}

const FacultyDetail = ({ facultyIdx }: FacultyDetailProps) => {
  const router = useRouter();
  const conferenceStringIdx = useSelector(selectConferenceStringIdx);
  console.log(facultyIdx);
  const { data, isPending } = useQuery({
    queryKey: ['getFaculty', facultyIdx],
    queryFn: () =>
      getFaculty(Number(facultyIdx)).then((response) => {
        if (response.status === 200) {
          return response.content as GetFacultyResponse;
        } else {
          Alert({
            title: '연자 상세 조회 실패',
            text: '연자 상세 조회에 실패하여 목록으로 돌아갑니다.',
          }).then((result) => {
            if (result.isConfirmed) {
              router.replace(PATH.EACH.FACULTY.LIST(conferenceStringIdx));
            }
          });
        }
      }),
  });
  console.log('data', data);
  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
    >
      {isPending && <Loading open={isPending} />}
      {data ? (
        <>
          <div className="flex justify-between">
            <PageTitle title={`연자 상세`} />
            <Button
              onClick={() =>
                router.push(
                  PATH.EACH.FACULTY.EDIT(conferenceStringIdx, data.facultyIdx)
                )
              }
              variant="contained"
              color="secondary"
            >
              수정하기
            </Button>
          </div>
          <Stack spacing={2} direction="row" sx={{ flex: 1, mt: 4 }}>
            <Card
              sx={{
                flex: 2,
                p: 2,
                '&.MuiPaper-root': {
                  boxShadow: 'none',
                },
              }}
            >
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Label label="노출 여부" minWidth={100} bold />
                  <Stack
                    direction="row"
                    useFlexGap
                    sx={{ flexWrap: 'wrap' }}
                    gap={1}
                  >
                    <span className="text-14">
                      {facultyStatusLabels[data.status as FACULTY_STATUS]}
                    </span>
                  </Stack>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                  <div className="min-w-[300px]">
                    <Label label="홈 미리보기" minWidth={100} bold />
                    <div className="mt-16 w-[292px] bg-slate-50 py-12">
                      <FacultyProfile
                        name={data.name}
                        cv={data.simpleCv}
                        profileUrl={data.profileUrl}
                      />
                    </div>
                  </div>
                  <div className="w-[640px]">
                    <Label label="연자상세 미리보기" minWidth={100} bold />
                    <div className="mt-16 p-40 border border-solid border-slate-100 rounded-8">
                      <FacultyProfile
                        name={data.name}
                        cv={data.cv}
                        profileUrl={data.profileUrl}
                        affiliation={data.affiliation}
                      />
                    </div>
                  </div>
                </Box>
              </Stack>
            </Card>
          </Stack>
        </>
      ) : null}
    </Box>
  );
};

export { FacultyDetail };

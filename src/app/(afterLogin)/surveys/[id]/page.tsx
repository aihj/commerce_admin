'use client';

import React from 'react';
import type { ReactElement } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Title } from '@/components/surveys/detail/Title';
import { Form as DetailForm } from '@/components/surveys/detail/Form';
import ComponsationTable, {
  Compensation,
} from '@/components/surveys/detail/ComponsationTable';
import { Button, Card, CardContent, Stack } from '@mui/material';
import { StyledInputLabel } from '@/components/core/Form/Form.styles';
import { MoreLink } from '@/components/surveys/detail/MoreLink';
import { useDialog } from '@/hooks/useDialog';
import { CompensationDialog } from '@/components/surveys/detail/CompensationDialog';

const compensations = [
  {
    idx: 112345,
    condition: '선착순',
    sex: '남',
    birthDateAfter: '1980-01-01',
    birthDateBefore: '1990-12-31',
    userLevel: '의사,치과의사',
    specialty: '없음',
    signInDateAfter: '2020-01-01',
    signInDateBefore: '2024-12-31',
    compenstionAmount: '1,000,000',
    totalCapacity: '1,000',
    compensatedNumber: '60',
  },
] satisfies Compensation[];

const SurveyDetail = (): ReactElement => {
  const dialog = useDialog();

  return (
    <>
      <Box
        sx={{
          maxWidth: 'var(--Content-maxWidth)',
          m: 'var(--Content-margin)',
          p: 'var(--Content-padding)',
          width: 'var(--Content-width)',
        }}
      >
        <Box sx={{ flex: '1 1 auto', pb: 2 }}>
          <Typography style={{ fontWeight: 600 }} variant="h4">
            설문조사
          </Typography>
        </Box>

        <DetailForm />

        <Box sx={{ py: 2 }}>
          <Title>
            <Stack
              direction="row"
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
                flex: '1 1 auto',
                flexWrap: 'wrap',
              }}
            >
              보상 관리
              <Button variant="outlined" onClick={dialog.handleOpen}>
                등록
              </Button>
            </Stack>
          </Title>
        </Box>
        <ComponsationTable rows={compensations} />

        <Box sx={{ py: 2 }}>
          <Title>상세 관리</Title>
        </Box>
        <Card>
          <CardContent>
            <MoreLink
              label="설문 문항 관리"
              href="/"
              linkText="설문 문항을 관리할 수 있습니다"
            />
            <MoreLink
              label="참여자 목록"
              href="/"
              linkText="참여자를 확인할 수 있습니다"
            />
            <MoreLink
              label="댓글 관리"
              href="/"
              linkText="댓글을 관리할 수 있습니다"
            />
          </CardContent>
        </Card>

        <Box sx={{ py: 2 }}>
          <Title>설문 운영 관리</Title>
        </Box>
        <Card>
          <CardContent sx={{ ':last-child': { pb: 2 }, display: 'flex' }}>
            <StyledInputLabel>설문 등록일</StyledInputLabel>
            2023-12-23
          </CardContent>
        </Card>
      </Box>
      <CompensationDialog onClose={dialog.handleClose} open={dialog.open} />
    </>
  );
};

export default SurveyDetail;

import { useParams } from 'next/navigation';
import { Button, Stack, Typography } from '@mui/material';
import * as React from 'react';

type SessionGroupFormTypes = {
  append?: any;
};

// 하나의 세션 그룹에 대한 Form
// eslint-disable-next-line no-empty-pattern
export default function SessionListForm(
  // eslint-disable-next-line no-empty-pattern
  {
    // append
  }: SessionGroupFormTypes
) {
  const { confStringIdx, sessionGroupIdx } = useParams();
  return (
    <Stack spacing={3}>
      <Typography color="primary" variant="h6">
        강의 입력
      </Typography>
      세션 리스트 form
      {confStringIdx}
      {sessionGroupIdx}
      <Button color="primary" type="submit">
        세션 정보 저장하기
      </Button>
    </Stack>
  );
}

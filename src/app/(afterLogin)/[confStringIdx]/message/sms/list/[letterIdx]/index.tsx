'use client';

import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Stack,
  TextField,
} from '@mui/material';
import { PageTitle } from '@/components/core/PageTitle';
import { SMSDetailList } from './SMSDetailList';
import { SEND_STATUS } from '@/api/types/messageTypes';
import { Label } from '@/components/core/Label';
import { numberWithComma } from '@/lib/numberWithComma';

const dummyData = {
  letterIdx: 7,
  templateIdx: null,
  count: 4,
  failureCount: 0,
  filterJson: '{"conferenceIdx": 3795}',
  type: 'custom',
  subject: null,
  content: '{[userName]} 받아랏',
  memo: '문자보내기',
  sendDate: '2024-08-19 14:22:42',
  completeDate: null,
  senderPhoneNumber: '01062813889',
  senderWuserIdx: 867,
  senderName: '메디스태프 율무',
  letterItemList: [
    {
      letterItemIdx: 23,
      letterItemSendDate: '2024-08-19 14:22:42',
      smsMsgId: 23518,
      mmsMsgId: null,
      receiverWuserIdx: 869,
      phone: '01076700219',
      name: '송덕수',
      sendStatus: SEND_STATUS.complete,
      failReason: null,
    },
    {
      letterItemIdx: 22,
      letterItemSendDate: '2024-08-19 14:22:42',
      smsMsgId: 23517,
      mmsMsgId: null,
      receiverWuserIdx: 865,
      phone: '01072496809',
      name: '테스트 정혜경',
      sendStatus: SEND_STATUS.inProgress,
      failReason: null,
    },
    {
      letterItemIdx: 21,
      letterItemSendDate: '2024-08-19 14:22:42',
      smsMsgId: 23516,
      mmsMsgId: null,
      receiverWuserIdx: 863,
      phone: '01095855825',
      name: '김유정',
      sendStatus: SEND_STATUS.inProgress,
      failReason: null,
    },
    {
      letterItemIdx: 20,
      letterItemSendDate: '2024-08-19 14:22:42',
      smsMsgId: 23515,
      mmsMsgId: null,
      receiverWuserIdx: 862,
      phone: '01026736809',
      name: '정혜경',
      sendStatus: SEND_STATUS.failure,
      failReason: '알수없는 이유',
    },
  ],
};

const SMSSendDetail = () => {
  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
    >
      <div>
        {/* TODO breadcrumbs */}
        <PageTitle title="문자 발송 내역 상세" />
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
              <Label label="전송 대상" minWidth={100} bold />
              <Chip color="secondary" label="전송 필터" />
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', flex: 1 }}>
                <Label label="요청 건수" minWidth={100} bold />
                <span className="text-14">
                  {numberWithComma(dummyData.count)}
                </span>
              </Box>
              <Box sx={{ display: 'flex', flex: 1 }}>
                <Label label="실패 건수" minWidth={100} bold />
                <span className="text-14">
                  {numberWithComma(dummyData.failureCount)}
                </span>
              </Box>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', flex: 1 }}>
                <Label label="발송 요청 일시" minWidth={100} bold />
                <span className="text-14">{dummyData.sendDate}</span>
              </Box>
              <Box sx={{ display: 'flex', flex: 1 }}>
                <Label label="발송 완료 일시" minWidth={100} bold />
                <span className="text-14">{dummyData.completeDate}</span>
              </Box>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
              <Label label="메모" minWidth={100} bold />
              <span className="text-14">{dummyData.memo}</span>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
              <Label label="양식" minWidth={100} bold />
              {/* TODO 양식 select */}
              <span className="text-14">선택 안함</span>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Label label="메시지" minWidth={100} bold />
              {/* TODO 양식 select */}
              <Box sx={{ width: '100%' }}>
                <Label label="제목" minWidth={100} />
                <TextField
                  sx={{ p: 0, height: 44, width: '100%' }}
                  inputProps={{
                    readonly: true,
                  }}
                  // helperText={
                  //   errors.subject
                  //     ? errors.subject?.message
                  //     : '제목은 문자 발송 내역에 저장되는 내용이며, 문자 발송시 제목으로 표기되지 않습니다.'
                  // }
                  fullWidth
                  // {...field}
                />
                <Label label="내용" minWidth={100} />
                <TextField
                  sx={{ p: 0, height: 44, width: '100%' }}
                  inputProps={{
                    readonly: true,
                  }}
                  // helperText={
                  //   errors.subject
                  //     ? errors.subject?.message
                  //     : '제목은 문자 발송 내역에 저장되는 내용이며, 문자 발송시 제목으로 표기되지 않습니다.'
                  // }
                  fullWidth
                  // {...field}
                />
              </Box>
            </Box>
          </Stack>
        </Card>
        <Divider />
        <Card sx={{ flex: 3 }}>
          <Stack
            spacing={2}
            direction="row"
            sx={{ m: 2, justifyContent: 'flex-end' }}
          >
            <Button variant="contained" color="secondary">
              실패 건 전체 재발송
            </Button>
            <Button variant="outlined" color="secondary">
              선택 건 재발송
            </Button>
          </Stack>
          <SMSDetailList data={dummyData.letterItemList} />
        </Card>
      </Stack>
    </Box>
  );
};

export { SMSSendDetail };

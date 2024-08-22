import React from 'react';
import { Box } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { InfoFilledIcon } from '@/components/icons/InfoFilledIcon';
import { toast } from '@/components/core/Toaster';

const SMSTemplateInfo = () => {
  return (
    <Box
      sx={{
        ml: 2,
        px: 3,
        py: 5,
        borderRadius: '12px',
      }}
    >
      <div className="mb-16 leading-20 text-stone-600">
        <span>
          <InfoFilledIcon size={20} />
        </span>
        <span className="font-bold leading-20 ml-4 text-primary-dark">
          자동 입력 지원
        </span>
      </div>
      <div className="flex flex-col">
        <span>
          메세지에 오른쪽과 같이 입력하면 자동 변환되어 정보가 표기됩니다.
        </span>
        <span>
          {`회원명 : {[userName]}`}
          <CopyToClipboard
            text={`{[userName]}`}
            onCopy={() => {
              toast.success(
                '복사가 완료되었습니다. 메세지에 붙여넣기 하여 사용하세요.',
                { duration: 1000 }
              );
            }}
          >
            <span className="underline hover:cursor-pointer pl-4 text-14">
              [복사하기]
            </span>
          </CopyToClipboard>
        </span>
      </div>
      <div className="flex flex-col mt-8 p-8 bg-primary-light leading-24 text-14">
        <span className="font-medium text-primary-dark ">{`예시)`}</span>
        <span>
          <strong>{`{[userName]}`}</strong>님 안녕하세요!
        </span>
        <span>
          → <strong>김메디</strong>님 안녕하세요!
        </span>
      </div>
    </Box>
  );
};

export { SMSTemplateInfo };

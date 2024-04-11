'use client';
import React, { useState } from 'react';
import { logger } from '@/lib/logger/defaultLogger';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Card } from '@mui/material';

type TestTypeProps = NonNullable<unknown>;

// eslint-disable-next-line no-empty-pattern
export default function Test({}: TestTypeProps) {
  const [value, setValue] = useState<string>('');

  return (
    <article>
      <h2>간단한 테스트용 페이지</h2>
      <Card>
        <>
          <DatePicker
            // timezone="Asia/Seoul"
            format="YYYY-MM-DD"
            label=""
            onChange={(date) => {
              logger.debug('date', date);
              setValue(date ? dayjs(date).format('YYYY-MM-DD') : null);
            }}
            value={value ? value : null}
          />
          value = {JSON.stringify(value)}
        </>
      </Card>
      <Card>
        <>ㅋㅋㅋㅋ</>
      </Card>
    </article>
  );
}

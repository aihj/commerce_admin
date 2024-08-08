'use client';

import { AttendeeTermsAgreeInfoResponse } from '@/api/types/attendeeTypes';
import { Label } from '@/components/core/Label';
import {
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import React, { forwardRef } from 'react';

const typeOptions = [
  {
    title: '동의',
    value: 'y',
  },
  {
    title: '미동의',
    value: 'n',
  },
] satisfies {
  title: string;
  value: string;
}[];

interface TermsAgreeInfoProp {
  terms: AttendeeTermsAgreeInfoResponse[] | undefined;
}

const TermsAgreeInfo = forwardRef(({ terms }: TermsAgreeInfoProp, ref) => {
  return (
    <Card
      sx={{
        borderRadius: '10px',
        boxShadow: 'none',
        border: `1px solid var(--color-secondary-light)`,
      }}
    >
      <CardHeader
        ref={ref}
        titleTypographyProps={{
          color: 'var(--color-secondary-darkest)',
          fontWeight: 700,
          fontSize: '18px',
        }}
        className="bg-secondary-light"
        title="선택 약관 동의"
      />
      <form>
        <CardContent className="flex flex-col gap-24" sx={{ p: 3 }}>
          {terms?.map((term) => (
            <div className="flex" key={term.termsIdx}>
              <Label label={term.title} minWidth={200} />
              <RadioGroup
                defaultValue={term.isSelect}
                sx={{
                  flexDirection: 'row',
                  '& .MuiFormControlLabel-root': {
                    borderRadius: 1,
                    gap: 2,
                  },
                }}
              >
                {typeOptions.map((option) => (
                  <FormControlLabel
                    control={<Radio />}
                    key={`${term.termsIdx}_${option.value}`}
                    disabled
                    label={
                      <div>
                        <Typography
                          sx={{
                            color: 'var(--mui-palette-text-primary)',
                          }}
                          variant="inherit"
                        >
                          {option.title}
                        </Typography>
                      </div>
                    }
                    value={option.value}
                  />
                ))}
              </RadioGroup>
            </div>
          ))}
          {/* 선택 약관 정보 수정 기능 사용 X
            <div className="text-right">
              <Button
                sx={{ minWidth: 180 }}
                variant="contained"
                color="primary"
                size="large"
                onClick={() => handleClick()}
              >
                저장
              </Button>
            </div> */}
        </CardContent>
      </form>
    </Card>
  );
});

TermsAgreeInfo.displayName = 'TermsAgreeInfo';

export { TermsAgreeInfo };

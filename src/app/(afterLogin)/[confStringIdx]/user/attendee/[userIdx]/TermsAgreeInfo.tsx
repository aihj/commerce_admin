'use client';

import { Label } from '@/components/core/Label';
import {
  Button,
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

// interface TermsAgreeInfoProp {}

const TermsAgreeInfo = forwardRef((props, ref) => {
  console.log(props);
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
        title="약관 동의"
      />
      <form>
        <CardContent className="flex flex-col gap-24" sx={{ p: 3 }}>
          <div className="flex">
            <Label label="(선택) 제3자 정보 제공 동의" minWidth={200} />
            <RadioGroup
              defaultValue="y"
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
                  key={option.value}
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
          <div className="text-right">
            <Button
              sx={{ minWidth: 180 }}
              onClick={() => {
                alert('데이터를 저장');
              }}
              variant="contained"
              color="primary"
              size="large"
            >
              저장
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
});

TermsAgreeInfo.displayName = 'TermsAgreeInfo';

export { TermsAgreeInfo };

'use client';

import {
  AttendeeTermsAgreeInfoResponse,
  AttendeeTermsInfoRequest,
} from '@/api/types/attendeeTypes';
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
import React, { forwardRef, useEffect, useState } from 'react';

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
  userIdx: number;
  handleTermsInfo: (data: AttendeeTermsInfoRequest) => void;
}

const TermsAgreeInfo = forwardRef(
  ({ terms, userIdx, handleTermsInfo }: TermsAgreeInfoProp, ref) => {
    const [termsState, setTermsState] =
      useState<AttendeeTermsAgreeInfoResponse[]>();

    useEffect(() => {
      setTermsState(terms);
    }, []);

    const handleTermAgreeChange = (termIdx: number, value: string) => {
      const newState = termsState?.map((term) =>
        term.termsIdx === termIdx ? { ...term, isSelect: value } : { ...term }
      );
      setTermsState(newState);
    };

    if (terms?.length === 0) {
      return null;
    }

    const handleClick = () => {
      handleTermsInfo({
        wuserIdx: userIdx,
        termsJson: JSON.stringify(termsState),
      });
    };

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
                      onChange={() =>
                        handleTermAgreeChange(term.termsIdx, option.value)
                      }
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
            </div>
          </CardContent>
        </form>
      </Card>
    );
  }
);

TermsAgreeInfo.displayName = 'TermsAgreeInfo';

export { TermsAgreeInfo };

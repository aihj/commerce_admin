import { Control, Controller, FieldErrors } from 'react-hook-form';
import { SignInFormValues } from '@/components/auth/SignInForm';
import * as React from 'react';
import { FormControl, FormHelperText, InputLabel, Select } from '@mui/material';
import { Option } from '@/components/core/Option';
import { getOpenAdminPcoList } from '@/api/conferenceApi';
import { useQuery } from '@tanstack/react-query';
import { logger } from '@/lib/logger/defaultLogger';

type OpenAdminPcoSelectTypes = {
  errors: FieldErrors<SignInFormValues>;
  control: Control<SignInFormValues>;
};

type PcoData = {
  conference_idx: number;
  committee_name: string;
  conference_name: string;
};

export default function OpenAdminPcoSelect({
  errors,
  control,
}: OpenAdminPcoSelectTypes) {
  const {
    isLoading,
    error: getOpenAdminPcoListError,
    data: pcoData,
  } = useQuery<PcoData[]>({
    queryKey: ['getOpenAdminPcoList'],
    queryFn: () =>
      getOpenAdminPcoList()
        .then((res) => {
          // console.log('[getOpenAdminPcoList] : ', res.data.content);
          return res.data.content;
        })
        .catch((error) => {
          logger.error('[getOpenAdminPcoList] error', error);
          return null;
        }),
  });

  // window.pcoData = pcoData;
  if (getOpenAdminPcoListError || !pcoData) {
    return (
      <div>
        해당하는 학회의 데이터를 불러 올 수 없습니다. 관리자에게 문의하여
        주세요.
      </div>
    );
  }
  if (isLoading) {
    return null;
  }
  return (
    <>
      <Controller
        defaultValue={null}
        control={control}
        name="conferenceIdx"
        render={({ field }) => (
          <FormControl error={Boolean(errors.conferenceIdx)} fullWidth>
            <InputLabel required>학회 선택하기</InputLabel>
            <Select {...field}>
              <Option value={null}>메디스태프</Option>
              {pcoData.map((item) => (
                <Option key={item.conference_idx} value={item.conference_idx}>
                  {`${item.committee_name}(${item.conference_name})`}
                </Option>
              ))}
            </Select>
            {errors.conferenceIdx ? (
              <FormHelperText error>
                {errors.conferenceIdx.message}
              </FormHelperText>
            ) : null}
          </FormControl>
        )}
      />
    </>
  );
}

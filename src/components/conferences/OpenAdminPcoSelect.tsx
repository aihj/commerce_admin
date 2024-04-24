import { Control, Controller, FieldErrors } from 'react-hook-form';
import { signInFormValues } from '@/components/auth/SignInForm';
import * as React from 'react';
import { FormControl, FormHelperText, InputLabel, Select } from '@mui/material';
import { Option } from '@/components/core/Option';
import { getOpenAdminPcoList } from '@/api/conferenceApi';
import { useQuery } from '@tanstack/react-query';

type OpenAdminPcoSelectTypes = {
  errors: FieldErrors<signInFormValues>;
  control: Control<signInFormValues>;
};

export default function OpenAdminPcoSelect({
  errors,
  control,
}: OpenAdminPcoSelectTypes) {
  const {
    isLoading,
    error,
    data: pcoData,
  } = useQuery({
    queryKey: ['getOpenAdminPcoList'],
    queryFn: () =>
      getOpenAdminPcoList().then((res) => {
        console.log('res : ', res);
        return res.data;
      }),
  });
  window.pcoData = pcoData;
  if (error || !pcoData) {
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
        control={control}
        name="conferenceIdx"
        render={({ field }) => (
          <FormControl error={Boolean(errors.conferenceIdx)} fullWidth>
            <InputLabel required>Country</InputLabel>
            <Select {...field}>
              {pcoData.map((item) => (
                <Option key={item.conferenceIdx} value={item.conferenceIdx}>
                  {`${item.committeeName}(${item.conferenceName})`}
                </Option>
              ))}
            </Select>
            {errors.conferenceIdx ? (
              <FormHelperText>{errors.conferenceIdx.message}</FormHelperText>
            ) : null}
          </FormControl>
        )}
      />
    </>
  );
}

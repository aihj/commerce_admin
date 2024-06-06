import { useParams } from 'next/navigation';
import * as React from 'react';
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Select,
  Stack,
  Typography,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Controller, FieldErrors, useFieldArray } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { isDate } from '@/utils/dateFunctions';
import { SessionGroupDetailData } from '@/app/(afterLogin)/[confStringIdx]/programs/session-group/[sessionGroupIdx]/page';
import { useFieldArrayRemove } from '@/utils/formFunctions';
import { Option } from '@/components/core/Option';
import { dayjs } from '@/lib/dayjs';
import { DateTimePicker } from '@mui/x-date-pickers';
type SessionGroupFormTypes = {
  sessionGroupDetailData: SessionGroupDetailData;
  errors: FieldErrors;
  control: any;
};

// 하나의 세션 그룹에 대한 Form
// eslint-disable-next-line no-empty-pattern
export default function SessionListForm({
  sessionGroupDetailData,
  errors,
  control,
}: SessionGroupFormTypes) {
  const { confStringIdx, sessionGroupIdx } = useParams();
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: 'sessions',
  });
  const sessionTypeOptions = useMemo(() => [
    { value: 'lecture', label: 'lecture' },
    { value: 'etc', label: 'etc' },
  ]);
  // 수정 페이지의 경우 세션 정보 업데이트
  useEffect(() => {
    sessionGroupDetailData?.sessionGroup?.sessions.forEach((item, index) => {
      const dataToAppend: any = {};
      Object.keys(item).forEach((key) => {
        if (item[key] !== null) {
          if (isDate(item[key])) dataToAppend[key] = new Date(item[key]);
          else dataToAppend[key] = item[key];
        }
      });
      update(index, dataToAppend);
    });
  }, [sessionGroupDetailData?.sessionGroup?.sessions, update]);

  return (
    <Stack spacing={3}>
      <Typography color="primary" variant="h6">
        강의 입력
      </Typography>

      <Grid container rowSpacing={1} columnSpacing={3}>
        {fields.map((item, index: number) => (
          <>
            <Grid xs={12}>
              강의 {index + 1}
              <Button
                className="h-10"
                variant="danger"
                type="button"
                onClick={() =>
                  useFieldArrayRemove(
                    remove,
                    index,
                    confStringIdx,
                    'session',
                    item['sessionIdx']
                  )
                }
              >
                강의 삭제
              </Button>
            </Grid>

            <Grid md={6} xs={12}>
              <Controller
                defaultValue={sessionGroupDetailData.sessionGroup.sessionType}
                control={control}
                rules={{ required: '강의 타입은 필수 값입니다.' }}
                name={`sessions.${index}.sessionType`}
                render={({ field }) => (
                  <FormControl
                    error={Boolean(errors.sessionGroupType)}
                    fullWidth
                  >
                    <InputLabel required>강의 타입</InputLabel>
                    <Select defaultValues={'etc'} {...field}>
                      {sessionTypeOptions.map((item) => (
                        <Option key={item.value} value={item.value}>
                          {item.label}
                        </Option>
                      ))}
                    </Select>

                    {errors.sessions?.[index]?.sessionType && (
                      <FormHelperText error>
                        {errors.sessions?.[index]?.sessionType.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid md={6} xs={12}>
              <Controller
                control={control}
                name={`sessions.${index}.sessionOrder`}
                rules={{ required: '강의 순서를 반드시 입력해주세요.' }}
                render={({ field }) => (
                  <FormControl
                    error={Boolean(errors.sessions?.[index]?.sessionOrder)}
                    fullWidth
                  >
                    <InputLabel required>세션 내 강의 순서</InputLabel>
                    <OutlinedInput {...field} />

                    {errors.sessions?.[index]?.sessionOrder && (
                      <FormHelperText error>
                        {errors.sessions?.[index]?.sessionOrder.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid xs={12}>
              <Controller
                control={control}
                rules={{ required: '강의 제목은 필수 값입니다.' }}
                name={`sessions.${index}.sessionTitle`}
                render={({ field }) => (
                  <FormControl
                    error={Boolean(errors.sessions?.[index]?.sessionGroupTitle)}
                    fullWidth
                  >
                    <InputLabel required>강의 제목</InputLabel>
                    <OutlinedInput {...field} />

                    {errors.sessions?.[index]?.sessionGroupTitle && (
                      <FormHelperText error>
                        {errors.sessions?.[index]?.sessionGroupTitle.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid xs={12}>
              <Controller
                control={control}
                name={`sessions.${index}.sessionSubTitle`}
                render={({ field }) => (
                  <FormControl
                    error={Boolean(errors.sessions?.[index]?.sessionSubTitle)}
                    fullWidth
                  >
                    <InputLabel>강의 부제목</InputLabel>
                    <OutlinedInput {...field} />

                    {errors.sessions?.[index]?.sessionSubTitle && (
                      <FormHelperText error>
                        {errors.sessions?.[index]?.sessionSubTitle.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid xs={12}>
              <Controller
                control={control}
                name={`sessions.${index}.sessionDesc`}
                render={({ field }) => (
                  <FormControl
                    error={Boolean(errors.sessions?.[index]?.sessionDesc)}
                    fullWidth
                  >
                    <InputLabel>강의 설명</InputLabel>
                    <OutlinedInput
                      {...field}
                      multiline
                      placeholder="e.g Leave package at the door"
                      rows={3}
                    />

                    {errors.sessions?.[index]?.sessionDesc && (
                      <FormHelperText error>
                        {errors.sessions?.[index]?.sessionDesc.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid md={6} xs={12}>
              <Controller
                control={control}
                name={`sessions.${index}.sessionStartT`}
                render={({ field }) => (
                  <DateTimePicker
                    placeholder="1995/11/29 오전 09:00"
                    format="YYYY/MM/DD A hh:mm"
                    label="세션 시작 날짜"
                    onChange={(date) => {
                      field.onChange(date ? date.toDate() : null);
                    }}
                    slotProps={{
                      textField: {
                        error: Boolean(errors.sessions?.[index]?.sessionStartT),
                        fullWidth: true,
                        helperText:
                          errors.sessions?.[index]?.sessionStartT?.message,
                      },
                    }}
                    value={dayjs(field.value)}
                  />
                )}
              />
            </Grid>

            <Grid md={6} xs={12}>
              <Controller
                control={control}
                name={`sessions.${index}.sessionEndT`}
                render={({ field }) => (
                  <DateTimePicker
                    placeholder="1995/11/29 오전 10:00"
                    format="YYYY/MM/DD A hh:mm "
                    label="세션 종료 날짜"
                    onChange={(date) => {
                      field.onChange(date ? date.toDate() : null);
                    }}
                    slotProps={{
                      textField: {
                        error: Boolean(errors.sessions?.[index]?.sessionEndT),
                        fullWidth: true,
                        helperText:
                          errors.sessions?.[index]?.sessionEndT?.message,
                      },
                    }}
                    value={dayjs(field.value)}
                  />
                )}
              />
            </Grid>
          </>
        ))}
        <Divider />
        <Stack direction="row" spacing={3}>
          <Button
            type="button"
            variant="contained"
            onClick={() =>
              append({
                sessionIdx: null,
              })
            }
          >
            강의 추가
          </Button>
        </Stack>
      </Grid>
    </Stack>
  );
}

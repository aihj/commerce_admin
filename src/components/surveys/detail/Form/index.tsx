'use client';

import React from 'react';
import type { ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { zodResolver } from '@hookform/resolvers/zod';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Checkbox from '@mui/material/Checkbox';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Option } from '@/components/core/Option';
import { Title } from '@/components/surveys/detail/Title';
import { FileDropzone } from '@/components/core/FileDropzone';
import { dayjs } from '@/lib/dayjs';
import { StyledInputLabel, StyledFormWrapper } from '@/components/core/Form';
import { Button } from '@mui/material';

const schema = zod.object({
  title: zod.string().min(1, 'Name is required').max(255),
  oranization: zod.string().max(255),
  description: zod.string().max(5000),
  image: zod.string().max(255).optional(),
  app: zod.string(),
  userLevel: zod.string(),
  startDate: zod.string(),
  endDate: zod.string(),
  requiredTotalTime: zod.string(),
  temporaryOccupancyTime: zod.string(),
  surveyInfomation: zod.string(),
  //   description: zod.string().max(5000).optional(),
  //   tags: zod.string().max(255).optional(),
});

type Values = zod.infer<typeof schema>;

const defaultValues = {
  title: '',
  oranization: '',
  description: '',
  image: '',
  app: '',
  userLevel: '',
  startDate: '',
  endDate: '',
  requiredTotalTime: '',
  temporaryOccupancyTime: '',
  surveyInfomation: '',
  //   type: 'physical',
  //   tags: '',
} satisfies Values;

const apps = [
  { label: '메디스태프', value: 'medistaff' },
  { label: '베트윈', value: 'vetween' },
];

const Form = (): ReactElement => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = () => {
    alert('submit');
    console.log('onSubmit');
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ py: 2 }}>
        <Title>기본 정보 설정</Title>
      </Box>
      <Card>
        <CardContent>
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <FormControl
                error={Boolean(errors.title)}
                sx={{ flexDirection: 'row', alignItems: 'center', mt: 0 }}
                fullWidth
              >
                <StyledInputLabel required>제목</StyledInputLabel>
                <OutlinedInput sx={{ mt: 0 }} {...field} fullWidth />
                {errors.title ? (
                  <FormHelperText>{errors.title.message}</FormHelperText>
                ) : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="oranization"
            render={({ field }) => (
              <FormControl
                error={Boolean(errors.oranization)}
                sx={{ flexDirection: 'row', alignItems: 'center' }}
                fullWidth
              >
                <StyledInputLabel required>주최/기관</StyledInputLabel>
                {/* TODO list map */}
                <Select fullWidth {...field}>
                  <Option value="physical">Physical</Option>
                  <Option value="digital">Digital</Option>
                  <Option value="service">Service</Option>
                </Select>
                {errors.oranization ? (
                  <FormHelperText error>
                    {errors.oranization.message}
                  </FormHelperText>
                ) : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <FormControl
                error={Boolean(errors.description)}
                sx={{ flexDirection: 'row', alignItems: 'center' }}
                fullWidth
              >
                <StyledInputLabel required>설명</StyledInputLabel>
                <OutlinedInput
                  maxRows={5}
                  minRows={3}
                  multiline
                  placeholder="설문조사에 대한 설명을 적어주세요."
                  fullWidth
                  {...field}
                />
                {errors.description ? (
                  <FormHelperText>{errors.description.message}</FormHelperText>
                ) : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="image"
            render={({ field }) => (
              <FormControl
                error={Boolean(errors.image)}
                sx={{ flexDirection: 'row', alignItems: 'center' }}
                fullWidth
              >
                <StyledInputLabel required>이미지</StyledInputLabel>
                <FileDropzone {...field} />
                {errors.image ? (
                  <FormHelperText>{errors.image.message}</FormHelperText>
                ) : null}
              </FormControl>
            )}
          />
        </CardContent>
      </Card>

      <Box sx={{ py: 2 }}>
        <Title>기능 설정</Title>
      </Box>
      <Card>
        <CardContent>
          <StyledFormWrapper>
            <StyledInputLabel required>노출 앱 설정</StyledInputLabel>
            <RadioGroup defaultValue="medistaff" name="apps" row>
              {apps.map((app) => (
                <FormControlLabel
                  control={<Radio />}
                  key={app.value}
                  label={app.label}
                  value={app.value}
                />
              ))}
            </RadioGroup>
          </StyledFormWrapper>

          <Controller
            control={control}
            name="userLevel"
            render={({ field }) => (
              <StyledFormWrapper>
                <StyledInputLabel required>노출 대상 설정</StyledInputLabel>
                {/* TODO 메디스태프 / 베트윈 나눠서 list map */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <FormControlLabel
                    label="의사"
                    control={<Checkbox {...field} name="DM" checked />}
                  />
                  <FormControlLabel
                    label="의사"
                    control={<Checkbox {...field} name="DM" checked />}
                  />
                  <FormControlLabel
                    label="의사"
                    control={<Checkbox {...field} name="DM" checked />}
                  />
                  <FormControlLabel
                    label="의사"
                    control={<Checkbox {...field} name="DM" checked />}
                  />
                </div>
              </StyledFormWrapper>
            )}
          />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <StyledInputLabel required>설문 기간</StyledInputLabel>
            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <>
                  <DateTimePicker
                    format="YYYY-MM-DD HH:mm"
                    label="시작일"
                    onChange={(date) => {
                      field.onChange(date ? date.toDate() : null);
                    }}
                    sx={{ pr: 1 }}
                    ampm={false}
                    disablePast
                    slotProps={{
                      textField: {
                        error: Boolean(errors.startDate),
                        helperText: errors.startDate?.message,
                      },
                    }}
                    value={dayjs(field.value)}
                  />
                </>
              )}
            />
            <Controller
              control={control}
              name="endDate"
              render={({ field }) => (
                <DateTimePicker
                  format="YYYY-MM-DD HH:mm"
                  label="종료일"
                  onChange={(date) => {
                    field.onChange(date ? date.toDate() : null);
                  }}
                  ampm={false}
                  disablePast
                  slotProps={{
                    textField: {
                      error: Boolean(errors.endDate),
                      helperText: errors.endDate?.message,
                    },
                  }}
                  value={dayjs(field.value)}
                />
              )}
            />
          </div>
          <Controller
            control={control}
            name="requiredTotalTime"
            render={({ field }) => (
              <FormControl
                error={Boolean(errors.requiredTotalTime)}
                sx={{ flexDirection: 'row', alignItems: 'center', mt: 0 }}
                fullWidth
              >
                <StyledInputLabel required>
                  설문 전체 소요 시간
                </StyledInputLabel>
                <OutlinedInput sx={{ mt: 0, width: '80px' }} {...field} />
                &nbsp; 분
                {errors.requiredTotalTime ? (
                  <FormHelperText>
                    {errors.requiredTotalTime.message}
                  </FormHelperText>
                ) : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="temporaryOccupancyTime"
            render={({ field }) => (
              <FormControl
                error={Boolean(errors.temporaryOccupancyTime)}
                sx={{ flexDirection: 'row', alignItems: 'center', mt: 0 }}
                fullWidth
              >
                <StyledInputLabel required>답변 임시저장 시간</StyledInputLabel>
                <OutlinedInput sx={{ mt: 0, width: '80px' }} {...field} />
                &nbsp; 초
                {errors.temporaryOccupancyTime ? (
                  <FormHelperText>
                    {errors.temporaryOccupancyTime.message}
                  </FormHelperText>
                ) : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="surveyInfomation"
            render={({ field }) => (
              <FormControl
                error={Boolean(errors.surveyInfomation)}
                sx={{ flexDirection: 'row', alignItems: 'center' }}
                fullWidth
              >
                <StyledInputLabel required>설문 안내 내용</StyledInputLabel>
                <OutlinedInput
                  maxRows={5}
                  minRows={3}
                  multiline
                  fullWidth
                  placeholder="예시) 설문을 완료해주시면 1MEDIT을 지급해 드립니다. 신중하게 참여해주세요. 설문 시작 후 시간이 지나면 설문은 초기화되니 시간 내 제출해주세요."
                  {...field}
                />
                {errors.surveyInfomation ? (
                  <FormHelperText>
                    {errors.surveyInfomation.message}
                  </FormHelperText>
                ) : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <FormControl
                error={Boolean(errors.title)}
                sx={{ flexDirection: 'row', alignItems: 'center', mt: 0 }}
                fullWidth
              >
                <StyledInputLabel
                  sx={{ minWidth: '120px', fontWeight: 400 }}
                  required
                >
                  설문 안내 시간
                </StyledInputLabel>
                <OutlinedInput sx={{ mt: 0, width: '80px' }} {...field} />
                &nbsp; 초
                {errors.title ? (
                  <FormHelperText>{errors.title.message}</FormHelperText>
                ) : null}
              </FormControl>
            )}
          />

          <div style={{ textAlign: 'center' }}>
            <Button type="submit" variant="contained">
              저장
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export { Form };

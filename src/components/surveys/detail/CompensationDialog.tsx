import React, { useState } from 'react';
import { z as zod } from 'zod';
import {
  Checkbox,
  Dialog,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';
import { Controller, useForm } from 'react-hook-form';
import { StyledFormWrapper, StyledInputLabel } from '@/components/core/Form';
import { Option } from '@/components/core/Option';
import { zodResolver } from '@hookform/resolvers/zod';
import { dayjs } from '@/lib/dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface CompensationDialogProps {
  onClose?: () => void;
  open?: boolean;
}

const schema = zod.object({
  conditionName: zod.string().min(1, '참여 가능 조건을 입력해주세요'),
  condition: zod.string(),
});

type Values = zod.infer<typeof schema>;

const defaultValues = {
  conditionName: '',
  condition: '',
} satisfies Values;

const conditions = [
  { label: '선착순', value: 'medistaff' },
  { label: '모든조건', value: 'vetween' },
  { label: '전체', value: 'vetween' },
];

const CompensationDialog = ({
  onClose,
  open = false,
}: CompensationDialogProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const [birthDateAfterIsNeed, setBirthDateAfterIsNeed] = useState(false);
  const [birthDateBeforeIsNeed, setBirthDateBeforeIsNeed] = useState(false);

  const onSubmit = () => {
    alert('submit');
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      open={open}
      sx={{ ml: 'var(--SideNav-width)' }}
    >
      <Stack
        direction="row"
        spacing={3}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
        }}
      >
        <Typography variant="h6">보상 조건 관리</Typography>
        <IconButton onClick={onClose}>
          <XIcon />
        </IconButton>
      </Stack>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="conditionName"
            render={({ field }) => (
              <FormControl
                error={Boolean(errors.conditionName)}
                sx={{ flexDirection: 'row', alignItems: 'center', mt: 0 }}
                fullWidth
              >
                <StyledInputLabel required>참여 가능 조건</StyledInputLabel>
                <OutlinedInput sx={{ mt: 0 }} {...field} fullWidth />
                {errors.conditionName ? (
                  <FormHelperText
                    sx={{ position: 'absolute', top: '50px', left: '118px' }}
                  >
                    {errors.conditionName.message}
                  </FormHelperText>
                ) : null}
              </FormControl>
            )}
          />

          <StyledFormWrapper>
            <StyledInputLabel required>보상 조건</StyledInputLabel>
            <RadioGroup defaultValue="medistaff" name="conditions" row>
              {conditions.map((condition) => (
                <FormControlLabel
                  control={<Radio />}
                  key={condition.value}
                  label={condition.label}
                  value={condition.value}
                />
              ))}
            </RadioGroup>
          </StyledFormWrapper>

          <Controller
            control={control}
            name="conditionName"
            render={({ field }) => (
              <FormControl
                error={Boolean(errors.conditionName)}
                sx={{ flexDirection: 'row', alignItems: 'center', mt: 0 }}
                fullWidth
              >
                <StyledInputLabel required>총 정원</StyledInputLabel>
                <OutlinedInput sx={{ mt: 0 }} {...field} fullWidth />
                {errors.conditionName ? (
                  <FormHelperText
                    sx={{ position: 'absolute', top: '50px', left: '118px' }}
                  >
                    {errors.conditionName.message}
                  </FormHelperText>
                ) : null}
              </FormControl>
            )}
          />
          <StyledFormWrapper>
            <StyledInputLabel>성별</StyledInputLabel>
            <RadioGroup defaultValue="medistaff" name="conditions" row>
              {conditions.map((condition) => (
                <FormControlLabel
                  control={<Radio />}
                  key={condition.value}
                  label={condition.label}
                  value={condition.value}
                />
              ))}
            </RadioGroup>
          </StyledFormWrapper>

          <Controller
            control={control}
            name="conditionName"
            render={({ field }) => (
              <StyledFormWrapper>
                <StyledInputLabel>회원 유형</StyledInputLabel>
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
          <Controller
            control={control}
            name="conditionName"
            render={({ field }) => (
              <FormControl
                error={Boolean(errors.conditionName)}
                sx={{ flexDirection: 'row', alignItems: 'center' }}
                fullWidth
              >
                <StyledInputLabel>근무 유형</StyledInputLabel>
                {/* TODO list map */}
                <Select fullWidth {...field}>
                  <Option value="physical">Physical</Option>
                  <Option value="digital">Digital</Option>
                  <Option value="service">Service</Option>
                </Select>
                {errors.conditionName ? (
                  <FormHelperText error>
                    {errors.conditionName.message}
                  </FormHelperText>
                ) : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="conditionName"
            render={({ field }) => (
              <FormControl
                error={Boolean(errors.conditionName)}
                sx={{ flexDirection: 'row', alignItems: 'center' }}
                fullWidth
              >
                <StyledInputLabel required>진료과</StyledInputLabel>
                {/* TODO list map */}
                <Select fullWidth {...field}>
                  <Option value="physical">Physical</Option>
                  <Option value="digital">Digital</Option>
                  <Option value="service">Service</Option>
                </Select>
                {errors.conditionName ? (
                  <FormHelperText error>
                    {errors.conditionName.message}
                  </FormHelperText>
                ) : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="conditionName"
            render={({ field }) => (
              <FormControl
                error={Boolean(errors.conditionName)}
                sx={{ flexDirection: 'row', alignItems: 'center', mt: 0 }}
                fullWidth
              >
                <StyledInputLabel required>인당 보상 금액</StyledInputLabel>
                <OutlinedInput sx={{ mt: 0 }} {...field} fullWidth />
                {errors.conditionName ? (
                  <FormHelperText
                    sx={{ position: 'absolute', top: '50px', left: '118px' }}
                  >
                    {errors.conditionName.message}
                  </FormHelperText>
                ) : null}
              </FormControl>
            )}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <StyledInputLabel>생년월일</StyledInputLabel>
            <div>
              <Controller
                control={control}
                name="conditionName"
                render={({ field }) => (
                  <>
                    <DatePicker
                      format="YYYY-MM-DD"
                      label="이후"
                      onChange={(date) => {
                        field.onChange(date ? date.toDate() : null);
                      }}
                      sx={{ pr: 1 }}
                      disabled={birthDateAfterIsNeed}
                      disablePast
                      slotProps={{
                        textField: {
                          error: Boolean(errors.conditionName),
                          helperText: errors.conditionName?.message,
                        },
                      }}
                      value={dayjs(field.value)}
                    />
                  </>
                )}
              />
              <FormControlLabel
                label="해당없음"
                control={
                  <Checkbox
                    name="DM"
                    checked={birthDateAfterIsNeed}
                    onChange={() =>
                      setBirthDateAfterIsNeed(!birthDateAfterIsNeed)
                    }
                  />
                }
              />
            </div>
            <div>
              <Controller
                control={control}
                name="conditionName"
                render={({ field }) => (
                  <DatePicker
                    format="YYYY-MM-DD"
                    label="이전"
                    onChange={(date) => {
                      field.onChange(date ? date.toDate() : null);
                    }}
                    disabled={birthDateBeforeIsNeed}
                    disablePast
                    slotProps={{
                      textField: {
                        error: Boolean(errors.conditionName),
                        helperText: errors.conditionName?.message,
                      },
                    }}
                    value={dayjs(field.value)}
                  />
                )}
              />
              <FormControlLabel
                label="해당없음"
                control={
                  <Checkbox
                    name="DM"
                    checked={birthDateBeforeIsNeed}
                    onChange={() =>
                      setBirthDateBeforeIsNeed(!birthDateBeforeIsNeed)
                    }
                  />
                }
              />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <StyledInputLabel>가입일자</StyledInputLabel>
            <div>
              <Controller
                control={control}
                name="conditionName"
                render={({ field }) => (
                  <>
                    <DatePicker
                      format="YYYY-MM-DD"
                      label="이후"
                      onChange={(date) => {
                        field.onChange(date ? date.toDate() : null);
                      }}
                      sx={{ pr: 1 }}
                      disabled={birthDateAfterIsNeed}
                      disablePast
                      slotProps={{
                        textField: {
                          error: Boolean(errors.conditionName),
                          helperText: errors.conditionName?.message,
                        },
                      }}
                      value={dayjs(field.value)}
                    />
                  </>
                )}
              />
              <FormControlLabel
                label="해당없음"
                control={
                  <Checkbox
                    name="DM"
                    checked={birthDateAfterIsNeed}
                    onChange={() =>
                      setBirthDateAfterIsNeed(!birthDateAfterIsNeed)
                    }
                  />
                }
              />
            </div>
            <div>
              <Controller
                control={control}
                name="conditionName"
                render={({ field }) => (
                  <DatePicker
                    format="YYYY-MM-DD"
                    label="이전"
                    onChange={(date) => {
                      field.onChange(date ? date.toDate() : null);
                    }}
                    disabled={birthDateBeforeIsNeed}
                    disablePast
                    slotProps={{
                      textField: {
                        error: Boolean(errors.conditionName),
                        helperText: errors.conditionName?.message,
                      },
                    }}
                    value={dayjs(field.value)}
                  />
                )}
              />
              <FormControlLabel
                label="해당없음"
                control={
                  <Checkbox
                    name="DM"
                    checked={birthDateBeforeIsNeed}
                    onChange={() =>
                      setBirthDateBeforeIsNeed(!birthDateBeforeIsNeed)
                    }
                  />
                }
              />
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { CompensationDialog };

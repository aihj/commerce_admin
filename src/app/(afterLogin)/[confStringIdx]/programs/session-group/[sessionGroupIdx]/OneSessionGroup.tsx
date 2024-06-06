import { useParams } from 'next/navigation';
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Controller, FieldErrors, UseFormRegister } from 'react-hook-form';
import { Option } from '@/components/core/Option';
import { dayjs } from '@/lib/dayjs';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useMemo } from 'react';
import { Category, SessionGroup } from '@/types/type';

type SessionGroupFormTypes = {
  index: number | null;
  item?: any;
  register: UseFormRegister<any>;
  remove: () => void;
  errors: FieldErrors;
  programData: {
    categories?: Category[];
    sessionGroup?: SessionGroup;
  };
  control: any;
};

// 하나의 세션 그룹에 대한 Form
export default function OneSessionGroup({
  register,
  control,
  errors,
  programData,
}: SessionGroupFormTypes) {
  // window.programData = programData;
  const { sessionGroupIdx } = useParams();
  const sessionGroupTypeOptions = useMemo(
    () => [
      { value: 'lecture', label: '강의' },
      { value: 'discussion', label: '논의' },
      { value: 'etc', label: '기타' },
    ],
    []
  );

  return (
    <Stack spacing={3}>
      {/*<DevTool control={control} />*/}
      <Typography color="primary" variant="h6">
        세션 상세
      </Typography>

      <Grid container rowSpacing={1} columnSpacing={3}>
        <Grid xs={12}>
          <Stack
            direction="row"
            spacing={10}
            sx={{
              alignItems: 'center',
              // , justifyContent: 'center'
            }}
          >
            <input type="hidden" {...register(sessionGroupIdx)} />
            <Typography color="" variant="h7">
              세션
            </Typography>
            <Button
              color="error"
              variant="contained"
              type="button"
              onClick={() => {
                // TODO : 해당 버튼 클릭시 세션 한개 삭제
              }}
            >
              세션 삭제
            </Button>
          </Stack>
        </Grid>

        <Grid md={6} xs={12}>
          <Controller
            defaultValue={programData.sessionGroup.sessionGroupIdx}
            control={control}
            name={'sessionCategoryIdx'}
            rules={{ required: '카테고리를 반드시 선택해주세요.' }}
            render={({ field }) => (
              <FormControl error={Boolean(errors.sessionCategoryIdx)} fullWidth>
                <InputLabel required>카테고리</InputLabel>
                <Select {...field}>
                  {programData?.categories?.map((oneDepthItem) => (
                    <Option
                      key={oneDepthItem['sessionCategoryIdx']}
                      value={oneDepthItem['sessionCategoryIdx']}
                    >
                      {oneDepthItem['sessionCategoryDate']} :{' '}
                      {oneDepthItem['sessionCategoryTitle']}
                    </Option>
                  ))}
                </Select>

                {errors.sessionCategoryIdx && (
                  <FormHelperText error>
                    {errors.sessionCategoryIdx?.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        <Grid md={6} xs={12}>
          <Controller
            control={control}
            name={'sessionGroupOrder'}
            render={({ field }) => (
              <FormControl error={Boolean(errors.sessionGroupOrder)} fullWidth>
                <InputLabel required>카테고리 내 세션 순서</InputLabel>
                <OutlinedInput {...field} />

                {errors.sessionGroupOrder && (
                  <FormHelperText error>
                    {errors.sessionGroupOrder.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        <Grid md={6} xs={12}>
          <Controller
            defaultValue={programData.sessionGroup.sessionGroupType}
            control={control}
            rules={{ required: '세션 타입은 필수 값입니다.' }}
            name={'sessionGroupType'}
            render={({ field }) => (
              <FormControl error={Boolean(errors.sessionGroupType)} fullWidth>
                <InputLabel required>세션 타입</InputLabel>
                <Select defaultValues={'etc'} {...field}>
                  {sessionGroupTypeOptions.map((item) => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>

                {errors.sessionGroupType && (
                  <FormHelperText error>
                    {errors.sessionGroupOrder.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        <Grid md={6} xs={12}>
          장소 선택
        </Grid>
        {/*장소 선택 Select */}
        {/*// TODO : index가 없을때에도 장소 선택할 수 있게 해줘야함*/}

        <Grid xs={12}>
          <Controller
            control={control}
            rules={{ required: '세션 제목은 필수 값입니다.' }}
            name={'sessionGroupTitle'}
            render={({ field }) => (
              <FormControl error={Boolean(errors.sessionGroupTitle)} fullWidth>
                <InputLabel required>세션 제목</InputLabel>
                <OutlinedInput {...field} />

                {errors.sessionGroupTitle && (
                  <FormHelperText error>
                    {errors.sessionGroupTitle.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        <Grid xs={12}>
          <Controller
            control={control}
            name={'sessionGroupubtitle'}
            render={({ field }) => (
              <FormControl
                error={Boolean(errors.sessionGroupubtitle)}
                fullWidth
              >
                <InputLabel>세션 부제목</InputLabel>
                <OutlinedInput {...field} />

                {errors.sessionGroupubtitle && (
                  <FormHelperText error>
                    {errors.sessionGroupubtitle.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        <Grid xs={12}>
          <Controller
            control={control}
            name={'sessionGroupDesc'}
            render={({ field }) => (
              <FormControl error={Boolean(errors.sessionGroupDesc)} fullWidth>
                <InputLabel>세션 설명</InputLabel>
                <OutlinedInput
                  {...field}
                  multiline
                  placeholder="e.g Leave package at the door"
                  rows={3}
                />

                {errors.sessionGroupDesc && (
                  <FormHelperText error>
                    {errors.sessionGroupDesc.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        <Grid md={6} xs={12}>
          <Controller
            control={control}
            name={'sessionGroupStartT'}
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
                    error: Boolean(errors.sessionGroupStartT),
                    fullWidth: true,
                    helperText: errors.sessionGroupStartT?.message,
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
            name={'sessionGroupEndT'}
            render={({ field }) => (
              <DateTimePicker
                placeholder="1995/11/29 오전 10:00"
                format="YYYY/MM/DD A hh:mm "
                label="세션 시작 날짜"
                onChange={(date) => {
                  field.onChange(date ? date.toDate() : null);
                }}
                slotProps={{
                  textField: {
                    error: Boolean(errors.sessionGroupEndT),
                    fullWidth: true,
                    helperText: errors.sessionGroupEndT?.message,
                  },
                }}
                value={dayjs(field.value)}
              />
            )}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}

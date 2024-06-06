import { useParams } from 'next/navigation';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Select,
  Stack,
} from '@mui/material';
import { fieldArrayRemove } from '@/utils/formFuntions';
import { Controller, FieldErrors, UseFormRegister } from 'react-hook-form';
import { Option } from '@/components/core/Option';
import ProgramLocationSelect from '@/components/program/ProgramLocationSelect';
import { dayjs } from '@/lib/dayjs';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useMemo } from 'react';

type SessionGroupFormTypes = {
  index: number | null;
  item?: any;
  register: UseFormRegister<any>;
  remove: () => void;
  errors: FieldErrors;
  programData: {
    files?: any[];
    categories?: any[];
    sessionGroups?: any[];
    sessions?: any[];
  };
  control: any;
};

// 하나의 세션 그룹에 대한 Form
export default function SessionGroupItem({
  index,
  item,
  register,
  remove,
  control,
  errors,
  programData,
}: SessionGroupFormTypes) {
  // window.programData = programData;
  const { confStringIdx } = useParams();
  const sessionGroupTypeOptions = useMemo(
    () => [
      { value: 'lecture', label: '강의' },
      { value: 'discussion', label: '논의' },
      { value: 'etc', label: '기타' },
    ],
    []
  );

  return (
    <>
      <input
        type="hidden"
        {...register(`sessionGroups.${index}.sessionGroupIdx`)}
      />
      <Box
        display="flex"
        sx={{
          alignItems: 'center',
          flexDirection: { xs: 'column', md: 'row' },
          '& > *': {
            // 모든 자식 요소에 대한 스타일 지정
            mx: 1, // 가로 여백을 설정하여 요소들 사이의 간격 조절
            my: { xs: 1, md: 0 }, // 모바일과 태블릿에서는 세로 간격을 설정하고, 그 이상의 크기에서는 세로 간격을 0으로 설정하여 수평 정렬
          },
        }}
      >
        <InputLabel required>세션 {index !== null ? index + 1 : ''}</InputLabel>
        <Button
          color="error"
          variant="contained"
          type="button"
          onClick={() => {
            fieldArrayRemove(
              remove,
              index,
              confStringIdx,
              'sessionGroup',
              item['sessionGroupIdx']
            );
          }}
        >
          세션 삭제
        </Button>
      </Box>

      {/* TODO: 안의 input의 크기가 증가하지 않는 이유를 정말 모르겠어...*/}
      {/*<Grid xs={12}>*/}
      <Stack>
        <Grid md={6} xs={12}>
          <Controller
            control={control}
            name={`sessionGroups.${index}.sessionCategoryIdx`}
            rules={{ required: '카테고리를 반드시 선택해주세요.' }}
            render={({ field }) => (
              <FormControl
                error={Boolean(
                  errors.sessionGroups?.[index]?.sessionCategoryIdx
                )}
                fullWidth
              >
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
                {errors.sessionGroups?.[index]?.sessionCategoryIdx && (
                  <FormHelperText error>
                    {errors.sessionGroups?.[index]?.sessionCategoryIdx?.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>
        <Grid md={6} xs={12}>
          <Controller
            control={control}
            name={`sessionGroups.${index}.sessionGroupOrder`}
            render={({ field }) => (
              <FormControl
                error={Boolean(
                  errors.sessionGroups?.[index]?.sessionGroupOrder
                )}
                fullWidth
              >
                <InputLabel required>카테고리 내 세션 순서</InputLabel>
                <OutlinedInput {...field} />

                {errors.sessionGroups?.[index]?.sessionGroupOrder && (
                  <FormHelperText error>
                    {errors.sessionGroups?.[index]?.sessionGroupOrder?.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>
        <>
          <Grid md={6} xs={12}>
            <Controller
              control={control}
              rules={{ required: '세션 타입은 필수 값입니다.' }}
              name={`sessionGroups.${index}.sessionGroupType`}
              render={({ field }) => (
                <FormControl
                  error={Boolean(
                    errors.sessionGroups?.[index]?.sessionGroupType
                  )}
                  fullWidth
                >
                  <InputLabel required>세션 타입</InputLabel>
                  <Select defaultValues={'etc'} {...field}>
                    {sessionGroupTypeOptions.map((item) => (
                      <Option key={item.value} value={item.value}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>

                  {errors.sessionGroups?.[index]?.sessionGroupType && (
                    <FormHelperText error>
                      {errors.sessionGroups?.[index]?.sessionGroupType?.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
          <Grid md={6} xs={12}></Grid>
        </>
        {/*장소 선택 Select */}
        (
        <ProgramLocationSelect
          control={control}
          filedName="sessionGroups"
          index={index}
          // item={item}
          errors={errors}
        />
        )
        <Controller
          control={control}
          rules={{ required: '세션 제목은 필수 값입니다.' }}
          name={`sessionGroups.${index}.sessionGroupTitle`}
          render={({ field }) => (
            <FormControl
              error={Boolean(errors.sessionGroups?.[index]?.sessionGroupTitle)}
            >
              <InputLabel required>세션 제목</InputLabel>
              <OutlinedInput {...field} />

              {errors.sessionGroups?.[index]?.sessionGroupTitle && (
                <FormHelperText error>
                  {errors.sessionGroups?.[index]?.sessionGroupTitle?.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name={`sessionGroups.${index}.sessionGroupSubtitle`}
          render={({ field }) => (
            <FormControl
              error={Boolean(
                errors.sessionGroups?.[index]?.sessionGroupSubtitle
              )}
            >
              <InputLabel>세션 부제목</InputLabel>
              <OutlinedInput {...field} />
              {errors.sessionGroups?.[index]?.sessionGroupSubtitle && (
                <FormHelperText error>
                  {errors.sessionGroups?.[index]?.sessionGroupSubtitle?.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name={`sessionGroups.${index}.sessionGroupDesc`}
          render={({ field }) => (
            <FormControl
              error={Boolean(errors.sessionGroups?.[index]?.sessionGroupDesc)}
              fullWidth
            >
              <InputLabel>세션 설명</InputLabel>
              <OutlinedInput
                {...field}
                multiline
                placeholder="e.g Leave package at the door"
                rows={3}
              />
              {errors.sessionGroups?.[index]?.sessionGroupDesc && (
                <FormHelperText error>
                  {errors.sessionGroups?.[index]?.sessionGroupDesc?.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
        <Grid md={6} xs={12}>
          <Controller
            control={control}
            name={`sessionGroups.${index}.sessionGroupStartT`}
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
                    error: Boolean(
                      errors.sessionGroups?.[index]?.sessionGroupStartT
                    ),
                    fullWidth: true,
                    helperText:
                      errors.sessionGroups?.[index]?.sessionGroupStartT
                        ?.message,
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
            name={`sessionGroups.${index}.sessionGroupEndT`}
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
                    error: Boolean(
                      errors.sessionGroups?.[index]?.sessionGroupEndT
                    ),
                    fullWidth: true,
                    helperText:
                      errors.sessionGroups?.[index]?.sessionGroupEndT.message,
                  },
                }}
                value={dayjs(field.value)}
              />
            )}
          />
        </Grid>
      </Stack>
      {/*
                  TODO: 연자 합치기
                  <A_FacultyConnectionSelect
                    cl="inner_container one_depth"
                    relatedType="sessionGroup" relatedIdx={item["sessionGroupIdx"]}
                    facultyProgramData={_programData?.sessionGroups[index]?.sessionGroupFaculties || []}
                    register={register} control={control} errors={errors} trigger={trigger}
                  />*/}
      {/*</Grid>*/}
    </>
  );
}

'use client';

import RouterLink from 'next/link';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { useEffect, useState } from 'react';
import { produce } from 'immer';
import Swal from 'sweetalert2';

import { PATH } from '@/paths';
import { updateProgramCategory } from '@/api/programApi';
import { formatDatePickerInList, isDate } from '@/utils/dateFunctions';
import { fieldArrayRemove } from '@/utils/formFuntions';
import { useParams } from 'next/navigation';
import { dayjs } from '@/lib/dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { DevTool } from '@hookform/devtools';

export type CategoryListFormTypes = {
  programData: {
    files: any[];
    categories: any[];
    sessionGroups: any[];
    sessions: any[];
  };
  refetch: () => void;
};

interface FormData {
  confStringIdx: string;
  sessionCategories?: SessionCategory[];
}

interface SessionCategory {
  sessionCategoryIdx?: number;
  sessionCategoryTitle?: string;
  sessionCategoryDate?: string;
}
export default function CategoryListForm({
  programData,
  refetch,
}: CategoryListFormTypes) {
  // logger.debug('programData?.categories', programData?.categories);
  const { confStringIdx } = useParams();
  // region *********************** FORM 데이터 ***********************
  const [isLoading, setLoading] = useState<boolean>(false);

  // TODO : 이거 없어도 될거같은데 정상작동 확인하면 삭제하기
  // const {mutate} = useMutation(getCAndSGAndFacultiesByConfId);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { confStringIdx: confStringIdx },
  });
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: 'sessionCategories',
  });

  useEffect(() => {
    programData?.categories?.forEach((item, index) => {
      const dataToAppend: any = {};
      Object.keys(item).forEach((key) => {
        if (item[key] !== null) {
          if (isDate(item[key])) dataToAppend[key] = new Date(item[key]);
          else dataToAppend[key] = item[key];
        }
      });
      update(index, dataToAppend);
    });
  }, [programData?.categories, update]);
  // endregion *********************** FORM 데이터  ***********************
  // sessionCategoryDate -> 2024-04-17T07:59:43.000Z
  // region ***************************DB 세션 카테고리 작업 ************************************
  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log('onSubmit data : ', data);
    setLoading(true);
    const newData = produce(data, (draft) => {
      draft.sessionCategories = formatDatePickerInList(
        data.sessionCategories,
        'sessionCategoryDate'
      );
    });
    console.log('onSubmit newData : ', newData);
    updateProgramCategory(newData)
      .then((result) => {
        refetch();
        Swal.fire({
          icon: 'success',
          text: result.data.message,
        });
      })
      .catch((result) => {
        console.log(result);
        Swal.fire({
          icon: 'error',
          text: result.response
            ? result.response.data.message
            : '현재 서버에 문제가 있습니다. 관리자에게 문의해주세요.',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  // endregion **************************DB 세션 카테고리 작업 ************************************

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DevTool control={control} />
      <Card>
        <CardContent>
          <Stack divider={<Divider />} spacing={3}>
            <Stack>
              {/* 아래부터 CreateForm 내부 콘텐츠 */}
              <Typography color="primary" variant="h6">
                카테고리 입력
              </Typography>

              {fields.map((item, index: number) => (
                <Box key={index}>
                  <Divider />
                  <input
                    type="hidden"
                    {...register(
                      `sessionCategories.${index}.sessionCategoryIdx`
                    )}
                    defaultValue={item['sessionCategoryIdx']}
                  />
                  <Box
                    display="flex"
                    sx={{
                      alignItems: 'center',
                      // justifyContent: 'center',
                      flexDirection: { xs: 'column', md: 'row' },
                      '& > *': {
                        // 모든 자식 요소에 대한 스타일 지정
                        mx: 1, // 가로 여백을 설정하여 요소들 사이의 간격 조절
                        my: { xs: 1, md: 0 }, // 모바일과 태블릿에서는 세로 간격을 설정하고, 그 이상의 크기에서는 세로 간격을 0으로 설정하여 수평 정렬
                      },
                    }}
                  >
                    <InputLabel color={'info'} variant={'filled'}>
                      카테고리 {index + 1}
                    </InputLabel>
                    <Button
                      color="error"
                      variant="contained"
                      type="button"
                      onClick={() =>
                        // TODO : 추후에 test2024 이거 변경 반드시 해야함
                        fieldArrayRemove(
                          remove,
                          index,
                          params.confStringIdx,
                          'category',
                          item['sessionCategoryIdx']
                        )
                      }
                    >
                      Category {index + 1} 삭제
                    </Button>
                  </Box>

                  <Controller
                    control={control}
                    name={`sessionCategories.${index}.sessionCategoryTitle`}
                    rules={{ required: '카테고리 이름은 필수 값입니다.' }}
                    render={({ field }) => (
                      <FormControl
                        error={Boolean(
                          errors.sessionCategories?.[index]
                            ?.sessionCategoryTitle
                        )}
                        fullWidth
                      >
                        <InputLabel required>카테고리 이름</InputLabel>
                        <Box
                          display="flex"
                          sx={{
                            flexDirection: { xs: 'column', md: 'row' },
                            '& > *': {
                              marginRight: '1px',
                              // 모든 자식 요소에 대한 스타일 지정
                              // mx: 1, // 가로 여백을 설정하여 요소들 사이의 간격 조절
                              my: { xs: 1, md: 0 }, // 모바일과 태블릿에서는 세로 간격을 설정하고, 그 이상의 크기에서는 세로 간격을 0으로 설정하여 수평 정렬
                            },
                          }}
                        >
                          <OutlinedInput {...field} style={{ flexGrow: 1 }} />
                        </Box>
                        {errors.sessionCategories?.[index]
                          ?.sessionCategoryTitle ? (
                          <FormHelperText error>
                            {
                              errors.sessionCategories?.[index]
                                ?.sessionCategoryTitle?.message
                            }
                          </FormHelperText>
                        ) : null}
                      </FormControl>
                    )}
                  />
                  <Controller
                    control={control}
                    name={`sessionCategories.${index}.sessionCategoryDate`}
                    rules={{ required: '카테고리 날짜는 필수 값입니다.' }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        format="YYYY/MM/DD"
                        label="카테고리 날짜 *"
                        onChange={(date) => {
                          console.log('<CategoryListForm> date', date);
                          field.onChange(date?.toDate());
                        }}
                        value={dayjs(field.value)}
                        slotProps={{
                          textField: {
                            error: Boolean(
                              errors.sessionCategories?.[index]
                                ?.sessionCategoryDate
                            ),
                            fullWidth: true,
                            helperText:
                              errors.sessionCategories?.[index]
                                ?.sessionCategoryDate?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Box>
              ))}
            </Stack>
          </Stack>
        </CardContent>

        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="secondary"
            component={RouterLink}
            href={PATH.EACH.PROGRAM.LIST(confStringIdx)}
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            type="button"
            variant="contained"
            // TODO : undefined 해도 되나 확인 안되면 null로 변경 필요
            onClick={() =>
              append({
                sessionCategoryIdx: undefined,
                sessionCategoryTitle: undefined,
                sessionCategoryDate: undefined,
              })
            }
          >
            카테고리 추가
          </Button>
          <Button type="submit" variant="contained">
            저장하기
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}

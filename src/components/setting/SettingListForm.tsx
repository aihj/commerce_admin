import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Pco } from '@/redux/slices/pcoSlice';
import { useAppSelector } from '@/redux/hooks';
import Box from '@mui/material/Box';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getSettings, processConferenceSettings } from '@/api/conferenceApi';
import Swal from 'sweetalert2';
import { isDate } from '@/utils/dateFunctions';
import { SettingVo } from '@/api/types/setting';

type HtmlEditorListFormProps = NonNullable<unknown>;

interface FormData {
  conferenceIdx: number;
  settings: {
    sessionCategoryIdx?: number | undefined;
    sessionCategoryTitle?: string;
    sessionCategoryDate?: string;
  };
}

// eslint-disable-next-line no-empty-pattern
const SettingListForm = ({}: HtmlEditorListFormProps) => {
  const pco: Pco = useAppSelector((state) => state.pco);
  // region *********************** FORM 데이터 **************************
  const [isPending, setIsPending] = useState<boolean>(false);

  const {
    handleSubmit,
    control,
    // formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      conferenceIdx: pco.conferenceIdx as number,
    },
  });

  const { fields, append, update } = useFieldArray({
    control,
    name: 'settings',
  });
  // endregion *********************** FORM 데이터 ***********************

  // region *********************** 수정 데이터 가져오기 **************************
  const {
    // isLoading:getShortcutsLoading,
    // error:getShortcutsLoadingError,
    data: settingData,
  } = useQuery({
    queryKey: ['setting', pco.conferenceIdx],
    queryFn: () => getSettings(pco.conferenceIdx as number),
    enabled: !!pco.conferenceIdx,
  });

  useEffect(() => {
    settingData?.forEach((item, index) => {
      const dataToAppend: any = {};
      Object.keys(item).forEach((key) => {
        if (item[key] !== null) {
          if (isDate(item[key])) dataToAppend[key] = new Date(item[key]);
          else dataToAppend[key] = item[key];
        }
      });
      update(index, dataToAppend);
    });
  }, [settingData, update]);
  // endregion *********************** 수정 데이터 가져오기 ***********************
  const onSubmit = (data: FormData) => {
    setIsPending(true);
    mutation.mutate(data);
  };

  const mutation = useMutation<SettingVo[]>({
    mutationFn: (data) => processConferenceSettings(data),
    onSuccess: () => {},
    onError: (result) => {
      Swal.fire({
        icon: 'error',
        text: result.response
          ? result.response.data.message
          : '현재 서버에 문제가 있습니다. 관리자에게 문의해주세요.',
      });
    },
    onSettled: () => {
      setIsPending(false);
    },
  });

  // -------------------------------------------------------
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/*<DevTool control={control} />*/}
      <Card>
        <CardContent>
          <Stack divider={<Divider />} spacing={3}>
            <Stack>
              {/* 아래부터 CreateForm 내부 콘텐츠 */}
              <Typography color="primary" variant="h6">
                Html Editor 입력
              </Typography>
              {fields.map((item, index: number) => (
                <Box key={index}></Box>
              ))}
            </Stack>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button
            disabled={isPending}
            type="button"
            variant="contained"
            onClick={() =>
              append({
                sessionCategoryIdx: undefined,
              })
            }
          >
            Html Editor 추가
          </Button>
          <Button type="submit" variant="contained">
            저장하기
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

export { SettingListForm };

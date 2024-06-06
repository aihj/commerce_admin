import { DevTool } from '@hookform/devtools';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import RouterLink from 'next/link';
import { PATH } from '@/paths';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Pco } from '@/redux/slice/pcoSlice';
import { useAppSelector } from '@/redux/hooks';
import Box from '@mui/material/Box';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSettings } from '@/api/conferenceApi';
import Swal from 'sweetalert2';
type HtmlEditorListFormProps = {};

interface FormData {
  conferenceIdx: number;
}

const SettingListForm = ({}: HtmlEditorListFormProps) => {
  const pco: Pco = useAppSelector((state) => state.pco);
  // region *********************** FORM 데이터 **************************
  const [isPending, setIsPending] = useState<boolean>(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { conferenceIdx: pco.conferenceIdx },
  });
  const { fields, append, remove } = useFieldArray({
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
    if (
      !!settingData &&
      settingData.length !== 0 &&
      settingData.length !== fields.length
    ) {
      for (const item of settingData) {
        const dataToAppend = {};

        // 모든 속성을 dataToAppend 객체에 추가
        for (const key in item) {
          if (item.hasOwnProperty(key)) {
            dataToAppend[key] = item[key];
          }
        }
        append(dataToAppend);
      }
    }
  }, [settingData]);
  // endregion *********************** 수정 데이터 가져오기 ***********************
  const onSubmit = (data: FormData) => {
    setIsPending(true);
    mutation.mutate(data);
  };
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (data) => adminApi.processConferenceSettings(data),
    {
      onSuccess: (result) => {
        Swal.fire({
          icon: result.status === 200 ? 'success' : 'error',
          text: result.data.message,
        }).then((result) => {
          mutate(confStringIdx);
        });
      },
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
    }
  );

  // -------------------------------------------------------
  return (
    <form
    // onSubmit={handleSubmit(onSubmit)}
    >
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
                sessionCategoryTitle: undefined,
                sessionCategoryDate: undefined,
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

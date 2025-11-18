import { useFieldArray, useForm } from 'react-hook-form';
import RouterLink from 'next/link';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { PATH } from '@/paths';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { updateProgramSessionGroup } from '@/api/programApi';
import { produce } from 'immer';
import { formatDatePickerTimeInList, isDate } from '@/utils/dateFunctions';
import { useParams } from 'next/navigation';
import { DevTool } from '@hookform/devtools';
import { logger } from '@/lib/logger/defaultLogger';
import SessionGroupItem from '@/app/(afterLogin)/[confStringIdx]/programs/form/SessionGroupItem';

type SessionGroupListFormTypes = {
  programData: {
    files: any[];
    categories: any[];
    sessionGroups: any[];
    sessions: any[];
  };
  // refetch?: () => void;
};

export default function SessionGroupListForm({
  programData,
  // refetch,
}: SessionGroupListFormTypes) {
  const params = useParams();
  const [isLoading, setLoading] = useState<boolean>(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      confStringIdx: params?.confStringIdx,
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'sessionGroups',
  });
  useEffect(() => {
    // if (
    //   !!programData?.sessionGroups &&
    //   programData?.sessionGroups.length !== 0 &&
    //   programData?.sessionGroups.length !== fields.length
    // ) {
    programData?.sessionGroups?.forEach((item, index) => {
      const dataToAppend = {};
      Object.keys(item).forEach((key) => {
        if (item[key] !== null) {
          if (isDate(item[key])) dataToAppend[key] = new Date(item[key]);
          else dataToAppend[key] = item[key];
        }
      });
      update(index, dataToAppend);
    });
    // }
  }, [programData?.sessionGroups, update]);
  const onSubmit = (data) => {
    setLoading(true);
    const newData = produce(data, (draft) => {
      draft.sessionGroups = formatDatePickerTimeInList(
        data.sessionGroups,
        'sessionGroupStartT',
        'sessionGroupEndT'
      );
    });
    // console.log(newData);
    updateProgramSessionGroup(newData)
      .then((result) => {
        Swal.fire({
          icon: 'success',
          text: result.data.message,
          confirmButtonText: 'OK',
        }).then((result) => {
          // TODO : 정보 업데이트 필요
          logger.debug('result', result);
          // mutate(_confData.conferenceIdx)
        });
      })
      .catch((result) => {
        Swal.fire({
          icon: 'error',
          text: result.response
            ? result.response.data.content
            : '현재 서버에 문제가 있습니다. 관리자에게 문의해주세요.',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // ------------------------------------------------------

  if (!programData?.categories || programData?.categories.length === 0) {
    return <div>카테고리 먼저 생성해주세요.</div>;
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DevTool control={control} /> {/* set up the dev tool */}
      <Card>
        <CardContent>
          <Stack divider={<Divider />} spacing={3}>
            <Stack>
              {/* 아래부터 CreateForm 내부 콘텐츠 */}
              <Typography color="primary" variant="h6">
                세션 입력
              </Typography>

              {fields.map((item, index) => (
                <div key={index}>
                  <SessionGroupItem
                    index={index}
                    item={item}
                    register={register}
                    remove={remove}
                    control={control}
                    errors={errors}
                    programData={programData}
                  />
                </div>
              ))}
            </Stack>
          </Stack>
        </CardContent>

        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button
            color="secondary"
            component={RouterLink}
            href={PATH.EACH.PROGRAM.LIST(params?.confStringIdx)}
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            type="button"
            variant="contained"
            onClick={() =>
              append({
                sessionGroupIdx: null,
                sessionGroupTitle: null,
                sessionGroupStartT: null,
                sessionGroupEndT: null,
              })
            }
          >
            세션 추가
          </Button>
          <Button type="submit" variant="contained">
            저장하기
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}

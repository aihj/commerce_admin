'use client';

import { PATH } from '@/paths';
import OneSessionGroup from '@/app/(afterLogin)/[confStringIdx]/programs/session-group/[sessionGroupIdx]/OneSessionGroup';
import SessionListForm from '@/components/program/SessionListForm';
import Swal from 'sweetalert2';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { produce } from 'immer';
import {
  getSessionGroupDetail,
  updateSessionGroupDetail,
} from '@/api/programApi';
import { formatDatePickerTimeInList, isDate } from '@/utils/dateFunctions';
import dayjs from 'dayjs';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Stack,
} from '@mui/material';
import FormLayout from '@/components/core/form/FormLayout';
import { Category, Session } from '@/types/type';

type SessionGroupDetailTypeProps = {
  params: {
    confStringIdx: string;
    sessionGroupIdx: number;
  };
};

interface FormData {
  confStringIdx: string;
  sessionGroupStartT?: string;
  sessionGroupEndT?: string;
  sessionStartT?: string;
  sessionEndT?: string;
  sessionGroupIdx: number;
  sessions?: Session[];
}

interface SessionGroupDetailData {
  categories: Category[];
  sessionGroups: {
    [key: string]: sessionGroup;
    sessions?: Session[];
  };
}

export default function SessionGroupDetail({
  params,
}: SessionGroupDetailTypeProps) {
  // region ***************************** POST: 카테고리 데이터 요청하기 ********************************
  const {
    isLoading: isQueryLoading,
    error: sessionGroupDetailError,
    data: sessionGroupDetailData,
  } = useQuery<SessionGroupDetailData>({
    queryKey: ['sessionGroupDetail', params.sessionGroupIdx],
    queryFn: () =>
      getSessionGroupDetail(params.confStringIdx, params.sessionGroupIdx).then(
        (res) => res.data.content
      ),
  });

  window.sessionGroupDetailData = sessionGroupDetailData;
  // endregion ***************************** POST: 데이터 요청하기 *****************************

  // region *********************** FORM 데이터 ***********************
  const [submitLoading, setSubmitLoading] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      sessionGroupIdx: params.sessionGroupIdx,
    },
  });

  const applyModifyDataToForm = useCallback(
    (data) => {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          if (isDate(data[key])) {
            setValue(key, new Date(data[key]));
          } else {
            setValue(key, data[key]);
          }
        }
      }
    },
    [setValue]
  );

  // const [count, setCount] = useState(0);
  const { append, update } = useFieldArray({
    control,
    name: 'sessions',
  });

  useEffect(() => {
    if (sessionGroupDetailData?.sessionGroups) {
      applyModifyDataToForm(sessionGroupDetailData.sessionGroups);
    }
  }, [applyModifyDataToForm, sessionGroupDetailData?.sessionGroups]);

  useEffect(() => {
    sessionGroupDetailData?.sessionGroups.sessions.forEach((item, index) => {
      const dataToAppend: any = {};
      Object.keys(item).forEach((key) => {
        if (item[key] !== null) {
          if (isDate(item[key])) dataToAppend[key] = new Date(item[key]);
          else dataToAppend[key] = item[key];
        }
      });
      update(index, dataToAppend);
    });
  }, [sessionGroupDetailData?.sessionGroups.sessions, update]);
  // endregion *********************** FORM 데이터 ***********************

  // region *********************** 데이터 제출 **************************

  const onSubmit: SubmitHandler<FormData> = (data) => {
    setSubmitLoading(true);

    // 데이터 가공
    const newData = produce(data, (draft) => {
      draft.sessionGroupStartT =
        data.sessionGroupStartT &&
        dayjs(data.sessionGroupStartT).format('YYYY-MM-DD HH:mm:ss');
      draft.sessionGroupEndT =
        data.sessionGroupStartT &&
        dayjs(data.sessionGroupStartT).format('YYYY-MM-DD HH:mm:ss');
      draft.sessions = formatDatePickerTimeInList(
        data.sessions,
        'sessionStartT',
        'sessionEndT'
      );
    });
    console.log(newData);
    updateSessionGroupDetail(newData)
      .then((result) => {
        Swal.fire({
          icon: result.data.message,
          text: result.data.content,
        });
      })
      .catch((result) => {
        console.log(`result : ${result}`);
        Swal.fire({
          icon: 'error',
          text: result.response
            ? result.response.data.content
            : '현재 서버에 문제가 있습니다. 관리자에게 문의해주세요.',
        });
      })
      .finally(() => {
        setSubmitLoading(false);
      });
  };

  // endregion *********************** 데이터 제출 **************************
  if (isQueryLoading)
    return <div>데이터를 가져오고 있는 중입니다. 잠시만 기다려주세요.</div>;
  if (sessionGroupDetailError)
    return (
      <div>
        프로그램 데이터를 가져 올 수 없습니다. 관리자에게 문의하여주세요.
      </div>
    );
  return (
    <FormLayout
      backLink={PATH.EACH.PROGRAM.LIST(params.confStringIdx)}
      backText={'프로그램 목록'}
      headText={'세션 상세'}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/*<DevTool control={control} />*/}
        <Card>
          <CardContent>
            <Stack divider={<Divider />} spacing={4}>
              {/* sessionGroupIdx에 따른 하나의 세션 그룹 폼 */}
              <OneSessionGroup
                register={register}
                control={control}
                errors={errors}
                programData={sessionGroupDetailData}
              />

              <Stack spacing={3}>
                연자 내용
                {/*      <A_FacultyConnectionSelect
        cl="inner_container one_depth"
        relatedType="sessionGroup"
        relatedIdx={parseInt(sessionGroupIdx)}
        facultyProgramData={SGData?.sessionGroupFaculties}
        register={register} control={control} errors={errors} trigger={trigger}
      />*/}
              </Stack>
              <SessionListForm append={append} />
            </Stack>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={!!submitLoading}
            >
              저장하기
            </Button>
          </CardActions>
        </Card>
      </form>
    </FormLayout>
  );
}

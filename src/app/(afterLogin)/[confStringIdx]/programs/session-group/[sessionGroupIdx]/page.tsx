'use client';

import { PATH } from '@/paths';
import FormLayout from '@/components/core/Form/FormLayout';
import SessionGroupForm from '@/components/program/SessionGroupForm';
import SessionListForm from '@/components/program/SessionListForm';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useFieldArray, useForm } from 'react-hook-form';
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
  Typography,
} from '@mui/material';

type SessionGroupDetailTypeProps = {
  params: {
    confStringIdx: string;
    sessionGroupIdx: string;
  };
};

export default function SessionGroupDetail({
  params,
}: SessionGroupDetailTypeProps) {
  // region ***************************** POST: 카테고리 데이터 요청하기 ********************************
  const {
    isLoading: isQueryLoading,
    error: sessionGroupDetailError,
    data: sessionGroupDetailData,
  } = useQuery({
    queryKey: ['sessionGroupDetail', params.sessionGroupIdx],
    queryFn: () =>
      getSessionGroupDetail(params.sessionGroupIdx).then((res) =>
        processingSessionGroup(res.data.content)
      ),
  });
  function processingSessionGroup(_data) {
    if (_data === null) return null;

    const sessionGroup = {};
    const sessionGroups = [];

    // sessions를 제외한 나머지 정보를 sessionGroup에 복사
    for (const key in _data) {
      if (key !== 'sessions') {
        sessionGroup[key] = _data[key];
      }
    }

    // sessionGroups 배열에 sessionGroup 추가
    sessionGroups.push(sessionGroup);

    return sessionGroups;
  }
  window.sessionGroupDetailData = sessionGroupDetailData;
  // endregion ***************************** POST: 데이터 요청하기 *****************************

  // region *********************** FORM 데이터 ***********************
  const [submitLoading, setSubmitLoading] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      sessionGroupIdx: params.sessionGroupIdx,
    },
  });

  // const [count, setCount] = useState(0);
  const { append, remove, update } = useFieldArray({
    control,
    name: 'sessions',
  });

  useEffect(() => {
    sessionGroupDetailData?.sessions.forEach((item, index) => {
      const dataToAppend = {};
      Object.keys(item).forEach((key) => {
        if (item[key] !== null) {
          if (isDate(item[key])) dataToAppend[key] = new Date(item[key]);
          else dataToAppend[key] = item[key];
        }
      });
      update(index, dataToAppend);
    });
  }, [sessionGroupDetailData?.sessions, update]);
  // endregion *********************** FORM 데이터 ***********************

  // region *********************** 데이터 제출 **************************

  const onSubmit = (data) => {
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
            <Stack divider={<Divider />} spacing={3}>
              <Stack>
                {/* 아래부터 CreateForm 내부 콘텐츠 */}
                <Typography color="primary" variant="h6">
                  세션 상세
                </Typography>

                {/* sessionGroupIdx에 따른 하나의 세션 그룹 폼 */}
                <SessionGroupForm
                  index={null}
                  item={null}
                  register={register}
                  remove={remove}
                  control={control}
                  errors={errors}
                  programData={sessionGroupDetailData}
                />

                {/*      <A_FacultyConnectionSelect
        cl="inner_container one_depth"
        relatedType="sessionGroup"
        relatedIdx={parseInt(sessionGroupIdx)}
        facultyProgramData={SGData?.sessionGroupFaculties}
        register={register} control={control} errors={errors} trigger={trigger}
      />*/}
                <SessionListForm append={append} />
              </Stack>
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

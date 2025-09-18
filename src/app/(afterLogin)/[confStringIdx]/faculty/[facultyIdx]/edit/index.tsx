'use client';

import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Stack } from '@mui/material';
import { Loading } from '@/components/core/Loading';
import { PageTitle } from '@/components/core/PageTitle';
import { FacultyForm } from '../../FacultyForm';
import { useForm } from 'react-hook-form';
import {
  FACULTY_STATUS,
  FacultyFormData,
  GetFacultyResponse,
} from '@/api/types/facultyTypes';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectConferenceStringIdx } from '@/redux/slices/pcoSlice';
import { Editor as TiptapEditor } from '@tiptap/core';
import { useQuery } from '@tanstack/react-query';
import { addFaculty, getFaculty } from '@/api/facultyApi';
import { Alert } from '@/components/core/Alert';
import { PATH } from '@/paths';

interface FacultyEditProps {
  facultyIdx: number;
}

const FacultyEdit = ({ facultyIdx }: FacultyEditProps) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm<FacultyFormData>({
    defaultValues: { facultyIdx: facultyIdx, status: FACULTY_STATUS.inactive },
  });

  // TODO router 사용할때 conferenceStringIdx를 계속 리덕스에서 불러와야하는 구조 개선하기
  // hook으로 만들던가, 페이지 루트 구조 개편하기
  const router = useRouter();
  const conferenceStringIdx = useSelector(selectConferenceStringIdx);

  const [simpleCvEditor, setSimpleCvEditor] = useState<TiptapEditor | null>(
    null
  );
  const [fullCvEditor, setFullCvEditor] = useState<TiptapEditor | null>(null);

  const [simpleCv, setSimpleCv] = useState<string>('');
  const [fullCv, setFullCv] = useState<string>('');
  const [profileUrl, setProfileUrl] = useState<string>('');

  const { isPending: dataIsPending } = useQuery({
    queryKey: ['getFaculty', facultyIdx],
    queryFn: () =>
      getFaculty(Number(facultyIdx)).then((response) => {
        if (response.status === 200) {
          reset({
            name: response.content?.name,
            affiliation: response.content?.affiliation,
            position: response.content?.position,
            status: response.content?.status,
          });
          setSimpleCv(response.content?.simpleCv ?? '');
          setFullCv(response.content?.cv ?? '');
          setProfileUrl(response.content?.profileUrl ?? '');

          return response.content as GetFacultyResponse;
        } else {
          Alert({
            title: '연자 상세 조회 실패',
            text: '연자 상세 조회에 실패하여 목록으로 돌아갑니다.',
          }).then((result) => {
            if (result.isConfirmed) {
              router.replace(PATH.EACH.FACULTY.LIST(conferenceStringIdx));
            }
          });
        }
      }),
    enabled: true,
  });

  const onSubmit = (data: FacultyFormData) => {
    const formData = {
      ...data,
      facultyIdx: facultyIdx,
      simpleCv: simpleCvEditor?.getText().length
        ? simpleCvEditor?.getHTML()
        : undefined,
      cv: fullCvEditor?.getText().length ? fullCvEditor?.getHTML() : undefined,
      isDeleteProfile: profileUrl === '',
    };
    setIsPending(true);
    addFaculty(formData)
      .then((response) => {
        if (response.status === 200) {
          Alert({
            title: '연자 수정',
            html: `수정이 완료되었습니다.`,
          }).then((result) => {
            if (result.isConfirmed) {
              router.push(PATH.EACH.FACULTY.LIST(conferenceStringIdx));
            }
          });
        }
      })
      .catch((error) => {
        Alert({ title: '연자 등록 실패', html: error });
      })
      .finally(() => {
        setIsPending(false);
      });
  };
  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
    >
      {isPending ||
        (dataIsPending && <Loading open={isPending || dataIsPending} />)}
      <Stack spacing={4}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          sx={{ alignItems: 'flex-start' }}
        >
          <Box sx={{ flex: '1 1 auto' }}>
            <PageTitle title="연자 수정" />
          </Box>
        </Stack>
        <Card
          sx={{
            borderRadius: '10px',
            boxShadow: 'none',
            border: `1px solid var(--color-secondary-light)`,
          }}
        >
          <CardContent className="flex flex-col gap-24" sx={{ p: 3 }}>
            <form>
              <FacultyForm
                control={control}
                errors={errors}
                setValue={setValue}
                simpleCvEditor={simpleCvEditor}
                setSimpleCvEditor={(editor: TiptapEditor) =>
                  setSimpleCvEditor(editor)
                }
                fullCvEditor={fullCvEditor}
                setFullCvEditor={(editor: TiptapEditor) =>
                  setFullCvEditor(editor)
                }
                simpleCvContents={simpleCv}
                fullCvContents={fullCv}
                profileUrl={profileUrl}
                setProfileUrl={(value: string) => setProfileUrl(value)}
              />
              <div className="mt-24 text-right">
                <Button
                  sx={{ textAlign: 'right' }}
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit(onSubmit)}
                >
                  등록하기
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export { FacultyEdit };

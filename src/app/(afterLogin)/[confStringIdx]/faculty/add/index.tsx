'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Editor as TiptapEditor } from '@tiptap/core';
import { Box, Button, Card, CardContent, Stack } from '@mui/material';
import { Loading } from '@/components/core/Loading';
import { PageTitle } from '@/components/core/PageTitle';
import { FACULTY_STATUS, FacultyFormData } from '@/api/types/facultyTypes';
import { addFaculty } from '@/api/facultyApi';
import { Alert } from '@/components/core/Alert';
import { PATH } from '@/paths';
import { selectConferenceStringIdx } from '@/redux/slices/pcoSlice';
import { FacultyForm } from '../FacultyForm';

const AddFaculty = () => {
  const [isPending, setIsPending] = useState<boolean>(false);
  // TODO router 사용할때 conferenceStringIdx를 계속 리덕스에서 불러와야하는 구조 개선하기
  // hook으로 만들던가, 페이지 루트 구조 개편하기
  const router = useRouter();
  const conferenceStringIdx = useSelector(selectConferenceStringIdx);

  const [simpleCvEditor, setSimpleCvEditor] = useState<TiptapEditor | null>(
    null
  );
  const [fullCvEditor, setFullCvEditor] = useState<TiptapEditor | null>(null);

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<FacultyFormData>({
    defaultValues: { status: FACULTY_STATUS.inactive },
  });

  const onSubmit = (data: FacultyFormData) => {
    const formData = {
      ...data,
      simpleCv: simpleCvEditor?.getHTML() ?? '',
      cv: fullCvEditor?.getHTML() ?? '',
      isDeletedProfile: false,
    };
    setIsPending(true);
    addFaculty(formData)
      .then((response) => {
        if (response.status === 200) {
          Alert({
            title: '연자 등록',
            html: `등록이 완료되었습니다.<br/>추가로 등록하시겠습니까?`,
            confirmButtonText: '등록',
            showCancelButton: true,
            cancelButtonText: '등록 안함',
          }).then((result) => {
            if (result.isConfirmed) {
              router.refresh();
            } else {
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
      {isPending && <Loading open={isPending} />}
      <Stack spacing={4}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          sx={{ alignItems: 'flex-start' }}
        >
          <Box sx={{ flex: '1 1 auto' }}>
            <PageTitle title="연자 등록" />
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

export { AddFaculty };

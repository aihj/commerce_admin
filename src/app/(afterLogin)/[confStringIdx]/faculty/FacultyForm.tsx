import React, { useEffect, useState } from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue,
} from 'react-hook-form';
import { Editor as TiptapEditor } from '@tiptap/core';
import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { Label } from '@/components/core/Label';
import { FACULTY_STATUS, FacultyFormData } from '@/api/types/facultyTypes';
import { UploadImageFiles } from './UploadImageFiles';
import { Editor } from '@/components/editor/simple/simple-editor';

interface FacultyFormProps {
  control: Control<FacultyFormData>;
  errors: FieldErrors<FacultyFormData>;
  setValue: UseFormSetValue<FacultyFormData>;
  simpleCvEditor: TiptapEditor | null;
  fullCvEditor: TiptapEditor | null;
  setSimpleCvEditor: (editor: TiptapEditor) => void;
  setFullCvEditor: (editor: TiptapEditor) => void;
  simpleCvContents?: string;
  fullCvContents?: string;
  profileUrl?: string;
  setProfileUrl?: (value: string) => void;
}

const FacultyForm = ({
  control,
  errors,
  setValue,
  setSimpleCvEditor,
  setFullCvEditor,
  simpleCvContents,
  fullCvContents,
  profileUrl,
  setProfileUrl,
}: FacultyFormProps) => {
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (files.length) {
      setValue('profile', files[0]);
    }
  }, [files]);

  return (
    <>
      <div className="flex">
        <div className="grid grid-cols-2 gap-x-32 gap-y-16">
          <Controller
            control={control}
            name="name"
            rules={{ required: '연자 이름을 입력해 주세요.' }}
            render={({ field }) => (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Label label="이름*" minWidth={100} bold />
                <TextField
                  sx={{ p: 0, mb: '18px' }}
                  error={Boolean(errors.name)}
                  placeholder="연자 이름을 입력해 주세요."
                  inputProps={{
                    maxLength: 49,
                  }}
                  InputProps={{
                    sx: {
                      height: 44,
                    },
                  }}
                  helperText={errors.name ? errors.name?.message : ''}
                  fullWidth
                  {...field}
                />
              </Box>
            )}
          />
          <Controller
            control={control}
            name="affiliation"
            render={({ field }) => (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Label label="소속" minWidth={100} bold />
                <TextField
                  sx={{ p: 0, width: 480, mb: '18px' }}
                  error={Boolean(errors.affiliation)}
                  placeholder="연자 소속을 입력해 주세요."
                  inputProps={{
                    maxLength: 49,
                  }}
                  InputProps={{
                    sx: {
                      height: 44,
                    },
                  }}
                  //   helperText={
                  //     errors.memo
                  //       ? errors.memo?.message
                  //       : '메모는 문자 발송 내역에 저장되는 내용이며, 문자 발송시 제목으로 표기되지 않습니다.'
                  //   }
                  fullWidth
                  {...field}
                />
              </Box>
            )}
          />
          <Controller
            control={control}
            name="position"
            render={({ field }) => (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Label label="직책" minWidth={100} bold />
                <TextField
                  sx={{ p: 0, mb: '18px' }}
                  error={Boolean(errors.position)}
                  placeholder="연자 직책을 입력해 주세요."
                  inputProps={{
                    maxLength: 49,
                  }}
                  InputProps={{
                    sx: {
                      height: 44,
                    },
                  }}
                  fullWidth
                  {...field}
                />
              </Box>
            )}
          />
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Label label="노출 여부" minWidth={100} bold />
                <Box>
                  <RadioGroup
                    sx={{ height: 44 }}
                    row
                    defaultValue={'n'}
                    {...field}
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                  >
                    <FormControlLabel
                      control={<Radio />}
                      label={
                        <div>
                          <Typography
                            sx={{
                              color: 'var(--mui-palette-text-primary)',
                            }}
                            variant="inherit"
                          >
                            노출
                          </Typography>
                        </div>
                      }
                      value={FACULTY_STATUS.active}
                    />
                    <FormControlLabel
                      control={<Radio />}
                      label={
                        <div>
                          <Typography
                            sx={{
                              color: 'var(--mui-palette-text-primary)',
                            }}
                            variant="inherit"
                          >
                            미노출
                          </Typography>
                        </div>
                      }
                      value={FACULTY_STATUS.inactive}
                    />
                  </RadioGroup>
                </Box>
              </Box>
            )}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Label label="간략 cv (홈 노출용)" minWidth={100} bold />
            <Editor
              contents={simpleCvContents ?? ''}
              setEditor={(editor: TiptapEditor) => setSimpleCvEditor(editor)}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Label label="프로필" minWidth={100} bold />
            <UploadImageFiles
              files={files}
              handleFiles={(newFiles: File[]) => setFiles(newFiles)}
              imageUrl={profileUrl}
              setImageUrl={(value: string) => setProfileUrl?.(value)}
            />
            {files.length === 0 && profileUrl !== '' ? <div></div> : null}
          </Box>
        </div>
      </div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          mt: 4,
        }}
      >
        <Label label="전체 cv (연자 상세용)" minWidth={100} bold />
        <Editor
          contents={fullCvContents ?? ''}
          setEditor={(editor: TiptapEditor) => setFullCvEditor(editor)}
        />
      </Box>
    </>
  );
};

export { FacultyForm };

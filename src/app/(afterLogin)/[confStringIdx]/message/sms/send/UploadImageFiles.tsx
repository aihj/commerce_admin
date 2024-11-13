import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, Divider, IconButton, Stack } from '@mui/material';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { FileDropzone } from '@/components/core/FileUploader/FileDropzone';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { bytesToKB } from '@/lib/byteToKB';

type FileWithThumbnail = {
  fileName: string;
  thumbnail: string;
};

interface UploadImageFilesProps {
  files: File[];
  handleFiles: (file: File[]) => void;
}

const UploadImageFiles = ({ files, handleFiles }: UploadImageFilesProps) => {
  const [thumbnails, setThumbnails] = useState<Map<string, FileWithThumbnail>>(
    new Map()
  );
  const [totalSize, setTotalSize] = useState<string>('');

  const handleDrop = useCallback(
    (newFiles: File[]) => {
      const newThumbnails = thumbnails; // 기존 files 상태 복사

      Array.from(newFiles).forEach((file) => {
        const fileName = file.name;
        const reader = new FileReader();
        reader.readAsDataURL(file); // 파일을 base64로 읽음
        reader.onloadend = () => {
          // 파일 경로와 썸네일을 Map에 저장
          newThumbnails.set(fileName, {
            fileName: fileName,
            thumbnail: reader.result as string,
          });
          setThumbnails(new Map(newThumbnails)); // 상태 업데이트
        };
      });

      handleFiles([...files, ...newFiles]);
    },
    [thumbnails, handleFiles]
  );

  const handleRemove = React.useCallback(
    (file: File) => {
      const newFiles = files.filter((_file) => _file.name !== file.name);
      handleFiles(newFiles);
    },
    [files, handleFiles]
  );

  useEffect(() => {
    const size = files.reduce((acc, curr) => acc + curr.size, 0);
    setTotalSize(bytesToKB(size));
  }, [files]);

  return (
    <Box
      sx={{
        ml: 2,
        px: 2,
        py: 1,
      }}
    >
      <div className="text-14">이미지 첨부</div>
      <Stack gap={1}>
        <Stack direction="row" sx={{ mt: 1 }} gap={2}>
          <FileDropzone
            accept={{ 'image/jpg': ['.jpg'] }}
            maxFiles={3}
            maxSize={307200}
            files={files}
            onDrop={handleDrop}
            onDropRejected={() =>
              Swal.fire({
                title: '파일 용량 초과',
                text: '300KB 이상의 파일은 업로드 할 수 없습니다.',
              })
            }
            disabled={files.length === 3}
          >
            <Button
              startIcon={<PlusIcon size={16} />}
              // onClick={onClose}
              size="small"
              type="button"
              variant="contained"
              disabled={files.length === 3}
            >
              파일 선택
            </Button>
          </FileDropzone>
          <ul className="text-12 text-gray-700 list-inside list-disc">
            <li>jpg파일 최대 3개, 파일 당 300KB 미만(총 900KB 미만)</li>
            <li>해상도 1500*1500 미만</li>
          </ul>
        </Stack>
        <div className="text-14 text-gray-800">
          총 {files.length}개의 파일 {totalSize}KB
        </div>
        <Stack>
          {files.length !== 0 && <Divider sx={{ my: '4px' }} />}
          {files.map((file) => (
            <>
              <div
                key={file.name}
                className="flex justify-between px-8 items-center"
              >
                <div className="flex gap-8">
                  <div className="w-50 h-50">
                    <Image
                      src={thumbnails.get(file.name)?.thumbnail as string}
                      width={50}
                      height={50}
                      style={{ maxHeight: '100%' }}
                      alt={`thumbnail-${file.name}`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-14">{file.name}</span>
                    <span className="text-12 text-gray-700">
                      {bytesToKB(file.size)}KB
                    </span>
                  </div>
                </div>
                <IconButton
                  onClick={() => {
                    handleRemove(file);
                  }}
                  sx={{
                    background: 'grey',
                    padding: '4px',
                    width: 24,
                    height: 24,
                    borderRadius: 24,
                  }}
                >
                  <XIcon size={16} color="white" />
                </IconButton>
              </div>
              <Divider sx={{ my: '4px' }} />
            </>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export { UploadImageFiles };

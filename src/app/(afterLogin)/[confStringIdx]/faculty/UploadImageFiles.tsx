import React, { useCallback, useState } from 'react';
import { Box, Button, Divider, IconButton, Stack } from '@mui/material';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { FileDropzone } from '@/components/core/FileUploader/FileDropzone';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';
import Swal from 'sweetalert2';
import Image from 'next/image';
import { bytesToKB } from '@/lib/byteToKB';
import { ErrorCode } from 'react-dropzone';
import { fileSizeMb } from '@/utils/fileSize';

type FileWithThumbnail = {
  fileName: string;
  thumbnail: string;
};

interface UploadImageFilesProps {
  files: File[];
  handleFiles: (file: File[]) => void;
  imageUrl?: string;
  setImageUrl?: (value: string) => void;
}

const UploadImageFiles = ({
  files,
  handleFiles,
  imageUrl,
  setImageUrl,
}: UploadImageFilesProps) => {
  const [thumbnails, setThumbnails] = useState<Map<string, FileWithThumbnail>>(
    new Map()
  );
  // const [totalSize, setTotalSize] = useState<string>('');

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

  // useEffect(() => {
  //   const size = files.reduce((acc, curr) => acc + curr.size, 0);
  //   setTotalSize(bytesToKB(size));
  // }, [files]);

  return (
    <Box>
      <Stack gap={1}>
        <Stack
          direction="row"
          sx={{
            backgroundColor: 'var(--color-gray-200)',
            padding: 1,
            borderRadius: 1,
          }}
          gap={2}
        >
          <FileDropzone
            accept={{ image: ['.jpg', '.jpeg', '.png'] }}
            maxFiles={1}
            maxSize={fileSizeMb(3)}
            files={files}
            onDrop={handleDrop}
            onDropRejected={(fileRejections) => {
              const error = fileRejections[0].errors[0];
              if (error.code === ErrorCode.FileTooLarge) {
                Swal.fire({
                  title: '파일 용량 초과',
                  text: '3MB 이상의 파일은 업로드 할 수 없습니다.',
                });
              }
            }}
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
            <li>.jpg, jpeg, png 파일 1개</li>
            <li>해상도 110*110 권장</li>
          </ul>
        </Stack>
        {/* <div className="text-14 text-gray-800">
          총 {files.length}개의 파일 {totalSize}KB
        </div> */}
        <Stack>
          {files.length !== 0 && <Divider sx={{ my: '4px' }} />}
          {files.map((file) => (
            <>
              <div
                key={file.name}
                className="flex justify-between px-8 items-center"
              >
                <div className="w-110 h-110">
                  <Image
                    src={thumbnails.get(file.name)?.thumbnail as string}
                    width={110}
                    height={110}
                    style={{ maxHeight: '100%' }}
                    alt={`thumbnail-${file.name}`}
                  />
                </div>
                <div className="flex gap-16">
                  <div className="flex flex-col">
                    <span className="text-14">{file.name}</span>
                    <span className="text-12 text-gray-700">
                      {bytesToKB(file.size)}KB
                    </span>
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
              </div>
              <Divider sx={{ my: '4px' }} />
            </>
          ))}
          {files.length === 0 && imageUrl && imageUrl !== '' ? (
            <>
              <div className="flex justify-between px-8 items-center">
                <div className="w-110 h-110">
                  <Image
                    src={imageUrl as string}
                    width={110}
                    height={110}
                    style={{ maxHeight: '100%' }}
                    alt={`thumbnail`}
                  />
                </div>
                <div className="flex gap-16">
                  <IconButton
                    onClick={() => {
                      setImageUrl?.('');
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
              </div>
              <Divider sx={{ my: '4px' }} />
            </>
          ) : null}
        </Stack>
      </Stack>
    </Box>
  );
};

export { UploadImageFiles };

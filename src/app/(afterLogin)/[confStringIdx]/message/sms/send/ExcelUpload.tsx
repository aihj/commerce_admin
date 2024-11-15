import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Divider, IconButton, Stack } from '@mui/material';
import { Label } from '@/components/core/Label';
import { FileDropzone } from '@/components/core/FileUploader/FileDropzone';
import { Plus } from '@phosphor-icons/react/dist/ssr/Plus';
import { DownloadIcon } from '@/components/icons/DownloadIcon';
import { ExcelUploadedUser } from '@/types/user';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';
import { bytesToKB } from '@/lib/byteToKB';
import { numberWithComma } from '@/lib/numberWithComma';
import { ColumnDef, DataTable } from '@/components/core/DataTable';
import { useSelection } from '@/hooks/useSelection';

const readFileWithEncoding = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const uint8Array = new Uint8Array(reader.result as ArrayBuffer);
        const decoder = new TextDecoder('utf-8', { fatal: true });
        try {
          const decodedText = decoder.decode(uint8Array); // 파일 내용 디코딩
          console.log('Decoded text:', decodedText);
          resolve(decodedText);
        } catch (err) {
          console.error('Error decoding with utf-8:', err);
          // 다른 인코딩 시도 가능
          const decoder = new TextDecoder('euc-kr');
          const decodedText = decoder.decode(uint8Array); // 파일 내용 디코딩
          resolve(decodedText);
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsArrayBuffer(file); // ArrayBuffer로 읽기
  });

const parseCSV = (data: string) => {
  const lines = data
    .trim()
    .split('\n')
    .filter((line) => {
      const [name, phone] = line.split(',');
      return name && phone;
    });

  const result: ExcelUploadedUser[] = lines.map((line, index) => {
    const [name, phone] = line.split(',');

    const newName = name.replace(/[^a-zA-Z가-힣]/g, '');
    const newPhone = phone.replace(/[^0-9]/g, '');

    const isValid =
      /^[가-힣]{2,}$/.test(newName) && /^(0\d{9}|0\d{10})$/.test(`${newPhone}`);
    return {
      index: index + 1,
      name: newName,
      phone: newPhone,
      isValid: isValid,
    };
  });

  return result;
};

interface ExcelUploadProps {
  handleExcelUploadedUser: (user: ExcelUploadedUser[]) => void;
  searchParamError: boolean;
}

const ExcelUpload = ({
  handleExcelUploadedUser,
  searchParamError,
}: ExcelUploadProps) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [userList, setUserList] = useState<ExcelUploadedUser[]>([]);

  const handleDrop = React.useCallback(async (newFiles: File[]) => {
    const csvText = await readFileWithEncoding(newFiles[0]);
    const userList = await parseCSV(csvText);

    setUserList(userList);

    setFiles(newFiles);
  }, []);

  const uploadedUser = useMemo(
    () => userList.map((user) => user.index),
    [userList]
  );

  const { deselectAll, deselectOne, selectAll, selectOne, selected } =
    useSelection(uploadedUser);

  const columns = [
    {
      formatter: (row): JSX.Element => (
        <Box sx={{ width: '160px' }}>{row.name}</Box>
      ),
      name: '이름',
    },
    {
      formatter: (row): JSX.Element => <Box>{row.phone.toString()}</Box>,
      name: '휴대폰 번호',
    },
    {
      formatter: (row): JSX.Element => (
        <Box>
          {row.isValid ? '정상' : <span className="text-error-main">오류</span>}
        </Box>
      ),
      name: '업로드 결과',
    },
  ] satisfies ColumnDef<ExcelUploadedUser>[];

  const handleRemoveUser = () => {
    const remainedUser = userList.filter((item) => !selected.has(item.index));

    setUserList(remainedUser);
  };

  useEffect(() => {
    handleExcelUploadedUser(userList);
  }, [userList, handleExcelUploadedUser]);

  return (
    <Stack spacing={3} sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Label label="파일 업로드" minWidth={100} bold />
        <Box
          sx={{
            width: '100%',
            borderRadius: '20px',
          }}
        >
          <div className="flex justify-end">
            <Button
              endIcon={<DownloadIcon fill="var(--color-primary-main)" />}
              onClick={() =>
                (window.location.href =
                  'https://appfile.medistaff.co.kr/pco/admin/문자 대량발송 csv 양식.csv')
              }
            >
              샘플 파일 다운받기
            </Button>
          </div>
          <div
            className="w-full rounded-20"
            style={{ boxShadow: '0px 5px 22px 0px #0000000A' }}
          >
            {files.length === 0 ? (
              <FileDropzone
                accept={{ 'text/html': ['.csv'] }}
                maxFiles={1}
                files={files}
                onDrop={handleDrop}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    gap: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 116,
                  }}
                >
                  <span className="text-12 leading-20 text-gray-700">
                    파일을 가져오거나 드래그해서 올려놓기
                  </span>
                  <Button
                    variant="outlined"
                    startIcon={<Plus />}
                    sx={{ width: 132 }}
                  >
                    파일 가져오기
                  </Button>
                </Box>
              </FileDropzone>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  gap: 2,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: 116,
                  px: 2,
                }}
              >
                <div>
                  <span className="text-16">{files[0].name}</span>
                  <br />
                  <span className="text-14 text-gray-700">
                    {bytesToKB(files[0].size)}KB
                  </span>
                </div>
                <IconButton
                  onClick={() => setFiles([])}
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
              </Box>
            )}
          </div>
          <div className="flex flex-col text-12 text-sky-600 ml-8 mt-8">
            <span>
              *csv파일만 업로드 가능합니다. 샘플 파일을 참조해 주세요.
            </span>
            <span>
              *파일 내 여러 시트(sheet)가 있더라도 첫 번째 시트의 데이터만
              불러옵니다.
            </span>
            <span>*최대 500개까지 동시에 발송할 수 있습니다.</span>
            <span>
              *숫자, 영문, 한글이 아닌 특수문자 등의 문자는 자동으로 부분
              삭제처리 됩니다.
            </span>
          </div>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Label label="전송 대상*" minWidth={100} bold />
        <Box>
          {files.length === 0 ? (
            <span
              className={`text-14 text-gray-800 ${searchParamError && 'text-error-main'}`}
            >
              csv 파일을 업로드하여 전송대상을 추가해 주세요.
            </span>
          ) : (
            <div>
              <div className="text-14 flex justify-between">
                <span>총 {numberWithComma(userList.length)}건</span>
                {userList.filter((item) => !item.isValid).length !== 0 && (
                  <span className="text-gray-800">
                    확인이 필요한 데이터{' '}
                    <span className="text-error-main font-bold">
                      {userList.filter((item) => !item.isValid).length}
                    </span>
                    건
                  </span>
                )}
              </div>
              <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                <DataTable<ExcelUploadedUser>
                  columns={columns}
                  selectable
                  rows={userList}
                  selected={selected}
                  onSelectAll={() => selectAll()}
                  onDeselectAll={() => deselectAll()}
                  onSelectOne={(_, row) =>
                    selectOne(row.index as unknown as number)
                  }
                  onDeselectOne={(_, row) =>
                    deselectOne(row.index as unknown as number)
                  }
                  uniqueRowId={(row: ExcelUploadedUser) => row.index as number}
                />
              </Box>
              <div className="text-14 leading-16 my-8 text-center">
                <Button
                  variant="outlined"
                  sx={{ width: 200 }}
                  disabled={selected.size === 0}
                  onClick={() => handleRemoveUser()}
                >
                  선택된 {selected.size}
                  개삭제
                </Button>
              </div>
            </div>
          )}
        </Box>
      </Box>
      <Divider />
    </Stack>
  );
};

export { ExcelUpload };

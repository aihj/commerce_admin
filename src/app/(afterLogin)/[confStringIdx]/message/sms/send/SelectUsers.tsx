import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Box, Button, Divider, Stack, TextField } from '@mui/material';
import { CHIP_COLOR, Chip } from '@/components/core/Chip';
import { ColumnDef, DataTable } from '@/components/core/DataTable';
import { Label } from '@/components/core/Label';
import { showPhoneWithHyphen } from '@/lib/showPhoneWithHyphen';
import { useSelection } from '@/hooks/useSelection';
import { getUsersWithNameOrPhone } from '@/api/messageApi';
import { getUsersWithNameOrPhoneResponse } from '@/api/types/messageTypes';
import Swal from 'sweetalert2';

interface SMSSelectUserFormData {
  conferenceIdx: number;
  type: string; // default: 'nameAndPhone'
  searchText: string;
}

interface SelectUsersProps {
  conferenceIdx: number;
  handleSearchedUsers: (data: number[]) => void;
  searchParamError: boolean;
}

const SelectUsers = ({
  conferenceIdx,
  handleSearchedUsers,
  searchParamError,
}: SelectUsersProps) => {
  const {
    control,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm<SMSSelectUserFormData>({
    defaultValues: { conferenceIdx, type: 'nameAndPhone' },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // 이름, 휴대폰번호로 검색 된 유저
  const [searchedUserList, setSearchedUserList] = useState<
    getUsersWithNameOrPhoneResponse[]
  >([]);

  // 전송 대상으로 확정된 유저
  const [selectedUser, setSelectedUser] = useState<
    getUsersWithNameOrPhoneResponse[]
  >([]);

  const searchedUserIds = useMemo(
    () => searchedUserList.map((searchedUser) => searchedUser.wuserIdx),
    [searchedUserList]
  );

  const { deselectAll, deselectOne, selectAll, selectOne, selected } =
    useSelection(searchedUserIds);

  const columns = [
    {
      formatter: (row): JSX.Element => <Box>{row.name}</Box>,
      name: '이름',
    },
    {
      formatter: (row): JSX.Element => (
        <Box>{showPhoneWithHyphen(row.phone.toString())}</Box>
      ),
      name: '휴대폰 번호',
    },
  ] satisfies ColumnDef<getUsersWithNameOrPhoneResponse>[];

  const handleSearchUser = (data: SMSSelectUserFormData) => {
    getUsersWithNameOrPhone(data).then((result) => {
      setSearchedUserList(result.content as getUsersWithNameOrPhoneResponse[]);
      setHasSearched(true);
      return result.content;
    });
  };

  const handleSelectedUser = () => {
    const filteredItems = searchedUserList.filter(
      (item) =>
        selected.has(item.wuserIdx) &&
        selectedUser.findIndex((user) => user.wuserIdx === item.wuserIdx) === -1
    );

    setSelectedUser(selectedUser.concat(filteredItems));
  };

  const handleClearSelected = () => {
    Swal.fire({
      title: '전송 대상 모두 삭제',
      text: '선택된 전송 대상을 모두 삭제하시겠습니까?',
      confirmButtonText: '삭제',
      showCancelButton: true,
      cancelButtonText: '취소',
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedUser([]);
      }
    });
  };

  useEffect(() => {
    const filteredItems = selectedUser.map(
      (selectedUser) => selectedUser.wuserIdx
    );
    handleSearchedUsers(filteredItems);
  }, [selectedUser]);

  return (
    <form onSubmit={handleSubmit(handleSearchUser)} className="w-full">
      <Stack spacing={3} sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Label label="회원 선택" minWidth={100} bold />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Controller
                control={control}
                name="searchText"
                rules={{
                  required: '검색어를 입력해 주세요.',
                }}
                render={({ field }) => (
                  <TextField
                    sx={{ p: 0, height: 44, width: 480 }}
                    placeholder="이름 또는 휴대폰 번호 입력"
                    error={Boolean(errors.searchText)}
                    helperText={errors.searchText?.message}
                    {...field}
                  />
                )}
              />
              <Button
                sx={{ px: 2, py: 1, ml: 1 }}
                variant="contained"
                color="secondary"
                type="submit"
              >
                검색
              </Button>
            </Box>
            {searchedUserList.length > 0 ? (
              <Box sx={{ width: '100%' }}>
                <div className="text-14 leading-16 my-8">
                  검색결과 {searchedUserList.length}명
                </div>
                <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                  <DataTable<getUsersWithNameOrPhoneResponse>
                    columns={columns}
                    selectable
                    rows={searchedUserList}
                    selected={selected}
                    onSelectAll={() => selectAll()}
                    onDeselectAll={() => deselectAll()}
                    onSelectOne={(_, row) =>
                      selectOne(row.wuserIdx as unknown as number)
                    }
                    onDeselectOne={(_, row) =>
                      deselectOne(row.wuserIdx as unknown as number)
                    }
                    uniqueRowId={(row: getUsersWithNameOrPhoneResponse) =>
                      row.wuserIdx as number
                    }
                  />
                </Box>
                <div className="text-14 leading-16 my-8 text-center">
                  <Button
                    variant="outlined"
                    sx={{ width: 200 }}
                    disabled={selected.size === 0}
                    onClick={() => handleSelectedUser()}
                  >
                    {selected.size === 0 ? '' : `${selected.size}명 `}
                    선택 추가
                  </Button>
                </div>
              </Box>
            ) : hasSearched ? (
              <Box sx={{ width: '100%' }}>
                <div className="text-14 leading-16 my-8">
                  검색된 회원이 없습니다.
                </div>
              </Box>
            ) : null}
          </Box>
        </Box>
        <Divider />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Label label="전송 대상*" minWidth={100} bold />
          <Box>
            {selectedUser.length === 0 ? (
              <span
                className={`text-14 leading-18 h-26 ${searchParamError && 'text-error-main'}`}
              >
                회원을 선택하여 전송대상을 추가해 주세요.
              </span>
            ) : (
              <Box>
                <span className="text-14 font-bold">
                  총 {selectedUser.length}명
                </span>
                <div className="flex flex-wrap gap-8 py-10">
                  {selectedUser.map((item) => (
                    <Chip
                      key={item.wuserIdx}
                      label={`${item.name} ${showPhoneWithHyphen(item.phone)}`}
                      type="soft"
                      color={CHIP_COLOR.secondary}
                      onDelete={() =>
                        setSelectedUser(() =>
                          selectedUser.filter(
                            ({ wuserIdx }) => item.wuserIdx !== wuserIdx
                          )
                        )
                      }
                    />
                  ))}
                </div>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleClearSelected()}
                >
                  모두 삭제
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Stack>
    </form>
  );
};

export { SelectUsers };

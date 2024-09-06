import { CHIP_COLOR, Chip } from '@/components/core/Chip';
import { ColumnDef, DataTable } from '@/components/core/DataTable';
import { Label } from '@/components/core/Label';
import { useSelection } from '@/hooks/useSelection';
import { showPhoneWithHyphen } from '@/lib/showPhoneWithHyphen';
import { Box, Button, Stack, TextField } from '@mui/material';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface SMSSelectUserFormData {
  searchWord: string;
}

interface SearchedUser {
  wuserIdx: number;
  name: string;
  phone: string;
}

const dummyUsers = [
  {
    wuserIdx: 1,
    name: '김민정',
    phone: '01031237207',
  },
  {
    wuserIdx: 2,
    name: '김민정',
    phone: '01031237206',
  },
  {
    wuserIdx: 3,
    name: '김민정',
    phone: '01031237205',
  },
  {
    wuserIdx: 4,
    name: '김민정',
    phone: '01031237204',
  },
  {
    wuserIdx: 5,
    name: '김민정',
    phone: '01031237203',
  },
  {
    wuserIdx: 6,
    name: '김민정',
    phone: '01031237202',
  },
];

const SelectUsers = () => {
  const {
    control,
    handleSubmit,
    // watch,
    // formState: { errors },
  } = useForm<SMSSelectUserFormData>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const [searchedUserList, setSearchedUserList] =
    useState<SearchedUser[]>(dummyUsers);

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
        <Box>
          {showPhoneWithHyphen(row.phone.toString())}
          {/* 010-3123-7207 */}
        </Box>
      ),
      name: '휴대폰 번호',
    },
  ] satisfies ColumnDef<SearchedUser>[];

  const handleSearchUser = (data: SMSSelectUserFormData) => {
    // 유저 검색
    alert(data.searchWord);

    const dummyUsers = [
      {
        wuserIdx: 1,
        name: '김민정',
        phone: '01031237207',
      },
      {
        wuserIdx: 2,
        name: '김유정',
        phone: '01031237206',
      },
      {
        wuserIdx: 1,
        name: '김혜정',
        phone: '01031237205',
      },
      {
        wuserIdx: 1,
        name: '김수정',
        phone: '01031237204',
      },
      {
        wuserIdx: 1,
        name: '김희정',
        phone: '01031237203',
      },
      {
        wuserIdx: 1,
        name: '김선정',
        phone: '01031237202',
      },
    ] satisfies SearchedUser[];

    setSearchedUserList(dummyUsers);
  };

  console.log(selected);
  return (
    <Stack spacing={3} sx={{ mt: 4 }}>
      <form onSubmit={handleSubmit(handleSearchUser)} className="w-full">
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Label label="회원 선택" minWidth={100} />
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
                name="searchWord"
                rules={{
                  required: '검색어를 입력해 주세요.',
                }}
                render={({ field }) => (
                  <TextField
                    sx={{ p: 0, height: 44, width: 480 }}
                    placeholder="이름 또는 휴대폰 번호 입력"
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
              <Box sx={{ maxHeight: 600, width: '100%' }}>
                <div className="text-14 leading-16 my-8">검색결과 6명</div>
                <DataTable<SearchedUser>
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
                  uniqueRowId={(row: SearchedUser) => row.wuserIdx as number}
                />
                <div className="text-14 leading-16 my-8 text-center">
                  <Button
                    variant="outlined"
                    sx={{ width: 200 }}
                    disabled={selected.size === 0}
                  >
                    {selected.size === 0 ? '' : `${selected.size}명 `}
                    선택 추가
                  </Button>
                </div>
              </Box>
            ) : null}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Label label="전송 대상*" minWidth={100} />
          <Box>
            <Chip
              label="김민정 010-3123-7207"
              type="soft"
              color={CHIP_COLOR.secondary}
              onDelete={() => alert('김민정')}
            />
          </Box>
        </Box>
      </form>
    </Stack>
  );
};

export { SelectUsers };

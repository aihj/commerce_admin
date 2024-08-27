import { Label } from '@/components/core/Label';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Select,
  Stack,
} from '@mui/material';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import {
  BIRTH_YEAR_RANGE,
  GENDERS,
  PAYMENT_STATUS,
  REGISTRATION_STATUS,
  WUSER_STATUS,
} from '@/constants/filterSelectOptions';
import { ResetIcon } from '@/components/icons/ResetIcon';
import { Option } from '@/components/core/Option';
import { getTotalUserAmount } from '@/api/messageApi';
import Swal from 'sweetalert2';
import { Chip as MyChip } from '@/components/core/Chip';

export interface Filter {
  conferenceIdx?: number;
  birthDateStartT?: string | ReactElement;
  birthDateEndT?: string;
  gender?: string;
  wuserStatus?: string;
  registrationStatus?: string;
  paymentStatus?: string;
}

interface FilterProps {
  conferenceIdx: number;
  handleSearchParam: (data: Filter) => void;
  searchParamError: boolean;
}

const Filters = ({
  conferenceIdx,
  handleSearchParam,
  searchParamError,
}: FilterProps) => {
  // 필터 항목
  const [searchParam, setSearchParam] = useState<Filter>({});
  const [birthDateStartT, setBirthDateStartT] = useState<string>('');
  const [birthDateEndT, setBirthDateEndT] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [wuserStatus, setWuserStatus] = useState<string>('');
  const [registrationStatus, setRegistrationStatus] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [allUser, setAllUser] = useState<boolean>(false);

  const [filteredChips, setFilteredChips] = useState<ReactElement[]>();
  const [filteredCount, setFilteredCount] = useState<number>(-1);

  const handleClearFilters = () => {
    setSearchParam({});
    setBirthDateStartT('');
    setBirthDateEndT('');
    setGender('');
    setWuserStatus('');
    setRegistrationStatus('');
    setPaymentStatus('');
    setAllUser(false);
    setFilteredChips([]);
  };

  const handleFilters = () => {
    if (allUser) {
      setSearchParam({ conferenceIdx });
      return;
    }

    setSearchParam({ conferenceIdx });

    if (birthDateStartT !== '') {
      setSearchParam((prev) => ({ ...prev, birthDateStartT }));
    }
    if (birthDateEndT !== '') {
      setSearchParam((prev) => ({ ...prev, birthDateEndT }));
    }
    if (gender !== '') {
      setSearchParam((prev) => ({ ...prev, gender }));
    }
    if (wuserStatus !== '') {
      setSearchParam((prev) => ({ ...prev, wuserStatus }));
    }
    if (registrationStatus !== '') {
      setSearchParam((prev) => ({ ...prev, registrationStatus }));
    }
    if (paymentStatus !== '') {
      setSearchParam((prev) => ({ ...prev, paymentStatus }));
    }
    if (
      birthDateStartT == '' &&
      birthDateEndT == '' &&
      gender == '' &&
      wuserStatus == '' &&
      registrationStatus == '' &&
      paymentStatus == ''
    ) {
      Swal.fire({
        text: '선택된 필터가 없습니다.',
      });
    }
  };

  const handleDelete = useCallback(
    (key: string) => {
      const newChips = filteredChips?.filter((item) => item.key !== key);
      if (newChips?.length === 1) {
        // 총 {total}건만 남은 상황
        setFilteredChips([]);
      } else {
        setFilteredChips(newChips);
      }
    },
    [filteredChips]
  );

  const handleChips = (total: number) => {
    const chips = [];
    if (allUser) {
      chips.push(
        <MyChip
          key="birthFullYear"
          label={`전체 ${total}명`}
          type="soft"
          color="secondary"
        />
      );
      setFilteredChips(chips);
      return chips;
    } else {
      if (searchParam.birthDateStartT && searchParam.birthDateEndT) {
        chips.push(
          <MyChip
            key="birthFullYear"
            label={`${searchParam.birthDateStartT}년생 ~ ${searchParam.birthDateEndT}년생`}
            type="soft"
            color="secondary"
            onDelete={() => {
              setBirthDateStartT('');
              setBirthDateEndT('');
              handleDelete('birthFullYear');
            }}
          />
        );
      } else if (searchParam.birthDateStartT) {
        chips.push(
          <MyChip
            key="birthDateStartT"
            label={`${searchParam.birthDateStartT}년생~`}
            type="soft"
            color="secondary"
            onDelete={() => {
              setBirthDateStartT('');
              handleDelete('birthDateStartT');
            }}
          />
        );
      } else if (searchParam.birthDateEndT) {
        chips.push(
          <MyChip
            key="birthDateEndT"
            label={`~${searchParam.birthDateEndT}년생`}
            type="soft"
            color="secondary"
            onDelete={() => {
              setBirthDateEndT('');
              handleDelete('birthDateEndT');
            }}
          />
        );
      }
      if (searchParam.gender) {
        chips.push(
          <MyChip
            key="gender"
            label={`${GENDERS.filter((item) => item.value === searchParam.gender)[0].label}`}
            type="soft"
            color="secondary"
            onDelete={() => {
              setGender('');
              handleDelete('gender');
            }}
          />
        );
      }
      if (searchParam.wuserStatus) {
        chips.push(
          <MyChip
            key="wuserStatus"
            label={`${WUSER_STATUS.filter((item) => item.value === searchParam.wuserStatus)[0].label}`}
            type="soft"
            color="secondary"
            onDelete={() => {
              setWuserStatus('');
              handleDelete('wuserStatus');
            }}
          />
        );
      }
      if (searchParam.registrationStatus) {
        chips.push(
          <MyChip
            key="registrationStatus"
            label={`${REGISTRATION_STATUS.filter((item) => item.value === searchParam.registrationStatus)[0].label}`}
            type="soft"
            color="secondary"
            onDelete={() => {
              setRegistrationStatus('');
              handleDelete('registrationStatus');
            }}
          />
        );
      }
      if (searchParam.paymentStatus) {
        chips.push(
          <MyChip
            key="paymentStatus"
            label={`${PAYMENT_STATUS.filter((item) => item.value === searchParam.paymentStatus)[0].label}`}
            type="soft"
            color="secondary"
            onDelete={() => {
              setPaymentStatus('');
              handleDelete('paymentStatus');
            }}
          />
        );
      }
      setFilteredChips(chips);
      return chips;
    }
  };

  useEffect(() => {
    if (searchParam.conferenceIdx) {
      getTotalUserAmount(searchParam).then((result) => {
        handleChips(result.content);
        setFilteredCount(result.content);
      });
    }
    handleSearchParam(searchParam);
  }, [searchParam]);
  return (
    <Stack spacing={3} sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Label label="그룹 선택*" minWidth={100} />
        <Box
          sx={{
            overflowX: 'auto',
            scrollbarWidth: 'thin',
            pb: 1,
          }}
        >
          <Stack
            direction="row"
            spacing={'12px'}
            sx={{
              alignItems: 'flex-end',
              minWidth: 980,
            }}
          >
            <FormControl sx={{ p: 0, width: 80 }}>
              <Label label="시작 연도" />
              <Select
                disabled={allUser}
                sx={{
                  height: 44,
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      paddingRight: 8,
                      maxHeight: 400,
                      scrollbarWidth: 'none',
                    },
                  },
                }}
                onChange={(event) => {
                  setBirthDateStartT(event.target.value);
                }}
                value={birthDateStartT}
              >
                <Option value="">선택</Option>
                {BIRTH_YEAR_RANGE.map((item) => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ p: 0, width: 80 }}>
              <Label label="종료 연도" />
              <Select
                disabled={allUser}
                sx={{ height: 44 }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      paddingRight: 8,
                      maxHeight: 400,
                      scrollbarWidth: 'none',
                    },
                  },
                }}
                onChange={(event) => {
                  setBirthDateEndT(event.target.value);
                }}
                value={birthDateEndT}
              >
                <Option value="">선택</Option>
                {BIRTH_YEAR_RANGE.map((item) => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ p: 0, width: 80 }}>
              <Label label="성별" />
              <Select
                disabled={allUser}
                sx={{ height: 44 }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 400,
                    },
                  },
                }}
                onChange={(event) => {
                  setGender(event.target.value);
                }}
                value={gender}
              >
                <Option value="">선택</Option>
                {GENDERS.map((item) => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ p: 0, width: 80 }}>
              <Label label="회원 상태" />
              <Select
                disabled={allUser}
                sx={{ height: 44 }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 400,
                    },
                  },
                }}
                onChange={(event) => {
                  setWuserStatus(event.target.value);
                }}
                value={wuserStatus}
              >
                <Option value="">선택</Option>
                {WUSER_STATUS.filter((status) => status.value !== 'delete').map(
                  (item) => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  )
                )}
              </Select>
            </FormControl>
            <FormControl sx={{ p: 0, width: 116 }}>
              <Label label="등록 상태" />
              <Select
                disabled={allUser}
                sx={{ height: 44 }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 400,
                    },
                  },
                }}
                onChange={(event) => {
                  setRegistrationStatus(event.target.value);
                }}
                value={registrationStatus}
              >
                <Option value="">선택</Option>
                {REGISTRATION_STATUS.map((item) => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ p: 0, width: 116 }}>
              <Label label="결제 상태" />
              <Select
                disabled={allUser}
                sx={{ height: 44 }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 400,
                    },
                  },
                }}
                onChange={(event) => {
                  setPaymentStatus(event.target.value);
                }}
                value={paymentStatus}
              >
                <Option value="">선택</Option>
                {PAYMENT_STATUS.map((item) => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={<Checkbox />}
              label="모든 회원"
              sx={{ mb: '10px' }}
              checked={allUser}
              onChange={() => {
                setAllUser(!allUser);
              }}
            />
            {/* <FormControl>
              <Label label='모든 회원'/>
              <Checkbox aria-label=''/>
            </FormControl> */}
            <Button
              sx={{ px: 2, py: 1, minWidth: 94 }}
              startIcon={<ResetIcon />}
              onClick={() => handleClearFilters()}
              variant="contained"
              color="secondary"
            >
              초기화
            </Button>
            <Button
              sx={{ px: 2, py: 1, minWidth: 136 }}
              onClick={() => handleFilters()}
              variant="contained"
              color="primary"
            >
              전송 대상으로 선택
            </Button>
          </Stack>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Label label="전송 대상*" minWidth={100} />
        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {filteredChips && filteredChips.length > 0 && !allUser ? (
              <div className="text-14 mb-4">총 {filteredCount}건</div>
            ) : null}
            {filteredChips && filteredChips.length !== 0 ? (
              filteredChips
            ) : (
              <span
                className={`text-14 leading-18 h-26 ${searchParamError && 'text-error-main'}`}
              >
                {searchParamError
                  ? '문자를 받을 대상을 선택해 주세요.'
                  : '그룹을 선택하여 전송대상을 추가해 주세요.'}
              </span>
            )}
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
};

export { Filters };

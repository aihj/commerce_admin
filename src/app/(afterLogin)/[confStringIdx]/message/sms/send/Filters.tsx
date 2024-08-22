import { Label } from '@/components/core/Label';
import {
  Box,
  Button,
  Checkbox,
  Chip,
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

export interface Filter {
  conferenceIdx?: number;
  birthDateStartT?: string | ReactElement;
  birthDateEndT?: string;
  gender?: string;
  wserStatus?: string;
  registrationStatus?: string;
  paymentStatus?: string;
}

interface FilterProps {
  conferenceIdx: number;
  handleSearchParam: (data: Filter) => void;
}

const Filters = ({ conferenceIdx, handleSearchParam }: FilterProps) => {
  // 필터 항목
  const [searchParam, setSearchParam] = useState<Filter>({});
  const [birthDateStartT, setBirthDateStartT] = useState<string>('');
  const [birthDateEndT, setBirthDateEndT] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [wserStatus, setWuserStatus] = useState<string>('');
  const [registrationStatus, setRegistrationStatus] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [allUser, setAllUser] = useState<boolean>(false);

  const [filteredChips, setFilteredChips] = useState<ReactElement[]>();

  const handleClearFilters = () => {
    setSearchParam({});
    setBirthDateStartT('');
    setBirthDateEndT('');
    setGender('');
    setWuserStatus('');
    setRegistrationStatus('');
    setPaymentStatus('');
    setAllUser(false);
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
    if (wserStatus !== '') {
      setSearchParam((prev) => ({ ...prev, wserStatus }));
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
      wserStatus == '' &&
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
      setFilteredChips(newChips);
    },
    [filteredChips]
  );

  const handleChips = useCallback(
    (total: number) => {
      const chips = [];
      if (allUser) {
        chips.push(
          <Chip label={`전체 ${total}명`} color="primary" size="small" />
        );
        setFilteredChips(chips);
        return chips;
      }
      if (searchParam.birthDateStartT && searchParam.birthDateEndT) {
        chips.push(
          <Chip
            key="birthFullYear"
            label={`${searchParam.birthDateStartT}년생 ~ ${searchParam.birthDateEndT}년생`}
            color="primary"
            size="small"
            onDelete={() => () => handleDelete('birthFullYear')}
          />
        );
      } else if (searchParam.birthDateStartT) {
        chips.push(
          <Chip
            key="birthDateStartT"
            label={`${searchParam.birthDateStartT}년생~`}
            color="primary"
            size="small"
            onDelete={() => handleDelete('birthDateStartT')}
          />
        );
      } else if (searchParam.birthDateEndT) {
        chips.push(
          <Chip
            key="birthDateEndT"
            label={`~${searchParam.birthDateStartT}년생`}
            color="primary"
            size="small"
            onDelete={() => handleDelete('birthDateEndT')}
          />
        );
      }
      if (searchParam.gender) {
        chips.push(
          <Chip
            key="gender"
            label={`${GENDERS.filter((item) => item.value === searchParam.gender)[0].label}`}
            size="small"
            onDelete={() => handleDelete('gender')}
          />
        );
      }
      if (searchParam.wserStatus) {
        chips.push(
          <Chip
            key="wserStatus"
            label={`${WUSER_STATUS.filter((item) => item.value === searchParam.wserStatus)[0].label}`}
            size="small"
            onDelete={() => handleDelete('wserStatus')}
          />
        );
      }
      if (searchParam.registrationStatus) {
        chips.push(
          <Chip
            key="registrationStatus"
            label={`${REGISTRATION_STATUS.filter((item) => item.value === searchParam.registrationStatus)[0].label}`}
            size="small"
            onDelete={() => handleDelete('registrationStatus')}
          />
        );
      }
      if (searchParam.paymentStatus) {
        chips.push(
          <Chip
            key="paymentStatus"
            label={`${PAYMENT_STATUS.filter((item) => item.value === searchParam.paymentStatus)[0].label}`}
            size="small"
            onDelete={() => handleDelete('paymentStatus')}
          />
        );
      }
      setFilteredChips(chips);
      return chips;
    },
    [searchParam, handleDelete, allUser]
  );

  useEffect(() => {
    if (searchParam.conferenceIdx) {
      getTotalUserAmount(searchParam).then((result) => {
        handleChips(result.content);
      });
    }
    handleSearchParam(searchParam);
  }, [searchParam, handleChips, handleSearchParam]);
  return (
    <Stack spacing={4} sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Label label="그룹 선택*" minWidth={100} />
        <Box>
          <Stack
            direction="row"
            spacing={'12px'}
            sx={{ alignItems: 'flex-end', flexWrap: 'wrap' }}
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
                value={wserStatus}
              >
                <Option value="">선택</Option>
                {WUSER_STATUS.map((item) => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
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
          <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-end' }}>
            {filteredChips
              ? filteredChips
              : '그룹을 선택하여 전송대상을 추가해 주세요.'}
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
};

export { Filters };

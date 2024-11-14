import { Label } from '@/components/core/Label';
import { CheckBoxMinusIcon } from '@/components/icons/CheckBoxMinusIcon';
import {
  isDuplicatedPhoneNumber,
  isValidName,
  isValidPhoneNumber,
} from '@/lib/isValidContacts';
import { DirectUser } from '@/types/user';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';

interface AddUserDirectlyProps {
  addedUsers: DirectUser[];
  handleAddedUser: (user: DirectUser[]) => void;
  searchParamError: boolean;
}

const AddUserDirectly = ({
  addedUsers,
  handleAddedUser,
  searchParamError,
}: AddUserDirectlyProps) => {
  const [phone, setPhone] = useState<string>('');
  const [isPhoneError, setIsPhoneError] = useState<boolean>(false);
  const [phoneErrorMessage, setPhoneErrorMessage] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isNameError, setIsNameError] = useState<boolean>(false);
  const [nameErrorMessage, setNameErrorMessage] = useState<string>('');

  const checkContactIsValid = () => {
    setIsPhoneError(false);
    setIsNameError(false);
    setPhoneErrorMessage('');
    setNameErrorMessage('');

    let error = false;
    if (!phone || phone.length === 0) {
      setIsPhoneError(true);
      setPhoneErrorMessage('휴대폰 번호를 입력해주세요.');
      error = true;
    } else if (!isValidPhoneNumber(phone)) {
      setIsPhoneError(true);
      setPhoneErrorMessage('연락처를 다시 확인해 주세요.');
      error = true;
    } else if (isDuplicatedPhoneNumber(phone, addedUsers)) {
      setIsPhoneError(true);
      setPhoneErrorMessage('이미 추가된 연락처 입니다.');
      error = true;
    }

    if (name.length !== 0) {
      if (!isValidName(name)) {
        setIsNameError(true);
        setNameErrorMessage('형식에 맞지 않습니다.');
        error = true;
      } else if (name.length === 1) {
        setIsNameError(true);
        setNameErrorMessage('2자 이상 입력해 주세요.');
        error = true;
      }
    }
    return error;
  };

  const handleAddUser = () => {
    if (!checkContactIsValid()) {
      const newUsers = addedUsers.concat({
        name: name === '' ? '-' : name,
        phone: phone,
      });
      handleAddedUser(newUsers);
    }
  };

  const handleRemoveUser = (index: number) => {
    const newUsers = addedUsers.filter((_, idx) => idx !== index);
    handleAddedUser(newUsers);
  };

  return (
    <Stack spacing={3} sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Label label="정보 입력" minWidth={100} bold />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <Box>
            <TextField
              label="휴대폰 번호"
              sx={{ p: 0, width: 240 }}
              InputProps={{
                sx: {
                  height: 44,
                },
              }}
              inputProps={{ maxLength: 13 }}
              error={isPhoneError}
              placeholder="ex)010-2345-6789"
              helperText={phoneErrorMessage}
              fullWidth
              value={phone}
              onChange={(e) => {
                setPhone(
                  e.target.value
                    .replace(/[^0-9-]/g, '')
                    .replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
                );
              }}
            />
            <TextField
              label="이름"
              sx={{ p: 0, width: 240, ml: 1 }}
              InputProps={{
                sx: {
                  height: 44,
                },
              }}
              error={isNameError}
              placeholder="ex) 김메디"
              helperText={nameErrorMessage}
              fullWidth
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </Box>
          <Box sx={{ top: '10px', position: 'absolute', right: '-64px' }}>
            <Button
              sx={{ px: 2, py: 1, top: '10px', ml: 1 }}
              variant="contained"
              color="secondary"
              onClick={() => handleAddUser()}
            >
              추가
            </Button>
          </Box>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
        <Label label="전송 대상*" minWidth={100} bold />
        <Box>
          {addedUsers.length === 0 ? (
            <span
              className={`text-14 leading-18 h-26 ${searchParamError && 'text-error-main'}`}
            >
              회원을 선택하여 전송대상을 추가해 주세요.
            </span>
          ) : (
            <>
              <span className="text-14 font-bold">
                총 {addedUsers.length}명
              </span>
              <div
                className="flex flex-col gap-8 py-10 overflow-y-auto text-14 font-medium"
                style={{ maxHeight: 250, width: 240 }}
              >
                {addedUsers.map((item, index) => (
                  <div className="flex items-center" key={item.phone}>
                    <IconButton onClick={() => handleRemoveUser(index)}>
                      <CheckBoxMinusIcon />
                    </IconButton>
                    <span>
                      {item.phone}, {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Box>
      </Box>
    </Stack>
  );
};

export { AddUserDirectly };

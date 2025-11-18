import { DirectUser } from '@/types/user';

export const isValidPhoneNumber = (phoneNumber: string) => {
  const regex = /^\d{3}-\d{4}-\d{4}$/;
  return regex.test(phoneNumber);
};

export const isDuplicatedPhoneNumber = (
  phoneNumber: string,
  users: DirectUser[]
) => {
  for (const contact of users) {
    if (contact.phone === phoneNumber) {
      return true; // 전화번호가 존재함
    }
  }
  return false; // 전화번호가 존재하지 않음
};

export const isValidName = (name: string) => {
  const regex =
    /^(?!.*[ㄱ-ㅎ]+$)(?!.*[ㅏ-ㅣ]+$)(?!.*[ㄱ-ㅎ]+[ㅏ-ㅣ]*[ㄱ-ㅎ]$)(?!.*[가-힣]*[ㄱ-ㅎ]+)[가-힣a-zA-Z\s]+$/;
  return regex.test(name);
};

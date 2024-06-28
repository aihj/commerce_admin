import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface SignUpState {
  name: string;
  birthDate: string;
  gender: string;
  ntvFrnrCd: string;
  phone: string;
  email: string;
  telComCd: string;
}

const initialState: SignUpState = {
  name: '',
  birthDate: '',
  gender: '',
  ntvFrnrCd: '',
  phone: '',
  email: '',
  telComCd: '',
};

const signUpSlice = createSlice({
  name: 'signUp',
  initialState,
  reducers: {
    STORE_PHONE_VERIFICATION_INFO(state, action) {
      return { ...state, ...action.payload };
    },
    RESET_PHONE_VERIFICATION_INFO(state) {
      return {
        ...state,
        name: '',
        birthDate: '',
        gender: '',
        ntvFrnrCd: '',
        phone: '',
        telComCd: '',
      };
    },
    STORE_EMAIL_VERIFICATION_INFO(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  STORE_PHONE_VERIFICATION_INFO,
  RESET_PHONE_VERIFICATION_INFO,
  STORE_EMAIL_VERIFICATION_INFO,
} = signUpSlice.actions;

export const selectSignUpUserInfo = (state: RootState) => state.signUp;

export default signUpSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/user';
import { RootState } from '../store';

const initialState: User = {
  serviceType: process.env.NEXT_PUBLIC_AUTH_TYPE,
  wuserStatus: '',
  wuserIdx: null,
  wroleNameList: [],
};

// Create a Redux slice for managing card data
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    UPDATE_USER: (state, action: PayloadAction<any>) => {
      console.log('UPDATE_USER');
      console.log(action.payload);
      return { ...state, ...action.payload };
    },
    LOGOUT_USER: () => {
      console.log('initialState', initialState);
      return { ...initialState };
    },
  },
});

export const { UPDATE_USER, LOGOUT_USER } = userSlice.actions;

export const selectServiceType = (state: RootState) => state.user.serviceType;
export const selectWUserIdx = (state: RootState) => state.user.wuserIdx;
export const selectUserRoleNameList = (state: RootState) =>
  state.user.wroleNameList;

export default userSlice.reducer;

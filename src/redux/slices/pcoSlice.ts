import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface Pco {
  conferenceIdx: number | null;
  conferenceStringIdx: string;
  conferenceName: string;
  conferenceStartT: string;
  conferenceEndT: string;
  conferencePreRegiStartT: string;
  conferencePreRegiEndT: string;
  logoHost: string;
  logoPath: string;
  logoName: string;
  paymentMethod: string;
}

const initialState: Pco = {
  conferenceIdx: null,
  conferenceStringIdx: '',
  conferenceName: '',
  conferenceStartT: '',
  conferenceEndT: '',
  conferencePreRegiStartT: '',
  conferencePreRegiEndT: '',
  logoHost: '',
  logoPath: '',
  logoName: '',
  paymentMethod: '',
};

// Create a Redux slice for managing card data
const pcoSlice = createSlice({
  name: 'pco',
  initialState,
  reducers: {
    UPDATE_PCO(state, action: PayloadAction<any>) {
      return { ...state, ...action.payload };
    },
    DELETE_PCO() {
      return { ...initialState };
    },
  },
});

export const { UPDATE_PCO, DELETE_PCO } = pcoSlice.actions;

export const selectConferenceIdx = (state: RootState) =>
  state.pco.conferenceIdx;

export const selectConferenceStringIdx = (state: RootState) =>
  state.pco.conferenceStringIdx;

export const selectConferenceName = (state: RootState) =>
  state.pco.conferenceName;

export default pcoSlice.reducer;

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
}

const initialState: Pco = {
  conferenceIdx: null,
  conferenceStringIdx: '',
  conferenceName: '',
  conferenceStartT: '',
  conferenceEndT: '',
  conferencePreRegiStartT: '',
  conferencePreRegiEndT: '',
};

// Create a Redux slice for managing card data
const pcoSlice = createSlice({
  name: 'pco',
  initialState,
  reducers: {
    UPDATE_PCO(state, action: PayloadAction<any>) {
      return { ...state, ...action.payload };
    },
  },
});

export const { UPDATE_PCO } = pcoSlice.actions;

export const selectConferenceIdx = (state: RootState) =>
  state.pco.conferenceIdx;

export default pcoSlice.reducer;

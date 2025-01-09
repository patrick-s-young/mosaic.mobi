import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum NavPhaseEnum {
  UPLOAD,
  EDIT,
  DOWNLOAD
}

export interface NavPhase {
  navPhase: NavPhaseEnum
}

export type NavState = NavPhase;

const initialState: NavState = {
  navPhase: NavPhaseEnum.UPLOAD
}

const navSlice = createSlice ({
  name: 'nav',
  initialState,
  reducers: {
    setNavPhase (state, action: PayloadAction<NavPhase>) {
      state.navPhase = action.payload.navPhase;
    }
  }
});

export const {
  setNavPhase
} = navSlice.actions;

export type SetNavPhase = ReturnType <typeof setNavPhase>;

export default navSlice.reducer;

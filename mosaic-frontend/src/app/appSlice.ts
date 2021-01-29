import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum AppPhaseEnum {
  INIT_SESSION,
  LOADING,
  NOT_LOADING
}

export interface AppPhase {
  appPhase: AppPhaseEnum
}

export type AppState = AppPhase;

const initialState: AppState = {
  appPhase: AppPhaseEnum.INIT_SESSION
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppPhase (state, action: PayloadAction<AppPhase>) {
      state.appPhase = action.payload.appPhase;
    }
  }
});

export const {
  setAppPhase
} = appSlice.actions;

export type SetAppPhase = ReturnType<typeof setAppPhase>;

export default appSlice.reducer;
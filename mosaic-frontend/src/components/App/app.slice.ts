import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export enum AppPhaseEnum {
  INIT_SESSION,
  LOADING,
  NOT_LOADING,
}

export interface AppPhase {
  appPhase: AppPhaseEnum
}

export type AppState = AppPhase & { canvasWidth: number }


const initialState: AppState = {
  appPhase: AppPhaseEnum.LOADING,
  canvasWidth: 0
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppPhase (state, action: PayloadAction<AppPhase>) {
      state.appPhase = action.payload.appPhase;
    },
    setCanvasWidth (state, action: PayloadAction<{ canvasWidth: number}>) {
      state.canvasWidth = action.payload.canvasWidth;
    }
  }
});

export const {
  setAppPhase,
  setCanvasWidth
} = appSlice.actions;

export type SetAppPhase = ReturnType<typeof setAppPhase>;
export type SetCanvasWidth = ReturnType<typeof setCanvasWidth>;

export default appSlice.reducer;
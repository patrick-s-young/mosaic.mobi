import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppPhaseEnum } from '@typescript/enums';
import { AppState } from '@interfaces/AppState';
import type { AspectRatio } from '@typescript/types';

const initialState: AppState = {
  appPhase: AppPhaseEnum.LOADING,
  canvasWidth: 0,
  aspectRatio: '1x1',
  uiVisible: true
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppPhase (state, action: PayloadAction<{ appPhase: AppPhaseEnum }>) {
      state.appPhase = action.payload.appPhase;
    },
    setCanvasWidth (state, action: PayloadAction<{ canvasWidth: number}>) {
      state.canvasWidth = action.payload.canvasWidth;
    },
    setAspectRatio (state, action: PayloadAction<{ aspectRatio: AspectRatio }>) {
      state.aspectRatio = action.payload.aspectRatio;
      // controls are always shown again when the aspect ratio changes
      state.uiVisible = true;
    },
    setUiVisible (state, action: PayloadAction<{ uiVisible: boolean }>) {
      state.uiVisible = action.payload.uiVisible;
    }
  }
});

export const {
  setAppPhase,
  setCanvasWidth,
  setAspectRatio,
  setUiVisible
} = appSlice.actions;

export default appSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppPhaseEnum } from '@typescript/enums';
import { AppState } from '@interfaces/AppState';
import type { AppHintKind, AspectRatio } from '@typescript/types';

const initialState: AppState = {
  appPhase: AppPhaseEnum.LOADING,
  canvasWidth: 0,
  aspectRatio: '9x16',
  uiVisible: true,
  hint: undefined,
  keepSound: false
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
    },
    setHint (state, action: PayloadAction<{ hint: AppHintKind | undefined }>) {
      state.hint = action.payload.hint;
    },
    setKeepSound (state, action: PayloadAction<{ keepSound: boolean }>) {
      state.keepSound = action.payload.keepSound;
    }
  }
});

export const {
  setAppPhase,
  setCanvasWidth,
  setAspectRatio,
  setUiVisible,
  setHint,
  setKeepSound
} = appSlice.actions;

export default appSlice.reducer;

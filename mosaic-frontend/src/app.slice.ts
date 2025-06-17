import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppPhaseEnum } from '@typescript/enums';
import { AppState } from '@interfaces/AppState';

const initialState: AppState = {
  appPhase: AppPhaseEnum.LOADING,
  canvasWidth: 0
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
    }
  }
});

export const {
  setAppPhase,
  setCanvasWidth
} = appSlice.actions;

export default appSlice.reducer;
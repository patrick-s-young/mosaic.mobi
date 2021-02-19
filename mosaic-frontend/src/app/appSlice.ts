import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface DeviceProfile {
  name: string
  popOver: { width: number, height: number }
  videoArea: { width: number, height: number }
  scrubberSlider:  { width: number, height: number }
  mosaicSelector:  { width: number, height: number }
  navigation:  { width: number, height: number }
}


export enum AppPhaseEnum {
  INIT_SESSION,
  LOADING,
  NOT_LOADING
}

export interface AppPhase {
  appPhase: AppPhaseEnum
}

export type AppState = 
AppPhase 
& { canvasWidth: number }
& { deviceProfiles: Array<DeviceProfile> }
& { deviceIndex: number }

const initialState: AppState = {
  appPhase: AppPhaseEnum.INIT_SESSION,
  deviceIndex: 0,
  deviceProfiles: [
    {
      name: 'iPhone XR',
      popOver: { width: 414, height: 580 },
      videoArea: { width: 414, height: 414 },
      scrubberSlider: { width: 414, height: 90 },
      mosaicSelector: { width: 414, height: 72 },
      navigation: { width: 414, height: 120 }
    }
  ],
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
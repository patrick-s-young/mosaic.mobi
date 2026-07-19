import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SCRUBBER_FRAMES_MAX } from '@/app.config';
import { ScrubberState } from '@interfaces/ScrubberState';
import { CurrentScrubberFrame } from '@typescript/types';


export const initialState: ScrubberState = {
  scrubberFramesMax: SCRUBBER_FRAMES_MAX,
  currentScrubberFrame: Math.floor(SCRUBBER_FRAMES_MAX / 2),
  canvasWidth: 0,
  videoUploadCount: 0
}

const scrubberSlice = createSlice({
  name: 'scrubber',
  initialState,
  reducers: {
    setScrubberCanvasWidth (state, action: PayloadAction<{canvasWidth: number}>) {
      state.canvasWidth = action.payload.canvasWidth;
    },
    setCurrentScrubberFrame (state, action: PayloadAction<CurrentScrubberFrame>) {
      state.currentScrubberFrame = action.payload;
    },
    setVideoUploadCount (state, action: PayloadAction<{increment: number}>) {
      state.videoUploadCount += action.payload.increment;
    }

  }
});

export const {
  setScrubberCanvasWidth,
  setCurrentScrubberFrame,
  setVideoUploadCount
} = scrubberSlice.actions;

export default scrubberSlice.reducer;

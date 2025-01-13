import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { defaultMosaic } from '@components/App/app.config';

export type CurrentScrubberFrame = number;

export interface ScrubberState {
  currentScrubberFrame: CurrentScrubberFrame,
  scrubberFramesMax: number,
  canvasWidth: number,
  videoUploadCount: number
}

export const initialState: ScrubberState = {
  scrubberFramesMax: defaultMosaic.scrubberFramesMax,
  currentScrubberFrame: defaultMosaic.currentScrubberFrame,
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

export type SetScrubberCanvasWidth = ReturnType<typeof setScrubberCanvasWidth>;
export type SetCurrentScrubberFrame = ReturnType<typeof setCurrentScrubberFrame>;
export type SetVideoUploadCount = ReturnType<typeof setVideoUploadCount>;

export default scrubberSlice.reducer;

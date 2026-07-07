import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// helpers
import {
  getInPoints,
  getTileAnimEvents,
  getDrawToCanvasArea,
  getCopyVideoFromArea
}  from '@components/MosaicTiles/helpers';
import { defaultVideoConfig, DEFAULT_VIDEO_NUM_TILES, getAspectHeight } from '@/app.config';
// enums
import { MosaicPhaseEnum } from '@enums/MosaicPhaseEnum';
// interfaces
import { MosaicState } from '@interfaces/MosaicState';
// types
import { NumTiles, AspectRatio } from '@typescript/types';


// TODO: move to config
export const numTilesAllPossibleValues: Array<NumTiles> = [2, 3, 4, 6, 9];
const defaultVideoNumTiles: NumTiles = defaultVideoConfig.numTiles as NumTiles;
const userVideoNumTiles: NumTiles = DEFAULT_VIDEO_NUM_TILES;


const initialState: Partial<MosaicState> = {
  mosaicPhase: MosaicPhaseEnum.WAITING_FOR_VIDEO,
  canvasWidth: undefined,
  canvasHeight: undefined,
  inPoints: undefined,
  copyVideoFromArea: undefined,
  drawToCanvasArea: undefined,
  tileAnimEvents: undefined,
  isDefaultVideo: true
}

const mosaicSlice = createSlice({
  name: 'mosaic',
  initialState,
  reducers: {
    setMosaicPhase (state, action: PayloadAction<{mosaicPhase: MosaicPhaseEnum}>) {
      state.mosaicPhase = action.payload.mosaicPhase;
    },
    setMosaicFormatting (state, action: PayloadAction<{duration: number, videoWidth: number, canvasWidth: number, aspectRatio: AspectRatio}>) {
      const { duration, videoWidth, canvasWidth, aspectRatio } = action.payload;
      const videoHeight = getAspectHeight(videoWidth, aspectRatio);
      const canvasHeight = getAspectHeight(canvasWidth, aspectRatio);
      state.inPoints = getInPoints(duration);
      state.copyVideoFromArea = getCopyVideoFromArea(videoWidth, videoHeight);
      state.tileAnimEvents = getTileAnimEvents();
      state.canvasWidth = canvasWidth;
      state.canvasHeight = canvasHeight;
      state.drawToCanvasArea = getDrawToCanvasArea(canvasWidth, canvasHeight);
      state.numTiles = state.isDefaultVideo ? defaultVideoNumTiles : userVideoNumTiles;
      state.isDefaultVideo = false;
      state.mosaicPhase = MosaicPhaseEnum.ANIMATION_STOPPED;
    },
    // recomputes tile geometry for a new aspect ratio without changing the
    // uploaded video or the user's current tile count; used when toggling 1:1 / 9:16
    setAspectFormatting (state, action: PayloadAction<{videoWidth: number, canvasWidth: number, aspectRatio: AspectRatio}>) {
      const { videoWidth, canvasWidth, aspectRatio } = action.payload;
      const videoHeight = getAspectHeight(videoWidth, aspectRatio);
      const canvasHeight = getAspectHeight(canvasWidth, aspectRatio);
      state.copyVideoFromArea = getCopyVideoFromArea(videoWidth, videoHeight);
      state.canvasWidth = canvasWidth;
      state.canvasHeight = canvasHeight;
      state.drawToCanvasArea = getDrawToCanvasArea(canvasWidth, canvasHeight);
      // reuse the cancel-then-rebuild cycle so the running animation is torn
      // down before tiles are recreated with the new geometry / preview source
      state.mosaicPhase = MosaicPhaseEnum.NUMTILES_UPDATED;
    },
    setNumTiles (state, action: PayloadAction<NumTiles>) {
      const numTiles = action.payload;
      state.numTiles = numTiles;
      state.mosaicPhase = MosaicPhaseEnum.NUMTILES_UPDATED;
    }
  }
});

export const {
  setMosaicPhase,
  setMosaicFormatting,
  setAspectFormatting,
  setNumTiles
} = mosaicSlice.actions;

export type SetMosaicPhase = ReturnType<typeof setMosaicPhase>;
export type SetMosaicFormatting = ReturnType<typeof setMosaicFormatting>;
export type SetAspectFormatting = ReturnType<typeof setAspectFormatting>;
export type SetNumTiles = ReturnType<typeof setNumTiles>;
export default mosaicSlice.reducer;
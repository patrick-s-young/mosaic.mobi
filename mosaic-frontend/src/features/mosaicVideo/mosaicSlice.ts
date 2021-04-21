import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import {
  getInPoints,
  getTileAnimEvents,
<<<<<<< HEAD
  getDrawToCanvasArea,
  getCopyVideoFromArea
=======
  getCopyVideoFromUvs,
  tileTranslation,
  tileVertices
>>>>>>> MOS-94-webgl-rendering-on-webkit-gecko
}  from 'features/mosaicVideo/helpers';

export enum MosaicPhaseEnum {
  WAITING_FOR_VIDEO,
  NUMTILES_UPDATED,
  ANIMATION_STOPPED,
  TILES_UPDATED,
  ANIMATION_STARTED,
  CANCEL_ANIMATION,
  DEBUG_PAUSE
}

export interface MosaicPhase {
  mosaicPhase: MosaicPhaseEnum
}

export type NumTiles = 2 | 3 | 4 | 6 | 9;
export type NumTilesToString = '2' | '3' | '4' | '6' | '9';
export type Rect = { x: number, y: number, width: number, height: number };
export type RectGroup = Array<Rect>;
export type RectGroupCollection = { [key in NumTilesToString] : RectGroup };
export type RectCollection = { [key in NumTilesToString]: Rect }
export type Action = { time: number, action: string }
export type ActionGroup = Array<Array<Action>>;
export type ActionGroupCollection = { [key in NumTilesToString] : ActionGroup };
export type Time = number;
export type TimeGroup = Array<Time>;
export type TimeGroupCollection = { [key in NumTilesToString] : TimeGroup };
<<<<<<< HEAD

=======
export type UvsCollection = { [key in NumTilesToString]: Array<number> };
export type TileVertices = { [key in NumTilesToString] : Array<number> };
export type TileTranslation = { [key in NumTilesToString] : Array<Array<number>> };
>>>>>>> MOS-94-webgl-rendering-on-webkit-gecko

export interface MosaicFormatting {
  numTiles: NumTiles,
  canvasWidth: number,
  inPoints: TimeGroupCollection,
<<<<<<< HEAD
  copyVideoFromArea: RectCollection,
  drawToCanvasArea: RectGroupCollection,
=======
  copyVideoFromUvs: UvsCollection,
>>>>>>> MOS-94-webgl-rendering-on-webkit-gecko
  tileAnimEvents: ActionGroupCollection,
  tileTranslation: TileTranslation,
  tileVertices: TileVertices
}

export type MosaicState = MosaicFormatting & MosaicPhase;

export const numTilesAllPossibleValues: Array<NumTiles> = [2, 3, 4, 6, 9];
const numTilesDefault: NumTiles = 9;
const initialState: Partial<MosaicState> = {
  mosaicPhase: MosaicPhaseEnum.WAITING_FOR_VIDEO,
  canvasWidth: undefined,
  inPoints: undefined,
<<<<<<< HEAD
  copyVideoFromArea: undefined,
  drawToCanvasArea: undefined,
  tileAnimEvents: undefined
=======
  tileAnimEvents: undefined,
  tileTranslation,
  tileVertices
>>>>>>> MOS-94-webgl-rendering-on-webkit-gecko
}

const mosaicSlice = createSlice({
  name: 'mosaic',
  initialState,
  reducers: {
    setMosaicPhase (state, action: PayloadAction<MosaicPhase>) {
      state.mosaicPhase = action.payload.mosaicPhase;
    },
    setMosaicFormatting (state, action: PayloadAction<{duration: number, videoWidth: number, canvasWidth: number}>) {
      const { duration, videoWidth, canvasWidth } = action.payload;
      state.inPoints = getInPoints(duration);
      state.copyVideoFromArea = getCopyVideoFromArea(videoWidth, videoWidth);
      state.tileAnimEvents = getTileAnimEvents();
      state.canvasWidth = canvasWidth;
<<<<<<< HEAD
      state.drawToCanvasArea = getDrawToCanvasArea(state.canvasWidth, state.canvasWidth);
=======
>>>>>>> MOS-94-webgl-rendering-on-webkit-gecko
      state.numTiles = numTilesDefault;
      state.mosaicPhase = MosaicPhaseEnum.ANIMATION_STOPPED;
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
  setNumTiles
} = mosaicSlice.actions;

export type SetMosaicPhase = ReturnType<typeof setMosaicPhase>;
export type SetMosaicFormatting = ReturnType<typeof setMosaicFormatting>;
export type SetNumTiles = ReturnType<typeof setNumTiles>;
export default mosaicSlice.reducer;
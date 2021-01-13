import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getInPoints,
  getTileAnimEvents,
  getDrawToCanvasArea,
  getCopyVideoFromArea
}  from 'features/mosaicVideo/helpers';

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


export interface MosaicState{
  numTiles: NumTiles,
  canvasWidth: number,
  inPoints: TimeGroupCollection,
  copyVideoFromArea: RectCollection,
  drawToCanvasArea: RectGroupCollection,
  tileAnimEvents: ActionGroupCollection
}

export const numTilesAllPossibleValues: Array<NumTiles> = [2, 3, 4, 6, 9];
const numTilesDefault: NumTiles = 3;
const initialState: Partial<MosaicState> = {
  numTiles: undefined,
  canvasWidth: undefined,
  inPoints: undefined,
  copyVideoFromArea: undefined,
  drawToCanvasArea: undefined,
  tileAnimEvents: undefined
}

const mosaicSlice = createSlice({
  name: 'mosaic',
  initialState,
  reducers: {
    setMosaicVideo (state, action: PayloadAction<{duration: number, width: number, height: number}>) {
      const { duration, width, height } = action.payload;
      if (duration && width && height) {
        state.inPoints = getInPoints(duration);
        state.copyVideoFromArea = getCopyVideoFromArea(width, height);
        state.tileAnimEvents = getTileAnimEvents();
        state.canvasWidth = width; //375; //width > window.innerWidth ? window.innerWidth : width;
        state.drawToCanvasArea = getDrawToCanvasArea(state.canvasWidth, state.canvasWidth);
        state.numTiles = numTilesDefault;
      }
    },
    setNumTiles (state, action: PayloadAction<NumTiles>) {
      const numTiles = action.payload;
      state.numTiles = numTiles;
    }
  }
});

export const {
  setMosaicVideo,
  setNumTiles
} = mosaicSlice.actions;

export type SetMosaicVideo = ReturnType<typeof setMosaicVideo>;

export default mosaicSlice.reducer;
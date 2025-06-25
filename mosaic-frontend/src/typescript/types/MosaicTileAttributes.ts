import { CopyVideoFromArea, DrawToCanvasArea, TileAnimEvents } from "@typescript/types";

export type MosaicTileAttributes = { 
  inPoint: number, 
  copyVideoFromArea: CopyVideoFromArea, 
  drawToCanvasArea: DrawToCanvasArea, 
  tileAnimEvents: TileAnimEvents, 
  videoSrc: string, 
  context: CanvasRenderingContext2D 
};
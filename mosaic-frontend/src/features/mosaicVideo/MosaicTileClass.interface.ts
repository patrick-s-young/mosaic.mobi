export type CopyVideoFromArea =  { x: number, y: number, width: number, height: number };
export type DrawToCanvasArea = { x: number, y: number, width: number, height: number };
export type TileAnimEvents = Array<{ time: number, action: string }>;

export type Attributes = { 
  inPoint: number, 
  copyVideoFromArea: CopyVideoFromArea, 
  drawToCanvasArea: DrawToCanvasArea, 
  tileAnimEvents: TileAnimEvents, 
  videoSrc: string, 
  context: CanvasRenderingContext2D | undefined };

export interface MosaicTileClassInterface {
  nextEventTime: number | undefined;


  setAttributes: (attributes: Attributes) => void;
  currentEventAction: () => void;
  resetAnimation: () => void;
  clearAnimation: () => void;
  unloadVideoSrc: () => void;
  isReady: () => boolean;
  updateCurrentEventAction: () => void;
  initAnimation: () => void;
  _initFadeIn: () => void;
  _fadeIn: () => void;
  _fadeOut: () => void;
  _drawImage: () => void;
  _wait: () => void;
}
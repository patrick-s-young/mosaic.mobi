
type CopyVideoFromArea =  { x: number, y: number, width: number, height: number };
type DrawToCanvasArea = { x: number, y: number, width: number, height: number };
type TileAnimEvents = Array<{ time: number, action: string }>;
type Attributes = { inPoint: number, copyVideoFromArea: CopyVideoFromArea, drawToCanvasArea: DrawToCanvasArea, tileAnimEvents: TileAnimEvents, videoSrc: string, context: CanvasRenderingContext2D };

export interface MosaicTile {
  _video: HTMLVideoElement,
  _context: CanvasRenderingContext2D,
  _inPoint: number,
  _copyVideoFromArea: CopyVideoFromArea,
  _drawToCanvasArea: DrawToCanvasArea,
  _tileAnimEvents: TileAnimEvents,
  _fadeStartTime: number,
  _fadeDuration: number,
  _fadeOpacity: number,
  nextEventTime: number,
  _nextEventIndex: number,
  _maxEventIndex: number,
  _canPlayThrough: boolean,
  _seeking: boolean,
  isReady: () => boolean | undefined,
  initMosaicTile: (
    this: MosaicTile
  ) => void,
  setAttributes: (
    this: MosaicTile, 
    attributes: Attributes
  ) => void,
  resetAnimation: (
    this: MosaicTile
  ) => void,
  clearAnimation: (
    this: MosaicTile
  ) => void,
  currentEventAction: (
    this: MosaicTile
    ) => void,
  updateCurrentEventAction: (
    this: MosaicTile
  ) => void,
  unloadVideoSrc: (
    this: MosaicTile
  ) => void,
  _initFadeIn: (
    this: MosaicTile
  ) => void,
  _fadeIn: (
    this:MosaicTile
  ) => void,
  _initFadeOut: (
    this: MosaicTile
  ) => void,
  _fadeOut: (
    this:MosaicTile
  ) => void,
  _drawImage: (
    this: MosaicTile
  ) => void,
  _wait: (
    this:MosaicTile
  ) => void
}

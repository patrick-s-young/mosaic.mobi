
type CopyVideoFromArea =  { x: number, y: number, width: number, height: number };
type DrawToCanvasArea = { x: number, y: number, width: number, height: number };
type TileAnimEvents = Array<{ time: number, action: string }>;

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
  setVideoSrc: (
    this: MosaicTile, 
    videoSrc: string,
    ) => void,
  setContext: (
    this: MosaicTile,
    context: CanvasRenderingContext2D
  ) => void,
  setAttributes: (
    this: MosaicTile, 
    inPoint: number, 
    copyVideoFromArea: CopyVideoFromArea, 
    drawToCanvasArea: DrawToCanvasArea, 
    tileAnimEvents: TileAnimEvents
    ) => void,
  initAnimation: (
    this: MosaicTile
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

export const mosaicTile: Partial<MosaicTile> = {
  _video: undefined,
  _context: undefined,
  _inPoint: undefined,
  _copyVideoFromArea: undefined,
  _drawToCanvasArea: undefined,
  _tileAnimEvents: undefined,
  _fadeStartTime: undefined,
  _fadeDuration: 500,
  _fadeOpacity: undefined,
  nextEventTime: undefined,
  _nextEventIndex: undefined,
  _maxEventIndex: undefined,
  setVideoSrc(videoSrc) { 
    this._video = document.createElement('video');
    this._video.src = videoSrc;
    this._video.autoplay = true;
    this._video.loop = true;
    this._video.muted = true;
    this._video.setAttribute('webkit-playsinline', 'webkit-playsinline');
    this._video.setAttribute('playsinline', 'playsinline');
  },
  setContext(context) {
    this._context = context;
  },
  setAttributes(inPoint, copyVideoFromArea, drawToCanvasArea, tileAnimEvents) {
    this._inPoint = inPoint;
    this._copyVideoFromArea = copyVideoFromArea;
    this._drawToCanvasArea = drawToCanvasArea;
    this._tileAnimEvents = tileAnimEvents;
    this._maxEventIndex = this._tileAnimEvents.length;
  },
  initAnimation() {
    this.currentEventAction = this._wait;
    this._nextEventIndex = 0;
    this.nextEventTime = this._tileAnimEvents[this._nextEventIndex].time;
    this._video.currentTime = this._inPoint;
  },
  resetAnimation() {
    this._nextEventIndex = 0;
    this.nextEventTime = this._tileAnimEvents[this._nextEventIndex].time;
  },
  clearAnimation() {
    this.currentEventAction = this._wait;
    this._video.pause();
    this._video.removeAttribute('src');
    this._video.load();
  },
  currentEventAction() {},
  updateCurrentEventAction() {
    const newCurrentEventAction = this._tileAnimEvents[this._nextEventIndex].action;
    this._nextEventIndex = (this._nextEventIndex + 1) % this._maxEventIndex;
    this.nextEventTime = this._tileAnimEvents[this._nextEventIndex].time;

    switch(newCurrentEventAction) {
      case 'fadeIn':
        this._initFadeIn();
        break;
      case 'fadeOut':
        this._initFadeOut();
        break;
      default:
        console.log(`ERROR: no case for ${newCurrentEventAction}`); // todo: add error handling
    }
  },
  _initFadeIn() {
    this._video.currentTime = this._inPoint;
    this._fadeStartTime = Date.now();
    this._video.play();
    this.currentEventAction = this._fadeIn;
  },
  _fadeIn() {
      const timeElapsed = Date.now() - this._fadeStartTime;
      this._fadeOpacity = timeElapsed / this._fadeDuration;
      if (this._fadeOpacity > 1) {
        this._fadeOpacity = 1;
        this.currentEventAction = this._drawImage;
        return;
      }
      this._drawImage();
  },
  _initFadeOut() {
    this._fadeStartTime = Date.now();
    this.currentEventAction = this._fadeOut;
  },
  _fadeOut() {
      const timeElapsed = Date.now() - this._fadeStartTime;
      this._fadeOpacity = 1 - timeElapsed / this._fadeDuration;
      if (this._fadeOpacity < 0) {
        this._fadeOpacity = 0;
        this._drawImage();
        this._video.pause();
        this._video.currentTime = this._inPoint;
        this.currentEventAction = this._wait;
        return;
      }
      this._drawImage();
  },
  _drawImage() {
    if (this._drawToCanvasArea.width === 0) return;

    this._context.clearRect(
      this._drawToCanvasArea.x, 
      this._drawToCanvasArea.y, 
      this._drawToCanvasArea.width, 
      this._drawToCanvasArea.height
    );

    this._context.globalAlpha = this._fadeOpacity;

    this._context.drawImage(
      this._video,
      this._copyVideoFromArea.x, 
      this._copyVideoFromArea.y, 
      this._copyVideoFromArea.width, 
      this._copyVideoFromArea.height,
      this._drawToCanvasArea.x, 
      this._drawToCanvasArea.y, 
      this._drawToCanvasArea.width, 
      this._drawToCanvasArea.height
    );
  },
  _wait() {}
}




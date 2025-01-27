import { MosaicTileProps } from '@/typescript/interfaces/MosaicTileProps';
import { CopyVideoFromArea, DrawToCanvasArea, TileAnimEvents, MosaicTileAttributes } from '@typescript/types';

// move to config
const FADE_DURATION = 500;

class MosaicTile implements Partial<MosaicTileProps> {
  nextEventTime: number | undefined;
  _canPlayThrough: boolean;
  _context: CanvasRenderingContext2D | undefined;
  _copyVideoFromArea: CopyVideoFromArea | undefined;
  _drawToCanvasArea: DrawToCanvasArea | undefined;
  _fadeOpacity: number | undefined;
  _fadeStartTime: number | undefined;
  _inPoint: number | undefined;
  _maxEventIndex: number | undefined;
  _nextEventIndex: number;
  _seeking: boolean;
  _tileAnimEvents: TileAnimEvents | undefined;
  _video: HTMLVideoElement;


  constructor() {
    this._video = document.createElement('video');
    this._video.loop = true;
    this._video.muted = true;
    this._video.setAttribute('webkit-playsinline', 'webkit-playsinline');
    this._video.setAttribute('playsinline', 'playsinline');
    this._canPlayThrough = false;
    this._seeking = true;
    this._nextEventIndex = 0;
    this._video.oncanplaythrough = () => {
      this._canPlayThrough = true;
    }
    this._video.onseeking = () => {
      this._seeking = true;
    }
    this._video.onseeked = () => {
      this._seeking = false;
    }
  }

  setAttributes(attributes: MosaicTileAttributes) {
    const { inPoint, copyVideoFromArea, drawToCanvasArea, tileAnimEvents, videoSrc, context } = attributes;
    this._video.src = videoSrc;
    this._video.pause();
    this._video.muted = true;
    this._context = context;
    this._inPoint = inPoint;
    this._copyVideoFromArea = copyVideoFromArea;
    this._drawToCanvasArea = drawToCanvasArea;
    this._tileAnimEvents = tileAnimEvents;
    this._maxEventIndex = this._tileAnimEvents?.length ?? 0;
    this._video.autoplay = true;
    this._canPlayThrough = false;
    this._seeking = true;
    this.currentEventAction = this._wait;
  }

  initAnimation() {
    this.currentEventAction = this._wait;
    this._nextEventIndex = 0;
    this.nextEventTime = this._tileAnimEvents?.[this._nextEventIndex ?? 0]?.time;
    this._video.currentTime = this._inPoint ?? 0;
  }

  resetAnimation() {
    this._nextEventIndex = 0;
    this.nextEventTime = this._tileAnimEvents?.[this._nextEventIndex]?.time;
  }

  clearAnimation() {
    this.currentEventAction = this._wait;
    this._video.pause();
    this._video.removeAttribute('src');
    this._video.load();
  }

  unloadVideoSrc() {
    this.currentEventAction = this._wait;
    this._video.removeAttribute('src');
    this._video.load();
  }

  currentEventAction() {}
  updateCurrentEventAction() {
    const newCurrentEventAction = this._tileAnimEvents?.[this._nextEventIndex ?? 0]?.action;
    this._nextEventIndex = (this._nextEventIndex + 1) % (this._maxEventIndex ?? 1);
    this.nextEventTime = this._tileAnimEvents?.[this._nextEventIndex ?? 0]?.time;

    switch(newCurrentEventAction) {
      case 'fadeIn':
        this._initFadeIn();
        break;
      case 'fadeOut':
        this._initFadeOut();
        break;
      default:
        console.warn(`ERROR: no case for ${newCurrentEventAction}`); // todo: add error handling
    }
  }

  _initFadeIn() {
    const playPromise = this._video.play();
    if (playPromise !== undefined) {
      playPromise.then(_ => {
        this._video.currentTime = this._inPoint ?? 0;
        this._fadeStartTime = Date.now();
        this.currentEventAction = this._fadeIn;
      })
      .catch(error => {
        console.warn(`Auto-play was prevented by error: ${error}`);
      });
    }
    this._video.play();
    this._fadeStartTime = Date.now();
    this.currentEventAction = this._fadeIn;
  }

  _fadeIn() {
    const timeElapsed = Date.now() - (this._fadeStartTime ?? 0);
    this._fadeOpacity = timeElapsed / FADE_DURATION;
    if (this._fadeOpacity > 1) {
      this._fadeOpacity = 1;
      this.currentEventAction = this._drawImage;
      return;
    }
    this._drawImage();
  }
  _initFadeOut() {
    this._fadeStartTime = Date.now();
    this.currentEventAction = this._fadeOut;
  }

  _fadeOut() {
    if (!this._fadeStartTime) return;
    const timeElapsed = Date.now() - this._fadeStartTime;
    this._fadeOpacity = 1 - timeElapsed / FADE_DURATION;
    if (this._fadeOpacity < 0) {
      this._fadeOpacity = 0;
      this._drawImage();
      this._video.pause();
      this._video.currentTime = this._inPoint ?? 0;
      this.currentEventAction = this._wait;
      return;
    }
    this._drawImage();
  }

  _drawImage() {
    if (!this._drawToCanvasArea || !this._context || !this._copyVideoFromArea) {
      console.warn('abort _drawImage');
      return;
    }
    
    this._context.clearRect(
      this._drawToCanvasArea.x, 
      this._drawToCanvasArea.y, 
      this._drawToCanvasArea.width, 
      this._drawToCanvasArea.height
    );

    this._context.globalAlpha = this._fadeOpacity ?? 1;

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
  }

  _wait() {}
}

export default MosaicTile;
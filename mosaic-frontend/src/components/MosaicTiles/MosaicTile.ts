import { MosaicTileProps } from '@/typescript/interfaces/MosaicTileProps';
import { CopyVideoFromArea, DrawToCanvasArea, TileAnimEvents, MosaicTileAttributes } from '@typescript/types';
import { mosaicTileConfig } from '@/app.config';

const { ANIMATION_CYCLE_DURATION, FADE_DURATION, FULL_OPACTIY_DURATION } = mosaicTileConfig;

class MosaicTile implements Partial<MosaicTileProps> {
  _beginTime: DOMHighResTimeStamp = 0;
  _canPlayThrough: boolean = false;
  _context: CanvasRenderingContext2D;
  _copyVideoFromArea: CopyVideoFromArea;
  _drawToCanvasArea: DrawToCanvasArea;
  _fadeInStartTime: number = 0;
  _fadeOpacity: number = 0;
  _fadeOutStartTime: number = 0;
  _fullOpacityStartTime: number = 0;
  _inPoint: number;
  _nextEventIndex: number = 0;
  _nextEventTime: number = 0;
  _seeking: boolean = true;
  _tileAnimEvents: TileAnimEvents = [];
  _video: HTMLVideoElement = document.createElement('video');


  constructor(attributes: MosaicTileAttributes) {
    const { inPoint, copyVideoFromArea, drawToCanvasArea, tileAnimEvents, videoSrc, context } = attributes;
    this._inPoint = inPoint;
    this._copyVideoFromArea = copyVideoFromArea;
    this._drawToCanvasArea = drawToCanvasArea;
    this._tileAnimEvents = tileAnimEvents;
    this._context = context;

    this._nextEventTime = this._tileAnimEvents[this._nextEventIndex];
    this._renderFrame = this._wait;
    this._initVideo(videoSrc);
  }

  // Public methods
  isReady() {
    return this._canPlayThrough;
  }

  initAnimation(beginTimeStamp: DOMHighResTimeStamp) {
    this._beginTime = beginTimeStamp;
  }

  animationFrameUpdate(timeStamp: DOMHighResTimeStamp) {
    const elapsedTime = timeStamp - this._beginTime;
    if (elapsedTime > this._nextEventTime) {
      this._nextEventIndex++;
      this._nextEventTime = this._nextEventIndex < this._tileAnimEvents.length 
        ? this._tileAnimEvents[this._nextEventIndex] 
        : Infinity;
      this._video.currentTime = this._inPoint;
      this._video.play();
      this._fadeInStartTime = timeStamp;
      this._renderFrame = this._fadeIn;
    }

    if (elapsedTime > ANIMATION_CYCLE_DURATION) {
      this._beginTime = timeStamp;
      this._nextEventIndex = 0;
      this._nextEventTime = this._tileAnimEvents[this._nextEventIndex];
      this._renderFrame = this._wait;
    }

    this._renderFrame(timeStamp);
  }

  clearAnimation() {
    this._renderFrame = this._wait;
    this._video.removeAttribute('src');
    this._video.load();
    this._context.clearRect(
      this._drawToCanvasArea.x, 
      this._drawToCanvasArea.y, 
      this._drawToCanvasArea.width, 
      this._drawToCanvasArea.height
    );
  }

  // Private methods
  // @ts-ignore: error TS6133: 'timeStamp' is declared but its value is never read.
  _renderFrame(timeStamp: DOMHighResTimeStamp) {}

  _fadeIn(timeStamp: DOMHighResTimeStamp) {
    const timeElapsed = timeStamp - this._fadeInStartTime;
    this._fadeOpacity = Math.round(timeElapsed / FADE_DURATION * 100) / 100;
    this._drawImage();
    if (this._fadeOpacity >= 1) {
      this._fadeOpacity = 1;
      this._fullOpacityStartTime = timeStamp;
      this._renderFrame = this._fullOpacity;
    }
  }

  _fullOpacity(timeStamp: DOMHighResTimeStamp) {
    this._drawImage();
    const timeElapsed = timeStamp - this._fullOpacityStartTime;
    if (timeElapsed > FULL_OPACTIY_DURATION) {
      this._fadeOutStartTime = timeStamp;
      this._renderFrame = this._fadeOut;
    }
  }
  
  _fadeOut(timeStamp: DOMHighResTimeStamp) {
    const timeElapsed = timeStamp - this._fadeOutStartTime;
    this._fadeOpacity = Math.round((1 - timeElapsed / FADE_DURATION) * 100) / 100;
    this._drawImage();
    if (this._fadeOpacity <= 0) {
      this._fadeOpacity = 0;
      this._video.pause();
      this._renderFrame = this._wait;
    }
  }
  // @ts-ignore: error TS6133: 'timeStamp' is declared but its value is never read.
  _wait(timeStamp: DOMHighResTimeStamp) {}
  
  _drawImage() {
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

 

  _initVideo(videoSrc: string) {
    this._video.src = videoSrc;
    this._video.loop = true;
    this._video.muted = true;
    this._video.autoplay = true;
    this._video.setAttribute('webkit-playsinline', 'webkit-playsinline');
    this._video.setAttribute('playsinline', 'playsinline');
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
}

export default MosaicTile;
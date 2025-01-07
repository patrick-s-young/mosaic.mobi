import type { MosaicTile } from './mosaicTile.interface';


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
  _canPlayThrough: false,
  _seeking: true,
  initMosaicTile() {
    this._video = document.createElement('video');
    this._video.loop = true;
    this._video.muted = true;
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
  },
  setAttributes({ inPoint, copyVideoFromArea, drawToCanvasArea, tileAnimEvents, videoSrc, context }) {
    console.log('this._video.src === blank string', this._video.src === '');
    this._video.src = this._video.src === '' ? videoSrc : this._video.src;
    this._video.pause();
    this._video.muted = true;
    this._context = context;
    this._inPoint = inPoint;
    this._copyVideoFromArea = copyVideoFromArea;
    this._drawToCanvasArea = drawToCanvasArea;
    this._tileAnimEvents = tileAnimEvents;
    this._maxEventIndex = this._tileAnimEvents.length;
    this._video.autoplay = true;
    this._canPlayThrough = false;
    this._seeking = true;
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
    // this._video.removeAttribute('src');
    // this._video.load();
  },
  unloadVideoSrc() {
    this.currentEventAction = this._wait;
    this._video.removeAttribute('src');
    this._video.load();
  },
  isReady() {
    return this._canPlayThrough && !this._seeking;
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
    const playPromise = this._video.play();
    if (playPromise !== undefined) {
      playPromise.then(_ => {
        //console.log(`Automatic playback started!`);
        this.currentEventAction = this._fadeIn;
        // Show playing UI.
      })
      .catch(error => {
        console.log(`Auto-play was prevented by error: ${error}`);
        // Auto-play was prevented
        // Show paused UI.
      });
    }
    ///this._video.play();
    // this.currentEventAction = this._fadeIn;
  },
  _fadeIn() {
    if (this._seeking) {
      return;
    }
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




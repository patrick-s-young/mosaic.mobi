
export interface MosaicTileProps {
  resetAnimation: () => void;
  clearAnimation: () => void;
  isReady: () => boolean;
  initAnimation: (timeStamp: DOMHighResTimeStamp) => void;
  animationFrameUpdate: (timeStamp: DOMHighResTimeStamp) => void;
  _fadeIn: (timeStamp: DOMHighResTimeStamp) => void;
  _fullOpacity: (timeStamp: DOMHighResTimeStamp) => void;
  _fadeOut: (timeStamp: DOMHighResTimeStamp) => void;
  _drawImage: () => void;
  _wait: (timeStamp: DOMHighResTimeStamp) => void;
  _initVideo: (videoSrc: string) => void;
  _renderFrame: (timeStamp: DOMHighResTimeStamp) => void;
}
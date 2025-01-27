import { MosaicTileAttributes } from "@typescript/types";

export interface MosaicTileProps {
  nextEventTime: number | undefined;
  setAttributes: (attributes: MosaicTileAttributes) => void;
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
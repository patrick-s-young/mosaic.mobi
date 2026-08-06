import { CurrentScrubberFrame } from '@typescript/types';

export interface ScrubberState {
  currentScrubberFrame: CurrentScrubberFrame,
  scrubberFramesMax: number,
  canvasWidth: number,
  videoUploadCount: number,
  // true while the user is touching/dragging the slider knob; the mosaic tiles
  // fade to 50% opacity so the background image behind them is easier to see
  isScrubbing: boolean
}

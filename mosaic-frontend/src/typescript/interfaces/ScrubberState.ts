import { CurrentScrubberFrame } from '@typescript/types';

export interface ScrubberState {
  currentScrubberFrame: CurrentScrubberFrame,
  scrubberFramesMax: number,
  canvasWidth: number,
  videoUploadCount: number
}

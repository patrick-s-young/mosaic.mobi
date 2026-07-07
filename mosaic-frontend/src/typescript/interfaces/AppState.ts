import { AppPhaseEnum } from '@typescript/enums';
import type { AspectRatio } from '@typescript/types';

export interface AppState {
  appPhase: AppPhaseEnum
  canvasWidth: number
  aspectRatio: AspectRatio
  uiVisible: boolean
}

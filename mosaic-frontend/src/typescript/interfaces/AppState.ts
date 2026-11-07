import { AppPhaseEnum } from '@typescript/enums';
import type { AppHintKind, AspectRatio } from '@typescript/types';

export interface AppState {
  appPhase: AppPhaseEnum
  canvasWidth: number
  aspectRatio: AspectRatio
  uiVisible: boolean
  hint: AppHintKind | undefined
}

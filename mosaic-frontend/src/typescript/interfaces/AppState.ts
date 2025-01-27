import { AppPhaseEnum } from '@typescript/enums';

export interface AppState {
  appPhase: AppPhaseEnum
  canvasWidth: number
}
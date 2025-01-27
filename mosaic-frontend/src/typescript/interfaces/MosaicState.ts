import type { NumTiles, TimeGroupCollection, RectCollection, RectGroupCollection, ActionGroupCollection } from "@typescript/types";
import { MosaicPhaseEnum } from "@enums/MosaicPhaseEnum";

export interface MosaicState {
  mosaicPhase: MosaicPhaseEnum,
  numTiles: NumTiles,
  canvasWidth: number,
  inPoints: TimeGroupCollection,
  copyVideoFromArea: RectCollection,
  drawToCanvasArea: RectGroupCollection,
  tileAnimEvents: ActionGroupCollection,
  isDefaultVideo: boolean
}
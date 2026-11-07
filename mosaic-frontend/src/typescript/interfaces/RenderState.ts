import { RenderPhaseEnum } from "@enums/RenderPhaseEnum";
import { Failure, RenderBlob } from "@typescript/types";

export interface RenderState {
  renderPhase: RenderPhaseEnum
  renderBlob: RenderBlob
  failure: Failure | undefined
  downloadFraction: number
}
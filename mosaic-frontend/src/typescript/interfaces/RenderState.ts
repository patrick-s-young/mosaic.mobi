import { RenderPhaseEnum } from "@enums/RenderPhaseEnum";
import { RenderBlob } from "@typescript/types";

export interface RenderState {
  renderPhase: RenderPhaseEnum
  renderBlob: RenderBlob
}
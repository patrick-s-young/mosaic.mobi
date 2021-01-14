import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum RenderPhaseEnum {
  RENDER_PROMPT,
  RENDERING,
  SAVE_PROMPT
}

export interface RenderPhase {
  renderPhase: RenderPhaseEnum
}

export interface RenderBlob {
  renderBlob: Blob | undefined
}

export type RenderState = RenderPhase & RenderBlob;

const initialState: RenderState = {
  renderPhase: RenderPhaseEnum.RENDER_PROMPT,
  renderBlob: undefined
}

const renderSlice = createSlice ({
  name: 'render',
  initialState,
  reducers: {
    setRenderPhase (state, action: PayloadAction<RenderPhase>) {
      state.renderPhase = action.payload.renderPhase;
    },
    setRenderBlob (state, action: PayloadAction<RenderBlob>) {
      state.renderBlob = action.payload.renderBlob;
      state.renderPhase = RenderPhaseEnum.SAVE_PROMPT;
    }
  }
});

export const {
  setRenderPhase,
  setRenderBlob
} = renderSlice.actions;

export type SetRenderPhase = ReturnType <typeof setRenderPhase>;
export type SetRenderBlob = ReturnType <typeof setRenderBlob>;

export default renderSlice.reducer;
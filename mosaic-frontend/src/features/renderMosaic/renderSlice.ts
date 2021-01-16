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
      console.log(`renderSlice.ts > setRenderPhase > ${action.payload.renderPhase}`);
      state.renderPhase = action.payload.renderPhase;
    },
    resetRenderPhase (state, action: PayloadAction<RenderPhase>) {
      console.log(`renderSlice.ts > resetRenderPhase`);
      state.renderPhase = action.payload.renderPhase;
    },
    setRenderBlob (state, action: PayloadAction<RenderBlob>) {
      console.log(`renderSlice.ts > setRenderBlob`);
      state.renderBlob = action.payload.renderBlob;
    }
  }
});

export const {
  setRenderPhase,
  resetRenderPhase,
  setRenderBlob
} = renderSlice.actions;

export type SetRenderPhase = ReturnType <typeof setRenderPhase>;
export type ResetRenderPhase = ReturnType <typeof resetRenderPhase>;
export type SetRenderBlob = ReturnType <typeof setRenderBlob>;

export default renderSlice.reducer;
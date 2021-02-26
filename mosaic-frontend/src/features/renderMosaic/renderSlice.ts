import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { renderMosaic } from 'api';

export enum RenderPhaseEnum {
  RENDER_PROMPT,
  RENDERING,
  READY_TO_SAVE
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
  },
  extraReducers: builder => {
    builder.addCase(renderMosaic.rejected, (state, action) => {
      console.log(`renderMosaic.rejected > action.payload: ${action.payload}`);
    })
    builder.addCase(renderMosaic.pending, (state, action) => {
      console.log(`renderMosaic.pending > action.payload: ${action.payload}`);
      state.renderPhase = RenderPhaseEnum.RENDERING;
    })
    builder.addCase(renderMosaic.fulfilled, (state, action) => {
      console.log(`renderMosaic.fulfilled > action.payload.renderBlob: ${action.payload.renderBlob}`);
      state.renderBlob = action.payload.renderBlob;
      state.renderPhase = RenderPhaseEnum.READY_TO_SAVE;
    }) 
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
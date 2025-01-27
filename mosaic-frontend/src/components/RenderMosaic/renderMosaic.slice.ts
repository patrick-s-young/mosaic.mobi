import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { renderMosaic } from '@api/index';
import { RenderPhaseEnum } from '@enums/RenderPhaseEnum';
import { RenderState } from '@interfaces/RenderState';
import { RenderBlob } from '@typescript/types';


const initialState: RenderState = {
  renderPhase: RenderPhaseEnum.RENDER_PROMPT,
  renderBlob: undefined
}

const renderSlice = createSlice ({
  name: 'render',
  initialState,
  reducers: {
    setRenderPhase (state, action: PayloadAction<{ renderPhase: RenderPhaseEnum }>) {
      state.renderPhase = action.payload.renderPhase;
    },
    resetRenderPhase (state, action: PayloadAction<{ renderPhase: RenderPhaseEnum }>) {
      state.renderPhase = action.payload.renderPhase;
    },
    setRenderBlob (state, action: PayloadAction<{ renderBlob: RenderBlob }>) {
      state.renderBlob = action.payload.renderBlob;
    }
  },
  extraReducers: builder => {
    builder.addCase(renderMosaic.rejected, (_, action) => {
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

export default renderSlice.reducer;
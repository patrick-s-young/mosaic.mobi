import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { renderMosaic } from '@api/index';
import { setRenderDownloadProgress } from '@api/assetLoading';
import { RenderPhaseEnum } from '@enums/RenderPhaseEnum';
import { RenderState } from '@interfaces/RenderState';
import { RenderBlob } from '@typescript/types';


const initialState: RenderState = {
  renderPhase: RenderPhaseEnum.RENDER_PROMPT,
  renderBlob: undefined,
  failure: undefined,
  downloadFraction: 0
}

const renderSlice = createSlice ({
  name: 'render',
  initialState,
  reducers: {
    setRenderPhase (state, action: PayloadAction<{ renderPhase: RenderPhaseEnum }>) {
      state.renderPhase = action.payload.renderPhase;
      state.failure = undefined;
    },
    resetRenderPhase (state, action: PayloadAction<{ renderPhase: RenderPhaseEnum }>) {
      state.renderPhase = action.payload.renderPhase;
    },
    setRenderBlob (state, action: PayloadAction<{ renderBlob: RenderBlob }>) {
      state.renderBlob = action.payload.renderBlob;
    }
  },
  extraReducers: builder => {
    builder.addCase(renderMosaic.rejected, (state, action) => {
      // cancelled by the user, who is already heading back to the editor
      if (action.meta.aborted) {
        state.renderPhase = RenderPhaseEnum.RENDER_PROMPT;
        return;
      }
      state.failure = action.payload ?? { stage: 'render', reason: 'server_error' };
      state.renderPhase = RenderPhaseEnum.RENDER_FAILED;
    })
    builder.addCase(renderMosaic.pending, (state, action) => {
      console.log(`renderMosaic.pending > action.payload: ${action.payload}`);
      state.renderPhase = RenderPhaseEnum.RENDERING;
      state.failure = undefined;
      state.downloadFraction = 0;
    })
    builder.addCase(setRenderDownloadProgress, (state, action) => {
      state.downloadFraction = action.payload;
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
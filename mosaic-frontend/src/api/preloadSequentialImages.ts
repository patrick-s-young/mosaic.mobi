import {
  createAsyncThunk
} from '@reduxjs/toolkit';
import { framePath, frameFilenames, loadObjectURL, setUploadProgress } from './assetLoading';
import type { AspectRatio, Failure, RootState } from '@typescript/types';

// Fetches only the background frame the slider is on, which is all the editor
// needs to open; loadRemainingFrames fetches the others once it has.
export const preloadSequentialImages = createAsyncThunk<
  { aspectRatio: AspectRatio, index: number, url: string, imageFilenames: Array<string> },
  { assetID: string, aspectRatio: AspectRatio },
  { rejectValue: Failure }
>(
  '@api/preloadSequentialImages',
  async ({ assetID, aspectRatio }, { rejectWithValue, dispatch, getState }) => {
    const index = (getState() as RootState).scrubber.currentScrubberFrame;
    try {
      const url = await loadObjectURL(framePath(assetID, index, aspectRatio));
      dispatch(setUploadProgress({ stage: 'loading', fraction: 1 }));
      return { aspectRatio, index, url, imageFilenames: frameFilenames() };
    } catch (err) {
      return rejectWithValue({ stage: 'preload', reason: 'download_failed', detail: String(err) });
    }
  }
);

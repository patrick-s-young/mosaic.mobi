import {
  createAsyncThunk
} from '@reduxjs/toolkit';
import { loadObjectURL, previewPath, setUploadProgress } from './assetLoading';
import type { AspectRatio, Failure, RootState } from '@typescript/types';

// the share of the "loading" step taken by the preview video; one frame follows
const PREVIEW_SHARE = 0.9;

// Fetches only the format on screen, as an object URL so it plays without more
// requests. The other format loads if the user switches to it (loadAspectAssets).
export const preloadUserVideo = createAsyncThunk<
  { aspectRatio: AspectRatio, url: string },
  { assetID: string, aspectRatio: AspectRatio },
  { rejectValue: Failure }
>(
  '@api/preloadUserVideo',
  async ({ assetID, aspectRatio }, { rejectWithValue, dispatch, getState }) => {
    try {
      const url = await loadObjectURL(previewPath(assetID, aspectRatio), (fraction) => {
        dispatch(setUploadProgress({ stage: 'loading', fraction: fraction * PREVIEW_SHARE }));
      });
      // the previous video's files are about to be replaced, so free their memory
      const { upload } = getState() as RootState;
      [upload.videoURL, upload.videoURL9x16, ...upload.imageURLs, ...upload.imageURLs9x16]
        .filter(Boolean)
        .forEach((previousURL) => URL.revokeObjectURL(previousURL));
      return { aspectRatio, url };
    } catch (err) {
      return rejectWithValue({ stage: 'preload', reason: 'download_failed', detail: String(err) });
    }
  }
);

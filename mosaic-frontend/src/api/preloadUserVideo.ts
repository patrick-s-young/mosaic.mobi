import {
  createAsyncThunk
} from '@reduxjs/toolkit';
import type { Failure } from '@typescript/types';

// preloads both aspect-ratio preview sources (resized.mov and resized_9x16.mov)
// as object URLs so toggling between 1:1 and 9:16 is instant (no re-fetch)
export const preloadUserVideo = createAsyncThunk<
  { videoURL: string, videoURL9x16: string },
  string,
  { rejectValue: Failure }
>(
  '@api/preloadUserVideo',
  async (assetID, { rejectWithValue }) => {
    const loadObjectURL = async (filename: string) => {
      const response = await fetch(`/uploads/${assetID}/${filename}`, { method: 'GET' });
      if (!response.ok) throw new Error(`preloadUserVideo status ${response.status}: ${filename}`);
      const videoBlob = await response.blob();
      return URL.createObjectURL(videoBlob);
    };
    try {
      const [videoURL, videoURL9x16] = await Promise.all([
        loadObjectURL('resized.mov'),
        loadObjectURL('resized_9x16.mov')
      ]);
      return { videoURL, videoURL9x16 };
    } catch (err) {
      return rejectWithValue({ stage: 'preload', reason: 'download_failed', detail: String(err) });
    }
  }
);

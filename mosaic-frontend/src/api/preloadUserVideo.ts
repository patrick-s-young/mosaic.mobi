import {
  createAsyncThunk
} from '@reduxjs/toolkit';

// preloads both aspect-ratio preview sources (resized.mov and resized_9x16.mov)
// as object URLs so toggling between 1:1 and 9:16 is instant (no re-fetch)
export const preloadUserVideo = createAsyncThunk(
  '@api/preloadUserVideo',
  async (assetID: string) => {
    const loadObjectURL = async (filename: string) => {
      const response = await fetch(`/uploads/${assetID}/${filename}`, { method: 'GET' });
      const videoBlob = await response.blob();
      return URL.createObjectURL(videoBlob);
    };
    const [videoURL, videoURL9x16] = await Promise.all([
      loadObjectURL('resized.mov'),
      loadObjectURL('resized_9x16.mov')
    ]);
    return { videoURL, videoURL9x16 };
  }
);

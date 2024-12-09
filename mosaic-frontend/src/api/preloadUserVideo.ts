import { 
  createAsyncThunk
} from '@reduxjs/toolkit';

export const preloadUserVideo = createAsyncThunk(
  '@api/preloadUserVideo',
  async (filePath: string) => {
    const response = await fetch(filePath, { method: 'GET' });
    const videoBlob = await response.blob();
    const videoURL = URL.createObjectURL(videoBlob);
    return { videoURL };
  }
);
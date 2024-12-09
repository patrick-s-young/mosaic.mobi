import type { UploadAssetID } from '@features/uploadVideo/uploadSlice';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const uploadUserVideo = createAsyncThunk(
  '@api/uploadUserVideo',
  async (file: File) => {
    const formData = new FormData();
    formData.append('myFile', file);
    const response = await fetch('/uploadvideo', {
      method: 'POST',
      body: formData
      })
    const data = await response.json();
    return data as UploadAssetID
  }
);
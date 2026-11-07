import type { Failure, UploadAssetID } from '@typescript/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { failureReasonForStatus, getSessionId } from './reportFailure';

export const uploadUserVideo = createAsyncThunk<UploadAssetID, File, { rejectValue: Failure }>(
  '@api/uploadUserVideo',
  async (file, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append('myFile', file);
    let response: Response;
    try {
      response = await fetch('/uploadvideo', {
        method: 'POST',
        headers: { 'X-Session-ID': getSessionId() },
        body: formData
      });
    } catch (err) {
      return rejectWithValue({ stage: 'upload', reason: 'network', detail: String(err) });
    }
    // errors from nginx are HTML, so the body may not be JSON
    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.assetID) {
      return rejectWithValue({
        stage: data?.stage ?? 'upload',
        reason: data?.reason ?? failureReasonForStatus(response.status),
        status: response.status,
        logged: data?.logged === true
      });
    }
    return data as UploadAssetID;
  }
);

import type { Failure, UploadAssetID } from '@typescript/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { failureReasonForStatus, getSessionId } from './reportFailure';
import { setUploadProgress } from './assetLoading';

// XMLHttpRequest rather than fetch, which can't report upload progress
export const uploadUserVideo = createAsyncThunk<UploadAssetID & { hasAudio?: boolean }, File, { rejectValue: Failure }>(
  '@api/uploadUserVideo',
  (file, { rejectWithValue, dispatch, signal }) => new Promise<any>((resolve) => {
    const formData = new FormData();
    formData.append('myFile', file);

    const request = new XMLHttpRequest();
    request.open('POST', '/uploadvideo');
    request.setRequestHeader('X-Session-ID', getSessionId());
    signal.addEventListener('abort', () => request.abort());

    let lastPercent = -1;
    request.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const percent = Math.floor((event.loaded / event.total) * 100);
      if (percent === lastPercent) return;
      lastPercent = percent;
      dispatch(setUploadProgress({ stage: 'sending', fraction: percent / 100 }));
    };
    request.upload.onload = () => dispatch(setUploadProgress({ stage: 'processing', fraction: 0 }));

    request.onload = () => {
      // errors from nginx are HTML, so the body may not be JSON
      let data: any = null;
      try {
        data = JSON.parse(request.responseText);
      } catch (err) {
        // handled below
      }
      if (request.status >= 200 && request.status < 300 && data?.assetID) {
        resolve(data as UploadAssetID);
        return;
      }
      resolve(rejectWithValue({
        stage: data?.stage ?? 'upload',
        reason: data?.reason ?? failureReasonForStatus(request.status),
        status: request.status,
        logged: data?.logged === true
      }));
    };
    request.onerror = () => resolve(rejectWithValue({ stage: 'upload', reason: 'network' }));

    request.send(formData);
  })
);

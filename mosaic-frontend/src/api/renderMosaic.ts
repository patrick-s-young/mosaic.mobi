import {
  createAsyncThunk
} from '@reduxjs/toolkit';
import axios from 'axios';
import { logEvent, AnalyticsEvent } from '@analytics/analytics';
import { failureReasonForStatus, getSessionId, reportFailure } from './reportFailure';
import type { Failure } from '@typescript/types';

// the response type is a blob, so a JSON error body has to be read back out of it
const failureFrom = async (err: any): Promise<Failure> => {
  const status: number | undefined = err?.response?.status;
  if (!status) return { stage: 'render', reason: 'network', detail: String(err) };
  const data = await err.response.data?.text?.().then(JSON.parse).catch(() => null);
  return {
    stage: 'render',
    reason: data?.reason ?? failureReasonForStatus(status),
    status,
    logged: data?.logged === true
  };
};

export const renderMosaic = createAsyncThunk<
  { renderBlob: Blob },
  { url: string, assetID: string },
  { rejectValue: Failure }
>(
  'render/renderMosaic',
  async ({ url, assetID }, { rejectWithValue }) => {
    const startedAt = performance.now();
    try {
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'blob',
        headers: { 'X-Session-ID': getSessionId() }
      });
      // render_success carries how long the server took and how large the
      // output was — useful for spotting slow/heavy renders in the dashboard
      logEvent(AnalyticsEvent.RENDER_SUCCESS, {
        render_ms: Math.round(performance.now() - startedAt),
        output_kb: Math.round(((response.data?.size ?? 0) / 1024))
      });
      return { renderBlob: response.data };
    } catch (err: any) {
      const failure = await failureFrom(err);
      logEvent(AnalyticsEvent.RENDER_ERROR, {
        render_ms: Math.round(performance.now() - startedAt),
        status: failure.status ?? 0,
        reason: failure.reason
      });
      reportFailure(failure, assetID);
      return rejectWithValue(failure);
    }
  }
);

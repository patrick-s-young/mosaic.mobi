import {
  createAsyncThunk
} from '@reduxjs/toolkit';
import axios from 'axios';
import { logEvent, AnalyticsEvent } from '@analytics/analytics';

export const renderMosaic = createAsyncThunk(
  'render/renderMosaic',
  async (url: string) => {
    const startedAt = performance.now();
    try {
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'blob'
      });
      // render_success carries how long the server took and how large the
      // output was — useful for spotting slow/heavy renders in the dashboard
      logEvent(AnalyticsEvent.RENDER_SUCCESS, {
        render_ms: Math.round(performance.now() - startedAt),
        output_kb: Math.round(((response.data?.size ?? 0) / 1024))
      });
      return { renderBlob: response.data };
    } catch (err: any) {
      logEvent(AnalyticsEvent.RENDER_ERROR, {
        render_ms: Math.round(performance.now() - startedAt),
        status: err?.response?.status ?? 0
      });
      throw err;
    }
  }
);

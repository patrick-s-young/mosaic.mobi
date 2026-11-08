import {
  createAsyncThunk
} from '@reduxjs/toolkit';
import { MAX_VIDEO_UPLOAD_BYTES, MIN_VIDEO_UPLOAD_DURATION } from '@/app.config';
import type { Failure } from '@typescript/types';

const METADATA_TIMEOUT_MS = 20000;

// resolves with the video's duration, or null if this browser can't read it.
// Without the error and timeout paths an unsupported file would wait forever.
const readDuration = (file: File): Promise<number | null> => new Promise((resolve) => {
  const videoUrl = URL.createObjectURL(new Blob([file], { type: 'video/mp4' }));
  const video = document.createElement('video');
  const finish = (duration: number | null) => {
    clearTimeout(timeout);
    URL.revokeObjectURL(videoUrl);
    resolve(duration);
  };
  const timeout = setTimeout(() => finish(null), METADATA_TIMEOUT_MS);
  video.addEventListener('loadedmetadata', () => finish(video.duration));
  video.addEventListener('error', () => finish(null));
  video.src = videoUrl;
});

export const preUploadValidation = createAsyncThunk<
  { selectedFile: File, uploadDuration: number },
  File,
  { rejectValue: Failure }
>(
  '@api/preUploadValidation',
  async (selectedFile, { rejectWithValue }) => {
    const uploadDuration = await readDuration(selectedFile);
    // the duration is recorded too, to show how often trimming would have
    // helped if the limit applied to the trimmed clip instead of the original
    if (selectedFile.size > MAX_VIDEO_UPLOAD_BYTES) {
      return rejectWithValue({ stage: 'validation', reason: 'too_large', detail: `${selectedFile.size} bytes, ${uploadDuration ?? 'unknown'}s` });
    }
    if (uploadDuration === null || !Number.isFinite(uploadDuration)) {
      return rejectWithValue({ stage: 'validation', reason: 'unreadable_file', detail: selectedFile.type });
    }
    if (uploadDuration < MIN_VIDEO_UPLOAD_DURATION) {
      return rejectWithValue({ stage: 'validation', reason: 'too_short', detail: `${uploadDuration}s` });
    }
    return { selectedFile, uploadDuration };
  }
);

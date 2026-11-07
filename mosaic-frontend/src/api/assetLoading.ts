import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { SCRUBBER_FRAMES_MAX } from '@/app.config';
import type { AspectRatio, Failure, RootState, UploadProgress, UploadState } from '@typescript/types';

const BACKGROUND_FRAME_WORKERS = 3;

export const setUploadProgress = createAction<UploadProgress>('upload/setUploadProgress');
export const setPreviewURL = createAction<{ assetID: string, aspectRatio: AspectRatio, url: string }>('upload/setPreviewURL');
export const setFrameURL = createAction<{ assetID: string, aspectRatio: AspectRatio, index: number, url: string }>('upload/setFrameURL');

// imgNNN.jpg is the name the render endpoint expects; the backend adds _9x16 itself
export const frameFilenames = (): Array<string> =>
  Array.from({ length: SCRUBBER_FRAMES_MAX }, (_, index) => `img${String(index + 1).padStart(3, '0')}.jpg`);

export const framePath = (assetID: string, index: number, aspectRatio: AspectRatio): string => {
  const filename = frameFilenames()[index];
  return `/uploads/${assetID}/${aspectRatio === '9x16' ? filename.replace('.jpg', '_9x16.jpg') : filename}`;
};

export const previewPath = (assetID: string, aspectRatio: AspectRatio): string =>
  `/uploads/${assetID}/${aspectRatio === '9x16' ? 'resized_9x16.mov' : 'resized.mov'}`;

export const framesFor = (upload: UploadState, aspectRatio: AspectRatio): Array<string> =>
  aspectRatio === '9x16' ? upload.imageURLs9x16 : upload.imageURLs;

export const previewFor = (upload: UploadState, aspectRatio: AspectRatio): string =>
  aspectRatio === '9x16' ? upload.videoURL9x16 : upload.videoURL;

// downloads a file into memory so it plays without further network requests
export const loadObjectURL = (path: string, onProgress?: (fraction: number) => void): Promise<string> =>
  new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('GET', path, true);
    request.responseType = 'blob';
    request.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(event.loaded / event.total);
    };
    request.onload = () => {
      if (request.status === 200) resolve(URL.createObjectURL(request.response));
      else reject(new Error(`status ${request.status}: ${path}`));
    };
    request.onerror = () => reject(new Error(`network error: ${path}`));
    request.send();
  });

// The other format is only fetched when someone switches to it, which keeps the
// first load small. Rejects so the toggle can stay where it is if this fails.
export const loadAspectAssets = createAsyncThunk<
  void,
  { assetID: string, aspectRatio: AspectRatio },
  { rejectValue: Failure }
>(
  '@api/loadAspectAssets',
  async ({ assetID, aspectRatio }, { getState, dispatch, rejectWithValue }) => {
    const { upload, scrubber } = getState() as RootState;
    const index = scrubber.currentScrubberFrame;
    try {
      const [previewURL, frameURL] = await Promise.all([
        previewFor(upload, aspectRatio) ? undefined : loadObjectURL(previewPath(assetID, aspectRatio)),
        framesFor(upload, aspectRatio)[index] ? undefined : loadObjectURL(framePath(assetID, index, aspectRatio))
      ]);
      if (previewURL) dispatch(setPreviewURL({ assetID, aspectRatio, url: previewURL }));
      if (frameURL) dispatch(setFrameURL({ assetID, aspectRatio, index, url: frameURL }));
    } catch (err) {
      return rejectWithValue({ stage: 'preload', reason: 'download_failed', detail: String(err) });
    }
  }
);

// Fetches the rest of the background frames once the editor is open, always
// taking the one nearest the slider next so a frame the user moves to arrives
// first. A frame that fails is skipped: the editor stays usable without it, and
// the render uses the server's copy.
export const loadRemainingFrames = createAsyncThunk<void, { assetID: string, aspectRatio: AspectRatio }>(
  '@api/loadRemainingFrames',
  async ({ assetID, aspectRatio }, { getState, dispatch }) => {
    const tried = new Set<number>();

    const nextFrame = (): number | undefined => {
      const { upload, scrubber } = getState() as RootState;
      if (upload.assetID !== assetID) return undefined;
      const frames = framesFor(upload, aspectRatio);
      return frames
        .map((url, index) => ({ url, index }))
        .filter(({ url, index }) => !url && !tried.has(index))
        .sort((a, b) => Math.abs(a.index - scrubber.currentScrubberFrame) - Math.abs(b.index - scrubber.currentScrubberFrame))[0]?.index;
    };

    const worker = async () => {
      for (let index = nextFrame(); index !== undefined; index = nextFrame()) {
        tried.add(index);
        try {
          const url = await loadObjectURL(framePath(assetID, index, aspectRatio));
          // a new upload may have replaced this asset while the frame was loading
          if ((getState() as RootState).upload.assetID === assetID) {
            dispatch(setFrameURL({ assetID, aspectRatio, index, url }));
          } else {
            URL.revokeObjectURL(url);
          }
        } catch (err) {
          console.warn(`background frame ${index} failed: ${err}`);
        }
      }
    };

    await Promise.all(Array.from({ length: BACKGROUND_FRAME_WORKERS }, worker));
  }
);

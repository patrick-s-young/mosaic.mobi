import {
  createAsyncThunk
} from '@reduxjs/toolkit';
import { SCRUBBER_FRAMES_MAX } from '@/app.config';

// preloads both aspect-ratio scrubber background frame sets (imgNNN.jpg and
// imgNNN_9x16.jpg). imageFilenames are returned as the aspect-agnostic base
// names; the backend applies the _9x16 suffix when rendering 9:16.
export const preloadSequentialImages = createAsyncThunk(
  '@api/preloadSequentialImages',
  async (assetID: string) => {
      const startIdx = 1;
      const endIdx = SCRUBBER_FRAMES_MAX;
      const nameFormat = 'img .jpg';
      const zeroPadding = 3;
      const directoryPath = `/uploads/${assetID}`;
      const filenameArr: Array<string> = Array(endIdx - startIdx + 1).fill(startIdx).map((val, idx) => {
        const imgIdx = val + idx + '';
        const imgName = nameFormat.replace(' ', imgIdx.padStart(zeroPadding, '0'));
        return imgName;
      });

      const loadObjectURL = (path: string): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
          const req = new XMLHttpRequest();
          req.open('GET', path, true);
          req.responseType = 'blob';
          req.onload = function() {
            if (this.status === 200) {
              const imageBlob: Blob = this.response;
              resolve(URL.createObjectURL(imageBlob)); // IE10+
            }
          }
          req.onerror = function() {
            reject('req ERROR')
          }
          req.send();
        });
      };

    const [imageURLs, imageURLs9x16] = await Promise.all([
      Promise.all(filenameArr.map((filename) => loadObjectURL(`${directoryPath}/${filename}`))),
      Promise.all(filenameArr.map((filename) => loadObjectURL(`${directoryPath}/${filename.replace(/\.jpg$/i, '_9x16.jpg')}`)))
    ]);
    return { imageURLs, imageURLs9x16, imageFilenames: filenameArr };
  }
);
